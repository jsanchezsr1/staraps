export declare class AppError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare function env(name: string, fallback?: string): string;
export declare const logger: {
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
};
export declare function slugify(input: string): string;
export * from "./logger";
export * from "./health";
export * from "./metrics";
