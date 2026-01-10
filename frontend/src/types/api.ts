/**
 * Common API Response Types
 * Shared interfaces for API responses, pagination, and error handling
 */

/**
 * Paginated response from Django REST Framework
 */
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

/**
 * Standard API error response
 */
export interface APIError {
    detail?: string;
    [key: string]: any;
}

/**
 * Generic API response wrapper
 */
export interface APIResponse<T> {
    data: T;
    message?: string;
}

/**
 * Common timestamp fields
 */
export interface Timestamps {
    created_at: string;
    updated_at: string;
}

/**
 * Common ID field
 */
export interface WithId {
    id: string;
}
