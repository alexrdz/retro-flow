import { Link } from "react-router-dom"
import styles from "./AppLayout.module.css"
interface AppLayoutProps {
    children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
    return <div data-container className={styles['app-container']}>
      <header className={styles['app-header']} data-cluster="justify:between align:center">
        <div>
          <h1 className={styles['app-header-title']}>Retro Flow</h1>
          <p className={styles['app-header-subtitle']}>AI Powered Retrospectives</p>
        </div>
        <div data-cluster="gap:sm">
          <Link to="/">Home</Link>
        </div>

      </header>
      <main>
        {children}
      </main>
      <footer className={styles['app-footer']}>footer</footer>
    </div>
}
