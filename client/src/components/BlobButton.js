import React from 'react';
import '../styles/Button.scss';

/**
 * BlobButton — Reusable animated blob button.
 *
 * Props:
 *  - children: button label text
 *  - onClick: optional click handler
 *  - disabled: optional disabled state
 *  - style: optional inline styles
 *  - type: optional button type ('button' | 'submit'), defaults to 'button'
 *  - className: optional extra CSS classes
 *
 * The SVG goo filter + 4 blob spans give the liquid-morph hover effect.
 * Extracted from Header/Login/Register/CreatePost/EditPost/BlogGenerator
 * to eliminate ~150 lines of duplicated markup across the app.
 */
export default function BlobButton({
    children,
    onClick,
    disabled = false,
    style = {},
    type = 'button',
    className = '',
}) {
    return (
        <div className={`buttons ${className}`}>
            <button
                className="blob-btn"
                onClick={onClick}
                disabled={disabled}
                style={style}
                type={type}
            >
                {children}
                <span className="blob-btn__inner">
                    <span className="blob-btn__blobs">
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                    </span>
                </span>
            </button>
            <br />
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7"
                            result="goo"
                        />
                        <feBlend in2="goo" in="SourceGraphic" result="mix" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
}
