function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="error-message">
      <div className="error-icon">
        ⚠️
      </div>

      <h3>Unable to load movies</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="retry-button"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;