import React from 'react';
import '../styles/Skeleton.css';

/**
 * PostSkeleton — shimmer placeholder for a Post card while loading.
 * Matches the layout of the Post component (image left, text right).
 */
export function PostSkeleton() {
    return (
        <>
            <hr />
            <div className="post-div">
                <div className="post skeleton-post">
                    <div className="image">
                        <div className="skeleton skeleton--image" />
                    </div>
                    <div className="texts">
                        <div className="skeleton skeleton--title" />
                        <div className="skeleton skeleton--line" />
                        <div className="skeleton skeleton--line skeleton--line-short" />
                        <div className="skeleton-meta">
                            <div className="skeleton skeleton--badge" />
                            <div className="skeleton skeleton--badge" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/**
 * PostPageSkeleton — full-page shimmer for the single post detail view.
 */
export function PostPageSkeleton() {
    return (
        <div className="post-page" style={{ padding: '20px' }}>
            <div className="skeleton skeleton--heading" />
            <div className="skeleton skeleton--date" style={{ margin: '10px auto' }} />
            <div className="skeleton skeleton--author" style={{ margin: '10px auto 20px' }} />
            <div className="skeleton skeleton--cover" />
            <div style={{ marginTop: '24px' }}>
                <div className="skeleton skeleton--line" />
                <div className="skeleton skeleton--line" />
                <div className="skeleton skeleton--line skeleton--line-short" />
                <div className="skeleton skeleton--line" />
                <div className="skeleton skeleton--line skeleton--line-short" />
            </div>
        </div>
    );
}

/**
 * SkeletonList — renders n PostSkeleton placeholders.
 */
export function SkeletonList({ count = 4 }) {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <PostSkeleton key={i} />
            ))}
        </>
    );
}
