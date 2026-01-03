import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in its child component tree,
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console or error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    // Use the component's state to determine if an error was caught
    if (this.state.hasError) {
      // Use the fallback prop if provided, otherwise show a default error message
      return this.props.fallback || (
        <div className="text-center p-8 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
            <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
            <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
        </div>
      );
    }

    // Render the children props if no error has occurred
    return this.props.children;
  }
}

export default ErrorBoundary;