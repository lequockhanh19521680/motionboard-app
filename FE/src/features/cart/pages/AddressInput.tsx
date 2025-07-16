import React, { useEffect, useState, useRef, forwardRef } from "react"
import {
  Box, Card, TextField, Typography, InputAdornment, IconButton, Fade, Paper, List, ListItemButton, ListItemText
} from "@mui/material"
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined"
import CloseIcon from "@mui/icons-material/Close"
import useLocationIQAutocomplete, { LocationIQOption } from "../../../api/3rd/useLocationIQAutocomplete"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

type AddressInputProps = {
  value: string, // place_id
  error?: string,
  onChange: (val: string) => void,
  inputRef?: React.RefObject<HTMLInputElement | null>
}

const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ value, error, onChange, inputRef }, ref) => {
    // Hiển thị input
    const [inputDisplay, setInputDisplay] = useState("")
    const [showList, setShowList] = useState(false)
    const debouncedQuery = useDebounce(inputDisplay, 200)
    const options = useLocationIQAutocomplete(debouncedQuery)
    const paperRef = useRef<HTMLDivElement>(null)
    console.log(value)
    useEffect(() => {
      if (!value) {
        setInputDisplay("")
        return
      }
      const found = options.find(opt => opt.place_id === value)
      if (found) {
        setInputDisplay(found.display_name)
      }
    }, [value])

    useEffect(() => {
      if (!value) return
      const found = options.find(opt => opt.place_id === value)
      if (found) {
        setInputDisplay(found.display_name)
      }
    }, [options, value])

    // Khi nhập text: truyền inputDisplay, không truyền value, reset value về ""
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputDisplay(e.target.value)
      onChange("")        // Khi nhập text tự do, reset value về "", tức là không chọn
      setShowList(true)
    }
    // Khi truyền lên cha: truyền place_id
    const handleSelect = (option: LocationIQOption) => {
      setInputDisplay(option.display_name)
      onChange(option.place_id)
      setShowList(false)
    }
    const handleClear = () => {
      setInputDisplay("")
      onChange("")
      setShowList(false)
    }

    return (
      <Box sx={{ mb: 3, position: "relative" }}>
        <Card
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "#fafbfc",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <RoomOutlinedIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ mb: 0.5, color: "text.primary" }}
            >
              Địa chỉ nhận hàng <span style={{ color: "#d32f2f" }}>*</span>
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="medium"
              placeholder="Nhập và chọn địa chỉ từ LocationIQ..."
              value={inputDisplay}
              onChange={handleInputChange}
              inputRef={inputRef ? inputRef : ref as React.Ref<HTMLInputElement>}
              error={error !== undefined}
              helperText={error}
              InputProps={{
                endAdornment: inputDisplay && (
                  <InputAdornment position="end">
                    <Fade in={!!inputDisplay}>
                      <IconButton
                        size="small"
                        sx={{ visibility: inputDisplay ? "visible" : "hidden" }}
                        onClick={handleClear}
                        aria-label="Xoá địa chỉ"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Fade>
                  </InputAdornment>
                ),
              }}
              sx={{
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 0 0 1px #e0e3eb",
                ".MuiInputBase-input": { fontSize: 16 },
              }}
              autoComplete="off"
              onFocus={() => {
                if (options.length > 0) setShowList(true)
              }}
              onBlur={() => {
                setTimeout(() => setShowList(false), 120)
              }}
            />
            {showList && inputDisplay && options.length > 0 && (
              <Paper
                elevation={3}
                ref={paperRef}
                sx={{
                  position: "absolute",
                  zIndex: 10,
                  left: 0,
                  right: 0,
                  mt: "2px",
                  maxHeight: 240,
                  overflow: "auto",
                }}
              >
                <List>
                  {options.map((option: LocationIQOption, i: number) => (
                    <ListItemButton
                      key={(option.place_id || "") + i}
                      onClick={() => handleSelect(option)}
                    >
                      <ListItemText
                        primary={option.display_name}
                        primaryTypographyProps={{ fontSize: 15 }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Card>
      </Box>
    )
  }
)

AddressInput.displayName = "AddressInput"
export default AddressInput
