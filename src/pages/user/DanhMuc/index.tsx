import { Button, Modal, Table, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CategoryDetail from './more';
import type { IColumn } from '@/components/Table/typing';
import { HomeOutlined, FileSearchOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './index.less';
import FormThongTinNguoiDung from '@/components/FormThongtinnguoidung';
import NoticeIcon from '@/components/RightContent/NoticeIcon';
import useUserNotification from '@/models/userNotification';

const IndexCategory = () => {
    const {
        filteredCategories,
        setCategories: updateCategories,
        categoryVisible,
        setCategoryVisible,
        categoryIsEdit,
        setCategoryIsEdit,
        categoryRow,
        setCategoryRow,
        getCategories,
        searchText,
        setSearchText,
    } = useModel('documentCategoryModel');

    const { notifications, unread, markAllAsRead, markOneAsRead } = useUserNotification();

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
                style={{ marginLeft: 8 }}
                onClick={() => {
                setCategoryRow(record);
                setCategoryIsEdit(true);
                setCategoryVisible(true);
                }}
            >
                Sửa
            </Button>
            <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                setCategoryRow(record);
                setCategoryIsEdit(false);
                setCategoryVisible(true);
                }}
            >
                Xem chi tiết
            </Button>
            </div>
        ),
        },
    ];

    const handleNotificationClick = (id: string, type: string) => {
        window.location.href = `/user/TaiLieu?id=${id}&type=${type}`;
    };

    return (
        <>
            <div className={styles.headerMenu}>
                <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{fontWeight: 600 }}>Trang chủ</Button>
                <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
                <Button type="link" icon={<FileSearchOutlined />} href="/user/DanhMuc" style={{ fontWeight: 600 }}>Danh mục</Button>
                <Button type="link" icon={<UploadOutlined />} href="/user/ThaoTacTaiLieu" style={{ fontWeight: 600 }}>Thao tác tài liệu</Button>
                <div style={{marginLeft: 840, display: 'flex', alignItems: 'center', gap: 10}}>
                    
                    <NoticeIcon
                        count={unread}
                        onClear={markAllAsRead}
                        list={notifications}
                        title="Thông báo"
                        emptyText="Bạn đã xem tất cả thông báo"
                        showClear={!!unread}
                        showViewMore={false}
                    />
                    <FormThongTinNguoiDung/>
                </div>
            </div>
            <div style={{ marginTop: 16, marginLeft: 25 }}>
                <Input.Search
                    placeholder="Tìm kiếm tên hoặc mô tả danh mục"
                    allowClear
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                />
            </div>
        <Table
            rowKey="id"
                dataSource={filteredCategories}
            columns={columns}
                style={{ marginTop: 16,marginLeft: 25 }}
            pagination={{ pageSize: 5 }}
        />

        <Modal
            visible={categoryVisible}
            footer={null}
            onCancel={() => setCategoryVisible(false)}
            width={800}
            destroyOnClose
                title={`Danh sách tài liệu thuộc danh mục: ${categoryRow?.categoryName}`}
        >
                <CategoryDetail categoryId={categoryRow?.categoryId ?? ''} />
        </Modal>
        </>
    );
};

export default IndexCategory;
