import React, { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import ErrorService from "../../utils/errorService";

interface ErrorBoundaryProps {
    children: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    errorMessage: string;
    errorDetails: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            errorMessage: "",
            errorDetails: "",
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            errorMessage: error.message || "An unexpected error occurred",
            errorDetails: error.toString(),
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("[ErrorBoundary] Caught error:", error);
        console.error("[ErrorBoundary] Error info:", errorInfo);

        ErrorService.logError(
            error.message,
            error.stack,
            errorInfo.componentStack
        );

        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            errorMessage: "",
            errorDetails: "",
        });
    };

    handleRefresh = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="error-boundary"
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "40px 20px",
                        textAlign: "center",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                    }}
                >
                    <div style={{ maxWidth: "600px" }}>
                        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
                            😢 Something Went Wrong
                        </h1>

                        <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
                            We encountered an unexpected error. Our team has been notified.
                        </p>

                        {import.meta.env.DEV && (
                            <details
                                style={{
                                    marginBottom: "30px",
                                    textAlign: "left",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    padding: "15px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                }}
                            >
                                <summary style={{ cursor: "pointer", marginBottom: "10px" }}>
                                    Error Details (Development Only)
                                </summary>
                                <pre
                                    style={{
                                        overflow: "auto",
                                        maxHeight: "200px",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    <strong>Message:</strong> {this.state.errorMessage}
                                    {"\n\n"}
                                    <strong>Details:</strong> {this.state.errorDetails}
                                </pre>
                            </details>
                        )}

                        <div
                            style={{
                                display: "flex",
                                gap: "15px",
                                justifyContent: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                onClick={this.handleRefresh}
                                style={{
                                    padding: "12px 30px",
                                    fontSize: "1rem",
                                    background: "white",
                                    color: "#667eea",
                                    border: "none",
                                    borderRadius: "25px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                🔄 Refresh Page
                            </button>

                            <Link
                                to="/"
                                style={{
                                    padding: "12px 30px",
                                    fontSize: "1rem",
                                    background: "rgba(255, 255, 255, 0.2)",
                                    color: "white",
                                    border: "2px solid white",
                                    borderRadius: "25px",
                                    textDecoration: "none",
                                    display: "inline-block",
                                    fontWeight: "bold",
                                }}
                            >
                                🏠 Go to Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
