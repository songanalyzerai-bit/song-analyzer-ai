import React, { useState } from 'react';
import { getFirebaseAuth, isFirebaseEnabled } from '../firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const auth = getFirebaseAuth();
        if (!auth) {
            setError("Authentication service is not available.");
            return;
        }

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            onClose();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        const auth = getFirebaseAuth();
        if (!auth) {
            setError("Authentication service is not available.");
            return;
        }
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            onClose();
        } catch (err: any) {
            setError(err.message);
        }
    }

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-md p-8 m-4" onClick={e => e.stopPropagation()}>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-400 mb-6">{isLogin ? 'Sign in to access your history.' : 'Sign up to save your analyses.'}</p>
        </div>
        
        {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md text-sm mb-4 text-center">{error}</p>}
        
        {!isFirebaseEnabled ? (
            <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg text-center text-sm">
                <p className="font-bold">Feature Unavailable</p>
                <p>Login and history features are not configured for this instance of the application.</p>
            </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email-auth" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                        id="email-auth"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-200"
                    />
                </div>
                 <div className="mb-6">
                    <label htmlFor="password-auth" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <input
                        id="password-auth"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-200"
                    />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:from-fuchsia-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 transition-all duration-300">
                    {isLogin ? 'Sign In' : 'Sign Up'}
                </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transition-all duration-300">
                 <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.8 64.4C308.2 99.1 280.7 86 248 86c-84.3 0-152.3 67.4-152.3 150s68 150 152.3 150c95.7 0 133.7-75.2 138.1-112.2H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
                </svg>
                Sign in with Google
            </button>


            <div className="text-center mt-6">
                <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-cyan-400 hover:text-cyan-300">
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
