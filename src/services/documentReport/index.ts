import axios from 'axios';

export const getDataReport = async () => {
	const res = await axios.get('https://randomapi.com');
	return res;
};
