import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/darshanease',
  jwt: {
    secret: process.env.JWT_SECRET || 'darshanease_default_secret',
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'darshanease_refresh_default',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromEmail: process.env.FROM_EMAIL || 'noreply@darshanease.com',
    fromName: process.env.FROM_NAME || 'DarshanEase',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
    path: process.env.UPLOAD_PATH || './uploads',
  },
};

export default config;
