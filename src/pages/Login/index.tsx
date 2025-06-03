import { Form, Input, Button, Checkbox } from 'antd';
import { useUserLogic } from '@/models/useUserLogic';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
const Login = () => {
	const [form] = Form.useForm();
	const { handleLogin } = useUserLogic();
	const history = useHistory();
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
