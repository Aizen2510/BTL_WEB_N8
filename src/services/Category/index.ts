import axios from 'axios';

export const getDataCategory = async () => {
	const res = await axios.get('https://randomapi.com');
	return res;
};
