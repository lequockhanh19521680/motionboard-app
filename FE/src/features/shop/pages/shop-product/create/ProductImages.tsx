import {
  Box,
  Stack,
  Card,
  Typography,
  CardMedia,
  CardActions,
  IconButton,
  Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import DeleteIcon from '@mui/icons-material/Delete'

interface ProductImageUI {
  imageId?: number
  imageUrl: string
  sortOrder: number
  preview?: string
  file?: File
}

interface ProductImagesProps {
  images: ProductImageUI[]
  addArrayItem: () => void
  removeArrayItem: (idx: number) => void
  handleImageUpload: (idx: number, file: File | null) => void
  moveImage: (from: number, to: number) => void
}

export function ProductImages({
  images,
  addArrayItem,
  removeArrayItem,
  handleImageUpload,
  moveImage,
}: ProductImagesProps) {
  return (
    <Box mt={5}>
      <Typography variant="subtitle1" color="primary.main" mb={1}>
        Hình ảnh phụ
      </Typography>
      <Stack direction="row" flexWrap="wrap" spacing={2} useFlexGap>
        {images.map((img, idx) => (
          <Box key={idx} width={156} maxWidth="95vw" mb={2} position="relative">
            <Card>
              <label htmlFor={`upload-img-${idx}`}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id={`upload-img-${idx}`}
                  type="file"
                  onChange={(e) => {
                    const file =
                      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null
                    handleImageUpload(idx, file)
                  }}
                />
                <CardMedia
                  image={img.preview || img.imageUrl || ''} // Use preview if available, else imageUrl
                  sx={{
                    height: 96,
                    width: '100%',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    bgcolor: img.imageUrl || img.preview ? '#eef2fb' : '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {(img.preview || img.imageUrl) && (
                    <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
                      <PhotoCamera sx={{ color: '#1992ff', fontSize: 32 }} />
                      <Typography color="#999" fontSize={13}>
                        Thêm ảnh
                      </Typography>
                    </Stack>
                  )}
                </CardMedia>
              </label>
              <CardActions sx={{ justifyContent: 'center', px: 1, py: 0.5 }}>
                <Tooltip title="Di chuyển lên" arrow placement="top">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => moveImage(idx, idx - 1)}
                      disabled={idx === 0}
                      color="primary"
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Di chuyển xuống" arrow placement="top">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => moveImage(idx, idx + 1)}
                      disabled={idx === images.length - 1}
                      color="primary"
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Xóa ảnh" arrow placement="top">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => removeArrayItem(idx)}
                      disabled={images.length === 1}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </CardActions>
            </Card>
          </Box>
        ))}
        <Box width={156} maxWidth="95vw" mb={2} sx={{ display: 'flex', alignItems: 'stretch' }}>
          <Card
            onClick={addArrayItem}
            sx={{
              height: '100%',
              minHeight: 148,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px dashed #1992ff',
              borderRadius: 3,
              boxShadow: 'none',
              bgcolor: '#f9fafb',
              cursor: 'pointer',
              transition: 'border 0.18s, box-shadow .18s',
              '&:hover': { borderColor: '#1976d2', boxShadow: 2 },
            }}
          >
            <Stack alignItems="center" justifyContent="center" spacing={1}>
              <AddIcon sx={{ color: '#1992ff', fontSize: 26 }} />
              <Typography color="#1992ff" fontSize={14}>
                Thêm ảnh
              </Typography>
            </Stack>
          </Card>
        </Box>
      </Stack>
    </Box>
  )
}
