type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  category: "ai" | "safety" | "auth" | "db" | "perf" | "system";
  metadata?: Record<string, any>;
  timestamp: string;
}

class Logger {
  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, category: LogEntry["category"], message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      category,
      message,
      metadata,
      timestamp: new Date().toISOString(),
    };

    const formatted = this.formatLog(entry);

    switch (level) {
      case "info":
        console.log(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "error":
        console.error(formatted);
        break;
      case "debug":
        if (process.env.NODE_ENV !== "production") {
          console.debug(formatted);
        }
        break;
    }

    // In a real production environment, we would also send this to a service like Axiom, Datadog or Sentry
  }

  info(category: LogEntry["category"], message: string, metadata?: Record<string, any>) {
    this.log("info", category, message, metadata);
  }

  warn(category: LogEntry["category"], message: string, metadata?: Record<string, any>) {
    this.log("warn", category, message, metadata);
  }

  error(category: LogEntry["category"], message: string, metadata?: Record<string, any>) {
    this.log("error", category, message, metadata);
  }

  debug(category: LogEntry["category"], message: string, metadata?: Record<string, any>) {
    this.log("debug", category, message, metadata);
  }
}

export const logger = new Logger();
