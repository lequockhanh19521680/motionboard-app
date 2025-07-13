import { Card, CardMedia, Stack } from '@mui/material'
import { ProductImage } from '../../../shared/types/response/ProductResponse'

interface Props {
  images: ProductImage[]
  selectedImage: string | null
  setSelectedImage: (img: string) => void
}

export default function ProductImages({ images, selectedImage, setSelectedImage }: Props) {
  return (
    <>
      <Card sx={{ borderRadius: 3 }}>
        <CardMedia
          component="img"
          height="400"
          image={selectedImage || 'https://via.placeholder.com/400x300?text=No+Image'}
          sx={{ objectFit: 'cover' }}
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
            onClick={() => setSelectedImage(img.imageUrl)}
          >
            <CardMedia
              component="img"
              image={img.imageUrl}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Card>
        ))}
      </Stack>
    </>
  )
}
