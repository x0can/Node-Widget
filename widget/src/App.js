import { useState, StrictMode } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import ThemeContext from "./ThemeContext";


const App = () => {
  const theme = useState("darkblue");
  return (
    <StrictMode>
      <ThemeContext.Provider value={theme}>
        <div>
          <header>
            <Link to="/">
              <Button image = {""} name = {"Eazzy Pay"}/>
            </Link>
          </header>
        </div>
      </ThemeContext.Provider>
    </StrictMode>
  );
};

export default App;