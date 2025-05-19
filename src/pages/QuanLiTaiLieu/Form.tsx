import { Button, DatePicker, Form, Input, Select, Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const FormDoc = () => {
  const [form] = Form.useForm();
  const { data, setData, row, isEdit, setVisible, getDoc } = useModel('documentManager');
    const {
    categories,
    getCategories,
    setCategories,
  } = useModel('documentCategoryModel');


  // Trạng thái upload file (lưu file url tạm thời)
  const [fileList, setFileList] = useState<any[]>([]);

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
    }
  }, [row, isEdit]);

  // Xử lý upload
  const onUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const saveData = (values: any, fileUrl: string) => {
    const dataLocal: Document.Record[] = JSON.parse(localStorage.getItem('data') || '[]');
    if (isEdit) {
      const updated = dataLocal.map((item) =>
        item.id === row?.id
          ? {
              ...item,
              ...values,
              uploadDate: values.uploadDate.format('YYYY-MM-DD'),
              fileUrl,
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
        uploadDate: values.uploadDate.format('YYYY-MM-DD'),
        fileUrl,
        downloadCount: 0,
        isApproved: 'pending',
        fileType: values.fileType || 'other',
      };
      localStorage.setItem('data', JSON.stringify([newItem, ...dataLocal]));
      message.success('Thêm tài liệu thành công!');
    }

    getDoc();
    setVisible(false);
  };

  const onFinish = (values: any) => {
    // Kiểm tra file upload có không
    if (!fileList.length) {
      message.error('Vui lòng tải lên file tài liệu');
      return;
    }
    // Lấy fileUrl giả định (thường bạn sẽ upload file lên server rồi trả về url)
    // Ở đây giả lập lấy url tạm từ file object
    let fileUrl = '';
    if (fileList[0].url) {
      fileUrl = fileList[0].url;
    } else if (fileList[0].originFileObj) {
      // Bạn có thể dùng FileReader để convert file thành base64 hoặc upload lên server
      // Ở ví dụ này giả sử lưu base64 (chỉ demo)
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

  // Hàm cho phép thêm danh mục mới ngay tại form chọn danh mục
const onCategoryChange = (value: string) => {
  if (value === 'addNew') {
    const newCatName = prompt('Nhập tên danh mục mới:');
    if (newCatName) {
      const newCat = { id: Date.now().toString(), name: newCatName };
      const updatedCategories = [...categories, newCat];
      setCategories(updatedCategories);

      // Lưu vào localStorage
      localStorage.setItem('categories', JSON.stringify(updatedCategories));

      form.setFieldsValue({ categoryId: newCat.id });
    } else {
      form.setFieldsValue({ categoryId: undefined });
    }
  }
};


  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        name="title"
        label="Tên Tài Liệu"
        rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="uploaderName"
        label="Người Đăng"
        rules={[{ required: true, message: 'Vui lòng nhập tên người đăng' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Mô Tả"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="Danh Mục"
        rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
      >
        <Select onChange={onCategoryChange} placeholder="Chọn danh mục hoặc thêm mới">
          {categories.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.name}
            </Option>
          ))}
          <Option value="addNew">+ Thêm mới danh mục</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="uploadDate"
        label="Ngày Đăng"
        rules={[{ required: true, message: 'Vui lòng chọn ngày đăng' }]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        name="fileUpload"
        label="Tải Lên File"
        rules={[{ required: true, message: 'Vui lòng tải lên file tài liệu' }]}
      >
        <Upload
          beforeUpload={() => false} // ngăn upload tự động
          onChange={onUploadChange}
          fileList={fileList}
          accept=".pdf,.docx,.pptx,.xlsx"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn File</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="fileType"
        label="Loại File"
        rules={[{ required: true, message: 'Vui lòng chọn loại file' }]}
      >
        <Select placeholder="Chọn loại file">
          <Option value="pdf">PDF</Option>
          <Option value="docx">DOCX</Option>
          <Option value="pptx">PPTX</Option>
          <Option value="xlsx">XLSX</Option>
          <Option value="other">Khác</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isEdit ? 'Cập nhật' : 'Thêm'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormDoc;
