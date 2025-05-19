import React, { useEffect, useRef, useState } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
const Login = () => {
	const [form] = Form.useForm();
	const history = useHistory();
	const [count, setCount] = useState<number>(Number(localStorage.getItem('failed')) || 0);
	const [isVerified, setIsVerified] = useState<boolean>(count < 5);


	useEffect(() => {
		const savedEmail = localStorage.getItem('savedEmail');
		const savedPassword = localStorage.getItem('savedPassword');
		const remember = localStorage.getItem('remember') === 'true';

		if (remember && savedEmail && savedPassword) {
			form.setFieldsValue({
				email: savedEmail,
				password: savedPassword,
				remember: true,
			});
		}
	}, [form]);

	const handleLogin = async (values: any) => {
		const { email, password, remember } = values;

		// Mock user database
		const users = [
			{ email: 'admin@example.com', password: '123456', role: 'admin', enabled: true },
			{ email: 'user@example.com', password: '123456', role: 'user', enabled: true },
		];

		const user = users.find(u => u.email === email && u.password === password);

		if (!user) {
			const newCount = count + 1;
			setCount(newCount);
			localStorage.setItem('failed', newCount.toString());

			if (newCount >= 5) {
				setIsVerified(false);
			}

			message.error('Sai tài khoản hoặc mật khẩu.');
			return;
		}

		if (!user.enabled) {
			message.warning('Tài khoản chưa được xác minh.');
			return;
		}

		if (count >= 5 && !isVerified) {
			message.error('Vui lòng xác thực Captcha trước khi đăng nhập.');
			return;
		}

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

		if (user.role === 'admin') {
			history.push('/admin');
		} else {
			history.push('/home');
		}
	};

	const onVerifyCaptcha = (value: string | null) => {
		if (value) {
			setIsVerified(true);
		}
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				backgroundColor: '#5788E93A',
				padding: 20,
			}}
		>
			<Form
				form={form}
				name="login"
				initialValues={{ remember: true }}
				style={{
					maxWidth: 360,
					width: '100%',
					padding: 24,
					backgroundColor: '#fff',
					borderRadius: 8,
					boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
				}}
				onFinish={handleLogin}
			>
				<Form.Item style={{ textAlign: 'center' }}>
					<h1>
						<strong>ĐĂNG NHẬP</strong>
					</h1>
				</Form.Item>

				<Form.Item
					name="email"
					rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
				>
					<Input prefix={<MailOutlined />} placeholder="Email" />
				</Form.Item>

				<Form.Item
					name="password"
					rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
				>
					<Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
				</Form.Item>

				<Form.Item>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox>Ghi nhớ mật khẩu</Checkbox>
						</Form.Item>
						<a href="./LogoutPage">Quên mật khẩu</a>
					</div>
				</Form.Item>


				<Form.Item>
					<Button block type="primary" htmlType="submit">
						Đăng nhập
					</Button>
				</Form.Item>

				<Form.Item style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<span>Bạn chưa có tài khoản?</span>
					<Button onClick={() => history.push('/register')} style={{ marginLeft: 10 }}>
						Đăng ký ngay
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default Login;
