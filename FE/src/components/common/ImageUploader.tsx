import { useRef, useState, useCallback } from 'react'
import { Box, Typography, IconButton, LinearProgress } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'

type UploadingFile = {
  file: File
  preview: string
  progress: number
  status: 'pending' | 'uploading' | 'uploaded' | 'error'
  uploadedUrl?: string
}

type ImageUploaderHookProps = {
  maxFiles?: number
  initialImages?: string[]
  onUpload: (file: File, onProgress: (percent: number) => void) => Promise<string>
  onDelete?: (url: string) => Promise<void>
}

export function useImageUploader({
  maxFiles = 10,
  initialImages = [],
  onUpload,
  onDelete,
}: ImageUploaderHookProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [error, setError] = useState<string | undefined>(undefined)

  const uploadFile = useCallback(
    async (item: UploadingFile) => {
      item.status = 'uploading'
      setUploadingFiles((prev) => [...prev])

      try {
        const url = await onUpload(item.file, (percent) => {
          item.progress = percent
          setUploadingFiles((prev) => [...prev])
        })

        item.status = 'uploaded'
        item.uploadedUrl = url
        setUploadedImages((prev) => [...prev, url])
        setUploadingFiles((prev) => prev.filter((f) => f !== item))
      } catch (err: any) {
        item.status = 'error'
        setError(err.message || 'Upload failed')
        setUploadingFiles((prev) => [...prev])
      }
    },
    [onUpload]
  )

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const arr = Array.from(files)

      if (arr.length + uploadedImages.length + uploadingFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} images allowed`)
        return
      }
      setError(undefined)

      const uploads: UploadingFile[] = arr.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'pending',
      }))

      setUploadingFiles((prev) => [...prev, ...uploads])
      uploads.forEach(uploadFile)
    },

    [uploadedImages.length, uploadingFiles.length, maxFiles, uploadFile]
  )

  const handleDelete = useCallback(
    async (url: string) => {
      if (!onDelete) return

      try {
        await onDelete(url)
        setUploadedImages((prev) => prev.filter((u) => u !== url))
      } catch (err: any) {
        setError(err.message || 'Delete failed')
      }
    },
    [onDelete]
  )

  const removeUploadingFile = useCallback((file: UploadingFile) => {
    setUploadingFiles((prev) => prev.filter((f) => f !== file))
  }, [])

  const clearAll = useCallback(() => {
    setUploadedImages([])
    setUploadingFiles([])
    setError(undefined)
  }, [])

  return {
    uploadedImages,
    uploadingFiles,
    error,
    handleFiles,
    handleDelete,
    removeUploadingFile,
    clearAll,
  }
}

type ImageUploaderProps = {
  maxFiles?: number
  previewSize?: number
  shape?: 'square' | 'circle'
  buttonLabel?: string
  uploadLabel?: string
  onUpload: (file: File, onProgress: (percent: number) => void) => Promise<string>
  onDelete?: (url: string) => Promise<void>
  defaultImages?: string[]
}

export default function ImageUploader({
  maxFiles = 10,
  previewSize = 120,
  shape = 'square',

  onUpload,
  onDelete,
  defaultImages = [],
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { uploadedImages, uploadingFiles, error, handleFiles, handleDelete, removeUploadingFile } =
    useImageUploader({
      maxFiles,
      initialImages: defaultImages,
      onUpload,
      onDelete,
    })

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const previewStyle = {
    width: previewSize,
    height: previewSize,
    borderRadius: shape === 'circle' ? '50%' : 4,
    objectFit: 'cover' as const,
  }

  return (
    <Box>
      <Typography variant="h6">Image Uploader</Typography>

      {/* DROPZONE */}
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
        <Typography fontWeight="bold">Drag & Drop or Click to Select</Typography>
        <Typography variant="caption" color="text.secondary">
          JPG/PNG, max {maxFiles} images
        </Typography>
        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
        />
      </Box>

      {/* Uploading previews */}
      {uploadingFiles.length > 0 && (
        <Box mt={2}>
          <Typography variant="body2">Uploading:</Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
            {uploadingFiles.map((item, idx) => (
              <Box
                key={idx}
                position="relative"
                sx={{
                  width: previewSize,
                  height: previewSize,
                  overflow: 'hidden',
                  borderRadius: shape === 'circle' ? '50%' : 2,
                  border: '1px solid #ccc',
                }}
              >
                <img src={item.preview} alt="preview" style={previewStyle} />
                {item.status === 'uploading' && (
                  <LinearProgress
                    variant="determinate"
                    value={item.progress}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: 4,
                    }}
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

      {/* Uploaded images */}
      <Box mt={3}>
        <Typography variant="body2">Uploaded:</Typography>
        <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
          {uploadedImages.map((url, idx) => (
            <Box
              key={idx}
              position="relative"
              sx={{
                width: previewSize,
                height: previewSize,
                borderRadius: shape === 'circle' ? '50%' : 2,
                overflow: 'hidden',
                border: '1px solid #ccc',
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
