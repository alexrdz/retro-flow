import type { Card } from "../../types";
import styles from "./Card.module.css";
import { mapColumnTypeToText } from "../../utils";

interface CardProps {
  card: Card
  removeCard: (id: string) => void
}

export default function Card({card, removeCard}: CardProps) {
  const { id, content, columnType } = card
  const columnTypeText = mapColumnTypeToText(columnType)
  const cardClasses = `${styles.card} ${styles[columnType]}`
  return (
    <div className={cardClasses}>
      <article>
        <p>{content}</p>
      </article>

      <footer className="card-footer" data-cluster="gap:sm align:center justify:space-between">
        <span className="pill">{columnTypeText}</span>
        <div data-cluster="align:center">
          <button className={styles['card-footer-button']}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            <span className="sr-only">edit</span>
            </button>
          <button className={styles['card-footer-button']} onClick={() => removeCard(String(id))}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">delete</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
