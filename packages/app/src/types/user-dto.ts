export interface UserDto {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    role: { [key: string]: unknown; type: string };
}
