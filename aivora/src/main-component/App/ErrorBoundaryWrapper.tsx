import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";

interface ErrorBoundaryWrapperProps {
    children: React.ReactNode;
}

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({
    children,
}) => {
    const location = useLocation();
    const [key, setKey] = useState(0);

    useEffect(() => {
        setKey((prev) => prev + 1);
        console.debug("[ErrorBoundaryWrapper] Route changed, resetting error boundary");
    }, [location.pathname]);

    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
        console.error("[ErrorBoundaryWrapper] Error caught:", error);
        console.error("[ErrorBoundaryWrapper] Component Stack:", errorInfo.componentStack);
    };

    return (
        <ErrorBoundary key={key} onError={handleError}>
            {children}
        </ErrorBoundary>
    );
};

export default ErrorBoundaryWrapper;
