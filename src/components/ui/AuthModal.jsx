import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onClose();
    navigate('/login');
  };

  const handleSignUp = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to DevQuest">
      <div className="space-y-4">
        <p className="text-gray-600 mb-6">
          Sign in to your account or create a new one to access all features.
        </p>

        <button
          onClick={handleSignIn}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Sign In
        </button>

        <button
          onClick={handleSignUp}
          className="w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
        >
          Create Account
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm py-3 border border-gray-300 rounded-lg">
          Google Sign-In (Coming Soon)
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
