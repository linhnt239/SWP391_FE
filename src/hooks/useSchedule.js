import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useSchedule = () => {
    const [cartItems, setCartItems] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [step, setStep] = useState(1); // 1: Thông tin người tiêm, 2: Thanh toán
    const [selectedChild, setSelectedChild] = useState(null);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [formData, setFormData] = useState({
        childId: '',
        childName: '',
        dateOfBirth: '',
        gender: '',
        parentName: '',
        parentPhone: '',
        preferredDate: '',
        preferredTime: '',
        note: '',
        useExistingProfile: true,
    });

    // Lấy thông tin người dùng từ localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setUserId(user.userId || user.userID || user.id);
                setFormData(prev => ({
                    ...prev,
                    parentName: user.username || user.name || '',
                    parentPhone: user.phone || user.phoneNumber || '',
                }));
            } catch (error) {
                console.error('Error parsing user data:', error);
                toast.error('Lỗi đọc thông tin người dùng');
            }
        }

        if (savedToken) {
            setToken(savedToken);
        }

        // Lấy giỏ hàng từ localStorage
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartItems(cart);

            // Tính tổng tiền
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotalPrice(total);
        } catch (error) {
            console.error('Error loading cart:', error);
            toast.error('Lỗi khi tải thông tin giỏ hàng');
        }

        // Kiểm tra URL parameters khi component được mount
        const urlParams = new URLSearchParams(window.location.search);
        const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');

        if (vnp_ResponseCode === "00") {
            setPaymentSuccess(true);
            setStep(2); // Chuyển đến bước 2
            localStorage.removeItem('cart');
            toast.success('Thanh toán thành công!');
        } else if (vnp_ResponseCode) {
            toast.error('Thanh toán không thành công. Vui lòng thử lại.');
        }
    }, []);

    // Lấy danh sách trẻ từ API
    useEffect(() => {
        if (userId && token) {
            fetchChildren();
        } else {
            setLoading(false);
        }
    }, [userId, token]);

    const fetchChildren = async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/child-get/${userId}/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error Response:", errorText);
                throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();

            // Kiểm tra cấu trúc dữ liệu trả về và cập nhật state
            let processedChildren = [];

            if (Array.isArray(data)) {
                processedChildren = data;
            } else if (data && typeof data === 'object') {
                if (data.children && Array.isArray(data.children)) {
                    processedChildren = data.children;
                } else if (data.data && Array.isArray(data.data)) {
                    processedChildren = data.data;
                } else if (data.results && Array.isArray(data.results)) {
                    processedChildren = data.results;
                } else if (data.items && Array.isArray(data.items)) {
                    processedChildren = data.items;
                } else {
                    if (data.childrenId || data.childrenName) {
                        processedChildren = [data];
                    }
                }
            }

            setChildren(processedChildren);
            if (processedChildren.length > 0) {
                toast.info(`Đã tải ${processedChildren.length} hồ sơ trẻ em`);
            }
        } catch (error) {
            console.error('Error fetching children:', error);
            toast.error('Không thể tải danh sách trẻ em');
            setChildren([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        // Nếu chọn một đứa trẻ từ danh sách, cập nhật thông tin
        if (name === 'childId') {
            if (value === 'new') {
                setFormData(prev => ({
                    ...prev,
                    childId: 'new',
                    childName: '',
                    dateOfBirth: '',
                    gender: '',
                    useExistingProfile: false
                }));
                setSelectedChild(null);
            } else if (value) {
                // Sửa lại phần tìm kiếm trẻ
                const selectedChildId = value.split(' - ')[0]; // Lấy phần ID từ giá trị select
                const child = children.find(c =>
                    c.childrenId === selectedChildId ||
                    c.id === selectedChildId
                );

                if (child) {
                    setSelectedChild(child);
                    setFormData(prev => ({
                        ...prev,
                        childId: selectedChildId,
                        useExistingProfile: true,
                        childName: child.childrenName || child.name,
                        dateOfBirth: child.dateOfBirth || child.dob,
                        gender: child.gender
                    }));
                    toast.success(`Đã chọn hồ sơ: ${child.childrenName || child.name}`);
                }
            }
        }

        // Nếu chuyển đổi giữa sử dụng hồ sơ có sẵn và tạo mới
        if (name === 'useExistingProfile') {
            if (checked) {
                // Reset form về trạng thái ban đầu khi chọn sử dụng hồ sơ có sẵn
                setFormData(prev => ({
                    ...prev,
                    childId: '',
                    childName: '',
                    dateOfBirth: '',
                    gender: '',
                    useExistingProfile: true,
                }));
                setSelectedChild(null);
            } else {
                // Reset childId khi chọn tạo hồ sơ mới
                setFormData(prev => ({
                    ...prev,
                    childId: '',
                    useExistingProfile: false,
                }));
                setSelectedChild(null);
                toast.info('Bạn đang tạo hồ sơ mới cho trẻ');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra nếu đã chọn trẻ hoặc điền đầy đủ thông tin
        if (formData.childId === '') {
            toast.error('Vui lòng chọn trẻ từ hồ sơ hoặc thêm hồ sơ trẻ mới!');
            return;
        }

        if (formData.childId === 'new' && (!formData.childName || !formData.dateOfBirth || !formData.gender)) {
            toast.error('Vui lòng điền đầy đủ thông tin trẻ!');
            return;
        }

        if (!formData.preferredDate || !formData.preferredTime) {
            toast.error('Vui lòng chọn ngày và giờ tiêm!');
            return;
        }

        if (!acceptTerms) {
            toast.error('Vui lòng đồng ý với điều khoản và điều kiện!');
            return;
        }

        // Chuyển sang bước thanh toán
        setStep(2);
        toast.success('Thông tin đã được xác nhận. Vui lòng tiến hành thanh toán.');
    };

    const handleCheckout = async () => {
        const toastId = toast.loading('Đang xử lý thanh toán...');

        try {
            const checkoutData = {
                childrenName: selectedChild ? selectedChild.childrenName : formData.childName,
                childrenGender: selectedChild ? selectedChild.gender : formData.gender,
                dateOfBirth: selectedChild ? selectedChild.dateOfBirth : formData.dateOfBirth,
                medicalIssue: "None",
                appointmentDate: formData.preferredDate,
                timeStart: formData.preferredTime,
                note: formData.note || ""
            };

            // Lưu thông tin lịch hẹn vào localStorage
            localStorage.setItem('lastAppointment', JSON.stringify({
                childName: checkoutData.childrenName,
                appointmentDate: formData.preferredDate,
                appointmentTime: formData.preferredTime
            }));

            const response = await fetch(`/api/cart/checkout?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(checkoutData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const result = await response.text();

            if (result && result.startsWith('http')) {
                toast.update(toastId, {
                    render: 'Chuyển hướng đến trang thanh toán...',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000
                });

                // Đặt timeout để người dùng thấy thông báo trước khi chuyển hướng
                setTimeout(() => {
                    window.location.href = result;
                }, 1000);
            } else {
                throw new Error('Invalid payment URL received');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            toast.update(toastId, {
                render: `Đã xảy ra lỗi khi thanh toán: ${error.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 5000
            });
        }
    };

    // Định dạng giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Tính tuổi từ ngày sinh
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return '';
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 1) {
            // Tính số tháng
            let months = today.getMonth() - birthDate.getMonth();
            if (months < 0) {
                months += 12;
            }
            if (today.getDate() < birthDate.getDate()) {
                months--;
            }
            return `${months} tháng`;
        }

        return `${age} tuổi`;
    };

    return {
        cartItems,
        children,
        loading,
        userId,
        token,
        totalPrice,
        step,
        selectedChild,
        acceptTerms,
        paymentSuccess,
        formData,
        formatPrice,
        formatDate,
        calculateAge,
        setStep,
        setAcceptTerms,
        setSelectedChild,
        handleChange,
        handleCheckout,
        handleSubmit,
        fetchChildren
    };
}; 