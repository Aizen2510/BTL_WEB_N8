import { useState } from 'react';

export default () => {
	const [data, setData] = useState<UserManagement.User[]>([]);
	const [search, setSearch] = useState<string>(''); // ✅ State tìm kiếm

	const getDataUserManagement = async () => {
		const dataLocal: UserManagement.User[] = JSON.parse(localStorage.getItem('users') || '[]');
        // Sửa lỗi so sánh kiểu: ép kiểu user.role về string trước khi so sánh
        const filteredUsers = dataLocal.filter((user) => String(user.role) !== 'admin');

        // ✅ Lọc theo từ khóa tìm kiếm
        const searchValue = search.trim().toLowerCase();
        const searchResult = filteredUsers.filter((user) =>
            user.username.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue)
        );

        // ✅ Không cần cập nhật active ở đây, đã làm khi login rồi
        setData(search ? searchResult : filteredUsers);
            };

	return {
		data,
		setData,
		getDataUserManagement,
		search,
		setSearch,
	};
};