import { useState } from 'react';
import { message } from 'antd';

const API_URL = 'http://localhost:3000/api';

// Utility function để gọi API
const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const config = {
        headers: defaultHeaders,
        ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API call failed');
    }

    return data;
};

export const useUserLogic = () => {
    const [loading, setLoading] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);
    const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
    const [isForgotVerificationModalVisible, setIsForgotVerificationModalVisible] = useState(false);

    // Đăng ký người dùng mới
    const handleRegister = async (values) => {
        try {
            setLoading(true);
            const { username, email, password } = values;

            const response = await apiCall(`${API_URL}/auth/register`, {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    fullName: username
                })
            });

            // Lưu thông tin pending user để xác thực OTP
            setPendingUser({ ...values, id: response.userId });
            setIsVerificationModalVisible(true);
            message.success(window.message || 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.');
        } catch (error) {
            message.error(`Lỗi đăng ký: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Xác thực OTP
    const handleVerification = async (values) => {
        try {
            setLoading(true);
            const { code } = values;
            
            if (!pendingUser) {
                throw new Error('Không tìm thấy thông tin đăng ký');
            }

            await apiCall(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                body: JSON.stringify({
                    userId: pendingUser.id,
                    otp: code
                })
            });

            setPendingUser(null);
            setIsVerificationModalVisible(false);
            setIsSuccessModalVisible(true);
            message.success('Xác thực thành công!');
        } catch (error) {
            message.error(`Lỗi xác thực: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Gửi lại OTP
    const handleResendOTP = async () => {
        try {
            setLoading(true);
            
            if (!pendingUser) {
                throw new Error('Không tìm thấy thông tin đăng ký');
            }

            await apiCall(`${API_URL}/auth/resend-otp`, {
                method: 'POST',
                body: JSON.stringify({
                    userId: pendingUser.id
                })
            });

            message.success('Đã gửi lại mã OTP');
        } catch (error) {
            message.error(`Lỗi gửi lại OTP: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (values) => {
        try {
            setLoading(true);
            const { email, password, remember } = values;

            const response = await apiCall(`${API_URL}/auth/login`, {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const { token, user } = response;

            // Lưu thông tin vào localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);

            // Xử lý remember me
            if (remember) {
                localStorage.setItem('savedEmail', email);
                localStorage.setItem('savedPassword', password);
                localStorage.setItem('remember', 'true');
            } else {
                localStorage.removeItem('savedEmail');
                localStorage.removeItem('savedPassword');
                localStorage.setItem('remember', 'false');
            }

            message.success(response.message || 'Đăng nhập thành công!');
            
            // Chuyển hướng dựa trên role
            if (user.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/user/home';
            }
        } catch (error) {
            message.error(`Lỗi đăng nhập: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Đăng xuất
    const handleLogout = async () => {
        try {
            setLoading(true);
            
            // Gọi API logout nếu cần thiết
            try {
                await apiCall(`${API_URL}/auth/logout`, {
                    method: 'POST'
                });
            } catch (error) {
                console.error('Logout API error:', error);
                // Tiếp tục đăng xuất local dù API lỗi
            }
            
            // Xóa thông tin khỏi localStorage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            
            message.success('Đã đăng xuất thành công');
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Vẫn đăng xuất local dù có lỗi
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
        } finally {
            setLoading(false);
        }
    };

    // Đổi mật khẩu
    const handleChangePassword = async (values) => {
        try {
            setLoading(true);
            const { oldPassword, newPassword } = values;
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

            const response = await apiCall(`${API_URL}/auth/change-password`, {
                method: 'POST',
                body: JSON.stringify({
                    userId: currentUser.id,
                    oldPassword,
                    newPassword
                })
            });

            message.success(response.message || 'Đổi mật khẩu thành công!');
            setIsChangePasswordModalVisible(false);
        } catch (error) {
            message.error(`Lỗi đổi mật khẩu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Lấy thông tin người dùng hiện tại
    const getCurrentUser = () => {
        try {
            const userStr = localStorage.getItem('currentUser');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing current user:', error);
            return null;
        }
    };

    // Kiểm tra trạng thái đăng nhập
    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    };

    // Kiểm tra role của user
    const hasRole = (role) => {
        const currentUser = getCurrentUser();
        return currentUser?.role === role;
    };

    // Lấy thông tin đã lưu (remember me)
    const getSavedCredentials = () => {
        const remember = localStorage.getItem('remember') === 'true';
        if (remember) {
            return {
                email: localStorage.getItem('savedEmail') || '',
                password: localStorage.getItem('savedPassword') || '',
                remember: true
            };
        }
        return {
            email: '',
            password: '',
            remember: false
        };
    };

    // Refresh token (nếu cần)
    const refreshToken = async () => {
        try {
            const response = await apiCall(`${API_URL}/auth/refresh`, {
                method: 'POST'
            });
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            // Đăng xuất nếu refresh token thất bại
            handleLogout();
            return false;
        }
    };

    // Quên mật khẩu
    const handleForgotPassword = async (email) => {
        try {
            setLoading(true);
            
            await apiCall(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                body: JSON.stringify({ email })
            });

            setResetEmail(email);
            setIsForgotVerificationModalVisible(true);
            message.success('Đã gửi email hướng dẫn đặt lại mật khẩu');
        } catch (error) {
            message.error(`Lỗi gửi email: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Xác thực forgot password OTP
    const handleForgotVerification = async (code) => {
        try {
            setLoading(true);
            
            await apiCall(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                body: JSON.stringify({
                    email: resetEmail,
                    otp: code
                })
            });

            setIsForgotVerificationModalVisible(false);
            setIsResetPasswordModalVisible(true);
        } catch (error) {
            message.error(`Lỗi xác thực: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Reset password
    const handleResetPassword = async (newPassword) => {
        try {
            setLoading(true);
            
            await apiCall(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                body: JSON.stringify({
                    email: resetEmail,
                    newPassword
                })
            });

            setIsResetPasswordModalVisible(false);
            message.success('Đặt lại mật khẩu thành công!');
            window.location.href = '/login';
        } catch (error) {
            message.error(`Lỗi đặt lại mật khẩu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const getUsers = async () => {
        try {
            const response = await apiCall(`${API_URL}/users`);
            return response;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    };

    return {
        // Methods
        handleRegister,
        handleLogin,
        handleLogout,
        handleChangePassword,
        handleVerification,
        handleResendOTP,
        handleForgotPassword,
        handleForgotVerification,
        handleResetPassword,
        getCurrentUser,
        isAuthenticated,
        hasRole,
        getSavedCredentials,
        refreshToken,
        getUsers,
        
        // States
        loading,
        pendingUser,
        isVerificationModalVisible,
        setIsVerificationModalVisible,
        isSuccessModalVisible,
        setIsSuccessModalVisible,
        isChangePasswordModalVisible,
        setIsChangePasswordModalVisible,
        resetEmail,
        isResetPasswordModalVisible,
        setIsResetPasswordModalVisible,
        isForgotVerificationModalVisible,
        setIsForgotVerificationModalVisible,
        
        // Modal handlers
        handleSuccessModalOk: () => {
            setIsSuccessModalVisible(false);
            window.location.href = '/login';
        }
    };
};
