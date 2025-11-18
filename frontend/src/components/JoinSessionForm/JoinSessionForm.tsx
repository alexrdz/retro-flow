import {useForm } from 'react-hook-form';
import { setUserPreferences } from '../../utils/user';
import { joinSession } from '../../services/session-service';
import { useNavigate } from 'react-router-dom';

interface JoinSessionFormData {
  username: string;
  sessionId: string;
  sessionShowName: boolean;
}

export default function JoinSessionForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<JoinSessionFormData>()

  async function onSubmit(data: JoinSessionFormData) {
    try {
      const username = data.username?.trim() || null;
      const sessionId = data.sessionId;
      const sessionShowName = data.sessionShowName;

      setUserPreferences({ username, showUsername: sessionShowName });

      const session = await joinSession(sessionId, username || null);
      if (session) {
        navigate(`/session/${sessionId}`);
      }
    } catch (error) {
      console.error(error)
    }
  }

    return (
      <form onSubmit={handleSubmit(onSubmit)} data-stack="gap:sm" className="session-form">
        <p>Join an existing session</p>
        <input
          type="text"
          placeholder='username'
          className={errors.username ? 'error' : ''}
          {...register('username', { required: 'Username is required' })}
        />
        {errors.username && <p className="error-message">{errors.username.message}</p>}
        <input
          type="text"
          placeholder='session id'
          className={errors.sessionId ? 'error' : ''}
          {...register('sessionId', { required: 'Session ID is required' })}
        />
        {errors.sessionId && <p className="error-message">{errors.sessionId.message}</p>}
        <label htmlFor="sessionShowName" data-cluster="align:center">
          <input type="checkbox" id="sessionShowName" {...register('sessionShowName')} />
          Show my name on cards
        </label>
        <button>Join</button>
      </form>
    );
}
