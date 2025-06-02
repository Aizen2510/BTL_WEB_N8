import { useState, useEffect } from 'react';
import { getDataDoc } from '@/services/DocumentManaget';
import { useModel } from 'umi';

// Lấy dữ liệu localStorage an toàn
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

	export default function useDocumentModel() {
	const [data, setDataState] = useState<Document.Record[]>([]);
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [row, setRow] = useState<Document.Record | undefined>();
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [searchText, setSearchText] = useState('');

	// Lấy categories từ model category
	const { categories } = useModel('documentCategoryModel');

	// Map categoryName vào document theo categoryId
	const mapCategoryNameToDocs = (
		docs: Document.Record[],
		cats: category.Record[],
	) => {
		return docs.map((doc) => {
		const cat = cats.find((c) => c.categoryId === doc.categoryId);
		return {
			...doc,
			categoryName: cat ? cat.categoryName : '',
		};
		});
	};

	const getDoc = async () => {
		try {
		const response = await getDataDoc();
		if (response && Array.isArray(response.data)) {
			const mappedData = mapCategoryNameToDocs(response.data, categories);
			setDataState(mappedData);
			localStorage.setItem('data', JSON.stringify(mappedData));
			return;
		}
		throw new Error('Dữ liệu API không hợp lệ');
		} catch (error) {
		console.warn('Lỗi API, fallback sang localStorage:', error);
		const dataLocal = safeGetLocalData('data') || [];
		const mappedData = mapCategoryNameToDocs(dataLocal, categories);
		setDataState(mappedData);
		}
	};

	const saveData = (newData: Document.Record[]) => {
		const mappedData = mapCategoryNameToDocs(newData, categories);
		setDataState(mappedData);
		localStorage.setItem('data', JSON.stringify(mappedData));
	};

	// Cập nhật document khi categories thay đổi
	useEffect(() => {
		if (data.length > 0 && categories.length > 0) {
		const updatedData = mapCategoryNameToDocs(data, categories);
		setDataState(updatedData);
		}
	}, [categories]);

	const handleApprove = () => {
		const updated = data.map((item) =>
		selectedRowKeys.includes(item.id) && item.isApproved === 'pending'
			? { ...item, isApproved: 'approved' as 'approved' }
			: item,
		);
		saveData(updated);
		setSelectedRowKeys([]);
	};

	const filteredData = data.filter((item) =>
		[item.title, item.uploaderName, item.description].some((field) =>
		field?.toLowerCase().includes(searchText.toLowerCase()),
		),
	);

	useEffect(() => {
		getDoc();
	}, []);

	return {
		data,
		setData: saveData,
		visible,
		setVisible,
		row,
		setRow,
		isEdit,
		setIsEdit,
		getDoc,
		selectedRowKeys,
		setSelectedRowKeys,
		searchText,
		setSearchText,
		handleApprove,
		filteredData,
	};
}
