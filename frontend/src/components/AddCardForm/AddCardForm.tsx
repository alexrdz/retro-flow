import { useForm } from "react-hook-form"
import type { CardFormData, ColumnType, Card } from "../../types"
import styles from "./AddCardForm.module.css"
import { createCard } from "../../services/card-service"
import { useState } from "react"

interface AddCardFormProps {
    columnType: ColumnType
    onCardCreated: () => void
}

export default function AddCardForm({columnType, onCardCreated}: AddCardFormProps) {
  const [loading, setLoading] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CardFormData>()

    async function onFormSubmit(data: CardFormData) {
      const newCard: Omit<Card, 'id'> = {
        sessionId: "1",
        content: data.content,
        columnType: columnType,
        position: 1,
        createdAt: new Date().toISOString()
      }

      try {
        setLoading(true)
        const createdCard = await createCard(newCard)

        if(createdCard.id) {
          onCardCreated()
          reset()
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }


    return (
        <form className={styles['add-card-form']} onSubmit={handleSubmit(onFormSubmit)} data-stack="gap:sm">
            <textarea
              className={styles.textarea + " " + (errors.content ? styles.error : '')}
              {...register('content', { required: 'Content is required', maxLength: 280 })}
              placeholder="Add a card..."
            />
            {errors.content && <p>{errors.content.message}</p>}
            <button type="submit" disabled={loading}>Add Card</button>
        </form>
    )
}
