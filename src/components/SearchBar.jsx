function SearchBar({
  value,
  onChange,
  onClear,
}) {
  return (
    <div className="search-bar">

      <span
        className="search-icon"
        aria-hidden="true"
      >
        🔍
      </span>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder="Search movies..."
        aria-label="Search movies"
      />

      {value && (
        <button
          type="button"
          className="clear-search"
          onClick={onClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}

    </div>
  );
}

export default SearchBar;