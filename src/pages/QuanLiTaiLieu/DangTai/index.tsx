// DocumentManager.tsx
import type { IColumn } from '@/components/Table/typing';
import { Button, Modal, Table, Input } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormDoc from './Form';
import { DownloadOutlined } from '@ant-design/icons';

const DocumentManager = () => {
  const { data, visible, setVisible, row, setRow, isEdit, setIsEdit, setData, getDoc, searchText, removeDocument, setSearchText, filteredData } = useModel('documentManager');

  useEffect(() => {
    getDoc();
  }, []);

  const handleDelete = (record: Document.Record) => {
    removeDocument(record.id);
  };

  const columns: IColumn<Document.Record>[] = [
    { title: 'Tên Tài Liệu', dataIndex: 'title', key: 'title', width: 150 },
    { title: 'Danh Mục', dataIndex: 'categoryName', key: 'categoryName', width: 100 },
    { title: 'Người Đăng', dataIndex: 'uploaderName', key: 'uploaderName', width: 120 },
    { title: 'Mô Tả', dataIndex: 'description', key: 'description', width: 250 },
    { title: 'Ngày Đăng', dataIndex: 'uploadDate', key: 'uploadDate', width: 150 },
    { title: 'Lượt Tải', dataIndex: 'downloadCount', key: 'downloadCount', width: 50 },
    {
      title: 'Hành Động',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <div>
          <Button onClick={() => { setVisible(true); setRow(record); setIsEdit(true); }}>Sửa</Button>
          <Button style={{ marginLeft: 10 }} danger onClick={() => handleDelete(record)}>Xóa</Button>
        </div>
      ),
    },
    {
      title: 'File',
      dataIndex: 'fileUrl',
      key: 'fileUrl',
      align: 'center',
      width: 120,
      render: (text, record) => {
        const filePath = record.fileUrl?.replace('http://localhost:3000/uploads/', '') || '';
        return record.fileUrl ? (
          <a href={`http://localhost:3000/download/${encodeURIComponent(filePath)}`}>
            <Button icon={<DownloadOutlined />} />
          </a>
        ) : 'Chưa có file';
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Button type="primary" onClick={() => { setVisible(true); setIsEdit(false); setRow(undefined); }}>Thêm Tài Liệu</Button>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Input.Search
          placeholder="Tìm kiếm tên, người đăng, mô tả"
          allowClear
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Table rowKey="id" columns={columns} dataSource={filteredData.filter(doc => doc.isApproved === 'approved')} pagination={{ pageSize: 5 }} />
      <Modal destroyOnClose footer={false} title={isEdit ? 'Chỉnh Sửa Tài Liệu' : 'Thêm Tài Liệu'} visible={visible} onCancel={() => setVisible(false)}>
        <FormDoc />
      </Modal>
    </div>
  );
};

export default DocumentManager;