require('dotenv').config();
const nodemailer = require("nodemailer");
const config = require('./config');
const { google } = require('googleapis');
const logger = require("../utils/logs").log;

const OAuth2_client = new google.auth.OAuth2(config.clientId, config.clientSecret);
OAuth2_client.setCredentials({ refresh_token: config.refresh_token });

async function getAccessToken() {
  try {
    const token = await OAuth2_client.getAccessToken();
    return token.token;
  } catch (error) {
    logger.error('Error getting access token', error);
    throw new Error('Error getting access token');
  }
}

async function createTransporter() {
  const accessToken = await getAccessToken();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.user,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refresh_token,
      accessToken: accessToken,
    }
  });
}

async function sendTextEmail(data) {
  try {
    const transporter = await createTransporter();
    
    logger.info(`<> sending email to: ${data.to} <>`);

    const info = await transporter.sendMail({
      text: data.text,
      subject: data.subject,
      from: config.Email,
      to: data.to,
      html: `<span> ${data.data} <span/>`,
    });

    logger.info(`Success sending email to ${data.to} - ${info.response}`);
    return { success: true, message: info.response };
  } catch (error) {
    logger.error(`<> error sending email: ${error.message} <>`, error);
    return { success: false, message: error.message, error: error };
  }
}


module.exports = { sendTextEmail };
