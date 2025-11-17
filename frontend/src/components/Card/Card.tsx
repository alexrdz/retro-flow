import type { Card } from "../../types"
import { getUsername } from "../../utils/user"
import styles from "./Card.module.css"
import { useRef, useEffect } from "react"
interface CardProps {
  card: Card
  removeCard: (id: string) => void
  updateCard: (updated: Card) => void
}

export default function Card({card, removeCard, updateCard}: CardProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { id, content, createdBy } = card

  useEffect(() => {
    if (contentRef.current && contentRef.current.textContent !== content) {
      contentRef.current.textContent = content;
    }
  }, [content]);

  const handleBlur = () => {
    const text = contentRef.current?.textContent ?? '';
    const sanitized = text.trim().slice(0, 500)

    if (sanitized !== content && sanitized.length > 0) {
      updateCard({ ...card, content: text });
    } else if (sanitized.length === 0) {
      if (contentRef.current) {
        contentRef.current.textContent = content
      }
    }
  };


  return (
    <div className={styles.card}>
      <article>
        <div
          contentEditable={getUsername() === card.createdBy}
          ref={contentRef}
          className={styles['card-textarea']}
          onBlur={handleBlur}
          />
      </article>

      <footer className="card-footer" data-cluster="gap:sm align:center justify:space-between">
        {createdBy && (
          <span className={styles['created-by']}>
            👤 {createdBy}
          </span>
        )}
        <div data-cluster="align:center">
          {getUsername() === card.createdBy ?

          <button className={styles['card-footer-button']} onClick={() => removeCard(String(id))}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">delete</span>
          </button>
          : null}
        </div>
      </footer>
    </div>
  )
}
