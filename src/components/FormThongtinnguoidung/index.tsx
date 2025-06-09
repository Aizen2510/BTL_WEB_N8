import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Avatar, message, Dropdown, Menu, Statistic, Row, Col, Upload } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  SaveOutlined,
  FileTextOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';

// Định nghĩa interface cho User
type User = {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  password?: string;
  status?: string;
};

// Hàm lấy thông tin user hiện tại từ localStorage
function getCurrentUser(): User | null {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// Hàm lấy tổng số lượt tải lên
const getTotalUploads = (): number => {
  const documents = JSON.parse(localStorage.getItem('documents') || '[]');
  return documents
    .filter((doc: any) => doc.uploaderId === getCurrentUser()?.id)
    .reduce((sum: number, doc: any) => sum + (doc.uploadCount ?? doc.uploads ?? 0), 0);
};

// Hàm lấy tổng số lượt tải xuống
const getTotalDownloads = (): number => {
  const documents = JSON.parse(localStorage.getItem('documents') || '[]');
  return documents
    .filter((doc: any) => doc.uploaderId === getCurrentUser()?.id)
    .reduce((sum: number, doc: any) => sum + (doc.downloadCount ?? doc.downloads ?? 0), 0);
};

// Hàm lấy danh sách tài liệu và ánh xạ categoryName
function getDocumentsWithCategoryName() {
  // Lấy danh sách categories
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  // Lấy danh sách tài liệu
  let documents = JSON.parse(localStorage.getItem('documents') || '[]');
  // Bổ sung categoryName nếu thiếu
  documents = documents.map((doc: any) => {
    if (!doc.categoryName) {
      const found = categories.find(
        (cat: any) => cat.categoryId === doc.categoryId || cat.id === doc.categoryId
      );
      return {
        ...doc,
        categoryName: found ? (found.categoryName || found.name) : doc.categoryId,
      };
    }
    return doc;
  });
  return documents;
}

// Hàm lưu thông tin user
function saveCurrentUser(user: User) {
  // Lưu vào currentUser
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Cập nhật trong danh sách users
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const idx = users.findIndex((u: User) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = {
      ...users[idx],
      ...user,
      password: users[idx].password, // Giữ nguyên mật khẩu
      status: users[idx].status, // Giữ nguyên trạng thái
    };
    localStorage.setItem('users', JSON.stringify(users));
  }
}

interface FormThongTinNguoiDungProps {
  totalDownloads?: number;
  totalUploads?: number;
}

const FormThongTinNguoiDung: React.FC<FormThongTinNguoiDungProps> = ({ totalDownloads = 0 }) => {
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);
  const [totalUploads, setTotalUploads] = useState<number>(getTotalUploads());
  const [totalDownloadsState, setTotalDownloadsState] = useState<number>(totalDownloads);

  // Hàm hiển thị modal thông tin
  const showModal = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setEditMode(false);
    setAvatarUrl(currentUser?.avatarUrl);
    setVisible(true);

    setTotalUploads(getTotalUploads());
    setTotalDownloadsState(getTotalDownloads());

    // Set giá trị mặc định cho form
    form.setFieldsValue({
      username: currentUser?.username,
      email: currentUser?.email,
      downloadCount: getTotalDownloads(),
      uploadCount: getTotalUploads(),
    });
  };

  const handleCancel = () => {
    setVisible(false);
    setEditMode(false);
    form.resetFields();
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Cập nhật trạng thái user thành inactive
    if (user) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: User) =>
        u.id === user.id ? { ...u, status: 'inactive' } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    // Xóa thông tin đăng nhập
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  // Hàm xử lý thay đổi avatar
  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64 = e.target.result;
      setAvatarUrl(base64);
      // Lưu base64 vào một key riêng
      if (user?.id) {
        localStorage.setItem(`avatar_${user.id}`, base64);
      }
    };
    reader.readAsDataURL(file);
    return false;
  };

  // Hàm lưu thông tin người dùng
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!user?.id) {
        message.error('Không tìm thấy thông tin người dùng!');
        return;
      }

      // Lấy danh sách users từ localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);

      if (userIndex === -1) {
        message.error('Không tìm thấy người dùng trong hệ thống!');
        return;
      }

      // Cập nhật thông tin user
      const updatedUser: User = {
        ...users[userIndex],
        username: values.username,
        email: values.email,
        avatarUrl: avatarUrl,
      };

      // Cập nhật trong danh sách users
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));

      // Cập nhật currentUser
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      setEditMode(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  // Load avatar khi component mount hoặc user thay đổi
  useEffect(() => {
    if (user?.id) {
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
      }
    }
  }, [user?.id]);

  // Lắng nghe sự thay đổi của localStorage
  useEffect(() => {
    const onStorage = () => {
      setTotalUploads(getTotalUploads());
      setTotalDownloadsState(getTotalDownloads());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Thêm đoạn này vào trong component để test xuất dữ liệu tài liệu ra console
  useEffect(() => {
    const docs = getDocumentsWithCategoryName();
    console.log('Tài liệu với categoryName:', docs);
  }, []);

  // Menu dropdown
  const menu = (
    <Menu>
      <Menu.Item key="info" icon={<UserOutlined />} onClick={showModal}>
        Thông tin người dùng
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
        <Avatar
          src={avatarUrl}
          icon={!avatarUrl ? <UserOutlined /> : undefined}
          size={36}
          style={{ cursor: 'pointer', border: '1px solid #e6e6e6', backgroundColor: '#f5f5f5' }}
        />
      </Dropdown>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        title="Thông tin người dùng"
        footer={null}
        destroyOnClose
      >
        <Form 
          form={form} 
          layout="vertical" 
          disabled={!editMode}
          initialValues={{
            username: user?.username,
            email: user?.email,
          }}
        >
          <Form.Item label="Ảnh đại diện">
            <div
              style={{ display: 'flex', justifyContent: 'center', cursor: editMode ? 'pointer' : 'default' }}
              onClick={() => {
                if (editMode) document.getElementById('avatar-upload-input')?.click();
              }}
            >
              <Avatar
                size={96}
                src={avatarUrl}
                icon={!avatarUrl ? <UserOutlined /> : undefined}
                style={{ border: '2px solid #ddd', backgroundColor: '#f0f0f0' }}
              />
            </div>
            {editMode && (
              <input
                title="Ảnh đại diện"
                placeholder="Ảnh đại diện"
                id="avatar-upload-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarChange(file);
                }}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Tên người dùng"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Số lượt tải lên"
                value={totalUploads}
                prefix={<UploadOutlined />}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Số lượt tải xuống"
                value={totalDownloadsState}
                prefix={<DownloadOutlined />}
              />
            </Col>
          </Row>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          {editMode ? (
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Lưu
            </Button>
          ) : (
            <Button icon={<EditOutlined />} onClick={() => setEditMode(true)}>
              Chỉnh sửa
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default FormThongTinNguoiDung;
