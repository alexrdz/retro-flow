import AddSessionForm from "../AddSessionForm/AddSessionForm";
import styles from './Home.module.css'
import JoinSessionForm from "../JoinSessionForm/JoinSessionForm";

export default function Home() {
    return <section className={styles.home} data-stack="gap:md align:center">


      <div className={styles['split-container']}>
        <AddSessionForm />
        <JoinSessionForm />
      </div>
    </section>
}
