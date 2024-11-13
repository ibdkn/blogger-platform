"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.ADMIN_AUTH = void 0;
exports.ADMIN_AUTH = 'admin:qwerty';
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    else {
        const encodedAuth = authHeader.slice(6);
        const decodedAuth = Buffer.from(encodedAuth, 'base64').toString('utf-8');
        if (decodedAuth === exports.ADMIN_AUTH) {
            next();
        }
        else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
};
exports.authMiddleware = authMiddleware;
