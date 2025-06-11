import type { IColumn } from '@/components/Table/typing';
import { Button, Modal, Table, Input, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import {
  DownloadOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  approveDocument,
  rejectDocument,
  deleteDocument,
} from '@/services/documentService'; // ✅ Gọi API

const { Option } = Select;

const DocumentApproval = () => {
    const {
        data,
        getDoc,
        searchText,
        setSearchText,
        filteredData,
    } = useModel('documentManager');

    const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        getDoc();
    }, []);

    const handleApprove = async (record: Document.Record, status: 'approved' | 'rejected') => {
        try {
        if (status === 'approved') {
            await approveDocument(record.id); // ✅ Gọi API duyệt
        } else {
            await rejectDocument(record.id); // ✅ Gọi API từ chối
        }
        message.success(`${status === 'approved' ? 'Duyệt' : 'Từ chối'} thành công`);
        getDoc(); // refresh lại dữ liệu
        } catch {
        message.error('Có lỗi xảy ra khi cập nhật trạng thái');
        }
    };

    const handleApproveAll = async () => {
        try {
        const pendingDocs = data.filter(
            (doc: Document.Record) => selectedRowKeys.includes(doc.id) && doc.isApproved === 'pending'
        );

        await Promise.all(pendingDocs.map((doc) => approveDocument(doc.id))); // ✅ Duyệt hàng loạt
        message.success('Duyệt tất cả thành công');
        setSelectedRowKeys([]);
        getDoc();
        } catch {
        message.error('Lỗi khi duyệt hàng loạt');
        }
    };

    const handleDelete = async (record: Document.Record) => {
        try {
        await deleteDocument(record.id); // ✅ Gọi API xóa
        message.success('Xóa tài liệu thành công');
        getDoc();
        } catch {
        message.error('Lỗi khi xóa tài liệu');
        }
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
        render: (text, record) => {
        const filePath = record.fileUrl
            ? record.fileUrl.replace('http://localhost:3000/uploads/', '')
            : '';
            return record.fileUrl ? (
            <a
                href={`http://localhost:3000/download/${encodeURIComponent(filePath)}`}
            >
                <Button icon={<DownloadOutlined />} />
            </a>
            ) : (
            'Chưa có file'
            );
        },
        },
        {
        title: 'Hành Động',
        width: 280,
        align: 'center',
        render: (_, record) => (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {record.isApproved === 'pending' && (
                <>
                <Button type="primary" onClick={() => handleApprove(record, 'approved')}>
                    <CheckSquareOutlined />
                </Button>
                <Button danger onClick={() => handleApprove(record, 'rejected')}>
                    <CloseSquareOutlined />
                </Button>
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
        disabled: record.isApproved !== 'pending', // chỉ chọn nếu chờ duyệt
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

export default DocumentApproval;
