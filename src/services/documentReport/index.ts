import axios from 'axios';

export const getDataReport = async (filter?: DocumentReport.ExportFilter) => {
	const params = { ...filter };
	const res = await axios.get('/api/document/report', { params });
	return res.data;
};
