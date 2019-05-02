const { createLogger, format, transports } = require('winston');
require('winston-mongodb')

let options = {
   
    database: {
      db  : process.env.MONGODB_URL
     // level: process.env.ENV === 'development' ? 'debug' : 'info',
    }
  };

const logger = createLogger({
    level: 'debug',
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(
        info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
      )
    ),
    transports: [
        new transports.MongoDB(options.database)
      ],
  });

  module.exports = logger;


