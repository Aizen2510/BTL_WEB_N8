import axios from 'axios';

export const userdata = async () => {
	const res = await axios.get('http://localhost:3000/api/users');
	return res;
};
