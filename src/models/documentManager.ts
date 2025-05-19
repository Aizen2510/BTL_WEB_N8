import { useState } from 'react';
import { getDataDoc } from '@/services/DocumentManaget';

const SAMPLE_DATA = [
	{
		id: '1',
		title: 'Ngân Hàng Đề Thi Cấu Trúc Dữ Liệu Và Giải Thuật',
		uploaderName: 'Nguyễn Văn Anh',
		description: 'Một Số Câu Hỏi Sẽ Có Trong Đề Thi',
		uploadDate: '2025-05-01',
		downloadCount: 10,
		isApproved: 'approved',
	},

	];

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

	export default () => {
	const [data, setData] = useState<Document.Record[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<Document.Record | undefined>();

	const getDoc = async () => {
		let dataLocal = safeGetLocalData('data');
		if (!dataLocal) {
		// Lần đầu chưa có dữ liệu thì lưu dữ liệu mẫu cứng vào localStorage
		localStorage.setItem('data', JSON.stringify(SAMPLE_DATA));
		dataLocal = SAMPLE_DATA;
		}
		setData(dataLocal);
	};

	return {
		data,
		visible,
		setVisible,
		row,
		setRow,
		isEdit,
		setIsEdit,
		setData,
		getDoc,
	};
};
