import React from 'react';
import { Form, Input, Button, Space, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import { Document, Category } from '@/services/ThaoTacTaiLieu/typings';
import { addDocument, updateDocument } from '@/services/ThaoTacTaiLieu/index';
import moment from 'moment';

interface DocumentFormProps {
  initialValues: Document | null;
  categories: Category[];
}

const FormDocument: React.FC<DocumentFormProps & { form: any }> = ({ initialValues, categories, form }) => {
  const { setIsModalVisible, selectedDocument, fetchDocuments, setDocuments } = useModel('ThaoTacTaiLieu');

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleSubmit = () => {
    form.validateFields().then(async (values: any) => {
      const fileObj = values.file && values.file[0];
      const fileUrl = fileObj && (fileObj.url || (fileObj.originFileObj && URL.createObjectURL(fileObj.originFileObj)));
      const docData: Document = {
        id: selectedDocument ? selectedDocument.id : uuidv4(),
        title: values.title,
        description: values.description,
        category: values.category,
        uploadedBy: values.uploadedBy,
        uploadDate: selectedDocument ? selectedDocument.uploadDate : moment().format('DD/MM/YYYY'),
        fileType: '',
        fileSize: 0, // Truyền 0 để đúng kiểu Document, không hiển thị trên UI
        downloadCount: selectedDocument ? selectedDocument.downloadCount : 0,
        status: selectedDocument ? selectedDocument.status : 'pending',
        fileUrl: fileUrl || '',
      };

      if (selectedDocument) {
        await updateDocument(docData);
        message.success('Cập nhật tài liệu thành công!');
        setIsModalVisible(false);
        fetchDocuments();
      } else {
        await addDocument(docData);
        setDocuments((prev: Document[]) => [...prev, docData]); // Thêm mới vào cuối danh sách
        message.success('Thêm tài liệu mới thành công!');
        setIsModalVisible(false);
        // KHÔNG gọi fetchDocuments ở đây để tránh ghi đè state vừa cập nhật
      }
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        ...selectedDocument,
      }}
    >
      <Form.Item
        name="title"
        label="Tiêu đề tài liệu"
        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề tài liệu!' }]}
      >
        <Input placeholder="Nhập tiêu đề tài liệu" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô tả"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
      >
        <Input.TextArea placeholder="Nhập mô tả chi tiết" rows={4} />
      </Form.Item>

      <Form.Item
        name="category"
        label="Danh mục"
        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
      >
        <Input
          placeholder="Tên danh mục"
        />
      </Form.Item>

      <Form.Item
        name="uploadedBy"
        label="Người đăng tải"
        rules={[{ required: true, message: 'Vui lòng nhập người đăng!' }]}
      >
        <Input placeholder="Nhập tên người đăng" />
      </Form.Item>

      <Form.Item
        name="file"
        label="Tệp tài liệu"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: 'Vui lòng tải lên tệp tài liệu!' }]}
      >
        <Upload
          name="file"
          customRequest={({ file, onSuccess }) => {
            // Giả lập upload, thực tế bạn gọi API upload ở đây
            const realFile = file as File;
            setTimeout(() => {
              onSuccess && onSuccess({ url: URL.createObjectURL(realFile) });
            }, 500);
          }}
          maxCount={1}
          beforeUpload={() => false} // Không upload tự động
        >
          <Button icon={<UploadOutlined />}>Chọn tệp</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {selectedDocument ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default FormDocument;
