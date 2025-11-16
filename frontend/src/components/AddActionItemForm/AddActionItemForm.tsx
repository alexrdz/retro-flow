import { useForm } from "react-hook-form"
import type { ActionItemFormData } from "../../types"
import styles from "./AddActionItemForm.module.css"
import { useState } from "react"

interface AddActionItemFormProps {
  onActionItemAdded: (data: ActionItemFormData) => Promise<void>
}

export default function AddActionItemForm({onActionItemAdded }: AddActionItemFormProps) {
  const [loading, setLoading] = useState(false)
  const [showFullForm, setShowFullForm] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActionItemFormData>()

  async function onFormSubmit(data: ActionItemFormData) {
    try {
      setLoading(true)
      await onActionItemAdded(data)
      reset()
      setShowFullForm(false) // Collapse after adding
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

  return (
      <form className={styles['add-action-form']} onSubmit={handleSubmit(onFormSubmit)} data-stack="gap:sm">
        <div className={styles['form-field']}>
          <label htmlFor="title">Action Item *</label>
          <input
            id="title"
            type="text"
            className={errors.title ? styles.error : ''}
            {...register('title', { required: 'Title is required', maxLength: 200 })}
            placeholder="What needs to be done?"
          />
          {errors.title && <p className={styles['error-message']}>{errors.title.message}</p>}
        </div>


        {showFullForm && (
          <>
            <div className={styles['form-field']}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                {...register('description', { maxLength: 500 })}
                placeholder="Additional details..."
                rows={3}
              />
            </div>

            <div className={styles['form-field']}>
              <label htmlFor="assignedTo">Assigned To</label>
              <input
                id="assignedTo"
                type="text"
                {...register('assignedTo', { maxLength: 100 })}
                placeholder="Who will do this?"
              />
            </div>
          </>
        )}

        <button
            type="button"
            className={styles['toggle-button']}
            onClick={() => setShowFullForm(!showFullForm)}
          >
            {showFullForm ? '- Hide Details' : '+ Add details'}
          </button>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Action Item'}
        </button>
      </form>
  )
}
