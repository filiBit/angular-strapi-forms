export interface StrapiErrorResponse {
    data: null;
    error: {
        status: string;
        name: string;
        message: string;
        details: {
            errors?: { message: string }[];
        };
    };
}
