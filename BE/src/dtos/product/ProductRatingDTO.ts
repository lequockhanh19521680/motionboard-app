export interface ProductRatingDTO {
    rating_id: number;
    user_id: number;
    rating: number;
    comment?: string | null;
    created_at?: string;
    username?: string;
}