import axios from 'axios';

export const getCategory = async () => {
	const res = await axios.get('http://localhost:3000/api/categories');
	return res;
	
};
