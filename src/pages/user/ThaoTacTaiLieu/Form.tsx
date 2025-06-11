import { Button, DatePicker, Form, Input, Select, Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';
import { notifyAdmin } from '@/utils/notification';
import axios from 'axios';

const { Option } = Select;

const FormDocUser = () => {
  const [form] = Form.useForm();
  const { data, setData, row, isEdit, setVisible, getDoc } = useModel('documentManager');
  const { categories, setCategories } = useModel('documentCategoryModel');
  const [fileList, setFileList] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEdit && row) {
      form.setFieldsValue({
        ...row,
        uploadDate: dayjs(row.uploadDate),
        categoryId: row.categoryId,
      });
      if (row.fileUrl) {
        setFileList([
          {
            uid: '-1',
            name: row.title,
            status: 'done',
            url: row.fileUrl,
          },
        ]);
      }
    } else {
      form.resetFields();
      setFileList([]);
      form.setFieldsValue({ uploaderName: user.username || 'ADMIN' });
    }
  }, [row, isEdit]);

  const onUploadChange = ({ fileList: newFileList }: any) => {
    console.log('Upload changed:', newFileList);
    setFileList(newFileList);
  };

  const saveData = (values: any, fileUrl: string) => {
    const dataLocal: Document.Record[] = JSON.parse(localStorage.getItem('data') || '[]');
    const category = categories.find(cat => cat.categoryId === values.categoryId);

    const isAdmin = user.username?.toLowerCase() === 'admin';

    if (isEdit) {
      const updated = dataLocal.map((item) =>
        item.id === row?.id
          ? {
              ...item,
              ...values,
              uploadDate: values.uploadDate.format('YYYY-MM-DD'),
              fileUrl,
              categoryName: category?.categoryName || '',
              fileType: values.fileType || 'other',
            }
          : item,
      );
      localStorage.setItem('data', JSON.stringify(updated));
      message.success('Cập nhật tài liệu thành công!');
    } else {
      const newItem: Document.Record = {
        id: Date.now().toString(),
        ...values,
        uploaderId: user.username || 'ADMIN',
        uploaderName: user.username || 'ADMIN',
        uploadDate: values.uploadDate.format('YYYY-MM-DD'),
        fileUrl,
        downloadCount: 0,
        isApproved: isAdmin ? 'approved' : 'pending',
        categoryName: category?.categoryName || '',
        fileType: values.fileType || 'other',
      };
      localStorage.setItem('data', JSON.stringify([newItem, ...dataLocal]));
      message.success('Thêm tài liệu thành công!');
    }

    getDoc();
    setVisible(false);

    if (!isAdmin) {
      notifyAdmin({
        type: 'upload_doc',
        title: 'Tài liệu mới chờ duyệt',
        content: `Người dùng ${user.username} vừa đăng tài liệu "${values.title}".`,
      });
    }
  };

  const onFinish = (values: any) => {
    console.log('Submitting form:', values);
    console.log('Current fileList:', fileList);

    if (!fileList.length) {
      message.error('Vui lòng tải lên file tài liệu');
      return;
    }

    let fileUrl = '';
    if (fileList[0].url) {
      fileUrl = fileList[0].url;
    } else if (fileList[0].originFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(fileList[0].originFileObj);
      reader.onload = () => {
        fileUrl = reader.result as string;
        saveData(values, fileUrl);
      };
      return;
    }

    saveData(values, fileUrl);
  };

  const onCategoryChange = (value: string) => {
    if (value === 'addNew') {
      const newCatName = prompt('Nhập tên danh mục mới:');
      if (newCatName) {
        const newCat = {
          categoryId: Date.now().toString(),
          categoryName: newCatName,
          description: '',
          documentCount: 0,
        };
        const updatedCategories = [...categories, newCat];
        setCategories(updatedCategories);
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
        form.setFieldsValue({ categoryId: newCat.categoryId });
      } else {
        form.setFieldsValue({ categoryId: undefined });
      }
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item name="title" label="Tên Tài Liệu" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Mô Tả" rules={[{ required: true }]}>
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
        <Select onChange={onCategoryChange}>
          {categories.map((cat) => (
            <Option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="uploadDate" label="Ngày Đăng" rules={[{ required: true }]}>
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item label="Tải Lên File">
        <Upload
          beforeUpload={() => false}
          onChange={onUploadChange}
          fileList={fileList}
          accept=".pdf,.docx,.pptx,.xlsx"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn File</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isEdit ? 'Cập nhật' : 'Thêm'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormDocUser;
