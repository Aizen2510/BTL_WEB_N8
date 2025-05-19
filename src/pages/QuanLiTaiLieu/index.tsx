import type { IColumn } from '@/components/Table/typing';
import { Button, Modal, Table } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormDoc from './Form';

const DocumentManager = () => {
  const { data, setData, visible, setVisible, row, setRow, isEdit, setIsEdit, getDoc } =
    useModel('documentManager');

  useEffect(() => {
    getDoc();
  }, []);

  const handleDelete = (record: Document.Record) => {
    const dataLocal = (() => {
      try {
        const json = localStorage.getItem('data');
        if (!json) return [];
        const arr = JSON.parse(json);
        if (Array.isArray(arr)) return arr;
        return [];
      } catch {
        return [];
      }
    })();

    const newData = dataLocal.filter((item: Document.Record) => item.id !== record.id);
    localStorage.setItem('data', JSON.stringify(newData));
    getDoc();
  };

  const columns: IColumn<Document.Record>[] = [
    { title: 'Tên Tài Liệu', dataIndex: 'title', key: 'title', width: 150 },
    { title: 'Người Đăng', dataIndex: 'uploaderName', key: 'uploaderName', width: 120 },
    { title: 'Mô Tả', dataIndex: 'description', key: 'description', width: 250 },
    { title: 'Ngày Đăng', dataIndex: 'uploadDate', key: 'uploadDate', width: 150 },
    { title: 'Lượt Tải', dataIndex: 'downloadCount', key: 'downloadCount', width: 50 },
    {
      title: 'Trạng Thái',
      dataIndex: 'isApproved',
      key: 'isApproved',
      width: 120,
      render: (value) => (value === 'approved' ? 'Đã Duyệt' : 'Chờ Duyệt'),
    },
    {
      title: 'Hành Động',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <div>
          <Button
            onClick={() => {
              setVisible(true);
              setRow(record);
              setIsEdit(true);
            }}
          >
            Sửa
          </Button>
          <Button style={{ marginLeft: 10 }} danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </div>
      ),
    },{
		
  title: 'File',
  dataIndex: 'fileUrl',
  key: 'fileUrl',
  width: 120,
  render: (text, record) => (
    record.fileUrl ? (
      <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" download>
        Xem/Tải file
      </a>
    ) : 'Chưa có file'
  ),
},

	
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
            setIsEdit(false);
            setRow(undefined);
          }}
        >
          Thêm Tài Liệu
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />

      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? 'Chỉnh Sửa Tài Liệu' : 'Thêm Tài Liệu'}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <FormDoc />
      </Modal>
    </div>
  );
};

export default DocumentManager;
