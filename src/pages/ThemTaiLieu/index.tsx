import React, { useState } from 'react';
import { Upload, Button, Form, Input, Select, Card, message, Typography, Space } from 'antd';
import { InboxOutlined, HomeOutlined, FileSearchOutlined, BarChartOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import './index.less';

const { Option } = Select;
const { Title, Paragraph } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

interface Category {
  id: string;
  name: string;
}

// Giả định danh sách danh mục
const categories: Category[] = [
  { id: '1', name: 'Biểu mẫu hành chính' },
  { id: '2', name: 'Văn bản quy phạm' },
  { id: '3', name: 'Quy trình nghiệp vụ' },
  { id: '4', name: 'Tài liệu đào tạo' },
];

const UploadPage: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleUpload = async (values: any) => {
    if (fileList.length === 0) {
      message.error('Vui lòng tải lên ít nhất một tệp!');
      return;
    }

    setUploading(true);
    
    try {
      // Giả lập API gửi tài liệu
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success('Tải lên thành công!');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Tải lên thất bại.');
    } finally {
      setUploading(false);
    }
  };

  const props = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: RcFile) => {
      // Kiểm tra kiểu file (tùy chỉnh theo yêu cầu)
      const isValidType = file.type === 'application/pdf' || 
                        file.type === 'application/msword' || 
                        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      if (!isValidType) {
        message.error('Chỉ hỗ trợ tệp PDF hoặc Word!');
        return false;
      }
      
      // Kiểm tra kích thước file (ví dụ: dưới 10MB)
      const isLessThan10M = file.size / 1024 / 1024 < 10;
      if (!isLessThan10M) {
        message.error('Tệp phải nhỏ hơn 10MB!');
        return false;
      }
      
      setFileList([...fileList, file]);
      return false; // Ngăn upload tự động
    },
    fileList,
  };

  // Header navigation menu
  const menu = (
    <div className="headerMenu">
      <Button type="link" icon={<HomeOutlined />} href="/Trangchu" style={{ color: '#1890ff', fontWeight: 600 }}>Trang chủ</Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
      <Button type="link" icon={<BarChartOutlined />} href="/ThongKe" style={{ fontWeight: 600 }}>Thống kê</Button>
      <Button type="link" href="/ThemTaiLieu" style={{ fontWeight: 600 }}>Thêm tài liệu</Button>
      <Button type="link" href="/DuyetTaiLieu" style={{ fontWeight: 600 }}>Duyệt tài liệu</Button>
    </div>
  );

  // Avatar for user
  const handleAvatarClick = () => {
    window.location.href = '/user/login';
  };

  return (
    <PageContainer title={false}>
      <div className="stickyHeader">
        {menu}
        <div className="headerRight">
          <div className="avatar" onClick={handleAvatarClick} title="Đăng nhập">
            <img src={require('@/assets/admin.png')} alt="avatar" />
          </div>
        </div>
      </div>
      <div className="uploadPage">
        <Card className="uploadCard">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpload}
            requiredMark="optional"
          >
            <Form.Item
              name="title"
              label="Tên tài liệu"
              rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu!' }]}
            >
              <Input placeholder="Nhập tên tài liệu" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả tài liệu!' }]}
            >
              <TextArea rows={4} placeholder="Nhập mô tả tài liệu" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>{category.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              initialValue="pending"
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="approved">Đã duyệt</Option>
                <Option value="pending">Chờ duyệt</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Tệp đính kèm">
              <Dragger {...props} className="uploadDragger">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo thả tệp vào khu vực này để tải lên</p>
                <p className="ant-upload-hint">
                  Hỗ trợ tải lên PDF, Word. Kích thước tệp tối đa 10MB.
                </p>
              </Dragger>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={uploading} 
                className="submitButton"
              >
                {uploading ? 'Đang tải lên...' : 'Đăng tải'}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card className="helpCard">
          <Title level={4}>Hướng dẫn</Title>
          <Paragraph>
            <ul>
              <li>Nhập đầy đủ thông tin tài liệu.</li>
              <li>Chọn danh mục phù hợp.</li>
              <li>Tài liệu "Đã duyệt" sẽ hiển thị ngay trên hệ thống.</li>
              <li>Tài liệu "Chờ duyệt" sẽ được quản trị viên xem xét trước khi công bố.</li>
            </ul>
          </Paragraph>
        </Card>
      </div>
    </PageContainer>
  );
};

export default UploadPage;