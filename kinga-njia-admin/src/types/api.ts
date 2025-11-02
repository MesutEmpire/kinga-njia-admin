export enum ClaimStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED',
    RESOLVED = 'RESOLVED',
}

export enum SeverityLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export enum DetectionType {
    AUTOMATIC = 'AUTOMATIC',
    MANUAL = 'MANUAL',
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
}

export interface Image {
    id: number;
    url: string;
    hash: string;
    timestamp: string;
    createdAt: string;
    updatedAt: string;
}

export interface Claim {
    id: number;
    user: User;
    location: string;
    latitude: number;
    longitude: number;
    status: ClaimStatus;
    hash: string;
    severity: SeverityLevel;
    description: string;
    detectionType: DetectionType;
    confirmationTime?: string;
    createdAt: string;
    updatedAt: string;
    images: Image[];
}

// Request DTOs
export interface CreateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface UpdateUserRequest {
    email?: string;
    firstName?: string;
    lastName?: string;
}

export interface CreateClaimRequest {
    userId: number;
    location: string;
    latitude: number;
    longitude: number;
    status: ClaimStatus;
    hash: string;
    severity: SeverityLevel;
    description: string;
    detectionType: DetectionType;
}

export interface UpdateClaimRequest {
    location?: string;
    latitude?: number;
    longitude?: number;
    status?: ClaimStatus;
    hash?: string;
    severity?: SeverityLevel;
    description?: string;
    detectionType?: DetectionType;
}

export interface CreateImageRequest {
    claim_id: number;
    url: string;
    hash: string;
    timestamp: string;
}

export interface UpdateImageRequest {
    url?: string;
    hash?: string;
    timestamp?: string;
}

// API Response types (matches backend ApiResponse wrapper)
export interface ApiResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data: T;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

// Analytics types
export interface ClaimStatistics {
    total: number;
    pending: number;
    verified: number;
    rejected: number;
    resolved: number;
    byLocation: { location: string; count: number }[];
    bySeverity: { severity: SeverityLevel; count: number }[];
    byDetectionType: { type: DetectionType; count: number }[];
    recentClaims: Claim[];
}
