const toLogPayload = (level, message, context = {}) => ({
  timestamp: new Date().toISOString(),
  service: 'ewangelibus-frontend',
  level,
  message,
  ...context,
});

export const logger = {
  info: (message, context = {}) => {
    console.info(toLogPayload('info', message, context));
  },
  warn: (message, context = {}) => {
    console.warn(toLogPayload('warn', message, context));
  },
  error: (message, context = {}) => {
    console.error(toLogPayload('error', message, context));
  },
};
