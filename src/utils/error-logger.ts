export interface ErrorContext {
  component: string;
  action: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

function formatError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}

export function logError(error: unknown, context: ErrorContext): void {
  const { message, stack } = formatError(error);
  const timestamp = new Date().toISOString();

  console.error(
    `[${timestamp}] [${context.component}] ${context.action}: ${message}`,
    { ...context.metadata, stack }
  );

  // Sentry hook — will activate once Sentry SDK is installed
  if (
    typeof window !== 'undefined' &&
    (window as unknown as Record<string, unknown>).__SENTRY__
  ) {
    try {
      const Sentry = (window as unknown as Record<string, unknown>).__SENTRY__ as {
        captureException?: (err: unknown, ctx?: Record<string, unknown>) => void;
      };
      Sentry.captureException?.(error instanceof Error ? error : new Error(message), {
        tags: { component: context.component, action: context.action },
        extra: context.metadata,
      });
    } catch {
      // Sentry call failed — already logged above
    }
  }
}

export function logWarning(message: string, context: ErrorContext): void {
  const timestamp = new Date().toISOString();

  console.warn(
    `[${timestamp}] [${context.component}] ${context.action}: ${message}`,
    context.metadata
  );
}
