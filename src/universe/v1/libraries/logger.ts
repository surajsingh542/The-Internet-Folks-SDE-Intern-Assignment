import winston from "winston";

class Logger {
  static instance: winston.Logger | Console;

  static Loader = () => {
    const loggerFormat = winston.format.combine(
      winston.format.splat(),
      winston.format.simple(),
      winston.format.errors({ stack: true })
    );

    let transports: winston.transport[] = [new winston.transports.Console()];

    Logger.instance = winston.createLogger({
      level: "debug",
      format: loggerFormat,
      transports,
    });
  };
}

export default Logger;
