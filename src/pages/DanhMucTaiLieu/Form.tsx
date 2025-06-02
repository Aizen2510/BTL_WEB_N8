import { Form, Input, Button, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCategory = () => {
    const [form] = Form.useForm();

    const {
        categories,
        setCategories: updateCategories,
        categoryVisible,
        setCategoryVisible,
        categoryIsEdit: isEdit,
        setCategoryIsEdit,
        categoryRow: row,
        setCategoryRow,
    } = useModel('documentCategoryModel');

    useEffect(() => {
        if (isEdit && row) {
        form.setFieldsValue(row);
        } else {
        form.resetFields();
        }
    }, [isEdit, row, form]);

    const handleFinish = (values: category.Record) => {
        if (isEdit && row) {
        const updated = categories.map((item) =>
            item.categoryId === row.categoryId ? { ...item, ...values } : item
        );
        updateCategories(updated);
        message.success('Cập nhật danh mục thành công');
        } else {
        const newCategory: category.Record = {
            categoryId: Date.now().toString(),
            categoryName: values.categoryName,
            description: values.description || '',
            documentCount: 0,
        };
        updateCategories([...categories, newCategory]);
        message.success('Thêm danh mục thành công');
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
            {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
        </Form.Item>
        </Form>
    );
};

export default FormCategory;
