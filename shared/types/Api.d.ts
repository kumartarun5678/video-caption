export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    statusCode?: number;
    timestamp?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface UploadResponse {
    id: string;
    url: string;
    filename: string;
    size: number;
    mimetype: string;
    uploadedAt: string;
    metadata?: {
        duration?: number;
        width?: number;
        height?: number;
        format?: string;
    };
}
export interface StatusResponse {
    status: 'processing' | 'completed' | 'failed' | 'pending';
    progress?: number;
    message?: string;
    estimatedTimeRemaining?: number;
}