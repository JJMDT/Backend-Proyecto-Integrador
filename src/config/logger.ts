import bunyan from 'bunyan';

export const logger = bunyan.createLogger({
  name: 'mi-backend-app',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'error',
      path: './error.log'
    }
  ]
});