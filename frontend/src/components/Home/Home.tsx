import AddSessionForm from "../AddSessionForm/AddSessionForm";
import styles from './Home.module.css'

export default function Home() {
    return <div className={styles.home} data-stack="gap:md" data-center="center:children center:text">
      <p>
        Start a new retro session for your team. <br /> No accounts needed.
      </p>
      <AddSessionForm />
    </div>
}
