interface ErrorBannerProps {
  operationError: string | null
  setOperationError: (error: string | null) => void
}
export default function ErrorBanner({ operationError, setOperationError }: ErrorBannerProps) {
  return (
    <div className="error-banner animated-fade-in" data-cluster="align:center justify:between">
      <div><strong>Error:</strong> {operationError}</div>
      <button onClick={() => setOperationError(null)}>✕</button>
    </div>
  )
}
