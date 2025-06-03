import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { message, Modal } from 'antd';
import { UserManagement } from '@/services/Auth/User';

export const useUserLogic = () => {
  const history = useHistory();
  const [count, setCount] = useState<number>(Number(localStorage.getItem('failed')) || 0);
  const [isVerified, setIsVerified] = useState<boolean>(count < 5);
  const [otp, setOtp] = useState('1507455');
  const [pendingUser, setPendingUser] = useState<UserManagement.User | null>(null);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
  const [isForgotVerificationModalVisible, setIsForgotVerificationModalVisible] = useState(false);

  const getUsers = (): UserManagement.User[] =>
    JSON.parse(localStorage.getItem('users') || '[]');

  const saveUsers = (users: UserManagement.User[]) =>
    localStorage.setItem('users', JSON.stringify(users));

  useEffect(() => {
    const users = getUsers();
    const adminExists = users.some(u => u.email === 'admin@example.com');
    if (!adminExists) {
      const adminUser: UserManagement.User = {
        id: Date.now().toString(),
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        enabled: true,
        status: 'inactive',
      };
      saveUsers([...users, adminUser]);
    }
  }, []);

  const handleRegister = (values: any) => {
    const { username, email, password } = values;
    const users = getUsers();

    if (users.find(u => u.email === email)) {
      Modal.error({ title: 'Email đã tồn tại' });
      return;
    }

    const newUser: UserManagement.User = {
      id: Date.now().toString(),
      username,
      email,
      avatarUrl: 'https://i.pinimg.com/736x/5b/62/64/5b62640b18181e52f03604fe8cec7fe1.jpg',
      password,
      role: 'user',
      enabled: false,
      status: 'inactive', // 👈 Khởi tạo là không hoạt động
    };

    setOtp('1507455');
    setPendingUser(newUser);
    setIsVerificationModalVisible(true);
  };

  const handleVerification = ({ code }: { code: string }) => {
    if (code !== otp || !pendingUser) {
      Modal.error({ title: 'Sai mã OTP' });
      return;
    }

    const users = getUsers();
    const newUser = { ...pendingUser, enabled: true };
    users.push(newUser);
    saveUsers(users);

    setPendingUser(null);
    setIsVerificationModalVisible(false);
    setIsSuccessModalVisible(true);
  };

  const handleLogin = (values: any) => {
    const { email, password, remember } = values;
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      const newCount = count + 1;
      setCount(newCount);
      localStorage.setItem('failed', newCount.toString());

      if (newCount >= 5) setIsVerified(false);
      message.error('Sai tài khoản hoặc mật khẩu');
      return;
    }

    if (!user.enabled) {
      message.warning('Tài khoản chưa xác minh');
      return;
    }

    if (count >= 5 && !isVerified) {
      message.error('Vui lòng xác thực Captcha trước');
      return;
    }
    if (user) {
      // ✅ Cập nhật trạng thái active khi đăng nhập
      const updatedUsers = users.map(u =>
        u.email === user.email ? { ...u, status: 'active' } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // ✅ Lưu user đăng nhập hiện tại
      localStorage.setItem('currentUser', JSON.stringify(user));

      // Điều hướng hoặc thông báo thành công...
    } 

    const updatedUser = { ...user, status: 'active' };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('token', 'mock-token');
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

    localStorage.removeItem('failed');
    setCount(0);
    message.success('Đăng nhập thành công!');

    history.push(user.role === 'admin' ? '/admin' : '/user/home');
  };

  const handleLogout = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const updatedUsers = users.map((u: UserManagement.User) =>
      u.email === currentUser.email ? { ...u, status: 'inactive' } : u
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.removeItem('currentUser');

    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    message.success('Đã đăng xuất');
    history.push('/login');
  };

  const handleForgotPassword = (email: string) => {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      Modal.error({ title: 'Email không tồn tại' });
      return;
    }

    setResetEmail(email);
    setIsForgotVerificationModalVisible(true);

    Modal.info({
      title: 'Mã OTP để đặt lại mật khẩu',
      content: 'Mã xác nhận: 1507455',
    });
  };

  const handleForgotVerification = (code: string) => {
    if (code !== otp) {
      Modal.error({ title: 'Sai mã OTP' });
      return;
    }

    setIsForgotVerificationModalVisible(false);
    setIsResetPasswordModalVisible(true);
  };

  const handleResetPassword = (newPassword: string) => {
    const users = getUsers();
    const updatedUsers = users.map(u =>
      u.email === resetEmail ? { ...u, password: newPassword } : u
    );

    saveUsers(updatedUsers);
    setIsResetPasswordModalVisible(false);
    message.success('Đổi mật khẩu thành công!');
  };

  return {
    handleRegister,
    handleLogin,
    handleLogout, // 👈 Đừng quên export hàm này
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
