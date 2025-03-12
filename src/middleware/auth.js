import { NextResponse } from 'next/server';

export function middleware(request) {
    // Lấy token từ localStorage hoặc cookies
    const token = request.cookies.get('token');

    // Danh sách các route cần bảo vệ
    const protectedRoutes = ['/profile', '/notifications', '/payment'];

    // Kiểm tra nếu route hiện tại cần được bảo vệ
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    // Nếu không có token và đang truy cập route được bảo vệ
    if (!token && isProtectedRoute) {
        // Chuyển hướng về trang login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Cấu hình các route cần áp dụng middleware
export const config = {
    matcher: [
        '/profile/:path*',
        '/notifications/:path*',
        '/payment/:path*'
    ]
}; 