import { Button, Modal, Table, Avatar, Tag, Input, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import type { IColumn } from '@/components/Table/typing';

const UserManagement = () => {
	const {data,getDataUserManagement,search,setSearch,} = useModel('usermanagement');

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
		},
		{
			title: 'Số Lượng Tải lên',
			dataIndex: 'uploadCount',
			width: 100,
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
			render: (record) => (
				<>
					<Button
						style={{ alignItems: 'center'}}
						danger
						onClick={() => {
							const dataLocal = JSON.parse(localStorage.getItem('users') || '[]');
							const newData = dataLocal.filter((item: UserManagement.User) => item.id !== record.id);
							localStorage.setItem('users', JSON.stringify(newData));
							getDataUserManagement();
						}}
					>
						Xóa Người Dùng
					</Button>
				</>
			),
		},
	];

	return (
		<div>
            <div>
                <h1>QUẢN LÍ NGƯỜI DÙNG</h1>
            </div>
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

export default UserManagement;
