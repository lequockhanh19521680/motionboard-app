import { useParams } from 'react-router-dom'
import ProductDetail from './ProductDetail'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { useEffect, useRef } from 'react'
import { fetchProductById } from '../../../redux/productSlice'

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const fetchedIdRef = useRef<number | null>(null)
  useEffect(() => {
    const parsedId = Number(id)
    if (id && !isNaN(parsedId) && fetchedIdRef.current !== parsedId) {
      fetchedIdRef.current = parsedId
      dispatch(fetchProductById(parsedId))
    }
  }, [dispatch, id])

  return <ProductDetail />
}
