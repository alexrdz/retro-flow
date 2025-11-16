import styles from "./AppLayout.module.css"
interface AppLayoutProps {
    children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
    return <div data-container className={styles['app-container']}>
      <header className={styles['app-header']}>
        <h1 className={styles['app-header-title']}>Retro Flow</h1>
        <p className={styles['app-header-subtitle']}>AI Powered Retrospectives</p>

      </header>
      <main>
        {children}
      </main>
      <footer className={styles['app-footer']}>footer</footer>
    </div>
}
