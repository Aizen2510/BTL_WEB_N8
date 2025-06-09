import React, { useEffect, useRef } from 'react';
import {Table,Button,Space,Input,Modal,message,Popconfirm,Typography,Tag,Row,Col,Select,Form,} from 'antd';
import {useState } from 'react';
import {EditOutlined,DeleteOutlined,EyeOutlined,PlusOutlined,SearchOutlined,BarChartOutlined,HomeOutlined,FileSearchOutlined,UploadOutlined,BellOutlined,DownloadOutlined,} from '@ant-design/icons';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';
import { useModel, useHistory } from 'umi';
import FormDocUser from './Form';
import FormThongTinNguoiDung from '@/components/FormThongtinnguoidung';
import type { IColumn } from '@/components/Table/typing';
import styles from './index.less';
import { notifyDocumentApproved, notifyDocumentRejected } from '@/utils/notification';
import NoticeIcon from '@/components/RightContent/NoticeIcon';
import useUserNotification from '@/models/userNotification';

const { Option } = Select;
const DocumentList: React.FC = () => {
  const history = useHistory();
  const {data,visible,setVisible,row,setRow,isEdit,setIsEdit,setData,getDoc,searchText,setSearchText,filteredData,} = useModel('documentManager');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const { notifications, unread, markAllAsRead } = useUserNotification();

  useEffect(() => {
    getDoc();
  }, []);

  const handleApprove = (record: Document.Record, status: 'approved' | 'rejected') => {
    const updated = data.map((doc: Document.Record) =>
      doc.id === record.id ? { ...doc, isApproved: status } : doc
    );
    localStorage.setItem('data', JSON.stringify(updated));
    
    // Gửi thông báo cho người đăng tài liệu
    if (status === 'approved') {
      notifyDocumentApproved(record.uploaderId, record.title);
    } else {
      notifyDocumentRejected(record.uploaderId, record.title);
    }
    
    getDoc();
  };

  const columns: IColumn<Document.Record>[] = [
    { title: 'Tên Tài Liệu', dataIndex: 'title', key: 'title', width: 150 },
    {
      title: 'Danh Mục',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 100,
      render: (categoryId: string) => {
        const cats = JSON.parse(localStorage.getItem('categories') || '[]');
        const found = cats.find((cat: any) => cat.categoryId === categoryId || cat.id === categoryId);
        return found ? (found.categoryName || found.name) : categoryId;
      }
    },
    { title: 'Mô Tả', dataIndex: 'description', key: 'description', width: 250 },
    { title: 'Ngày Đăng', dataIndex: 'uploadDate', key: 'uploadDate', width: 150 },
    {
      title: 'Trạng Thái',
      dataIndex: 'isApproved',
      key: 'isApproved',
      align: 'center',
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
      align: 'center',
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' ,justifyContent: 'center'}}>
          <Button onClick={() => {
            setVisible(true);
            setRow(record);
            setIsEdit(true);
          }}>
            Sửa
          </Button>
        </div>
      ),
    },
  ];

  const myDocuments = filteredData.filter(
    (item) => item.uploaderName === currentUser.username
  );

  // Click notification: chuyển hướng đến TaiLieu với id/type
  const handleNotificationClick = (id: string, type: string) => {
    window.location.href = `/user/TaiLieu?id=${id}&type=${type}`;
  };

  return (
    <div>
      {/* Sticky Header */}
      <div className={styles.headerMenu}>
        <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{fontWeight: 600 }}>Trang chủ</Button>
        <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
        <Button type="link" icon={<FileSearchOutlined />} href="/user/DanhMuc" style={{ fontWeight: 600 }}>Danh mục</Button>
        <Button type="link" icon={<UploadOutlined />} href="/user/ThaoTacTaiLieu" style={{ fontWeight: 600 }}>Thao tác tài liệu</Button>
        <div style={{marginLeft: 820, display: 'flex', alignItems: 'center'}}>       
          <NoticeIcon
            style={{margin: 100}}
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
      {/* End Sticky Header */}
      
      <div style={{ marginBottom: 15,marginTop: 15,padding: 25 , display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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
        style={{ margin: 25}}
        rowKey="id"
        columns={columns}
        dataSource={myDocuments}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? 'Chỉnh Sửa Tài Liệu' : 'Thêm Tài Liệu'}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <FormDocUser/>
      </Modal>
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

export default DocumentList;