import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const formatMessage = (level, message, meta = {}) => {
  const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
  return `[${getTimestamp()}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
};

const writeToFile = (filename, content) => {
  const filePath = path.join(logDir, filename);
  fs.appendFileSync(filePath, content, 'utf8');
};

const logger = {
  info(message, meta = {}) {
    const formatted = formatMessage('INFO', message, meta);
    console.log(`ℹ️  ${message}`);
    writeToFile('app.log', formatted);
  },

  warn(message, meta = {}) {
    const formatted = formatMessage('WARN', message, meta);
    console.warn(`⚠️  ${message}`);
    writeToFile('app.log', formatted);
  },

  error(message, meta = {}) {
    const formatted = formatMessage('ERROR', message, meta);
    console.error(`❌ ${message}`);
    writeToFile('error.log', formatted);
    writeToFile('app.log', formatted);
  },

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = formatMessage('DEBUG', message, meta);
      console.log(`🔍 ${message}`);
      writeToFile('app.log', formatted);
    }
  },

  request(req) {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    };
    const formatted = formatMessage('REQUEST', `${req.method} ${req.originalUrl}`, meta);
    writeToFile('access.log', formatted);
  },
};

export default logger;
