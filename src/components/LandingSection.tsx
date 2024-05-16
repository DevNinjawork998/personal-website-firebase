import { Heading, Text, VStack, Image, Box } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import profilePic from "../images/IMG_2796.png";

// Introduction message for Full Scereen Section
const greeting = "Hello, I am Jack!";
const bio1 = "Aspiring Software Engineer at bp Malaysia";
const bio2 =
  "Core Specilisation in React.js, Next.js, TypeScript, ASP.Net, Azure Cloud,  Graphql";
const Location = "Location: Kuala Lumpur, Malaysian";

// function for getting current age
var currentage = new Date().getFullYear() - 1998;

const LandingSection = () => (
  <FullScreenSection
    justifyContent="center"
    alignItems="center"
    isDarkBackground
    backgroundColor="rgba(0,0,0,0.5)"
    backgroundImage
  >
    <Box>
      <VStack spacing={8} paddingLeft="2rem" paddingRight="2rem">
        <div className="profile-picture">
          <Image
            src={profilePic}
            style={{
              width: "440px",
              height: "450px",
              borderRadius: "100%",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          />
        </div>
        <div
          className="Description"
          style={{
            textAlign: "center",
          }}
        >
          <Heading
            size="2xl"
            style={{
              paddingBottom: "2rem",
            }}
          >
            {greeting}
          </Heading>
          <VStack spacing={4} paddingBottom={4}>
            <Heading size="xl">{bio1}</Heading>
            <Heading size="xl">{bio2}</Heading>
            <Text size="sm">{Location}</Text>
            <Text size="sm">Age: {currentage}</Text>
          </VStack>
        </div>
      </VStack>
    </Box>
  </FullScreenSection>
);

export default LandingSection;
