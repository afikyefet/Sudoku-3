import nodemailer from 'nodemailer';

const { MAIL_PROVIDER, MAILGUN_USER, MAILGUN_PASS, RESEND_API_KEY, POSTMARK_API_KEY, EMAIL_FROM } = process.env;

let transporter: nodemailer.Transporter;

if (MAIL_PROVIDER === 'mailgun') {
    transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: { user: MAILGUN_USER, pass: MAILGUN_PASS },
    });
} else if (MAIL_PROVIDER === 'resend') {
    transporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 587,
        auth: { user: 'resend', pass: RESEND_API_KEY },
    });
} else if (MAIL_PROVIDER === 'postmark') {
    transporter = nodemailer.createTransport({
        host: 'smtp.postmarkapp.com',
        port: 587,
        auth: { user: POSTMARK_API_KEY, pass: POSTMARK_API_KEY },
    });
} else {
    throw new Error('No supported mail provider configured');
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    await transporter.sendMail({
        from: EMAIL_FROM || 'noreply@sudoku.com',
        to,
        subject,
        html,
    });
}
