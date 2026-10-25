import { Spin } from 'antd'
import styles from './PageLoader.module.css'

export default function PageLoader() {
  return (
    <div className={styles.loader}>
      <Spin size="large" />
    </div>
  )
}
