import axios from 'axios';

export const getDataDoc = async () => {
	const res = await axios.get('http://localhost:3000/api/documents');
	return res;
};
