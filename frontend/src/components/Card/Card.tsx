import type { Card } from "../../types";
import styles from "./Card.module.css";
import { mapColumnTypeToText } from "../../utils";

export default function Card(props: Card) {
  const { id, sessionId, content, columnType, position, createdAt } = props
  const columnTypeText = mapColumnTypeToText(columnType)
  const cardClasses = `${styles.card} ${styles[columnType]}`
  return (
    <div className={cardClasses}>
      <article>
        <p>{content}</p>
      </article>

      <footer className="card-footer">
        this is the card footer
        <p className="pill">{columnTypeText}</p>
      </footer>
    </div>
  )
}
