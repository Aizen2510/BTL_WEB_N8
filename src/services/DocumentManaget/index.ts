import axios from 'axios';

export const getDataDocum = async () => {
	const res = await axios.get('http://localhost:3000/api/documents');
	return res;
};
