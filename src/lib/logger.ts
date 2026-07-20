type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const formattedMeta = meta ? ` | ${JSON.stringify(meta)}` : '';

    // In a real production app, we would pipe this to Datadog/Sentry etc.
    // For now we format it nicely for standard out streams.
    const logOutput = `[${timestamp}] [${level.toUpperCase()}] ${message}${formattedMeta}`;

    switch (level) {
      case 'info':
        console.info(logOutput);
        break;
      case 'warn':
        console.warn(logOutput);
        break;
      case 'error':
        console.error(logOutput);
        break;
      case 'debug':
        if (process.env.NODE_ENV !== 'production') {
          console.debug(logOutput);
        }
        break;
    }
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }
  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }
  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }
  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger();
