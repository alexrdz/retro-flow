import styles from './OnlineUsers.module.css';

interface OnlineUsersProps {
  onlineUsers: string[];
  readyUsers: string[];
  currentUser: string;
  onToggleReady: () => void;
  isReady: boolean;
}

export default function OnlineUsers({ onlineUsers, readyUsers, currentUser, onToggleReady, isReady }: OnlineUsersProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          online ({onlineUsers.length})
        </h3>
        <button
          onClick={onToggleReady}
          className={styles['toggle-button']}
        >
          {isReady ? 'still working' : "I'm Done"}
        </button>
      </div>

      <ul className={styles['user-list']}>
        {onlineUsers.map(user => {
          const isDone = readyUsers.includes(user);
          const isCurrentUser = user === currentUser;

          return (
            <li key={user} className={styles['user-item']}>
              <span
                className={`status-indicator ${isDone ? 'status-indicator--done' : 'status-indicator--hidden'}`}
                aria-label={isDone ? 'done' : 'working'}
              />
              <span className={`${styles['user-name']} ${isCurrentUser ? styles.currentUser : ''}`}>
                {user} {isCurrentUser && '(you)'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
