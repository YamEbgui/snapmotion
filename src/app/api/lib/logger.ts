type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

class SimpleLogger {
    private log(level: LogLevel, message: string, data?: any): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}`;

        if (data) {
            console.log(logMessage, data);
        } else {
            console.log(logMessage);
        }
    }

    info(message: string, data?: any): void {
        this.log('INFO', message, data);
    }

    warn(message: string, data?: any): void {
        this.log('WARN', message, data);
    }

    error(message: string, error?: Error | any): void {
        this.log('ERROR', message, error);
    }

    debug(message: string, data?: any): void {
        if (process.env.NODE_ENV === 'development') {
            this.log('DEBUG', message, data);
        }
    }
}

export const logger = new SimpleLogger();
