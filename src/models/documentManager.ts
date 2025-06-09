// 📁 src/models/documentManager.ts
import { useState, useEffect } from 'react';
import { getDataDoc } from '@/services/DocumentManaget';
import { useModel } from 'umi';

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
	const [searchText, setSearchText] = useState('');

	const { categories } = useModel('documentCategoryModel');

	const mapCategoryNameToDocs = (docs: Document.Record[], cats: category.Record[]) => {
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

	useEffect(() => {
		if (data.length > 0 && categories.length > 0) {
		const updatedData = mapCategoryNameToDocs(data, categories);
		setDataState(updatedData);
		}
	}, [categories]);


	const filteredData = data.filter((item) =>
		[item.title, item.uploaderName, item.description].some((field) =>
		field?.toLowerCase().includes(searchText.toLowerCase())
		)
	);

	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
	const myDocuments = filteredData.filter(
		(item) =>
			item.uploaderId === currentUser.id ||
			item.uploaderName === currentUser.username // tuỳ theo bạn lưu id hay username
	);

	const approvedDocuments = myDocuments.filter(doc => doc.isApproved === 'approved');

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
		searchText,
		setSearchText,
		filteredData,
		myDocuments,
		approvedDocuments,
	};
}