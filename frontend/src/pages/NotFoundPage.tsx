import { Button, Result } from 'antd'
import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="The page you are looking for does not exist."
      extra={<Link to="/employees"><Button type="primary">Go to employees</Button></Link>}
    />
  )
}
