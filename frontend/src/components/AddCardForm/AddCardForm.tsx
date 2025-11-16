import { useForm } from "react-hook-form"
import type { CardFormData, Card } from "../../types"
import styles from "./AddCardForm.module.css"
import { useState } from "react"
interface AddCardFormProps {
  columnId: number
  onCardCreated: () => void
  onCardAdded: (newCard: Omit<Card, 'id' | 'createdAt'>) => Promise<Card>
  sessionId: string
}

export default function AddCardForm({columnId, onCardCreated, onCardAdded, sessionId}: AddCardFormProps) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CardFormData>()

  async function onFormSubmit(data: CardFormData) {
    const newCard: Omit<Card, 'id' | 'createdAt'> = {
      sessionId: sessionId,
      content: data.content,
      columnId: columnId,
      position: 1,
    }

    try {
      setLoading(true)
      const createdCard = await onCardAdded(newCard)

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
          <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Card'}</button>
      </form>
  )
}
