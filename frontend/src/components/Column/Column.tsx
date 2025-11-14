import styles from "./Column.module.css"
import AddCardForm from "../AddCardForm/AddCardForm"
import { mapColumnTypeToText } from "../../utils";
import { ColumnType } from "../../types";
import { useState, useEffect } from "react";

interface ColumnProps {
    children: React.ReactNode;
    title: ColumnType;
}

export default function Column({children, title}: ColumnProps) {
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
      // fetchCards()
    }
  }, [cardAdded])

  return (
      <div className={styles.column} data-container data-stack="gap:sm">
        {cardAdded && <p>✅ Card added!</p>}
        <h2>{columnTitle}</h2>
        <AddCardForm columnType={title} onCardCreated={onCardCreated} />
        {children}
      </div>
  )
}
