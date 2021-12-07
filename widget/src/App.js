import { useState, StrictMode } from "react";
import { Link } from "react-router-dom";
import ThemeContext from "./ThemeContext";


const App = () => {
  const theme = useState("darkblue");
  return (
    <StrictMode>
      <ThemeContext.Provider value={theme}>
        <div>
          <header>
            <Link to="/">Adopt Me!</Link>
          </header>
        </div>
      </ThemeContext.Provider>
    </StrictMode>
  );
};

export default App;