"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
exports.buildCookieOptions = buildCookieOptions;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 12);
}
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function signJwt(payload, secret) {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "7d", issuer: "platform", audience: "platform-users" });
}
function verifyJwt(token, secret) {
    return jsonwebtoken_1.default.verify(token, secret, { issuer: "platform", audience: "platform-users" });
}
function buildCookieOptions(isProduction, domain) {
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: domain || undefined
    };
}
//# sourceMappingURL=index.js.map