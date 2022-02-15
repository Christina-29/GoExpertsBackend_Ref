import sgMail from "@sendgrid/mail";
import logger from "../config/winston";

type Message = {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html: string;
};

/**
 * Send email using sendgrid
 * @param msg message
 * @returns send email result, true if successful, false if failed
 */
const sgSendEmail = async (msg: Message): Promise<boolean> => {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;
  sgMail.setApiKey(SENDGRID_API_KEY);
  try {
    await sgMail.send(msg);
    return true;
  } catch (error: unknown) {
    logger.error(error);
    return false;
  }
};

const emailHeader = `<header></header>`;

const emailFooter = `<footer><p>If you did not request this, please ignore this email.</p></footer>`;

/**
 * Send email
 * @param to email address
 * @param subject email subject
 * @param content email content
 * @returns send email result, true if successful, false if failed
 */
export const sendEmail = async (
  to: string,
  subject: string,
  content: string
): Promise<boolean> => {
  const html = emailHeader + content + emailFooter;
  const from = process.env.SENDER_EMAIL as string;
  const emailMSG = {
    to,
    from,
    subject,
    html,
  };
  return sgSendEmail(emailMSG);
};

/**
 * email templates
 */
export const emailTemplate = {
  confirmEmail: (
    firstName: string,
    link: string
  ): string => `
  <article>
    <p>Hi ${firstName}</p>
    <p> Click to verify your email: <a href="${link}"> Confirm Email</a>  </p>
  </article>`,
  resetPasswordEmail: (
    firstName: string,
    link: string
  ): string => `
  <article>
    <p>Hi ${firstName}</p>
    <p>Click to reset your password: <a href="${link}"> Reset Password</a></p>
  </article>`,
};
