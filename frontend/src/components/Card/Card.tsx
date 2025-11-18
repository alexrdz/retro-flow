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
      updateCard({ ...card, content: sanitized });
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
          <div className={styles['created-by']} data-cluster="align:center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles['created-by-icon']}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            {createdBy}
          </div>
        )}
        <div data-cluster="align:center" className={styles['card-footer-button-container']}>
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
  );
}
