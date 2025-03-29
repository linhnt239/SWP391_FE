import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const userCookie = request.cookies.get('user')?.value;
    const { pathname } = request.nextUrl;

    // Danh sách các public routes không cần đăng nhập
    const publicRoutes = ['/login', '/register', '/', '/about', '/services', '/news'];

    // Cho phép truy cập các public routes và tài nguyên tĩnh
    if (publicRoutes.includes(pathname) ||
        pathname.startsWith('/_next') ||
        pathname.includes('/images/') ||
        pathname.endsWith('.jpeg') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.ico')) {
        return NextResponse.next();
    }

    // Nếu không có token, chuyển về trang login
    if (!token || !userCookie) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Kiểm tra và parse thông tin user
    let userData;
    try {
        userData = JSON.parse(userCookie);
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Kiểm tra quyền truy cập dựa trên role
    switch (userData.role) {
        case 'Staff':
            if (!pathname.startsWith('/staff')) {
                return NextResponse.redirect(new URL('/staff', request.url));
            }
            break;

        case 'Admin':
            if (!pathname.startsWith('/admin')) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            break;

        case 'User':
            if (pathname.startsWith('/staff') || pathname.startsWith('/admin')) {
                return NextResponse.redirect(new URL('/', request.url));
            }
            break;

        default:
            return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Loại trừ các tài nguyên tĩnh và API routes
        '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
    ],
}; 