import React from 'react';
import '../styles/Pagination.css';

/**
 * Pagination — renders page controls with previous/next + numbered buttons.
 *
 * Props:
 *  - page: current page number
 *  - totalPages: total number of pages
 *  - onPageChange: callback (newPage) => void
 */
export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    // Build page numbers: show max 5 around current page
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination" role="navigation" aria-label="Page navigation">
            <button
                className="pagination__btn"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
            >
                ← Prev
            </button>

            {start > 1 && (
                <>
                    <button className="pagination__num" onClick={() => onPageChange(1)}>1</button>
                    {start > 2 && <span className="pagination__dots">…</span>}
                </>
            )}

            {pages.map(p => (
                <button
                    key={p}
                    className={`pagination__num ${p === page ? 'pagination__num--active' : ''}`}
                    onClick={() => onPageChange(p)}
                >
                    {p}
                </button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="pagination__dots">…</span>}
                    <button className="pagination__num" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
                </>
            )}

            <button
                className="pagination__btn"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
            >
                Next →
            </button>
        </div>
    );
}
