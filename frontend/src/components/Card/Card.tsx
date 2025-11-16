import type { Card } from "../../types"
import styles from "./Card.module.css"
import { useState, useRef, useEffect } from "react"
interface CardProps {
  card: Card
  removeCard: (id: string) => void
  updateCard: (updated: Card) => void
}

export default function Card({card, removeCard, updateCard}: CardProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { id, content } = card

  useEffect(() => {
    if (contentRef.current && contentRef.current.textContent !== content) {
      contentRef.current.textContent = content;
    }
  }, [content]);

  const handleBlur = () => {
    const text = contentRef.current?.textContent ?? '';
    if (text !== content) {
      updateCard({ ...card, content: text });
    }
  };


  return (
    <div className={styles.card}>
      <article>
        <div
          contentEditable
          ref={contentRef}
          className={styles['card-textarea']}
          onBlur={handleBlur}
          />
      </article>

      <footer className="card-footer" data-cluster="gap:sm align:center justify:space-between">
        <div data-cluster="align:center">
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
