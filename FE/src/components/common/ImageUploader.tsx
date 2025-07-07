import { useState } from 'react'
import { Box, Button, Typography, IconButton, CircularProgress } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { clearImages, deleteImage, uploadImage, uploadMultiImage } from '../../redux/imageSlice'

export default function ImageUploader() {
  const dispatch = useAppDispatch()
  const { images, loading, error } = useAppSelector((state) => state.image)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setSelectedFiles(Array.from(files))
    }
  }

  const handleUpload = () => {
    const formData = new FormData()
    if (selectedFiles.length === 1) {
      formData.append('image', selectedFiles[0])
      dispatch(uploadImage(formData))
    } else {
      selectedFiles.forEach((file) => formData.append('images', file))
      dispatch(uploadMultiImage(formData))
    }
  }

  const handleDelete = (url: string) => {
    dispatch(deleteImage(url))
  }

  return (
    <Box>
      <Typography variant="h6">Image Uploader</Typography>

      <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ mt: 2 }}>
        Chọn ảnh
        <input hidden type="file" accept="image/*" multiple onChange={handleChange} />
      </Button>

      {selectedFiles.length > 0 && (
        <Box mt={2}>
          <Typography variant="body2">Preview:</Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
            {selectedFiles.map((file, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 100,
                  height: 100,
                  overflow: 'hidden',
                  borderRadius: 1,
                  border: '1px solid #ccc',
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            ))}
          </Box>
          <Button
            sx={{ mt: 1 }}
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Upload'}
          </Button>
        </Box>
      )}

      <Box mt={3}>
        <Typography variant="body2">Uploaded Images:</Typography>
        <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
          {images.map((url, idx) => (
            <Box
              key={idx}
              position="relative"
              sx={{
                width: 120,
                height: 120,
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid #ccc',
              }}
            >
              <img
                src={url}
                alt={`uploaded-${idx}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <IconButton
                size="small"
                onClick={() => handleDelete(url)}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'rgba(255,255,255,0.7)',
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}

      <Button onClick={() => dispatch(clearImages())} sx={{ mt: 2 }}>
        Clear
      </Button>
    </Box>
  )
}
