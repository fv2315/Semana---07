
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState("claro");

  function alternarTema() {
    setTema((actual) => (actual === "claro" ? "oscuro" : "claro"));
  }

  return (
    <ThemeContext.Provider
      value={{
        tema,
        alternarTema,
      }}
    >
      <div className={tema === "oscuro" ? "dark-mode" : ""}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const contexto = useContext(ThemeContext);

  if (!contexto) {
    throw new Error("useTheme debe utilizarse dentro de ThemeProvider.");
  }

  return contexto;
}
