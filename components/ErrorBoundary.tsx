

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
  // Fix: Explicitly declare state type to resolve property 'state' visibility issues in TypeScript
  public state: State = {
    hasError: false
  };

  // Fix: Explicitly declare props type to resolve property 'props' visibility issues in TypeScript
  public props!: Props;

  // Fix: Explicitly defining the constructor to resolve property 'props' visibility issues in TypeScript
  constructor(props: Props) {
    super(props);
    // Fix: Initialize state as expected in React class components
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console or error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    // Fix: Access state via this.state which is now recognized on the class
    const { hasError } = this.state;
    // Fix: Access props via this.props which is now recognized due to the explicit declaration in the class body
    const { fallback, children } = this.props;

    // Use the component's state to determine if an error was caught
    if (hasError) {
      // Use the fallback prop if provided, otherwise show a default error message
      return fallback || (
        <div className="text-center p-8 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
            <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
            <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
        </div>
      );
    }

    // Render the children props if no error has occurred
    return children;
  }
}

export default ErrorBoundary;
