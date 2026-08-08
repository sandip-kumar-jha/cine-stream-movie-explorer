import { NavLink } from "react-router-dom";

import {
  useFavorites,
} from "../context/FavoritesContext";

function Navbar() {
  const {
    favorites,
  } = useFavorites();

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}

        <NavLink
          to="/"
          className="logo"
        >
          CineStream
        </NavLink>

        {/* Navigation */}

        <nav className="nav-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive
                ? "nav-link active favorites-nav-link"
                : "nav-link favorites-nav-link"
            }
          >
            <span>
              ♡
            </span>

            <span>
              Favorites
            </span>

            {favorites.length > 0 && (
              <span className="favorites-count">
                {favorites.length}
              </span>
            )}

          </NavLink>

        </nav>

      </div>
    </header>
  );
}

export default Navbar;