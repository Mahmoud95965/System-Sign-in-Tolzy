"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/layout/PageLayout';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Zap, Github } from 'lucide-react';
import GoogleIcon from '../components/icons/GoogleIcon';
// import { auth, microsoftProvider } from '../config/firebase';
// import { signInWithPopup } from 'firebase/auth';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGithub, resetPassword, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (showForgotPassword) {
        await resetPassword(email);
        alert('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
        setShowForgotPassword(false);
      } else if (isLogin) {
        await signInWithEmail(email, password);
        if (window.location.hostname === 'tolzy.me') {
          window.location.href = 'https://app.tolzy.me/dashboard';
        } else {
          router.push('/dashboard');
        }
      } else {
        await signUpWithEmail(email, password, firstName, lastName);
        if (window.location.hostname === 'tolzy.me') {
          window.location.href = 'https://app.tolzy.me/dashboard';
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      if (window.location.hostname === 'tolzy.me') {
        window.location.href = 'https://app.tolzy.me/dashboard';
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGithub();
      if (window.location.hostname === 'tolzy.me') {
        window.location.href = 'https://app.tolzy.me/dashboard';
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Github sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-200 dark:bg-slate-800/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-md mx-auto">
          {/* Logo/Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
              <img
                src="/image/tools/Logo.png"
                alt="Logo"
                className="h-24 w-auto object-contain drop-shadow-2xl"
              />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
              {showForgotPassword
                ? 'استعادة الحساب'
                : isLogin
                  ? 'مرحباً بعودتك'
                  : 'انضم إلينا'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {showForgotPassword
                ? 'سنرسل لك رابط إعادة تعيين كلمة المرور'
                : isLogin
                  ? 'سجّل دخولك للوصول إلى أدواتك المفضلة'
                  : 'أنشئ حساباً واستكشف أكثر من 100+ أداة'}
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 transform hover:scale-[1.02] transition-all duration-300">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-r-4 border-red-500 rounded-lg p-4 animate-shake">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 text-right">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 pr-12 border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-slate-700/50 dark:text-white transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500"
                    placeholder="your@example.com"
                    dir="ltr"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-200" />
                  </div>
                </div>
              </div>

              {/* First Name Input - Only for Registration */}
              {!isLogin && !showForgotPassword && (
                <div className="group">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 text-right">
                    الاسم الأول
                  </label>
                  <div className="relative">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 pr-12 border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-slate-700/50 dark:text-white transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500"
                      placeholder="أحمد"
                      dir="rtl"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <UserPlus className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              )}

              {/* Last Name Input - Only for Registration */}
              {!isLogin && !showForgotPassword && (
                <div className="group">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 text-right">
                    الاسم الأخير
                  </label>
                  <div className="relative">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 pr-12 border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-slate-700/50 dark:text-white transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500"
                      placeholder="محمد"
                      dir="rtl"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <UserPlus className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              )}

              {/* Password Input */}
              {!showForgotPassword && (
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 text-right">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 pr-12 pl-12 border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-slate-700/50 dark:text-white transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500"
                      placeholder="••••••••"
                      dir="ltr"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-200" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Link */}
              {isLogin && !showForgotPassword && (
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 transition-colors duration-200 hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-800 hover:to-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-5 w-5 text-white ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>جاري التحميل...</span>
                    </div>
                  ) : showForgotPassword ? (
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 ml-2" />
                      <span>إرسال رابط الاستعادة</span>
                    </div>
                  ) : isLogin ? (
                    <div className="flex items-center">
                      <LogIn className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      <span>تسجيل الدخول</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <UserPlus className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform duration-200" />
                      <span>إنشاء الحساب</span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Social Login & Toggle */}
            {!showForgotPassword && (
              <>
                {/* Divider */}
                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 font-medium">
                        أو تابع باستخدام
                      </span>
                    </div>
                  </div>
                </div>

                {/* Google Sign In */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500"
                  >
                    <GoogleIcon className="h-5 w-5 ml-2" />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGithubSignIn}
                    disabled={isLoading}
                    className="w-full mt-3 flex justify-center items-center py-3 px-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500"
                  >
                    <Github className="h-5 w-5 ml-2" />
                    <span>GitHub</span>
                  </button>
                </div>

                {/* Toggle Login/Register */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setShowForgotPassword(false);
                      }}
                      className="mr-1 font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 hover:underline"
                    >
                      {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                    </button>
                  </p>
                </div>

                {/* Features */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="group cursor-pointer">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-700/50 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
                        <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">آمن 100%</p>
                    </div>
                    <div className="group cursor-pointer">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
                        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">سريع</p>
                    </div>
                    <div className="group cursor-pointer">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
                        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">100+ أداة</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Back to Login (Forgot Password) */}
            {showForgotPassword && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 transition-colors duration-200 hover:underline inline-flex items-center"
                >
                  <LogIn className="h-4 w-4 ml-1" />
                  العودة إلى تسجيل الدخول
                </button>
              </div>
            )}
          </div>

          {/* Footer Text */}
          <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
            بالتسجيل، أنت توافق على{' '}
            <a href="/terms" className="font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline">
              الشروط والأحكام
            </a>
            {' '}و{' '}
            <a href="/privacy-policy" className="font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline">
              سياسة الخصوصية
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </PageLayout>
  );
};

export default AuthPage;
