import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    gold: "#C9A843",
    bg: "#0D0C0A",
  },
  fonts: {
    heading: "'Cormorant Garamond', serif",
    body: "'Inter', sans-serif",
  },
  styles: {
    global: {
      "html, body": {
        bg: "#0D0C0A",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        WebkitFontSmoothing: "antialiased",
      },
      "*::selection": {
        bg: "rgba(201, 168, 67, 0.3)",
      },
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default theme;
