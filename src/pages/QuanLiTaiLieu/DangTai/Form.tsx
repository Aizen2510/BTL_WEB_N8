import { Form, Input, Button, DatePicker, Select, Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const FormDoc = () => {
  const [form] = Form.useForm();
  const { row, isEdit, setVisible, setData } = useModel('documentManager');
  const { categories, setCategories } = useModel('documentCategoryModel');
  const [fileList, setFileList] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Gọi API nếu chưa có categories
  useEffect(() => {
    if (categories.length === 0) {
      axios.get('http://localhost:3000/api/categories')
        .then(res => {
          setCategories(res.data || []);
        })
        .catch(() => {
          message.error('Không thể tải danh mục từ API');
        });
    }
  }, []);

  // Cập nhật form nếu là edit
  useEffect(() => {
    if (isEdit && row) {
      form.setFieldsValue({
        ...row,
        uploadDate: dayjs(row.uploadDate),
        fileUpload: [{ name: row.title }],
      });
      if (row.fileUrl) {
        setFileList([{
          uid: '-1',
          name: row.title,
          status: 'done',
          url: row.fileUrl,
        }]);
      }
    } else {
      form.resetFields();
      form.setFieldsValue({
        uploaderName: user.username || 'admin',
        uploadDate: dayjs(),
      });
      setFileList([]);
    }
  }, [row, isEdit]);

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onFinish = async (values: any) => {
    const file = fileList[0];
    if (!file) {
      return message.error('Vui lòng chọn file.');
    }

    let fileUrl = file.url || '';
    if (!fileUrl && file.originFileObj) {
      fileUrl = await readFileAsBase64(file.originFileObj);
    }

    const newDoc: Document.Record = {
      id: isEdit && row?.id ? row.id : Date.now().toString(),
      title: values.title,
      description: values.description,
      categoryId: values.categoryId,
      categoryName: categories.find(cat => cat.categoryId === values.categoryId)?.categoryName || '',
      uploadDate: values.uploadDate.format('YYYY-MM-DD'),
      uploaderId: user.id,
      uploaderName: user.username,
      fileUrl,
      isApproved: user.username === 'admin' ? 'approved' : 'pending',
      downloadCount: isEdit ? (row?.downloadCount ?? 0) : 0,
    };

    await setData(newDoc, isEdit);
    setVisible(false);
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item name="title" label="Tên tài liệu" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
        <Select placeholder="Chọn danh mục">
          {categories.map((cat) => (
            <Option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="uploadDate" label="Ngày đăng" rules={[{ required: true }]}>
        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="fileUpload"
        label="Tải lên file"
        rules={[{ required: true, message: 'Vui lòng chọn file.' }]}
      >
        <Upload
          beforeUpload={() => false}
          onChange={({ fileList: newFileList }) => {
            setFileList(newFileList);
            form.setFieldsValue({ fileUpload: newFileList });
          }}
          fileList={fileList}
          maxCount={1}
          accept=".pdf,.docx,.xlsx,.pptx"
        >
          <Button icon={<UploadOutlined />}>Chọn file</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isEdit ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormDoc;
