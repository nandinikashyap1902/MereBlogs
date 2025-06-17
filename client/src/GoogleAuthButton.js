import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from './Firebase';

const GoogleAuthButton = () => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // After successful login, you'd typically:
      // 1. Get the user info from result.user
      // 2. Send this to your backend to create/update user record
      // 3. Store auth token in localStorage or context
      console.log("Google Sign In Success:", result.user);
    } catch (error) {
      console.error("Google Sign In Error:", error);
    }
  };

  return (
    <button onClick={handleGoogleSignIn} className="google-btn">
      <img src="/google-icon.png" alt="Google Icon" />
      Sign in with Google
    </button>
  );
};

export default GoogleAuthButton;