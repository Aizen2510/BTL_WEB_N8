// src/hooks/useUserLogic.ts

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { message, Modal } from 'antd';
import axios from 'axios';


const API_URL = 'http://localhost:3000/api';

// Cấu hình axios
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const useUserLogic = () => {
    const history = useHistory();
    const [pendingUser, setPendingUser] = useState<any>(null);
    const [resetEmail, setResetEmail] = useState<string>('');
    const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
    const [isForgotVerificationModalVisible, setIsForgotVerificationModalVisible] = useState(false);

    const getUsers = async (): Promise<UserManagement.User[]> => {
        try {
            const response = await axios.get(`${API_URL}/users`);
            return response.data as UserManagement.User[];
        } catch (error) {
            message.error('Lỗi khi lấy danh sách người dùng');
            return [];
        }
    };

    const findUserByEmail = async (email: string): Promise<UserManagement.User| null> => {
        try {
            const response = await axios.get(`${API_URL}/users?email=${email}`);
            return response.data?.[0] as UserManagement.User || null;
        } catch (error) {
            return null;
        }
    };

    const handleRegister = async (values: { username: string; email: string; password: string; }) => {
        try {
            const { username, email, password } = values;

            // Kiểm tra email tồn tại
            const existingUser = await findUserByEmail(email);
            if (existingUser) {
                Modal.error({ title: 'Email đã tồn tại' });
                return;
            }

            // Gọi API đăng ký
            const response = await axios.post(`${API_URL}/auth/register`, {
                email,
                password,
                fullName: username
            });

            setPendingUser({ ...values, id: response.data.userId });
            setIsVerificationModalVisible(true);
            message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.');
        } catch (error: any) {
            Modal.error({ title: error.response?.data?.message || 'Đăng ký thất bại' });
        }
    };

    const handleVerification = async ({ code }: { code: string }) => {
        try {
            if (!pendingUser) return;

            // Gọi API xác thực OTP
            await axios.post(`${API_URL}/auth/verify-otp`, {
                userId: pendingUser.id,
                otp: code
            });

            setPendingUser(null);
            setIsVerificationModalVisible(false);
            setIsSuccessModalVisible(true);
            message.success('Xác thực thành công!');
        } catch (error: any) {
            Modal.error({ title: error.response?.data?.message || 'Xác thực thất bại' });
        }
    };

    const handleLogin = async (values: { email: string; password: string; remember: boolean; }) => {
        try {
            const { email, password, remember } = values;

            // Gọi API đăng nhập
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            const { token, user } = response.data as { token: string; user: UserManagement.User };

            // Lưu thông tin đăng nhập
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);

            if (remember) {
                localStorage.setItem('savedEmail', email);
                localStorage.setItem('savedPassword', password);
                localStorage.setItem('remember', 'true');
            } else {
                localStorage.removeItem('savedEmail');
                localStorage.removeItem('savedPassword');
                localStorage.setItem('remember', 'false');
            }

            message.success('Đăng nhập thành công!');
            history.push(user.role === 'admin' ? '/admin' : '/user/home');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    const handleLogout = async () => {
        try {
            const currentUser: UserManagement.User| null = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (currentUser?.id) {
                await axios.put(`${API_URL}/users/${currentUser.id}`, { status: 'inactive' });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái người dùng:', error);
        }

        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        message.success('Đã đăng xuất');
        history.push('/login');
    };

    const handleForgotPassword = async (email: string) => {
        try {
            // Gọi API quên mật khẩu
            await axios.post(`${API_URL}/auth/forgot-password`, { email });

            setResetEmail(email);
            setIsForgotVerificationModalVisible(true);
            message.success('Đã gửi email hướng dẫn đặt lại mật khẩu');
        } catch (error: any) {
            Modal.error({ title: error.response?.data?.message || 'Gửi email thất bại' });
        }
    };

    const handleForgotVerification = async (code: string) => {
        try {
            // Gọi API xác thực OTP
            await axios.post(`${API_URL}/auth/verify-otp`, {
                userId: resetEmail,
                otp: code
            });

            setIsForgotVerificationModalVisible(false);
            setIsResetPasswordModalVisible(true);
        } catch (error: any) {
            Modal.error({ title: error.response?.data?.message || 'Xác thực thất bại' });
        }
    };

    const handleResetPassword = async (newPassword: string) => {
        try {
            // Gọi API đặt lại mật khẩu
            await axios.post(`${API_URL}/auth/reset-password`, {
                email: resetEmail,
                newPassword
            });

            setIsResetPasswordModalVisible(false);
            message.success('Đặt lại mật khẩu thành công!');
            history.push('/login');
        } catch (error: any) {
            Modal.error({ title: error.response?.data?.message || 'Đặt lại mật khẩu thất bại' });
        }
    };

    return {
        handleRegister,
        handleLogin,
        handleLogout,
        handleVerification,
        isVerificationModalVisible,
        setIsVerificationModalVisible,
        isSuccessModalVisible,
        setIsSuccessModalVisible,
        handleSuccessModalOk: () => {
            setIsSuccessModalVisible(false);
            history.push('/login');
        },
        handleForgotPassword,
        handleForgotVerification,
        handleResetPassword,
        isForgotVerificationModalVisible,
        setIsForgotVerificationModalVisible,
        isResetPasswordModalVisible,
        setIsResetPasswordModalVisible,
    };
};
