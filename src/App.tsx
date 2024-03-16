import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactMeSection from "./components/ContactMeSection";
import Footer from "./components/Footer";
import { AlertProvider } from "./context/alertContext";
import Alert from "./components/Alert";

import ReactGA from "react-ga4";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

//GA Trackingomen
const Tracking_ID = "7642102574";
//test mode enable true for using test case.
ReactGA.initialize(Tracking_ID, { testMode: true });
ReactGA.ga(window.location.pathname);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBe1gjMZfYjaekoHeYy9RRQnx4XcltT1Is",
  authDomain: "personalwebsite-7a718.firebaseapp.com",
  projectId: "personalwebsite-7a718",
  storageBucket: "personalwebsite-7a718.appspot.com",
  messagingSenderId: "711296515869",
  appId: "1:711296515869:web:9735e5f38a8271bc09abf4",
  measurementId: "G-2C32FHBMDR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);

function App() {
  return (
    <ChakraProvider>
      <AlertProvider>
        <main>
          <Header />
          <LandingSection />
          <ProjectsSection />
          <ContactMeSection />
          <Footer />
          <Alert />
        </main>
      </AlertProvider>
    </ChakraProvider>
  );
}

export default App;
