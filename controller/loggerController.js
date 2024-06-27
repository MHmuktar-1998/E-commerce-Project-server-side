const {createLogger,format,transports} = require('winston');

const logger = createLogger({
  level: 'info',
  format : format.combine(format.colorize(),format.timestamp({format : 'YYYY-MM-DD'})
  ,format.json()),
  transports: [
    
    // //for console in show
    // new transports.Console({
    //     format : format.combine(format.colorize(),format.simple())
    // }),


    // for files in show
    new transports.File({ 
        filename: 'src/logs/info.log',
        level : 'info'
     }),
     new transports.File({ 
        filename: 'src/logs/error.log',
        level : 'error'
     })




    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;