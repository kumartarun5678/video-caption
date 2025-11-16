export interface CustomError extends Error {
    statusCode?: number;
    status?: string;
}
export declare const errorHandler: (err: CustomError, req: any, res: any, next: any) => void;
export declare const notFound: (req: any, res: any, next: any) => void;