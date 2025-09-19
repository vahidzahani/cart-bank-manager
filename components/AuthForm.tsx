import React, { useState } from 'react';

interface AuthFormProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister, error, loading }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !username || !password) return;

    if (isLogin) {
      onLogin(username, password);
    } else {
      const success = await onRegister(username, password);
      if (success) {
        setIsLogin(true); // Switch to login form after successful registration
        setUsername('');
        setPassword('');
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-2">
        {isLogin ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری'}
      </h2>
      <p className="text-center text-gray-500 mb-6">
        برای مدیریت و همگام‌سازی کارت‌های خود وارد شوید.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            نام کاربری
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-gray-700">
            رمز عبور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? (isLogin ? 'در حال ورود...' : 'در حال ثبت‌نام...') : (isLogin ? 'ورود' : 'ثبت نام')}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600 hover:text-blue-500">
          {isLogin ? 'حساب کاربری ندارید؟ ثبت نام کنید' : 'قبلاً ثبت‌نام کرده‌اید؟ وارد شوید'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
