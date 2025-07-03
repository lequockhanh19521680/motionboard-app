import { Paper, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material'

export const Categories: React.FC = () => {
  const categories = ['Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện', 'Đồ gia dụng', 'Thời trang']

  return (
    <div className="md:col-span-1">
      <Paper elevation={3} className="p-4">
        <Typography variant="h6" className="font-bold pb-3 border-b border-gray-200">
          Danh mục
        </Typography>
        <List className="p-0">
          {categories.map((category, index) => (
            <ListItem key={index} disablePadding className="border-b border-gray-100 last:border-0">
              <ListItemButton className="hover:bg-gray-50">
                <ListItemText primary={category} className="text-gray-700" />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  )
}
