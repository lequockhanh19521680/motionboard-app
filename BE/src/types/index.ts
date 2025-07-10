export interface AuthRequest extends Request {
    user_id: number;
}

export interface UploadResponse {
    message: string;
    key?: string;
    keys?: string[];
}

export interface ErrorResponse {
    error: string;
}

export interface GenerateSignedUrlRequest {
    key: string;
}

export interface DeleteImageRequest {
    key: string;
}