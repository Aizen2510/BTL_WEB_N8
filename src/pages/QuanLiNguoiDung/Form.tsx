import { Button, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

const FormUser = () => {
	const { data, getDataUserManagement, row, isEdit, setVisible } = useModel('usermanagement');

	return (
		<Form
			initialValues={row}
			onFinish={(values) => {
				const newUser = { ...values, id: row?.id || `${Date.now()}` };

				let updatedData: UserManagement.User[];

				if (isEdit) {
					const index = data.findIndex((item) => item.id === row?.id);
					updatedData = [...data];
					updatedData.splice(index, 1, newUser);
				} else {
					updatedData = [newUser, ...data];
				}

				localStorage.setItem('users', JSON.stringify(updatedData));
				setVisible(false);
				getDataUserManagement();
			}}
			layout="vertical"
		>
			<Form.Item
				label="Username"
				name="username"
				rules={[{ required: true, message: 'Please enter a username' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				label="Email"
				name="email"
				rules={[{ required: true, message: 'Please enter an email' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item label="Avatar URL" name="avatarUrl">
				<Input />
			</Form.Item>

			<Form.Item
				label="Download Count"
				name="downloadCount"
				rules={[{ required: true, message: 'Please enter download count' }]}
			>
				<Input type="number" />
			</Form.Item>

			<Form.Item
				label="Upload Count"
				name="uloadCount"
				rules={[{ required: true, message: 'Please enter upload count' }]}
			>
				<Input type="number" />
			</Form.Item>

			<Form.Item
				label="Status"
				name="status"
				rules={[{ required: true, message: 'Please select status' }]}
			>
				<Select options={[
					{ label: 'Hoạt động', value: 'active' },
					{ label: 'Không hoạt động', value: 'inactive' },
				]} />
			</Form.Item>

			<div className="form-footer">
				<Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
					{isEdit ? 'Save' : 'Insert'}
				</Button>
				<Button onClick={() => setVisible(false)}>Cancel</Button>
			</div>
		</Form>
	);
};

export default FormUser;
