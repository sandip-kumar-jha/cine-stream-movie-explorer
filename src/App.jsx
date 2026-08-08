import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

import FavoritesProvider from "./context/FavoritesContext";


function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>

        <div className="app">

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/favorites"
              element={<Favorites />}
            />

          </Routes>

        </div>

      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;