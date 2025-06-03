import { Form, Input, Button, Modal } from 'antd';
import { useUserLogic } from '@/models/useUserLogic';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import remImg from '../../assets/img/remBackround.png';
const Register = () => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [otpForm] = Form.useForm();
    const {
        handleRegister,
        handleVerification,
        isVerificationModalVisible,
        setIsVerificationModalVisible,
        isSuccessModalVisible,
        handleSuccessModalOk,
    } = useUserLogic();

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
                name="register"
                onFinish={handleRegister}
                style={{
                    maxWidth: 400,
                    width: '100%',
                    padding: 24,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Form.Item style={{ textAlign: 'center' }}>
                    <h1><strong>ĐĂNG KÝ</strong></h1>
                </Form.Item>

                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Tên người dùng" />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Đăng ký
                    </Button>
                </Form.Item>

                <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{ marginRight: 8 }}>Đã có tài khoản?</span>
                    <Button onClick={() => history.push('/login')}>Đăng nhập</Button>
                </Form.Item>
            </Form>

            {/* Modal nhập mã xác nhận */}
            <Modal
                title="Xác minh tài khoản"
                visible={isVerificationModalVisible}
                onCancel={() => setIsVerificationModalVisible(false)}
                footer={null}
            >
                <Form form={otpForm} onFinish={handleVerification}>
                    <Form.Item
                        name="code"
                        rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận!' }]}
                    >
                        <Input placeholder="Nhập mã xác nhận từ email" />
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit">Xác minh</Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal đăng ký thành công */}
            <Modal
                title="Đăng ký thành công"
                visible={isSuccessModalVisible}
                onOk={handleSuccessModalOk}
                onCancel={() => (false)}
                okText="Đăng nhập ngay"
                cancelText="Đóng"
            >
                <div style={{ justifyContent: 'center' }}>
                    <img src={remImg} alt="Background" style={{ width: '100%' }} />
                </div>
                <p>Tài khoản của bạn đã được xác minh và tạo thành công.</p>
            </Modal>
        </div>
    );
};

export default Register;
