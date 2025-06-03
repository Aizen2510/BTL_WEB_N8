import React, { useEffect, useRef } from 'react';
import { Button } from 'antd';
import {
  BarChartOutlined,
  HomeOutlined,
  FileSearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import ThongbaoPopover from '@/components/Thongbao';
import DocumentTableSection from './DocumentTableSection';
import { useModel } from 'umi';

const DocumentList: React.FC = () => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const { documents } = useModel('ThaoTacTaiLieu');
  const prevDocumentsRef = useRef<any[]>([]);

  function diffDocuments(prev: any[], curr: any[]) {
    const changes: any[] = [];
    const prevMap = new Map(prev.map(doc => [doc.id, doc]));
    const currMap = new Map(curr.map(doc => [doc.id, doc]));
    curr.forEach(doc => {
      if (!prevMap.has(doc.id)) {
        changes.push({ id: doc.id, type: 'add', title: doc.title, date: doc.uploadDate });
      }
    });
    prev.forEach(doc => {
      if (!currMap.has(doc.id)) {
        changes.push({ id: doc.id, type: 'delete', title: doc.title, date: doc.uploadDate });
      }
    });
    curr.forEach(doc => {
      const prevDoc = prevMap.get(doc.id);
      if (prevDoc && JSON.stringify(doc) !== JSON.stringify(prevDoc)) {
        changes.push({ id: doc.id, type: 'edit', title: doc.title, date: doc.uploadDate });
      }
    });
    return changes;
  }

  React.useEffect(() => {
    const prevDocs = prevDocumentsRef.current;
    const changes = diffDocuments(prevDocs, documents);
    if (changes.length > 0) {
      setNotifications(prev => {
        const merged = [...changes.reverse(), ...prev].slice(0, 6);
        const unique = [];
        const seen = new Set();
        for (const n of merged) {
          const key = n.id + n.type + n.date;
          if (!seen.has(key)) {
            unique.push(n);
            seen.add(key);
          }
        }
        return unique.slice(0, 6);
      });
    }
    prevDocumentsRef.current = documents;
  }, [documents]);

  const handleNotificationClick = (id: string, type: string) => {
    window.location.href = `/user/TaiLieu?id=${id}&type=${type}`;
  };

  return (
    <div>
      {/* Sticky Header */}
      <div className="stickyHeader" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="headerMenu" style={{ display: 'flex', gap: 16 }}>
          <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{ fontWeight: 600 }}>Trang chủ</Button>
          <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
          <Button type="link" icon={<BarChartOutlined />} href="/user/ThongKe" style={{ fontWeight: 600 }}>Thống kê</Button>
          <Button type="link" icon={<UploadOutlined />} href="/user/ThaoTacTaiLieu" style={{ color: '#1890ff', fontWeight: 600 }}>Thao tác tài liệu</Button>
        </div>
        <div className="headerRight" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ThongbaoPopover
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            handleNotificationClick={handleNotificationClick}
          />
          <div className="avatar" onClick={() => window.location.href = '/login'} title="Đăng nhập" style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '1px solid #e6e6e6', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.2s' }}>
            <img src={require('@/assets/admin.png')} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
      {/* End Sticky Header */}
      <DocumentTableSection />
    </div>
  );
};

export default DocumentList;
