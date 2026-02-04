"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
// import PageLayout from '../components/layout/PageLayout'; // Removing wrapping layout to control full screen
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Zap, Github, ArrowRight, CheckCircle2 } from 'lucide-react';
import GoogleIcon from '../components/icons/GoogleIcon';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGithub, resetPassword, error } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 font-sans selection:bg-indigo-500/30">

      {/* LEFT SIDE - VISUAL & BRANDING */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 justify-center items-center">
        {/* Abstract Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-12 max-w-lg text-white">
          <div className="mb-8 p-3 bg-white/10 backdrop-blur-md w-fit rounded-2xl border border-white/10 shadow-xl">
            <img src="/image/tools/Logo.png" alt="Logo" className="h-16 w-auto drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            أطلق العنان <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">لإبداعك</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            انضم إلى الآلاف من المبدعين وصناع المحتوى الذين يستخدمون منصتنا للوصول إلى أكثر من 100 أداة ذكاء اصطناعي متطورة.
          </p>

          {/* Feature List */}
          <div className="space-y-4">
            {[
              'وصول غير محدود للأدوات',
              'دعم فني على مدار الساعة',
              'تحديثات أسبوعية مستمرة'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-slate-200 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Mobile Background Gradient */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 -z-10"></div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center lg:text-right mb-10">
            <div className="lg:hidden flex justify-center mb-6">
              <img src="/image/tools/Logo.png" alt="Logo" className="h-12 w-auto" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              {showForgotPassword ? 'نسيت كلمة المرور؟' : isLogin ? 'مرحباً بعودتك' : 'ابدأ رحلتك معنا'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm lg:text-base">
              {showForgotPassword
                ? 'أدخل بريدك الإلكتروني لاستعادة حسابك'
                : isLogin
                  ? 'أدخل بياناتك للمتابعة إلى لوحة التحكم'
                  : 'أنشئ حسابك الجديد في ثوانٍ معدودة'
              }
            </p>
          </div>

          {/* Error handling */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3 animate-shake">
              <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full text-red-600 dark:text-red-400">
                <Shield className="w-4 h-4" />
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          {/* Social Login */}
          {!showForgotPassword && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-200 font-medium transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              >
                <GoogleIcon className="w-5 h-5" />
                <span className="text-sm">Google</span>
              </button>
              <button
                onClick={handleGithubSignIn}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-200 font-medium transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm">GitHub</span>
              </button>
            </div>
          )}

          {!showForgotPassword && (
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-950 text-slate-500">أو عبر البريد الإلكتروني</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && !showForgotPassword && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block text-right">الاسم الأول</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="أحمد"
                    required
                    dir="rtl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block text-right">الاسم الأخير</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="محمد"
                    required
                    dir="rtl"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block text-right">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="name@example.com"
                  required
                  dir="ltr"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            {!showForgotPassword && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block text-right">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                    dir="ltr"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Lock className="w-5 h-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {isLogin && !showForgotPassword && (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  هل نسيت كلمة المرور؟
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {showForgotPassword ? 'إرسال رابط الاستعادة' : isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                  </span>
                  {!showForgotPassword && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />}
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {isLogin ? 'جديد معنا؟' : 'لديك حساب بالفعل؟'}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setShowForgotPassword(false);
                }}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isLogin ? 'انضم إلينا الآن' : 'سجّل دخولك'}
              </button>
            </p>
          </div>

          {showForgotPassword && (
            <button
              onClick={() => setShowForgotPassword(false)}
              className="w-full mt-4 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              الرجوع للخلف
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default AuthPage;
