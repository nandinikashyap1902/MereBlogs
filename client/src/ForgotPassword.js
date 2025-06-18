import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./Firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Try Firebase's built-in reset first
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (firebaseError) {
      console.log("Firebase reset failed, trying custom backend:", firebaseError);
      
      // If Firebase fails (e.g. no Firebase user), try our custom backend
      try {
        const response = await fetch('http://localhost:4000/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
          credentials: 'include',
        });

        const data = await response.json();
        
        if (response.ok) {
          setMessage(data.message || "Password reset email sent! Check your inbox.");
        } else {
          setError(data.message || "Failed to send reset email. Please try again.");
        }
      } catch (backendError) {
        setError("Error connecting to the server. Please try again later.");
        console.error("Backend error:", backendError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Your Password</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your email address"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="submit-button"
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
      </form>
      
      <p className="login-link">
        Remember your password? <a href="/login">Back to Login</a>
      </p>
    </div>
  );
};

export default ForgotPassword;