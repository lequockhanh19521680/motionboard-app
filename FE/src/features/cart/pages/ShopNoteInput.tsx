import React from "react"
import { Box, TextField, InputAdornment, IconButton, Fade } from "@mui/material"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import CloseIcon from "@mui/icons-material/Close"

type Props = {
  value: string
  shopId: number
  error?: string
  onChange: (shopId: number, note: string) => void
  onClear: (shopId: number) => void
  inputRef?: React.Ref<HTMLInputElement>
}

const ShopNoteInput = ({
  value,
  shopId,
  error,
  onChange,
  onClear,
  inputRef,
}: Props) => (
  <Box sx={{ px: 2, py: 1.5, borderBottom: t => `1px solid ${t.palette.grey[100]}` }}>
    <TextField
      variant="outlined"
      size="small"
      multiline
      minRows={1}
      maxRows={3}
      fullWidth
      placeholder="Ghi chú cho shop (vd: Giao giờ hành chính, gói quà...)"
      value={value}
      onChange={e => onChange(shopId, e.target.value)}
      inputRef={inputRef}
      error={error !== undefined}
      helperText={error}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <ChatBubbleOutlineIcon color="action" fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <Fade in={!!value}>
              <IconButton
                size="small"
                edge="end"
                aria-label="Xoá ghi chú"
                onClick={() => onClear(shopId)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Fade>
          </InputAdornment>
        ),
      }}
      sx={{
        background: "#fafbfc",
        borderRadius: 2,
        ".MuiInputBase-input": { fontSize: 15 },
      }}
    />
  </Box>
)

export default ShopNoteInput
