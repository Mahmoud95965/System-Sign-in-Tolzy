import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. مسار لوحة التحكم
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // التحقق من وجود كوكي الجلسة الخاصة بالمسؤول
        // ملاحظة: بما أننا نستخدم Firebase Client SDK، التوكن الفعلي موجود في LocalStorage وليس الكوكي تلقائياً.
        // لكننا في AuthContext سنقوم بتعيين كوكي خاص عند تسجيل دخول المسؤول لغرض هذا الـ Middleware.
        const adminSession = request.cookies.get('tolzy_admin_session');

        if (!adminSession || adminSession.value !== 'mahmoud_secure_session') {
            // إذا لم يوجد الكوكي أو قيمته غير صحيحة، توجيه لصفحة 404
            // أو الصفحة الرئيسية لتمويه وجود لوحة التحكم
            return NextResponse.redirect(new URL('/404', request.url));
        }
    }

    // 2. توجيه الدومين الفرعي (Subdomain Routing)
    // الهدف: توجيه كل ما يتعلق بالتطبيق (تسجيل دخول، لوحة تحكم المستخدم، الأدوات) إلى app.tolzy.me
    const hostname = request.headers.get('host') || '';
    const APP_DOMAIN = 'app.tolzy.me';
    const MAIN_DOMAIN = 'tolzy.me';

    // مسارات التطبيق التي يجب أن تكون حصرياً على app.tolzy.me
    const appRoutes = ['/auth', '/dashboard', '/tools', '/settings', '/profile', '/chat'];
    const isAppRoute = appRoutes.some(route => request.nextUrl.pathname.startsWith(route));
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

    // الحالة 1: المستخدم يزور المسارات الخاصة بالتطبيق ولكنه ليس على الدومين الفرعي (مثلاً tolzy.me/dashboard)
    if (isAppRoute && hostname !== APP_DOMAIN && !hostname.includes('localhost')) {
        // استثناء localhost للتطوير المحلي
        const newUrl = new URL(request.nextUrl.pathname, `https://${APP_DOMAIN}`);
        // نقل أي query parameters موجودة
        newUrl.search = request.nextUrl.search;
        return NextResponse.redirect(newUrl);
    }

    // الحالة 2: إذا كنا على app.tolzy.me وحاول المستخدم زيارة الصفحة الرئيسية /
    if (hostname === APP_DOMAIN && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
