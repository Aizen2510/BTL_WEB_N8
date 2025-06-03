import React from 'react';
import { Popover } from 'antd';
import { BellOutlined } from '@ant-design/icons';

export interface NotificationItem {
  id: string;
  type: 'add' | 'edit' | 'delete';
  title: string;
  date: string;
}

interface ThongbaoPopoverProps {
  notifications: NotificationItem[];
  showNotifications: boolean;
  setShowNotifications: (v: boolean) => void;
  handleNotificationClick: (id: string, type: string) => void;
}

const ThongbaoPopover: React.FC<ThongbaoPopoverProps> = ({
  notifications,
  showNotifications,
  setShowNotifications,
  handleNotificationClick,
}) => {
  const notificationContent = (
    <div style={{ minWidth: 350 }}>
      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', padding: 16 }}>Không có thông báo mới</div>
      ) : (
        notifications.map((n, idx) => {
          let color = '#52c41a';
          let label = 'Thêm mới';
          if (n.type === 'edit') { color = '#faad14'; label = 'Chỉnh sửa'; }
          if (n.type === 'delete') { color = '#ff4d4f'; label = 'Xóa'; }
          return (
            <div
              key={n.id + n.type + n.date + idx}
              onClick={() => handleNotificationClick(n.id, n.type)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: 8, cursor: 'pointer',
                borderBottom: idx !== notifications.length - 1 ? '1px solid #f0f0f0' : undefined,
                background: '#fff',
                transition: 'background 0.2s',
                borderLeft: `4px solid ${color}`,
              }}
            >
              <BellOutlined style={{ color, fontSize: 18 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 500, color }}>{label}: </span>
                <span style={{ fontWeight: 500 }}>{n.title}</span>
                <div style={{ fontSize: 12, color: '#888' }}>{n.date}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      title="Thông báo"
      trigger="click"
      visible={showNotifications}
      onVisibleChange={setShowNotifications}
      placement="bottomRight"
    >
      <div style={{ cursor: 'pointer', marginRight: 16 }}>
        <BellOutlined style={{ fontSize: 22, color: '#faad14' }} />
      </div>
    </Popover>
  );
};

export default ThongbaoPopover;
