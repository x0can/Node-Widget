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
            <Link to="/">Shopify shop</Link>
          </header>
        </div>
      </ThemeContext.Provider>
    </StrictMode>
  );
};

export default App;