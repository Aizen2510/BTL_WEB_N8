// import React, { useState } from 'react';
// import { Modal, Button, Form, Input, Avatar, message, Dropdown, Menu } from 'antd';
// import { UserOutlined, LogoutOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

// // Giả sử interface User như sau
// type User = {
//   id: number;
//   username: string;
//   email: string;
//   avatarUrl?: string;
//   downloadCount?: number;
//   uploadCount?: number;
//   status?: string;
// };

// // Lấy user hiện tại từ localStorage
// function getCurrentUser(): User | null {
//   try {
//     const user = localStorage.getItem('currentUser');
//     return user ? JSON.parse(user) : null;
//   } catch {
//     return null;
//   }
// }

// function saveCurrentUser(user: User) {
//   localStorage.setItem('currentUser', JSON.stringify(user));
//   const users = JSON.parse(localStorage.getItem('users') || '[]');
//   const idx = users.findIndex((u: User) => u.id === user.id);
//   if (idx !== -1) {
//     users[idx] = user;
//     localStorage.setItem('users', JSON.stringify(users));
//   }
// }

// const FormThongTinNguoiDung: React.FC = () => {
//   const [visible, setVisible] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [user, setUser] = useState<User | null>(getCurrentUser());
//   const [form] = Form.useForm();

//   // Hiện modal form
//   const showModal = () => {
//     console.log('Đã vào showModal'); // -> kiểm tra xem hàm có chạy không
//     const cur = getCurrentUser();
//     setUser(cur);
//     setEditMode(false);
//     setVisible(true);
//     // Đợi một tick rồi mới set giá trị xuống form
//     setTimeout(() => {
//       form.setFieldsValue(cur || {});
//     }, 0);
//   };

//   // Đăng xuất
//   const handleLogout = () => {
//     localStorage.removeItem('currentUser');
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     window.location.href = '/login';
//   };

//   // Lưu thông tin
//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       const updatedUser = { ...user, ...values } as User;
//       setUser(updatedUser);
//       saveCurrentUser(updatedUser);
//       setEditMode(false);
//       message.success('Cập nhật thông tin thành công!');
//     } catch {
//       // validate fail
//     }
//   };

//   // Dropdown menu (AntD v4)
//   const menu = (
//     <Menu>
//       <Menu.Item key="info" icon={<UserOutlined />} onClick={showModal}>
//         Thông tin người dùng
//       </Menu.Item>
//       <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={handleLogout}>
//         Đăng xuất
//       </Menu.Item>
//     </Menu>
//   );

//   return (
//     <>
//       <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
//         <Avatar
//           src={user?.avatarUrl}
//           icon={<UserOutlined />}
//           size={36}
//           style={{ cursor: 'pointer', border: '1px solid #e6e6e6', background: '#f5f5f5' }}
//         />
//       </Dropdown>

//       {/* Ở v4.x, dùng visible chứ không phải open */}
//       <Modal
//         visible={visible}
//         onCancel={() => setVisible(false)}
//         title="Thông tin người dùng"
//         footer={null}
//         destroyOnClose
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           initialValues={user || {}}
//           disabled={!editMode}
//         >
//           <Form.Item label="Tên người dùng" name="username" rules={[{ required: true, message: 'Nhập tên người dùng' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item label="Avatar URL" name="avatarUrl">
//             <Input />
//           </Form.Item>
//           <Form.Item label="Số lượt tải xuống" name="downloadCount">
//             <Input type="number" />
//           </Form.Item>
//           <Form.Item label="Số lượt tải lên" name="uploadCount">
//             <Input type="number" />
//           </Form.Item>
//           <Form.Item label="Trạng thái" name="status">
//             <Input disabled />
//           </Form.Item>
//         </Form>
//         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
//           {editMode ? (
//             <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
//               Lưu
//             </Button>
//           ) : (
//             <Button icon={<EditOutlined />} onClick={() => setEditMode(true)}>
//               Chỉnh sửa
//             </Button>
//           )}
//         </div>
//       </Modal>
//     </>
//   );
// };

// File: src/components/FormThongtinnguoidung/index.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Avatar, message, Dropdown, Menu, Statistic, Row, Col } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  SaveOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

type User = {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
};

function getCurrentUser(): User | null {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

function saveCurrentUser(user: User) {
  localStorage.setItem('currentUser', JSON.stringify(user));
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const idx = users.findIndex((u: User) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    localStorage.setItem('users', JSON.stringify(users));
  }
}

const getTotalUploads = () => {
  // Lấy số tài liệu từ localStorage giống Thao tác dữ liệu
  const docs = JSON.parse(localStorage.getItem('documents') || '[]');
  return Array.isArray(docs) ? docs.length : 0;
};

const getTotalDownloads = () => {
  // Lấy tổng lượt tải xuống của tài liệu đã duyệt
  const docs = JSON.parse(localStorage.getItem('documents') || '[]');
  if (!Array.isArray(docs)) return 0;
  return docs
    .filter((doc: any) => doc.status === 'approved')
    .reduce((sum: number, doc: any) => sum + (doc.downloadCount ?? doc.downloads ?? 0), 0);
};

const FormThongTinNguoiDung: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [form] = Form.useForm();
  const [totalUploads, setTotalUploads] = useState<number>(getTotalUploads());
  const [totalDownloads, setTotalDownloads] = useState<number>(getTotalDownloads());

  // Cập nhật số liệu mỗi khi mở modal hoặc khi có thay đổi
  const showModal = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setEditMode(false);
    setVisible(true);

    // Lấy lại số liệu mới nhất từ localStorage
    setTotalUploads(getTotalUploads());
    setTotalDownloads(getTotalDownloads());

    setTimeout(() => {
      form.setFieldsValue({
        ...(currentUser || {}),
        downloadCount: getTotalDownloads(),
        uploadCount: getTotalUploads(),
      });
    }, 0);
  };

  const handleCancel = () => setVisible(false);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser: User = {
        id: (user && user.id) || 0,
        username: values.username,
        email: values.email,
        avatarUrl: values.avatarUrl,
      };
      saveCurrentUser(updatedUser);
      setUser(updatedUser);
      setEditMode(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (err) {
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

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

  // Nếu muốn tự động cập nhật khi có thay đổi localStorage (ví dụ khi thêm/xóa tài liệu)
  useEffect(() => {
    const onStorage = () => {
      setTotalUploads(getTotalUploads());
      setTotalDownloads(getTotalDownloads());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <>
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
        <Avatar
          src={user?.avatarUrl}
          icon={!user?.avatarUrl ? <UserOutlined /> : undefined}
          size={36}
          style={{
            cursor: 'pointer',
            border: '1px solid #e6e6e6',
            backgroundColor: '#f5f5f5',
          }}
        />
      </Dropdown>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        title="Thông tin người dùng"
        footer={null}
        destroyOnClose
      >
        {/* Hiển thị số liệu tổng quan */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Statistic
              title="Số tài liệu đã đăng lên"
              value={totalUploads}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff', fontWeight: 600 }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Số lượt tải xuống"
              value={totalDownloads}
              prefix={<DownloadOutlined />}
              valueStyle={{ color: '#52c41a', fontWeight: 600 }}
            />
          </Col>
        </Row>
        <Form
          form={form}
          layout="vertical"
          disabled={!editMode}
          initialValues={{
            ...(user || {}),
            downloadCount: totalDownloads,
            uploadCount: totalUploads,
          }}
        >
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
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Ảnh đại diện (URL)" name="avatarUrl">
            <Input />
          </Form.Item>
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