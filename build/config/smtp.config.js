"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtpConfig = void 0;
exports.smtpConfig = {
    host: process.env.SMTP_HOST, // Non-null assertion if you're sure it exists
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT || '587') != 587 ? true : false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // Optional TLS settings
    tls: {
        rejectUnauthorized: process.env.NODE_ENV !== 'production'
    }
};
