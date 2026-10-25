import { Layout, Menu } from 'antd'
import { Link, Outlet, useLocation } from 'react-router'
import styles from './AppLayout.module.css'

const NAV_ITEMS = [
  { key: '/employees', label: <Link to="/employees">Employees</Link> },
  { key: '/insights', label: <Link to="/insights">Pay insights</Link> },
]

export default function AppLayout() {
  const { pathname } = useLocation()
  const selectedKey = NAV_ITEMS.find(({ key }) => pathname.startsWith(key))?.key

  return (
    <Layout className={styles.layout}>
      <Layout.Header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.brand} aria-label="Salary Management">
            <img src="/favicon.svg" alt="" width={28} height={28} />
            <span className={styles.brandName}>Salary Management</span>
          </Link>
          <Menu mode="horizontal" items={NAV_ITEMS} selectedKeys={selectedKey ? [selectedKey] : []} className={styles.menu} />
        </div>
      </Layout.Header>
      <Layout.Content className={`${styles.container} ${styles.content}`}>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
