import axios from 'axios';

export const getDataUser = async () => {
	const res = await axios.get('https://randomapi.com');
	return res;
};
