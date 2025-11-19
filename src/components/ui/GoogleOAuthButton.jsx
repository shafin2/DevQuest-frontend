import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

const GoogleOAuthButton = ({ mode = 'signin', role = 'client', onSuccess, onError }) => {
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // credentialResponse.credential contains the ID token (JWT)
      const response = await googleLogin(credentialResponse.credential, role);
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    console.error('Google Login Error');
    if (onError) {
      onError(new Error('Google sign-in failed'));
    }
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-3"></div>
          <span className="text-gray-600">Signing in with Google...</span>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          text={mode === 'signin' ? 'signin_with' : 'signup_with'}
          shape="rectangular"
          size="large"
          width="100%"
          logo_alignment="left"
        />
      )}
    </div>
  );
};

export default GoogleOAuthButton;
