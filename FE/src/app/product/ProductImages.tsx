import { Card, CardMedia, Stack } from '@mui/material'
import { ProductImage } from '../../types/response/ProductResponse'

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
            key={img.image_id}
            sx={{
              width: 80,
              height: 80,
              cursor: 'pointer',
              border: selectedImage === img.image_url ? '2px solid' : '1px solid #eee',
              borderColor: selectedImage === img.image_url ? 'primary.main' : '#eee',
            }}
            onClick={() => setSelectedImage(img.image_url)}
          >
            <CardMedia
              component="img"
              image={img.image_url}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Card>
        ))}
      </Stack>
    </>
  )
}
