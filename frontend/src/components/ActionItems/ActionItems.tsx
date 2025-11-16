import type { ActionItem as ActionItemType, ActionItemFormData } from "../../types"
import ActionItem from "../ActionItem/ActionItem"
import AddActionItemForm from "../AddActionItemForm/AddActionItemForm"
import styles from "./ActionItems.module.css"

interface ActionItemsProps {
    actionItems: ActionItemType[]
    onAdd: (data: ActionItemFormData) => Promise<void>
    onStatusChange: (id: number, newStatus: 'pending'
  | 'in_progress' | 'completed') => Promise<void>
    onDelete: (id: number) => Promise<void>
  }

export default function ActionItems({
    actionItems,
    onAdd,
    onStatusChange,
    onDelete
  }: ActionItemsProps) {

    // group action items by status
    const pending = actionItems.filter(item => item.status === 'pending')
    const inProgress = actionItems.filter(item => item.status === 'in_progress')
    const completed = actionItems.filter(item => item.status === 'completed')

    return (
      <section className={styles['action-items-section']}>
        <header className={styles.header}>
          <h2>Action Items ({actionItems.length})</h2>
          <p className={styles.subtitle}>Track decisions and next steps from your retro</p>
        </header>

        <AddActionItemForm onActionItemAdded={onAdd} />

        {actionItems.length === 0 ? (
          <p className={styles['empty-state']}>
            No action items yet. Add one above to track next steps!
          </p>
        ) : (
          <div className={styles['action-items-grid']}>
            {pending.length > 0 && (
              <div className={styles['status-group']}>
                <h3 className={styles['status-heading']}>
                  ⏳ Pending ({pending.length})
                </h3>
                <div className={styles['items-list']}>
                  {pending.map((item) => (
                    <ActionItem
                      key={item.id}
                      actionItem={item}
                      onStatusChange={onStatusChange}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {inProgress.length > 0 && (
              <div className={styles['status-group']}>
                <h3 className={styles['status-heading']}>
                  🚀 In Progress ({inProgress.length})
                </h3>
                <div className={styles['items-list']}>
                  {inProgress.map((item) => (
                    <ActionItem
                      key={item.id}
                      actionItem={item}
                      onStatusChange={onStatusChange}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {completed.length > 0 && (
              <div className={styles['status-group']}>
                <h3 className={styles['status-heading']}>
                  ✅ Completed ({completed.length})
                </h3>
                <div className={styles['items-list']}>
                  {completed.map((item) => (
                    <ActionItem
                      key={item.id}
                      actionItem={item}
                      onStatusChange={onStatusChange}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    )
}
