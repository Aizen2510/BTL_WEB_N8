import { useState } from 'react';
import { getAllUsers } from '@/services/Auth';

// Tài khoản admin mặc định
const ADMIN_USER: UserManagement.User = {
	id: 'admin-001',
	username: 'admin',
	email: 'admin@example.com',
	password: 'admin123',
	role: 'admin',
	enabled: true,
	status: 'active',
	downloadCount: 0,
	uploadCount: 0
};

// Tính thống kê tài liệu của người dùng
const getUserStats = (username: string) => {
	try {
		const rawData = localStorage.getItem('data') || '[]';
		const allDocs = JSON.parse(rawData);

		const userDocs = allDocs.filter((doc: any) => doc.uploaderName === username);

		const totalDownloads = userDocs.reduce((total: number, doc: any) => {
			return total + (doc.downloads || doc.downloadCount || 0);
		}, 0);

		return {
			uploadCount: userDocs.length,
			downloadCount: totalDownloads
		};
	} catch (error) {
		console.error('Lỗi khi lấy thống kê người dùng:', error);
		return { uploadCount: 0, downloadCount: 0 };
	}
};

export default () => {
	const [data, setData] = useState<UserManagement.User[]>([]);
	const [row, setRow] = useState<UserManagement.User>();
	const [search, setSearch] = useState<string>('');

	const getDataUserManagement = async () => {
		let dataLocal: UserManagement.User[] = [];

		try {
			// Lấy dữ liệu từ API
			const res = await getAllUsers();
			dataLocal = res || [];

			// Lưu vào localStorage (tuỳ chọn)
			localStorage.setItem('users', JSON.stringify(dataLocal));
		} catch (error) {
			console.error('Lỗi khi gọi API người dùng:', error);
			dataLocal = JSON.parse(localStorage.getItem('users') || '[]');
		}

		const adminExists = dataLocal.some(user => user.email === ADMIN_USER.email);
		if (!adminExists) {
			dataLocal = [ADMIN_USER, ...dataLocal];
			localStorage.setItem('users', JSON.stringify(dataLocal));
		}

		dataLocal = dataLocal.map(user => {
			if (user.role === 'admin') return user;
			const stats = getUserStats(user.username);
			return {
				...user,
				uploadCount: stats.uploadCount,
				downloadCount: stats.downloadCount
			};
		});

		const filteredUsers = dataLocal.filter(user => user.role !== 'admin');
		const searchValue = search.trim().toLowerCase();
		const searchResult = filteredUsers.filter(user =>
			user.username.toLowerCase().includes(searchValue) ||
			user.email.toLowerCase().includes(searchValue)
		);

		setData(search ? searchResult : filteredUsers);
	};

	return {
		data,
		row,
		setData,
		getDataUserManagement,
		search,
		setSearch,
	};
};
