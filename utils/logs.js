require('dotenv').config()
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const wsConfig = require('../config/wsconfig.json')

//const ROOT_PATH = process.argv[2];

// const setupConfig = '../../../config/wsconfig.json'

// let wsConfigParams = fs.readFileSync('../config/wsconfig.json');
// let setupConfig = JSON.parse(wsConfigParams);

// const readConfigPath = ROOT_PATH.concat(setupConfig);

let logConfigProps = (wsConfig);
let errorPath = logConfigProps.errorLogPath;
let infoPath = logConfigProps.infoLogPath;
// let errorPath = ROOT_PATH.concat(logConfigProps.errorLogPath);
// let infoPath = ROOT_PATH.concat(logConfigProps.infoLogPath);

const path = require('path');
const env = process.env.NODE_ENV || 'development';


if (logConfigProps.errorLevel) {
  errorTransport = new transports.DailyRotateFile({
    filename: `${errorPath}/error_%DATE%.log`,
    datePattern: 'MM-DD-YYYY',
    level: 'error'
  });
}
if (logConfigProps.infoLevel) {
  infoTransport = new transports.DailyRotateFile({
    filename: `${infoPath}/info_%DATE%.log`,
    datePattern: 'MM-DD-YYYY',
    level: 'info'
  });

}

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'MM-DD-YYYY HH:mm:ss.SSSS'
    }),
    format.printf(log => `${log.timestamp} ${log.level}: ${log.message}`)
  ),

  transports: [
    new transports.Console(),
    infoTransport,
    errorTransport
  ]
});

logger.transports[0].silent = !(logConfigProps.infoLevel);
// logger.exceptionHandlers[0].silent = !(logConfigProps.errorLevel);



const log = {
  debug: function (msg) {
    logger.debug(msg);
  },
  info: function (msg) {
    logger.info(msg);
  },
  error: function (msg, exception) {
    logger.error(`${msg}, Exception: - ${exception}`);
  },
  getLogMessage: function (message, fileName, methodName, lineNo) {
    let lineNoMesage = (lineNo) ? `at line no : ${lineNo}` : '';
    return `${message} file: ${fileName} -> ${methodName} ${lineNoMesage}`;
  }
};

Object.defineProperty(global, '__stack', {
  get: function () {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
      return stack;
    };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line', {
  get: function () {
    return __stack[1].getLineNumber();
  }
});

Object.defineProperty(global, '__function', {
  get: function () {
    return __stack[1].getFunctionName();
  }
});

module.exports.log = log;