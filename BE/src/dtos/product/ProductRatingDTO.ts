export interface ProductRatingDTO {
    ratingId: number;
    userId: number;
    rating: number;
    comment?: string | null;
    createdAt?: string;
    username?: string;
}