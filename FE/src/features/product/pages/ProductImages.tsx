import React, { useState } from 'react'
import { Card, CardMedia, Stack } from '@mui/material'
import { ProductImage } from '../../../shared/types/response/ProductResponse'

interface Props {
  images: ProductImage[]
  selectedImage: string | null
  setSelectedImage: (img: string) => void
}

export default function ProductImages({ images, selectedImage, setSelectedImage }: Props) {
  // Fallback image URL
  const fallbackImg = 'https://via.placeholder.com/400x300?text=No+Image'
  // State để trigger re-render khi ảnh lỗi
  const [mainImgError, setMainImgError] = useState(false)
  const [thumbError, setThumbError] = useState<Record<number, boolean>>({})

  return (
    <>
      <Card sx={{ borderRadius: 3 }}>
        <CardMedia
          component="img"
          height="400"
          image={mainImgError ? fallbackImg : selectedImage || fallbackImg}
          sx={{ objectFit: 'cover' }}
          onError={() => setMainImgError(true)}
        />
      </Card>
      <Stack direction="row" spacing={1} sx={{ mt: 1, overflowX: 'auto' }}>
        {images.map((img) => (
          <Card
            key={img.imageId}
            sx={{
              width: 80,
              height: 80,
              cursor: 'pointer',
              border: selectedImage === img.imageUrl ? '2px solid' : '1px solid #eee',
              borderColor: selectedImage === img.imageUrl ? 'primary.main' : '#eee',
            }}
            onClick={() => {
              setSelectedImage(img.imageUrl)
              setMainImgError(false)
            }}
          >
            <CardMedia
              component="img"
              image={thumbError[img.imageId ?? 0] ? fallbackImg : img.imageUrl}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() =>
                setThumbError((prev: Record<number, boolean>) => ({
                  ...prev,
                  [img.imageId ?? 0]: true,
                }))
              }
            />
          </Card>
        ))}
      </Stack>
    </>
  )
}
