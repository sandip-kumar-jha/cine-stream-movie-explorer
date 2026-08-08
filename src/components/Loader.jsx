function Loader({
  text = "Loading movies...",
}) {
  return (
    <div className="loader">
      <div className="loader-spinner"></div>

      <p>{text}</p>
    </div>
  );
}

export default Loader;