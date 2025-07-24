import { Box, Button, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'

export interface SidebarItem {
  key: string
  label: string
  icon?: ReactNode
}

interface SidebarProps {
  title?: string
  selectedKey: string
  onSelect: (key: string) => void
  items: SidebarItem[]
}

const SidebarButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) => {
  return (
    <Button
      fullWidth
      onClick={onClick}
      startIcon={undefined}
      sx={{
        justifyContent: 'flex-start',
        borderRadius: '12px',
        py: 1.5,
        px: 2,
        gap: 1.5,
        backgroundColor: active ? '#4f46e5' : '#f3f4f6',
        color: active ? '#fff' : '#333',
        boxShadow: active ? '0 4px 12px rgba(79, 70, 229, 0.35)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          backgroundColor: active ? '#4338ca' : '#e5e7eb',
          color: active ? '#fff' : '#111',
        },
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '1rem',
      }}
    >
      {children}
    </Button>
  )
}

export default function Sidebar({ title, selectedKey, onSelect, items }: SidebarProps) {
  return (
    <Box
      sx={{
        width: 240,
        bgcolor: '#fff',
        borderRight: '1px solid #e2e8f0',
        py: 4,
        px: 2,
        boxShadow: '4px 0 20px rgba(0,0,0,0.06)',
      }}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            fontSize: '1.2rem',
            color: '#1f2937',
          }}
        >
          {title}
        </Typography>
      )}

      <Stack spacing={1.5}>
        {items.map((item) => (
          <SidebarButton
            key={item.key}
            active={selectedKey === item.key}
            onClick={() => onSelect(item.key)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.icon}
              <span>{item.label}</span>
            </Box>
          </SidebarButton>
        ))}
      </Stack>
    </Box>
  )
}
