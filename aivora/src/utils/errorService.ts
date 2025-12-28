export interface ErrorLog {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  environment: string;
  url: string;
}

class ErrorService {
  private static errors: ErrorLog[] = [];
  private static readonly MAX_ERRORS = 50;

  static logError(
    message: string,
    stack?: string,
    componentStack?: string
  ): void {
    const errorLog: ErrorLog = {
      message,
      stack,
      componentStack,
      timestamp: new Date().toISOString(),
      environment: import.meta.env.VITE_APP_ENV || 'development',
      url: window.location.href,
    };

    this.errors.push(errorLog);

    if (this.errors.length > this.MAX_ERRORS) {
      this.errors.shift();
    }

    if (import.meta.env.DEV) {
      console.error('[ErrorService]', errorLog);
    }
  }

  static getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  static clear(): void {
    this.errors = [];
  }

  static exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }
}

export default ErrorService;
