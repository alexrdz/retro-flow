import { useNavigate } from "react-router-dom"
import { createSession } from "../../services/session-service"
import { useForm } from "react-hook-form"
import { setUserPreferences } from "../../utils/user";

interface AddSessionFormData {
  username: string;
  showName: boolean;
}

export default function AddSessionForm() {
    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<AddSessionFormData>()

    async function onFormSubmit(data: AddSessionFormData) {
        try {
          const username = data.username?.trim();
          const showName = data.showName;
          setUserPreferences({ username, showUsername: showName });

          const session = await createSession(username);

          navigate(`/session/${session.id}`);
        } catch (error) {
          console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} data-stack="gap:sm" className="session-form">
          <p>
            Start a new retro session
          </p>
          <input type="text" placeholder='username' {...register('username', { required: 'Username is required' })} />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
          <label htmlFor="showName" data-cluster="align:center">
            <input type="checkbox" id="showName" {...register('showName')} />
            Show my name on cards
          </label>
          <button type="submit">Start</button>
        </form>
    )
}
