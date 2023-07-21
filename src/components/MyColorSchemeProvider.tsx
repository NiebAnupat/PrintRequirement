import React, { useState } from "react";
import { ColorSchemeProvider, ColorScheme } from "@mantine/core";

interface props {
  children: React.ReactNode;
}
export const MyColorSchemeProvider = ({ children }: props) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      {children}
    </ColorSchemeProvider>
  );
};
