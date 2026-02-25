import React from 'react';
import '../styles/Spinner.css';

/**
 * Spinner — lightweight loading indicator.
 * Usage: <Spinner /> or <Spinner size="small" /> or <Spinner fullPage />
 */
export default function Spinner({ size = 'default', fullPage = false }) {
    const spinner = (
        <div className={`spinner spinner--${size}`} role="status" aria-label="Loading">
            <div className="spinner__ring"></div>
        </div>
    );

    if (fullPage) {
        return (
            <div className="spinner__overlay">
                {spinner}
                <p className="spinner__label">Loading...</p>
            </div>
        );
    }

    return spinner;
}
