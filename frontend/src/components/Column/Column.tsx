import styles from "./Column.module.css";
import AddCardForm from "../AddCardForm/AddCardForm";
import { useState, useEffect } from "react";
import type { Card, Column as ColumnType } from "../../types";

interface ColumnProps {
  children: React.ReactNode;
  column: ColumnType;
  onCardAdded: (newCard: Omit<Card, 'id'>) => Promise<Card>;
  sessionId: string;
}

export default function Column({children, column, onCardAdded, sessionId}: ColumnProps) {
  const [cardAdded, setCardAdded] = useState(false)

  function onCardCreated() {
    setCardAdded(true)
  }

  useEffect(() => {
    if(cardAdded) {
      setTimeout(() => {
        setCardAdded(false)
      }, 1000)
    }
  }, [cardAdded])

  return (
      <div className={styles.column} data-container data-stack="gap:sm">
        {cardAdded && <p className={styles['card-added']}>✅ Card added!</p>}
        <h2 data-cluster="gap:sm align:center">
          <span className={`column-indicator`} style={{ backgroundColor: `var(${column.color})` }}></span>
          {column.name}
        </h2>
        <AddCardForm
          columnId={column.id}
          onCardCreated={onCardCreated}
          onCardAdded={onCardAdded}
          sessionId={sessionId} />
        {children}
      </div>
  )
}
