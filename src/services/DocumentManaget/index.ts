import axios from 'axios';

export const getDataDoc = async () => {
	const res = await axios.get('https://randomapi.com');
	return res;
};
