import axios from 'axios';

export const getCategory = async () => {
	const res = await axios.get('https://randomapi.com');
	return res;
};
