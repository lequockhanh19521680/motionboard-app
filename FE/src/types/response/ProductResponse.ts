export interface ProductResponse {
    id: number // from product_id
    product_name: string
    image: string | null
    description: string
    price: string
    created_at: string
    created_by: number
    updated_ai?: any // Type is 'any' as data sample does not provide this field
    updated_by: number | null
}
