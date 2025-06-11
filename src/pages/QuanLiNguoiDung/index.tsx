import { Button, Table, Avatar, Tag, Input, Space, message, Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import type { IColumn } from '@/components/Table/typing';

const UserManagementPage = () => {
	const { data, getDataUserManagement, search, setSearch } = useModel('usermanagement');

	useEffect(() => {
		getDataUserManagement();
	}, [search]);

	const columns: IColumn<UserManagement.User>[] = [
		{
			title: 'Avatar',
			dataIndex: 'avatarUrl',
			width: 80,
			render: (url) => <Avatar src={url} />,
		},
		{
			title: 'Tên người dùng',
			dataIndex: 'username',
			width: 150,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
		},
		{
			title: 'Số Lượng Tải xuống',
			dataIndex: 'downloadCount',
			width: 100,
			render: (count) => count || 0,
		},
		{
			title: 'Số Lượng Tải lên',
			dataIndex: 'uploadCount',
			width: 100,
			render: (count) => count || 0,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 120,
			render: (status) => (
				<Tag color={status === 'active' ? 'green' : 'red'}>
					{status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
				</Tag>
			),
		},
		{
			title: 'Thao tác',
			width: 180,
			render: (_, record) => (
			<Button
				danger
				onClick={() => {
				Modal.confirm({
					title: 'Xác nhận xoá',
					content: `Bạn có chắc chắn muốn xoá người dùng "${record.username}" không?`,
					okText: 'Xoá',
					okType: 'danger',
					cancelText: 'Huỷ',
					onOk: async () => {
					try {
						await fetch(`http://localhost:3000/api/users/${record.id}`, { method: 'DELETE' });
						message.success('Đã xoá người dùng thành công');
						getDataUserManagement();
					} catch (error) {
						message.error('Lỗi khi xoá người dùng');
						console.error(error);
					}
					},
				});
				}}
			>
				Xoá Người Dùng
			</Button>
			),
		},
	];

	return (
		<div>
			<h1>QUẢN LÝ NGƯỜI DÙNG</h1>
			<Space style={{ marginBottom: 16, width: '30%' }} direction="vertical">
				<Input.Search
					placeholder="Tìm kiếm theo tên hoặc email"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					enterButton
				/>
			</Space>

			<Table rowKey="id" dataSource={data} columns={columns} />
		</div>
	);
};

export default UserManagementPage;
