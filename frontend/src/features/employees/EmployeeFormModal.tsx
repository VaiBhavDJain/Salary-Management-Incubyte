import { App, AutoComplete, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd'
import { ApiError } from '../../api/client'
import type { FilterOptions } from '../filterOptions/useFilterOptions'
import type { Employee, EmployeeInput } from './types'
import { useSaveEmployee } from './useEmployeeMutations'

const LABELS: Record<keyof EmployeeInput, string> = {
  full_name: 'Full name',
  email: 'Email',
  job_title: 'Job title',
  department: 'Department',
  country_code: 'Country',
  salary: 'Salary',
}

const required = (what: string) => ({ required: true, whitespace: true, message: `Please enter the ${what}` })

const suggestions = (values: string[] = []) => ({
  options: values.map((value) => ({ value })),
  showSearch: {
    filterOption: (input: string, option?: { value: string }) => !!option?.value.toLowerCase().includes(input.toLowerCase()),
  },
})

interface Props {
  employee?: Employee
  options?: FilterOptions
  onClose: () => void
}

export default function EmployeeFormModal({ employee, options, onClose }: Props) {
  const [form] = Form.useForm<EmployeeInput>()
  const { message } = App.useApp()
  const save = useSaveEmployee()
  const countryCode = Form.useWatch('country_code', form)
  const currency = options?.countries.find((country) => country.code === countryCode)?.currency
  const title = employee ? 'Edit employee' : 'Add employee'

  const submit = async (input: EmployeeInput) => {
    try {
      await save.mutateAsync({ id: employee?.id, input })
      message.success(employee ? 'Changes saved' : 'Employee added')
      onClose()
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 422) {
        message.error('Could not save the employee. Please try again.')
        return
      }
      form.setFields(
        Object.entries(error.fieldErrors).map(([field, messages]) => ({
          name: field as keyof EmployeeInput,
          errors: messages.map((text) => `${LABELS[field as keyof EmployeeInput] ?? field} ${text}`),
        })),
      )
    }
  }

  return (
    <Modal
      open
      title={title}
      okText={employee ? 'Save changes' : 'Add employee'}
      confirmLoading={save.isPending}
      onOk={form.submit}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical" initialValues={employee} onFinish={submit} requiredMark={false}>
        <Form.Item name="full_name" label={LABELS.full_name} rules={[required('full name')]}>
          <Input autoFocus />
        </Form.Item>
        <Form.Item
          name="email"
          label={LABELS.email}
          rules={[required('email'), { type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input />
        </Form.Item>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="job_title" label={LABELS.job_title} rules={[required('job title')]}>
              <AutoComplete {...suggestions(options?.job_titles)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="department" label={LABELS.department} rules={[required('department')]}>
              <AutoComplete {...suggestions(options?.departments)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="country_code" label={LABELS.country_code} rules={[{ required: true, message: 'Please choose a country' }]}>
              <Select
                showSearch={{ optionFilterProp: 'label' }}
                options={options?.countries.map((country) => ({ value: country.code, label: country.name }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="salary"
              label={LABELS.salary}
              rules={[
                { required: true, message: 'Please enter the salary' },
                { type: 'number', min: 0.01, message: 'Salary must be greater than 0' },
              ]}
            >
              <InputNumber<number>
                prefix={currency}
                min={0}
                precision={2}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/,/g, '') as unknown as number}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
