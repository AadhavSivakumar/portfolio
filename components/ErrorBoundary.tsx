import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        // In a class component, `state` is accessed via `this.state`.
        if (this.state.hasError) {
            // You can render any custom fallback UI
            // Fix: In a class component, `props` must be accessed via `this.props`.
            return this.props.fallback || (
                <div className="text-center p-8 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
                    <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
                    <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
                </div>
            );
        }

        // Fix: In a class component, `props` must be accessed via `this.props`.
        return this.props.children;
    }
}

export default ErrorBoundary;