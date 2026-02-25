/**
 * ErrorFallback — functional fallback UI rendered by react-error-boundary
 * when any child component throws a JavaScript error.
 *
 * Props injected automatically by <ErrorBoundary FallbackComponent={ErrorFallback}>:
 *  - error              : the Error object that was thrown
 *  - resetErrorBoundary : call this to reset the boundary and retry rendering
 */
function ErrorFallback({ error, resetErrorBoundary }) {
    const handleGoHome = () => {
        resetErrorBoundary();          // clear the error boundary state
        window.location.href = '/';    // then navigate home
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            fontFamily: 'sans-serif',
            color: '#333',
            padding: '20px',
            textAlign: 'center',
        }}>
            <h1 style={{ fontSize: '2rem', color: '#0505A9' }}>Something went wrong</h1>
            <p style={{ color: '#666', maxWidth: '400px' }}>
                An unexpected error occurred. You can try reloading the page.
            </p>
            <code style={{
                background: '#f3f3f3',
                padding: '10px 16px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#c0392b',
                maxWidth: '500px',
                wordBreak: 'break-word',
            }}>
                {error?.message}
            </code>
            <button
                onClick={handleGoHome}
                style={{
                    marginTop: '12px',
                    padding: '10px 24px',
                    background: '#0505A9',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                }}
            >
                Go to Home
            </button>
        </div>
    );
}

export default ErrorFallback;
