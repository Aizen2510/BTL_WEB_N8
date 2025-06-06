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

  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

  const handleSubmit = () => {
    form.validateFields().then(async (values: any) => {
      const fileObj = values.file && values.file[0];
      let fileUrl = '';

      if (fileObj) {
        if (fileObj.url) {
          fileUrl = fileObj.url;
        } else if (fileObj.originFileObj) {
          fileUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(fileObj.originFileObj);
          });
        }
      }

      const docData: Document = {
        id: selectedDocument ? selectedDocument.id : uuidv4(),
        title: values.title,
        description: values.description,
        category: values.category,
        uploadedBy: values.uploadedBy,
        uploadDate: selectedDocument ? selectedDocument.uploadDate : moment().format('DD/MM/YYYY'),
        fileType: '',
        fileSize: 0,
        downloadCount: selectedDocument ? selectedDocument.downloadCount : 0,
        status: selectedDocument ? selectedDocument.status : 'pending', // Gán mặc định "pending" khi thêm mới
        fileUrl: fileUrl || '',
      };

      if (selectedDocument) {
        await updateDocument(docData);
        message.success('Cập nhật tài liệu thành công!');
        fetchDocuments();
      } else {
        await addDocument(docData);
        setDocuments((prev: Document[]) => [...prev, docData]);
        message.success('Thêm tài liệu mới thành công!');
      }

      setIsModalVisible(false);
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
        <Input placeholder="Tên danh mục" />
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
            setTimeout(() => {
              onSuccess && onSuccess({ url: URL.createObjectURL(file as File) });
            }, 500);
          }}
          maxCount={1}
          beforeUpload={() => false}
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
