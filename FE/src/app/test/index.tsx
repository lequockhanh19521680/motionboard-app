import { Box, Typography, Divider, Paper } from '@mui/material'
import ImageUploader from '../../components/common/ImageUploader'
import { deleteImage, uploadImage, uploadMultiImage } from '../../redux/imageSlice'
import { AppDispatch } from '../../redux/store'
import { useDispatch } from 'react-redux'

type Scenario = {
  key: string
  title: string
  description: string
  props: React.ComponentProps<typeof ImageUploader>
}

// mockUpload để giả lập upload với tiến trình
const mockUpload = async (file: File, onProgress: (percent: number) => void) => {
  return new Promise<string>((resolve, reject) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          resolve(URL.createObjectURL(file))
        }, 300)
      }
      onProgress(Math.min(progress, 100))
    }, 200)
  })
}

// tất cả test case
const scenarios: Scenario[] = [
  {
    key: 'basic',
    title: 'Basic Usage',
    description: 'Default settings with multiple file upload (no delete, no default images)',
    props: {
      maxFiles: 5,
      onUpload: mockUpload,
      buttonLabel: 'Upload Images',
    },
  },
  {
    key: 'avatar',
    title: 'Avatar Upload',
    description: 'Single image upload with circular shape, delete functionality, and default image',
    props: {
      maxFiles: 1,
      previewSize: 150,
      shape: 'circle',
      defaultImages: ['https://placekitten.com/200/200'],
      onUpload: mockUpload,
      onDelete: async (url) => {
        console.log('[Avatar] Deleting image:', url)
        await new Promise((resolve) => setTimeout(resolve, 500))
      },
      buttonLabel: 'Upload Avatar',
    },
  },
  {
    key: 'limited',
    title: 'Limited Upload',
    description: 'Maximum 3 files with square previews and custom size',
    props: {
      maxFiles: 3,
      previewSize: 100,
      shape: 'square',
      onUpload: mockUpload,
      onDelete: async (url) => {
        console.log('[Limited] Deleting image:', url)
      },
    },
  },
  {
    key: 'large-preview',
    title: 'Large Preview',
    description: 'Large preview size with multiple uploads',
    props: {
      maxFiles: 10,
      previewSize: 180,
      onUpload: mockUpload,
    },
  },
  {
    key: 'error-test',
    title: 'Error Handling',
    description: 'Scenario that simulates upload errors',
    props: {
      maxFiles: 2,
      onUpload: async (file, onProgress) => {
        await new Promise((resolve) => {
          let progress = 0
          const interval = setInterval(() => {
            progress += 20
            onProgress(progress)
            if (progress >= 80) {
              clearInterval(interval)
              resolve(null)
            }
          }, 200)
        })
        throw new Error('Simulated upload error')
      },
      uploadLabel: 'Upload With Error',
    },
  },
]

const TestPage = () => {
  const dispatch = useDispatch<AppDispatch>()

  // dùng redux upload 1 ảnh
  const onUploadSingle = async (file: File, onProgress: (percent: number) => void) => {
    onProgress(30)
    const formData = new FormData()
    formData.append('file', file)
    const res = await dispatch(uploadImage(formData)).unwrap()
    onProgress(100)
    return res
  }

  // dùng redux upload nhiều ảnh
  const onUploadMulti = async (file: File, onProgress: (percent: number) => void) => {
    onProgress(30)
    const formData = new FormData()
    formData.append('image', file) // field name đúng
    const res = await dispatch(uploadImage(formData)).unwrap()
    onProgress(100)
    return res
  }

  const onDeleteImage = async (url: string) => {
    await dispatch(deleteImage(url)).unwrap()
    console.log('Deleted with Redux:', url)
  }

  const scenarios: Scenario[] = [
    {
      key: 'basic',
      title: 'Basic with Redux',
      description: 'Upload many images with redux store',
      props: {
        maxFiles: 5,
        onUpload: onUploadMulti,
        onDelete: onDeleteImage,
      },
    },
    {
      key: 'avatar',
      title: 'Avatar Redux Upload',
      description: 'Upload avatar with redux',
      props: {
        maxFiles: 1,
        shape: 'circle',
        defaultImages: [],
        previewSize: 150,
        onUpload: onUploadSingle,
        onDelete: onDeleteImage,
      },
    },
  ]

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        ImageUploader Redux Test
      </Typography>

      <Divider sx={{ my: 4 }} />

      {scenarios.map((scenario) => (
        <Paper key={scenario.key} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6">{scenario.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {scenario.description}
          </Typography>
          <Box mt={2}>
            <ImageUploader {...scenario.props} />
          </Box>
        </Paper>
      ))}
    </Box>
  )
}

export default TestPage
