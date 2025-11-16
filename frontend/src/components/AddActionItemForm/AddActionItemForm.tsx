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
            {...register('title', {
              required: 'Title is required',
              maxLength: {
                value: 200,
                message: 'Title must be 200 characters or less',
              },
              validate: {
                notEmpty: (value) => value.trim().length > 0 || 'Title is required',
              }
            })}
            placeholder="What needs to be done?"
            maxLength={200}
          />
          {errors.title && <p className={styles['error-message']}>{errors.title.message}</p>}
        </div>


        {showFullForm && (
          <>
            <div className={styles['form-field']}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                {...register('description', {
                  maxLength: {
                    value: 500,
                    message: 'Description must be 500 characters or less',
                  }
                }
              )}
                placeholder="Additional details..."
                rows={3}
                maxLength={500}
              />
            </div>

            <div className={styles['form-field']}>
              <label htmlFor="assignedTo">Assigned To</label>
              <input
                id="assignedTo"
                type="text"
                {...register('assignedTo', {
                  maxLength: {
                    value: 100,
                    message: 'Assigned To must be 100 characters or less',
                  }
                }
              )}
                placeholder="Who will do this?"
                maxLength={100}
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
