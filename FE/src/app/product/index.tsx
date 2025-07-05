import { useParams } from 'react-router-dom'
import ProductDetail from './ProductDetail'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { useEffect } from 'react'
import { fetchProductById } from '../../redux/productSlice'

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const parsedId = Number(id)
    if (id && !isNaN(parsedId)) {
      dispatch(fetchProductById(parsedId))
    }
  }, [dispatch, id])
  return <ProductDetail />
}
