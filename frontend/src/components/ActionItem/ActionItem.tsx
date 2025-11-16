import type { ActionItem } from "../../types"
import styles from "./ActionItem.module.css"

interface ActionItemProps {
    actionItem: ActionItem
    onStatusChange: (id: number, newStatus: 'pending' | 'in_progress' | 'completed') => void
    onDelete: (id: number) => void
}

export default function ActionItem({ actionItem, onStatusChange, onDelete }: ActionItemProps) {
  const { id, title, description, assignedTo, status } = actionItem

  function handleStatusClick() {
      const statusCycle = {
        'pending': 'in_progress' as const,
        'in_progress': 'completed' as const,
        'completed': 'pending' as const,
      }
      onStatusChange(id, statusCycle[status])
    }

    const statusDisplay = {
      'pending': { emoji: '⏳', text: 'Pending', color: 'var(--gray-6)' },
      'in_progress': { emoji: '🚀', text: 'In Progress', color: 'var(--blue-6)' },
      'completed': { emoji: '✅', text: 'Completed', color: 'var(--green-6)' },
    }

    const currentStatus = statusDisplay[status]

    return (
    <div className={styles['action-item']}>
      <div className={styles['action-item-content']}>
        <h3>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {assignedTo && (
          <p className={styles.assignee}>
            <span>👤</span> {assignedTo}
          </p>
        )}
      </div>

      <footer className={styles['action-item-footer']} data-cluster="gap:sm align:center justify:space-between">
        <button
            className={styles['status-badge']}
            onClick={handleStatusClick}
            style={{ backgroundColor: currentStatus.color }}
            title="Click to change status"
          >
            {currentStatus.emoji} {currentStatus.text}
          </button>

          <button
            className={styles['delete-button']}
            onClick={() => onDelete(id)}
            aria-label="Delete action item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
      </footer>
    </div>)
}
