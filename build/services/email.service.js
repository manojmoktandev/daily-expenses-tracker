"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_config_1 = require("../config/logger.config");
const http_status_1 = require("http-status");
const fs_1 = __importDefault(require("fs"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const logger = (0, logger_config_1.createLogger)('EmailService');
class EmailService {
    constructor(config, templatesDir = 'src/templates/emails') {
        this.transporter = nodemailer_1.default.createTransport(config);
        this.templatesDir = templatesDir;
        // verify connection on startup
        this.verifyConnection();
    }
    verifyConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transporter.verify();
                logger.info('SMTP connection verified');
            }
            catch (error) {
                logger.error('Error verifying SMTP connection:', error);
                throw new error_handler_middleware_1.default('SMTP connection failed', http_status_1.status.BAD_REQUEST);
            }
        });
    }
    renderTemplate(template_1) {
        return __awaiter(this, arguments, void 0, function* (template, context = {}) {
            const templatePath = path_1.default.join(this.templatesDir, `${template}.ejs`);
            try {
                const templateContent = yield fs_1.default.promises.readFile(templatePath, 'utf-8');
                return ejs_1.default.render(templateContent, context);
            }
            catch (error) {
                logger.error(`Error rendering template ${template}:`, error);
                throw new Error(`Failed to render email template: ${template}`);
            }
        });
    }
    sendEmail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { to, subject, template, context, text, html, attachments } = options;
                let finalHtml = html;
                if (template) {
                    finalHtml = yield this.renderTemplate(template, context);
                }
                const mailOptions = {
                    from: process.env.EMAIL_FROM || '"No Reply" <no-reply@example.com>',
                    to: Array.isArray(to) ? to.join(', ') : to,
                    subject,
                    text: text || '',
                    html: finalHtml,
                    attachments
                };
                const info = yield this.transporter.sendMail(mailOptions);
                logger.info(`Email sent to ${to}`, info.messageId);
            }
            catch (error) {
                logger.error('Error sending email:', error);
                throw error;
            }
        });
    }
}
exports.EmailService = EmailService;
