import React from 'react'
import { Box, Typography, Divider, Paper } from '@mui/material'
import ImageUploader from '../../../shared/components/forms/ImageUploader'
import { uploadImage, deleteImage } from '../../../redux/imageSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'

type Scenario = {
  key: string
  title: string
  description: string
  props: React.ComponentProps<typeof ImageUploader>
}

const TestPage = () => {
  const dispatch = useDispatch<AppDispatch>()

  // Upload single file with redux + p1rogress123
  const onUploadSingle = async (file: File, onProgress: (percent: number) => void) => {
    onProgress(30)
    const formData = new FormData()
    formData.append('file', file)
    const res = await dispatch(uploadImage(formData)).unwrap()
    onProgress(100)
    return res
  }

  // Upload multi files (1 file per call) with redux + progress
  const onUploadMulti = async (file: File, onProgress: (percent: number) => void) => {
    onProgress(30)
    const formData = new FormData()
    formData.append('image', file)
    const res = await dispatch(uploadImage(formData)).unwrap()
    onProgress(100)
    return res
  }

  // Delete image with redux
  const onDeleteImage = async (url: string) => {
    await dispatch(deleteImage(url)).unwrap()
    console.log('Deleted with Redux:', url)
  }

  // Define test scenarios with different props
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
        previewSize: 150,
        defaultImages: [],
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

      {scenarios.map(({ key, title, description, props }) => (
        <Paper key={key} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {description}
          </Typography>
          <ImageUploader {...props} />
        </Paper>
      ))}
    </Box>
  )
}

export default TestPage
