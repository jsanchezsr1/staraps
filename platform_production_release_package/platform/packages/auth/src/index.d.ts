export type PlatformRole = "OWNER" | "ADMIN" | "DEVELOPER" | "VIEWER";
export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
export declare function signJwt(payload: Record<string, unknown>, secret: string): string;
export declare function verifyJwt(token: string, secret: string): Record<string, unknown>;
export declare function buildCookieOptions(isProduction: boolean, domain?: string): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax";
    path: string;
    maxAge: number;
    domain: string | undefined;
};
