import type { IColumn } from '@/components/Table/typing';
import { Button, Modal, Table, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { DownloadOutlined, CheckSquareOutlined, CloseSquareOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const DocumentApproval = () => {
    const {data,visible,setVisible,row,setRow,isEdit,setIsEdit,setData,getDoc,searchText,setSearchText,filteredData,} = useModel('documentManager');

    const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        getDoc();
    }, []);

    const handleApprove = (record: Document.Record, status: 'approved' | 'rejected') => {
        const updated = data.map((doc: Document.Record) =>
        doc.id === record.id ? { ...doc, isApproved: status } : doc
        );
        localStorage.setItem('data', JSON.stringify(updated));
        getDoc();
    };

    // Duyệt tất cả các tài liệu được chọn
    const handleApproveAll = () => {
        const updated = data.map((doc: Document.Record) =>
            selectedRowKeys.includes(doc.id) && doc.isApproved === 'pending'
                ? { ...doc, isApproved: 'approved' }
                : doc
        );
        localStorage.setItem('data', JSON.stringify(updated));
        setSelectedRowKeys([]);
        getDoc();
    };

    // Xóa tài liệu
    const handleDelete = (record: Document.Record) => {
        const updated = data.filter((doc: Document.Record) => doc.id !== record.id);
        localStorage.setItem('data', JSON.stringify(updated));
        getDoc();
    };

    const columns: IColumn<Document.Record>[] = [
        { title: 'Tên Tài Liệu', dataIndex: 'title', key: 'title', width: 150 },
        { title: 'Danh Mục', dataIndex: 'categoryName', key: 'categoryName', width: 120 },
        { title: 'Người Đăng', dataIndex: 'uploaderName', key: 'uploaderName', width: 120 },
        { title: 'Mô Tả', dataIndex: 'description', key: 'description', width: 250 },
        { title: 'Ngày Đăng', dataIndex: 'uploadDate', key: 'uploadDate', width: 150 },
        {
        title: 'Trạng Thái',
        dataIndex: 'isApproved',
        key: 'isApproved',
        width: 120,
        render: (value) => {
            if (value === 'approved') return <span style={{ color: 'green' }}>Đã duyệt</span>;
            if (value === 'rejected') return <span style={{ color: 'red' }}>Từ chối</span>;
            return <span style={{ color: 'orange' }}>Chờ duyệt</span>;
        },
        },
        {
        title: 'File',
        dataIndex: 'fileUrl',
        key: 'fileUrl',
        width: 120,
        render: (_, record) =>
            record.fileUrl ? (
            <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" download>
                <Button icon={<DownloadOutlined />}>Tải file</Button>
            </a>
            ) : (
            'Chưa có file'
            ),
        },
        {
        title: 'Hành Động',
        width: 280,
        align: 'center',
        render: (_, record) => (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' , justifyContent: 'center'}}>
            {record.isApproved === 'pending' && (
                <>
                <Button type="primary" onClick={() => handleApprove(record, 'approved')}><CheckSquareOutlined /></Button>
                <Button danger onClick={() => handleApprove(record, 'rejected')}><CloseSquareOutlined /></Button>
                </>
            )}
            <Button danger onClick={() => handleDelete(record)}>
                <DeleteOutlined />
            </Button>
            </div>
        ),
        },
    ];

    const filteredByStatus = filteredData.filter(
        (item) => statusFilter === 'all' || item.isApproved === statusFilter
    );

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => setSelectedRowKeys(selectedKeys),
        getCheckboxProps: (record: Document.Record) => ({
            disabled: record.isApproved !== 'pending', // chỉ cho chọn tài liệu chờ duyệt
        }),
    };

    return (
        <div>
        <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button
            type="primary"
            onClick={handleApproveAll}
            disabled={selectedRowKeys.length === 0}
            >
            Duyệt tất cả
            </Button>
            <Input.Search
            placeholder="Tìm kiếm tên, người đăng, mô tả"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
            value={statusFilter}
            style={{ width: 160 }}
            onChange={(val) => setStatusFilter(val)}
            >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="approved">Đã duyệt</Option>
            <Option value="rejected">Từ chối</Option>
            </Select>
        </div>

        <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredByStatus}
            rowSelection={rowSelection}
            pagination={{ pageSize: 5 }}
        />
        </div>
    );
    };

    const safeGetLocalData = (key: string) => {
    try {
        const json = localStorage.getItem(key);
        if (!json) return null;
        const data = JSON.parse(json);
        if (Array.isArray(data)) return data;
        return null;
    } catch (error) {
        console.error('Lỗi parse JSON localStorage:', error);
        return null;
    }
};

export default DocumentApproval;
