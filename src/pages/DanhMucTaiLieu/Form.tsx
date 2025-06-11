import { Form, Input, Button } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCategory = () => {
  const [form] = Form.useForm();
  const {
    categoryIsEdit,
    setCategoryIsEdit,
    categoryRow,
    setCategoryRow,
    setCategoryVisible,
    addCategory,
    editCategory,
  } = useModel('documentCategoryModel');

  useEffect(() => {
    if (categoryIsEdit && categoryRow) {
      form.setFieldsValue(categoryRow);
    } else {
      form.resetFields();
    }
  }, [categoryIsEdit, categoryRow, form]);

  const handleFinish = async (values: category.Record) => {
    if (categoryIsEdit && categoryRow) {
      await editCategory(categoryRow.categoryId, values);
    } else {
      await addCategory(values);
    }

    setCategoryVisible(false);
    setCategoryIsEdit(false);
    setCategoryRow(undefined);
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        name="categoryName"
        label="Tên danh mục"
        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {categoryIsEdit ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormCategory;
