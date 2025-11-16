import {useForm } from 'react-hook-form';
import styles from './JoinSessionForm.module.css';
import { setUsername } from '../../utils/user';
import { joinSession } from '../../services/session-service';
import { useNavigate } from 'react-router-dom';

interface JoinSessionFormData {
  username: string;
  sessionId: string;
}

export default function JoinSessionForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<JoinSessionFormData>()

  async function onSubmit(data: JoinSessionFormData) {
    try {
      const username = data.username;
      const sessionId = data.sessionId;

      setUsername(username);
      const session = await joinSession(sessionId, username);
      if (session) {
        navigate(`/session/${sessionId}`);
      }
    } catch (error) {
      console.error(error)
    }
  }

    return (
      <div className={styles['join-session-form']} data-center="center:text">
        <p>Join an existing session</p>
        <form onSubmit={handleSubmit(onSubmit)} data-cluster="align:center">
          <input type="text" placeholder='username' {...register('username')} />
          <input type="text" placeholder='session id' {...register('sessionId')} />
          <button>Join</button>
        </form>
      </div>
    );
}
