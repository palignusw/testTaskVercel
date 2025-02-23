import { useEffect } from 'react'
import { Form, Input, Button, InputNumber, Switch, message, Card } from 'antd'
import {
	UserOutlined,
	FileTextOutlined,
	TagOutlined,
	DollarOutlined,
	CalendarOutlined,
	BellOutlined,
	LockOutlined,
	SendOutlined,
	TeamOutlined,
} from '@ant-design/icons'

interface Rules {
	budget_from: number
	budget_to: number
	deadline_days: number
	qty_freelancers: number
}

interface TaskForm {
	title: string
	description: string
	tags: string
	budget_from: number
	budget_to: number
	deadline: number
	reminds: number
	all_auto_responses: boolean
	private_content: string | null
	rules: Rules | null
	token: string
}

export default function LeadCaptureForm() {
	const [form] = Form.useForm()

	useEffect(() => {
		const savedToken = localStorage.getItem('api_token')
		if (savedToken) {
			form.setFieldsValue({ token: savedToken })
		}
	}, [])

	const handleSubmit = async (values: TaskForm) => {
		const formattedValues = {
			...values,
			rules: values.all_auto_responses ? null : values.rules,
		}

		const apiUrl = `https://deadlinetaskbot.productlove.ru/api/v1/tasks/client/newhardtask?token=${formattedValues.token}&title=${encodeURIComponent(
			formattedValues.title
		)}&description=${encodeURIComponent(
			formattedValues.description
		)}&tags=${encodeURIComponent(
			formattedValues.tags
		)}&budget_from=${formattedValues.budget_from}&budget_to=${
			formattedValues.budget_to
		}&deadline=${formattedValues.deadline}&reminds=${
			formattedValues.reminds
		}&all_auto_responses=${formattedValues.all_auto_responses}&private_content=${encodeURIComponent(
			formattedValues.private_content || ''
		)}&rules=${
			formattedValues.rules
				? encodeURIComponent(JSON.stringify(formattedValues.rules))
				: 'null'
		}`

		try {
			const response = await fetch(apiUrl, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
				},
			})

			const result = await response.json()
			console.log('asd', result)

			if (response.ok) {
				form.resetFields()
				form.setFieldsValue({ token: formattedValues.token })
				alert('Задача успешно опубликована! 🎉')
			} else {
				alert('Ошибка публикации 😢')
			}
		} catch (error) {
			console.error('Ошибка запроса:', error)
		}
	}

	return (
		<div className='max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-2xl'>
			<Card
				title='🚀 Создание задачи'
				className='shadow-xl bg-white border border-gray-300 rounded-lg'
				headStyle={{
					background: 'linear-gradient(90deg, #4F46E5, #6366F1)',
					color: 'white',
					fontSize: '1.2rem',
					fontWeight: 'bold',
				}}
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={handleSubmit}
					initialValues={{
						all_auto_responses: false,
						rules: {
							budget_from: 0,
							budget_to: 0,
							deadline_days: 0,
							qty_freelancers: 1,
						},
					}}
				>
					<Form.Item
						label='🔑 API Токен'
						name='token'
						rules={[{ required: true, message: 'Введите токен' }]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							onChange={e => localStorage.setItem('api_token', e.target.value)}
							placeholder='Введите ваш API токен'
							className='border-blue-500'
						/>
					</Form.Item>

					<Form.Item
						label='📌 Название'
						name='title'
						rules={[{ required: true, message: 'Введите название' }]}
					>
						<Input
							prefix={<UserOutlined />}
							placeholder='Название задачи'
							className='border-blue-500'
						/>
					</Form.Item>

					<Form.Item
						label='📝 Описание'
						name='description'
						rules={[{ required: true, message: 'Введите описание' }]}
					>
						<Input.TextArea
							placeholder='Опишите задачу'
							className='border-blue-500'
						/>
					</Form.Item>

					<Form.Item
						label='🏷️ Теги (через запятую)'
						name='tags'
						rules={[{ required: true, message: 'Введите теги' }]}
					>
						<Input
							prefix={<TagOutlined />}
							placeholder='Например: дизайн, figma'
							className='border-blue-500'
						/>
					</Form.Item>

					<div className='grid grid-cols-2 gap-4'>
						<Form.Item
							label='💰 Бюджет от'
							name='budget_from'
							rules={[{ required: true, message: 'Введите бюджет' }]}
						>
							<InputNumber
								min={0}
								className='w-full border-blue-500'
								addonBefore={<DollarOutlined />}
							/>
						</Form.Item>
						<Form.Item
							label='💸 Бюджет до'
							name='budget_to'
							rules={[{ required: true, message: 'Введите бюджет' }]}
						>
							<InputNumber
								min={0}
								className='w-full border-blue-500'
								addonBefore={<DollarOutlined />}
							/>
						</Form.Item>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<Form.Item
							label='📅 Срок (дни)'
							name='deadline'
							rules={[{ required: true, message: 'Введите срок' }]}
						>
							<InputNumber
								min={1}
								className='w-full border-blue-500'
								addonBefore={<CalendarOutlined />}
							/>
						</Form.Item>
						<Form.Item
							label='🔔 Напоминания'
							name='reminds'
							rules={[{ required: true, message: 'Введите напоминания' }]}
						>
							<InputNumber
								min={0}
								className='w-full border-blue-500'
								addonBefore={<BellOutlined />}
							/>
						</Form.Item>
					</div>

					<Form.Item
						label='🤖 Автоответы'
						name='all_auto_responses'
						valuePropName='checked'
					>
						<Switch
							checkedChildren='Вкл'
							unCheckedChildren='Выкл'
							className='bg-blue-500'
						/>
					</Form.Item>

					<Form.Item shouldUpdate>
						{({ getFieldValue }) =>
							!getFieldValue('all_auto_responses') && (
								<div className='grid grid-cols-2 gap-4'>
									<Form.Item
										label='💰 Бюджет от (правила)'
										name={['rules', 'budget_from']}
									>
										<InputNumber
											min={0}
											className='w-full border-blue-500'
											addonBefore={<DollarOutlined />}
										/>
									</Form.Item>
									<Form.Item
										label='💸 Бюджет до (правила)'
										name={['rules', 'budget_to']}
									>
										<InputNumber
											min={0}
											className='w-full border-blue-500'
											addonBefore={<DollarOutlined />}
										/>
									</Form.Item>
									<Form.Item
										label='📅 Срок (правила)'
										name={['rules', 'deadline_days']}
									>
										<InputNumber
											min={1}
											className='w-full border-blue-500'
											addonBefore={<CalendarOutlined />}
										/>
									</Form.Item>
									<Form.Item
										label='👥 Кол-во фрилансеров'
										name={['rules', 'qty_freelancers']}
									>
										<InputNumber
											min={1}
											className='w-full border-blue-500'
											addonBefore={<TeamOutlined />}
										/>
									</Form.Item>
								</div>
							)
						}
					</Form.Item>

					<Form.Item>
						<Button
							type='primary'
							htmlType='submit'
							className='w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-lg transition-all duration-300'
						>
							<SendOutlined /> Опубликовать задачу
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	)
}
