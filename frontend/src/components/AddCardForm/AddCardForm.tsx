import { useForm } from "react-hook-form";
import type { CardFormData, Card } from "../../types";
import styles from "./AddCardForm.module.css";
import { useState } from "react";
import { getUsername, shouldShowUsername } from "../../utils/user";
interface AddCardFormProps {
  columnId: number;
  onCardCreated: () => void;
  onCardAdded: (newCard: Omit<Card, 'id' | 'createdAt'>) => Promise<Card>;
  sessionId: string;
}

export default function AddCardForm({columnId, onCardCreated, onCardAdded, sessionId}: AddCardFormProps) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CardFormData>()

  async function onFormSubmit(data: CardFormData) {
    const username = getUsername() || null;
    const createdBy = (shouldShowUsername() && username) ? username : undefined;

    const newCard: Omit<Card, 'id' | 'createdAt'> = {
      sessionId: sessionId,
      content: data.content,
      columnId: columnId,
      position: 1,
      createdBy,
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
            {...register('content', {
              required: 'Content is required',
              maxLength: { value: 280, message: 'Content must be at most 280 characters' },
              validate: {
                notEmpty: (value) => value.trim().length > 0 || 'Content is required',
              }
            })}
            placeholder="Add a card..."
            maxLength={500}
          />
          {errors.content && <p className={styles['error-message']}>{errors.content.message}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Card'}</button>
      </form>
  )
}
