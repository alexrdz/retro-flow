import { useNavigate } from "react-router-dom"
import { createSession } from "../../services/session-service"

export default function AddSessionForm() {
    const navigate = useNavigate()

    async function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
          const session = await createSession()
          console.log(session)
          navigate(`/session/${session.id}`)
        } catch (error) {
          console.error(error)
        }
    }

    return (
        <form onSubmit={onFormSubmit}>
            <button type="submit">Create a new Retro Session</button>
        </form>
    )
}
