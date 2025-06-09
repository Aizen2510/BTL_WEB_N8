import { Button, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormCategory from './Form';
import CategoryDetail from './more';
import type { IColumn } from '@/components/Table/typing';

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
    const [selectedCategory, setSelectedCategory] = useState<category.Record | null>(null);

    useEffect(() => {
        getCategories();
    }, []);

    const columns: IColumn<category.Record>[] = [
        { title: 'Tên danh mục', dataIndex: 'categoryName', key: 'categoryName', width: 200 },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: 300 },
        { title: 'Số tài liệu', dataIndex: 'documentCount', key: 'documentCount', width: 120 },
        {
        title: 'Hành động',
        key: 'action',
        width: 250,
        render: (_: any, record: category.Record) => (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                const updated = categories.filter((item) => item.categoryId !== record.categoryId);
                updateCategories(updated);
                }}
            >
                Xoá
            </Button>
            <Button
                style={{ marginLeft: 8 }}
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
            title={`Danh sách tài liệu thuộc danh mục: ${selectedCategory?.categoryName}`}
        >
            <CategoryDetail categoryId={selectedCategory?.categoryId ?? ''} />
        </Modal>
        </>
    );
};

export default IndexCategory;
