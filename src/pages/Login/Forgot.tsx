import React, { useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { useUserLogic } from '@/models/useUserLogic';

const ForgotPasswordForm: React.FC = () => {
  const [form] = Form.useForm();
  const [verificationForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  const {
    handleForgotPassword,
    handleForgotVerification,
    handleResetPassword,
    isForgotVerificationModalVisible,
    setIsForgotVerificationModalVisible,
    isResetPasswordModalVisible,
    setIsResetPasswordModalVisible,
  } = useUserLogic();

  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');

  const onEmailSubmit = async () => {
    try {
      const values = await form.validateFields();
      handleForgotPassword(values.email);
      setStep('otp');
    } catch (err) {
      // Validation failed
    }
  };

  const onOtpSubmit = async () => {
    try {
      const values = await verificationForm.validateFields();
      handleForgotVerification(values.otp);
      setStep('reset');
    } catch (err) {
      // Validation failed
    }
  };

  const onResetPassword = async () => {
    try {
      const values = await resetForm.validateFields();
      handleResetPassword(values.password);
      setStep('email');
      form.resetFields();
      verificationForm.resetFields();
      resetForm.resetFields();
    } catch (err) {
      // Validation failed
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Quên mật khẩu</h2>
      {step === 'email' && (
        <Form form={form} layout="vertical" onFinish={onEmailSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Gửi mã xác thực
          </Button>
        </Form>
      )}

      <Modal
        title="Nhập mã OTP"
        visible={isForgotVerificationModalVisible}
        onCancel={() => setIsForgotVerificationModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={verificationForm} layout="vertical" onFinish={onOtpSubmit}>
          <Form.Item
            label="Mã OTP"
            name="otp"
            rules={[{ required: true, message: 'Vui lòng nhập mã OTP' }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Xác nhận
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Đặt lại mật khẩu"
        visible={isResetPasswordModalVisible}
        onCancel={() => setIsResetPasswordModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={resetForm} layout="vertical" onFinish={onResetPassword}>
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đổi mật khẩu
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ForgotPasswordForm;
