import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Typography, IconButton, LinearProgress } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'

type UploadingFile = {
  file: File
  preview: string
  progress: number
  status: 'pending' | 'uploading' | 'uploaded' | 'error'
}

export type ImageUploaderProps = {
  maxFiles?: number
  previewSize?: number
  shape?: 'square' | 'circle'
  buttonLabel?: string
  onUpload: (file: File, onProgress: (percent: number) => void) => Promise<string>
  onDelete?: (url: string) => Promise<void>
  defaultImages?: string[]
  mode?: 'default' | 'avatar'
  onUploadComplete?: (url: string) => void
}

export default function ImageUploader({
  maxFiles = 10,
  previewSize = 120,
  shape = 'square',
  buttonLabel,
  onUpload,
  onDelete,
  defaultImages = [],
  mode = 'default',
  onUploadComplete,
}: ImageUploaderProps) {
  // console.log('ImageUploader props.mode:', mode)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>(defaultImages)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [error, setError] = useState<string>()

  useEffect(() => {
    setUploadedImages(defaultImages)
  }, [defaultImages])

  const handleUploadFile = useCallback(
    async (uploading: UploadingFile) => {
      // console.log('handleUploadFile uploading:', uploading)

      setUploadingFiles((prev) =>
        prev.map((f) => (f.preview === uploading.preview ? { ...f, status: 'uploading' } : f))
      )
      try {
        const url = await onUpload(uploading.file, (percent) => {
          setUploadingFiles((prev) =>
            prev.map((f) => (f.preview === uploading.preview ? { ...f, progress: percent } : f))
          )
        })
        setUploadingFiles((prev) => prev.filter((f) => f.preview !== uploading.preview))
        if (mode === 'avatar') {
          setUploadedImages([url])
        } else {
          setUploadedImages((prev) => [...prev, url])
        }
        if (onUploadComplete) onUploadComplete(url)
      } catch (err: any) {
        setUploadingFiles((prev) =>
          prev.map((f) => (f.preview === uploading.preview ? { ...f, status: 'error' } : f))
        )
        setError(err.message || 'Upload thất bại')
      }
    },
    [onUpload, mode, onUploadComplete]
  )

  const handleFiles = useCallback(
    (files: FileList | null) => {
      // console.log('handleFiles called with:', files)
      if (!files) return

      const arr = Array.from(files)
      const maxAllowed = mode === 'avatar' ? 1 : maxFiles

      const uploads: UploadingFile[] = arr.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'pending',
      }))

      // console.log('uploads array:', uploads)

      if (mode === 'avatar') {
        const uploadsToUpload = uploads.slice(0, 1)
        // console.log('uploads to upload:', uploadsToUpload)

        uploadsToUpload.forEach((u) => {
          // console.log('about to call handleUploadFile on:', u)
          handleUploadFile(u)
        })

        setUploadedImages([])
        setUploadingFiles(uploadsToUpload)
      } else {
        // console.log('default mode uploads', uploads)
        setUploadingFiles((prev) => [...prev, ...uploads])
        uploads.forEach(handleUploadFile)
      }
    },
    [uploadedImages.length, uploadingFiles.length, maxFiles, handleUploadFile, mode]
  )

  const handleDelete = useCallback(
    async (url: string) => {
      try {
        if (onDelete) {
          await onDelete(url)
        }
        setUploadedImages((prev) => prev.filter((u) => u !== url))
      } catch (err: any) {
        setError(err.message || 'Xóa ảnh thất bại')
      }
    },
    [onDelete]
  )

  const removeUploadingFile = useCallback((uploading: UploadingFile) => {
    setUploadingFiles((prev) => prev.filter((f) => f !== uploading))
  }, [])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('onChange fired:', e.target.files)
    if (e.target.files && e.target.files.length > 0) {
      // console.log('selected file name:', e.target.files[0].name)
    }
    handleFiles(e.target.files)
  }

  const previewStyle: React.CSSProperties = {
    width: previewSize,
    height: previewSize,
    borderRadius: shape === 'circle' ? '50%' : 4,
    objectFit: 'cover',
  }

  // ============================= AVATAR MODE =============================
  if (mode === 'avatar') {
    return (
      <Box
        sx={{
          position: 'relative',
          width: previewSize,
          height: previewSize,
          borderRadius: shape === 'circle' ? '50%' : 4,
          overflow: 'hidden',
          border: '2px dashed #90caf9',
          cursor: 'pointer',
          '&:hover .overlay': { opacity: 1 },
          userSelect: 'none',
          bgcolor: '#f5faff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 8px rgba(33,150,243,0.5)',
        }}
        onClick={() => {
          // console.log('Box clicked, ref:', fileInputRef.current)
          fileInputRef.current?.click()
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept="image/*"
          multiple={false}
          onChange={handleChange}
        />
        {uploadingFiles.length > 0 ? (
          uploadingFiles.map((item) => (
            <Box key={item.preview} sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <img src={item.preview} alt="uploading" style={previewStyle} />
              {item.status === 'uploading' && (
                <LinearProgress
                  variant="determinate"
                  value={item.progress}
                  sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 4 }}
                />
              )}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  removeUploadingFile(item)
                }}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(255,255,255,0.7)',
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        ) : uploadedImages.length > 0 ? (
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <img src={uploadedImages[0]} alt="avatar" style={previewStyle} />
            {onDelete && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(uploadedImages[0])
                }}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(255,255,255,0.7)',
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ) : (
          <AddPhotoAlternateIcon sx={{ fontSize: previewSize / 2, color: '#90caf9' }} />
        )}
      </Box>
    )
  }

  // ============================= DEFAULT MODE =============================
  return (
    <Box>
      <Typography variant="h6">{buttonLabel || 'Image Uploader'}</Typography>
      <Box
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed #90caf9',
          borderRadius: 2,
          p: 4,
          cursor: 'pointer',
          textAlign: 'center',
          background: '#f5faff',
          color: '#1976d2',
          mt: 2,
          '&:hover': { background: '#e3f2fd' },
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, mb: 1 }} />
        <Typography fontWeight="bold">Drag & Drop hoặc Click để chọn</Typography>
        <Typography variant="caption" color="text.secondary">
          JPG/PNG, tối đa {maxFiles} ảnh
        </Typography>
        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept="image/*"
          multiple={maxFiles > 1}
          onChange={handleChange}
        />
      </Box>
      {uploadingFiles.length > 0 && (
        <Box mt={2}>
          <Typography variant="body2">Đang tải lên:</Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
            {uploadingFiles.map((item) => (
              <Box
                key={item.preview}
                sx={{
                  position: 'relative',
                  width: previewSize,
                  height: previewSize,
                  overflow: 'hidden',
                  border: '1px solid #ccc',
                  borderRadius: shape === 'circle' ? '50%' : 2,
                }}
              >
                <img src={item.preview} alt="preview" style={previewStyle} />
                {item.status === 'uploading' && (
                  <LinearProgress
                    variant="determinate"
                    value={item.progress}
                    sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 4 }}
                  />
                )}
                <IconButton
                  size="small"
                  onClick={() => removeUploadingFile(item)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'rgba(255,255,255,0.8)',
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      <Box mt={3}>
        <Typography variant="body2">Đã tải lên:</Typography>
        <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
          {uploadedImages.map((url, idx) => (
            <Box
              key={idx}
              sx={{
                position: 'relative',
                width: previewSize,
                height: previewSize,
                overflow: 'hidden',
                border: '1px solid #ccc',
                borderRadius: shape === 'circle' ? '50%' : 2,
              }}
            >
              <img src={url} alt={`uploaded-${idx}`} style={previewStyle} />
              {onDelete && (
                <IconButton
                  size="small"
                  onClick={() => handleDelete(url)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'rgba(255,255,255,0.8)',
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Box>
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  )
}
