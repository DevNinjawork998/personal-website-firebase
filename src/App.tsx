import { Suspense, lazy } from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import theme from "./theme";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactMeSection from "./components/ContactMeSection";
import Footer from "./components/Footer";

const GoldField = lazy(() => import("./components/GoldField"));

function App() {
  const reducedMotion = useReducedMotion();

  return (
    <ChakraProvider theme={theme}>
      <MotionConfig reducedMotion="user">
        {!reducedMotion && (
          <Suspense fallback={null}>
            <GoldField />
          </Suspense>
        )}
        <Box as="main" position="relative" zIndex={1}>
          <Header />
          <LandingSection />
          <AboutSection />
          <ProjectsSection />
          <ContactMeSection />
          <Footer />
        </Box>
      </MotionConfig>
    </ChakraProvider>
  );
}

export default App;
