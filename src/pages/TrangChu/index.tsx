import { Card } from 'antd';

import { useModel } from 'umi';

const TrangChu = () => {
	const { data } = useModel('randomuser');

	return (
		<Card bodyStyle={{ height: '100%' }}>
			<div className='home-welcome'>
				<div>
					<b>{data.length} users</b>
				</div>
				<h1 className='title'>có cái lôn</h1>
			</div>
		</Card>
	);
};

export default TrangChu;