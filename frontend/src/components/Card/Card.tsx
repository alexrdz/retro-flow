import type { Card } from "../../types";
import styles from "./Card.module.css";

export default function Card(props: Card) {
  return (
    <div className={styles.card}>
      <article>
        <p>{props.content}</p>
      </article>

      <footer className="card-footer">
        this is the card footer
      </footer>
    </div>
  )
}
