import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { smtpI } from "../interfaces/smtp.interface";
import { createLogger } from '../config/logger.config';
import { status as httpStatus } from "http-status";

import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import ApiError from '../middlewares/error-handler.middleware';

const logger = createLogger('EmailService')

interface EmailOptions{
    to:string | string[];
    subject:string;
    template?:string;
    context?: Record<string, any>;
    text?: string;
    html?: string;
    attachments?: SendMailOptions['attachments'];
}

export class EmailService {
    private transporter: Transporter;
    private templatesDir: string;

    constructor(config: smtpI, templatesDir = 'src/templates/emails'){
            this.transporter =  nodemailer.createTransport(config);
            this.templatesDir =  templatesDir;

            // verify connection on startup
            this.verifyConnection();
    }

    private async verifyConnection():Promise<void>{
        try{
            await this.transporter.verify();
            logger.info('SMTP connection verified');
        }catch(error){
            logger.error('Error verifying SMTP connection:',error);
            throw new ApiError('SMTP connection failed',httpStatus.BAD_REQUEST)
        }
    }

    private async renderTemplate(template: string, context: object = {}): Promise<string> {
        const templatePath = path.join(this.templatesDir, `${template}.ejs`);
        
        try {
          const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
          return ejs.render(templateContent, context);
        } catch (error) {
          logger.error(`Error rendering template ${template}:`, error);
          throw new Error(`Failed to render email template: ${template}`);
        }
    }

    public  async sendEmail(options:EmailOptions): Promise<void>{
        try {
            const {to, subject, template, context, text, html, attachments } =  options;
            let finalHtml =  html;
            if(template){
                finalHtml =  await this.renderTemplate(template, context);
            }

            const mailOptions:SendMailOptions  = {
                from:process.env.EMAIL_FROM || '"No Reply" <no-reply@example.com>',
                to:Array.isArray(to) ? to.join(', ') : to,
                subject,
                text:text || '',
                html: finalHtml,
                attachments
            };

            const info  =  await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent to ${to}`, info.messageId)
        }
        catch(error){
            logger.error('Error sending email:', error);
            throw error;
        }
    }

}

