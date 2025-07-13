import { Box, Typography, Chip, Paper, CircularProgress, Rating, Stack } from '@mui/material'
import { motion } from 'motion/react'
import ProductImages from './ProductImages'
import ProductVariants from './ProductVariants'
import ProductQuantity from './ProductQuantity'
import ProductActions from './ProductActions'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../redux/hook'

export default function ProductDetail() {
  const { selectedProduct, loading, error } = useAppSelector((state) => state.product)
  const [selectedVariant, setSelectedVariant] = useState<number | undefined>(undefined)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (selectedProduct?.images?.length) {
      setSelectedImage(selectedProduct.images[0].imageUrl)
    }
    if (selectedProduct?.variants?.length) {
      setSelectedVariant(selectedProduct.variants[0].variantId)
    }
  }, [selectedProduct])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        Đã có lỗi: {error}
      </Typography>
    )
  }

  if (!selectedProduct) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box flex={1}>
            <ProductImages
              images={selectedProduct.images ?? []}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
          </Box>

          <Box flex={1}>
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {selectedProduct.productName}
              </Typography>
              <div className="w-[40%]">
                <Chip
                  label={selectedProduct.categoryName}
                  color="secondary"
                  sx={{ fontWeight: 'bold' }}
                />
              </div>

              <Typography variant="subtitle1" color="text.secondary">
                Shop: {selectedProduct.shopName}
              </Typography>
              <Typography variant="h5" fontWeight={700} color="primary.dark">
                {Number(selectedProduct.price).toLocaleString()} VND
              </Typography>
              <Typography>{selectedProduct.description}</Typography>
              <Rating value={Number(selectedProduct.avgRating) || 0} readOnly precision={0.5} />

              <Box>
                <Typography variant="subtitle1">Chọn loại: </Typography>
                <ProductVariants
                  variants={selectedProduct.variants ?? []}
                  selectedVariant={selectedVariant}
                  onSelect={setSelectedVariant}
                />
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <ProductQuantity quantity={quantity} setQuantity={setQuantity} />
                <Box display="flex" alignItems="center" gap={2}>
                  <ProductActions variantId={selectedVariant ?? 0} quantity={quantity} />
                </Box>{' '}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  )
}
