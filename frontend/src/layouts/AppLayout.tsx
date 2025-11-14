import styles from "./AppLayout.module.css"

interface AppLayoutProps {
    children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
    return <>
      <header className={styles['app-header']}>header</header>
      <main>
        {children}
      </main>
      <footer className={styles['app-footer']}>footer</footer>
    </>
}
