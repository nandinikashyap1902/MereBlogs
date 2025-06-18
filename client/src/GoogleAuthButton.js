import { useState } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from './Firebase';
import { useNavigate } from 'react-router-dom';
import './GoogleAuthButton.css';

const GoogleAuthButton = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // Firebase Google sign-in
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get user info from result
      const { user } = result;
      const idToken = await user.getIdToken();
      
      // Send to backend to create/update user
      const response = await fetch('http://localhost:4000/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: { sub: user.uid }, // In a real implementation, send the actual token
          email: user.email,
          name: user.displayName,
          imageUrl: user.photoURL,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401 && data.error === "account_not_found") {
          setError("No account found with this email. Please sign up first.");
          // You could also redirect to the signup page with:
          // navigate('/register', { state: { email: user.email, redirectedFromGoogle: true } });
        } else {
          throw new Error('Failed to authenticate with server');
        }
        return;
      }

      // If provided, call the success callback (useful for parent component)
      if (onSuccess) {
        onSuccess(data);
      }
      
      // Redirect to home or dashboard
      navigate('/');
      
    } catch (err) {
      console.error("Google Sign In Error:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-auth-container">
      <button 
        onClick={handleGoogleSignIn} 
        className="google-btn"
        disabled={loading}
      >
        <div className="google-icon-wrapper">
          <img 
            className="google-icon" 
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google logo" 
          />
        </div>
        <p className="btn-text">
          {loading ? "Signing in..." : "Sign in with Google"}
        </p>
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default GoogleAuthButton;