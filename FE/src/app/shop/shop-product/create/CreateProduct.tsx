import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
  Button,
  Alert,
  SelectChangeEvent,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../redux/store'
import { fetchBrands } from '../../../../redux/brandSlice'
import { fetchCategories } from '../../../../redux/categorySlice'
import { useAppSelector } from '../../../../redux/hook'
import { ProductCreate } from '../../../../shared/types/request/ProductCreate'
import { ProductImage, ProductVariant } from '../../../../shared/types/response/ProductResponse'

import { CategorySelect } from './CategorySelect'
import { BrandSelect } from './BrandSelect'
import { ProductInfoFields } from './ProductInfoFields'
import { ProductImages } from './ProductImages'
import { VariantList } from './VariantList'
import { createProduct } from '../../../../redux/productSlice'
import { uploadMultiImage } from '../../../../redux/imageSlice'

interface ProductImageUI extends ProductImage {
  preview?: string
  file?: File
}

interface ProductFormState {
  category_id: number
  product_name: string
  description: string
  price: number
  brand_id: number | null
  images: ProductImageUI[]
  variants: ProductVariant[]
}

const initialImage: ProductImageUI = {
  image_url: '',
  sort_order: 0,
  preview: '',
  file: undefined,
}

const initialVariant: ProductVariant = {
  color: '',
  size: '',
  stock_quantity: 0,
  price: 0,
}

const initialForm = {
  category_id: 0,
  product_name: '',
  description: '',
  price: 0,
  brand_id: null,
  images: [{ ...initialImage }],
  variants: [] as ProductVariant[],
}

export default function CreateProduct() {
  const dispatch = useDispatch<AppDispatch>()

  const { shop_id } = useParams<{ shop_id: string }>()
  const { brands } = useAppSelector((state) => state.brand)
  const { categories } = useAppSelector((state) => state.category)

  const [form, setForm] = useState<ProductFormState>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  useEffect(() => {
    dispatch(fetchBrands())
    dispatch(fetchCategories())
  }, [dispatch])

  // CATEGORY
  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setForm((f) => ({
      ...f,
      category_id: Number(event.target.value),
    }))
  }

  const handleBrandChange = (event: SelectChangeEvent<number | string>) => {
    const value = event.target.value
    setForm((f) => ({
      ...f,
      brand_id: value === '' ? null : Number(value),
    }))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({
      ...f,
      [name]: name === 'price' ? Number(value) : value,
    }))
  }

  const handleImageUpload = (idx: number, file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm((f) => {
        const list = [...f.images]
        list[idx] = {
          ...list[idx],
          file,
          preview: reader.result as string,
        }
        return { ...f, images: list }
      })
    }
    reader.readAsDataURL(file)
  }
  const addArrayItem = () =>
    setForm((f) => ({
      ...f,
      images: [
        ...f.images,
        {
          image_url: '',
          sort_order: f.images.length,
          preview: '',
        },
      ],
    }))
  const removeArrayItem = (idx: number) =>
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
    }))
  const moveImage = (from: number, to: number) => {
    setForm((f) => {
      if (to < 0 || to >= f.images.length) return f
      const list = [...f.images]
      const [removed] = list.splice(from, 1)
      list.splice(to, 0, removed)
      const updated = list.map((img, idx) => ({ ...img, sort_order: idx }))
      return { ...f, images: updated }
    })
  }
  // VARIANT
  const addVariant = () =>
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { ...initialVariant }],
    }))
  const removeVariant = (idx: number) =>
    setForm((f) => ({
      ...f,
      variants: f.variants.filter((_, i) => i !== idx),
    }))
  const handleVariantChange = (idx: number, field: keyof ProductVariant, value: any) =>
    setForm((f) => {
      const newVariants = [...f.variants]
      newVariants[idx] = { ...newVariants[idx], [field]: value }
      return { ...f, variants: newVariants }
    })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      // 1. Lấy ra file ảnh cần upload
      const files = form.images.map((img) => img.file).filter(Boolean) as File[]

      let updatedImages = [...form.images]
      if (files.length > 0) {
        const resAction = await dispatch(uploadMultiImage(files))
        if (uploadMultiImage.rejected.match(resAction)) {
          setError('Upload hình ảnh thất bại!')
          setLoading(false)
          return
        }
        const signedUrls = resAction.payload as string[]
        let urlIdx = 0
        updatedImages = form.images.map((img) => {
          if (img.file) {
            const newUrl = signedUrls[urlIdx]
            urlIdx += 1
            return { ...img, image_url: newUrl }
          }
          return img
        })
      }

      const payload: ProductCreate = {
        shop_id: Number(shop_id),
        ...form,
        images: updatedImages.map((img, idx) => ({
          image_id: img.image_id,
          image_url: img.image_url,
          sort_order: idx,
        })),
        variants: form.variants,
      }
      const resultAction = await dispatch(createProduct(payload))
      if (createProduct.rejected.match(resultAction)) {
        let message = 'Có lỗi xảy ra khi tạo sản phẩm'
        const payloadErr = (resultAction as any).payload
        if (typeof payloadErr === 'string') message = payloadErr
        else if (
          payloadErr &&
          typeof payloadErr === 'object' &&
          'message' in payloadErr &&
          typeof payloadErr.message === 'string'
        )
          message = payloadErr.message
        setError(message)
      } else {
        setSuccess('Tạo sản phẩm thành công!')
        setForm(initialForm)
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box minHeight="100vh" bgcolor="#f5f7fb" py={5}>
      <Box maxWidth="700px" mx="auto">
        <Paper elevation={4} sx={{ borderRadius: 4, p: { xs: 2, sm: 4 }, bgcolor: '#fff' }}>
          <Typography variant="h4" color="primary.main" gutterBottom textAlign="center">
            Tạo sản phẩm mới
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <form onSubmit={handleSubmit} autoComplete="off">
            <Stack spacing={2}>
              <CategorySelect
                value={form.category_id}
                onChange={handleCategoryChange as any}
                categories={categories}
              />
              <BrandSelect
                value={form.brand_id === null || form.brand_id === undefined ? '' : form.brand_id}
                onChange={handleBrandChange}
                brands={brands}
              />
              <ProductInfoFields
                values={{
                  product_name: form.product_name,
                  description: form.description ?? '',
                  price: form.price,
                }}
                handleChange={handleChange}
              />
            </Stack>
            <ProductImages
              images={form.images}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              handleImageUpload={handleImageUpload}
              moveImage={moveImage}
            />
            {/* ------ Variants ------ */}
            <Box mt={4}>
              <VariantList
                variants={form.variants}
                addVariant={addVariant}
                removeVariant={removeVariant}
                handleVariantChange={handleVariantChange}
              />
            </Box>
            {/* ------ End Variants ------ */}
            <Stack mt={4} spacing={2}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{ borderRadius: 3 }}
              >
                {loading ? 'Đang lưu...' : 'Tạo sản phẩm'}
              </Button>
              {success && <Alert severity="success">{success}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  )
}
