export interface ShopResponse {
  id: number
  shopName: string
  image: string | null
  ownerId: number
  addressLabel: string | null
  longitude: number | null
  latitude: number | null
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}
