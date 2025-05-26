import { Button, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormCategory from './Form';
import CategoryDetail from './more';

const IndexCategory = () => {
    const {
        categories,
        setCategories: updateCategories,
        categoryVisible,
        setCategoryVisible,
        categoryIsEdit,
        setCategoryIsEdit,
        categoryRow,
        setCategoryRow,
        getCategories,
    } = useModel('documentCategoryModel');

    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category.Record | null>(null);

    useEffect(() => {
        getCategories();
    }, []);

    const columns = [
        { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Số tài liệu', dataIndex: 'documentCount', key: 'documentCount' },
        {
        title: 'Hành động',
        key: 'action',
        render: (_: any, record: Category.Record) => (
            <div>
            <Button
                onClick={() => {
                setCategoryRow(record);
                setCategoryIsEdit(true);
                setCategoryVisible(true);
                }}
            >
                Sửa
            </Button>
            <Button
                danger
                style={{ marginLeft: 8 }}
                onClick={() => {
                const updated = categories.filter((item) => item.id !== record.id);
                updateCategories(updated);
                }}
            >
                Xoá
            </Button>
            <Button
                type="link"
                onClick={() => {
                setSelectedCategory(record);
                setDetailVisible(true);
                }}
            >
                Xem chi tiết
            </Button>
            </div>
        ),
        },
    ];

    return (
        <>
        <Button
            type="primary"
            onClick={() => {
            setCategoryIsEdit(false);
            setCategoryRow(undefined);
            setCategoryVisible(true);
            }}
        >
            Thêm danh mục
        </Button>

        <Table
            rowKey="id"
            dataSource={categories}
            columns={columns}
            style={{ marginTop: 16 }}
            pagination={{ pageSize: 5 }}
        />

        <Modal
            visible={categoryVisible}
            footer={null}
            onCancel={() => setCategoryVisible(false)}
            destroyOnClose
        >
            <FormCategory />
        </Modal>

        <Modal
            visible={detailVisible}
            footer={null}
            onCancel={() => setDetailVisible(false)}
            width={800}
            destroyOnClose
            title={`Danh sách tài liệu thuộc danh mục: ${selectedCategory?.name}`}
        >
            <CategoryDetail categoryId={selectedCategory?.id ?? ''} />
        </Modal>
        </>
    );
};

export default IndexCategory;
