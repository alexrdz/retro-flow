import styles from "./Column.module.css"
import AddCardForm from "../AddCardForm/AddCardForm"
import { mapColumnTypeToText } from "../../utils";
import { ColumnType } from "../../types";
import { useState, useEffect } from "react";
import type { Card } from "../../types";

interface ColumnProps {
    children: React.ReactNode;
    title: ColumnType;
    onCardAdded: (newCard: Card) => void;
}

export default function Column({children, title, onCardAdded}: ColumnProps) {
  const [cardAdded, setCardAdded] = useState(false)
  const columnTitle = mapColumnTypeToText(title)

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
        <h2 data-cluster="gap:sm align:center"> <span className={`column-indicator-${title}`}></span> {columnTitle}</h2>
        <AddCardForm columnType={title} onCardCreated={onCardCreated} onCardAdded={onCardAdded} />
        {children}
      </div>
  )
}
