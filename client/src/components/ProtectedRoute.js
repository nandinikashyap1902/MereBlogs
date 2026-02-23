import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

/**
 * ProtectedRoute — wraps any route that requires the user to be logged in.
 * Redirects to /login if no authenticated user is found in UserContext.
 */
export default function ProtectedRoute({ children }) {
    const { userInfo } = useContext(UserContext);

    if (!userInfo?.username) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
