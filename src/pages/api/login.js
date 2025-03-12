import { sign } from 'jsonwebtoken';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    // Đây là demo, trong thực tế bạn sẽ kiểm tra credentials với database
    if (email === 'demo@example.com' && password === 'password123') {
        // Tạo JWT token
        const token = sign(
            { email: email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        // Set cookie
        res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly`);

        return res.status(200).json({
            success: true,
            token: token
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
    });
} 