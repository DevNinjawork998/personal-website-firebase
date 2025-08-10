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
        <Box
          w="300px"
          h="300px"
          borderRadius="50%"
          overflow="hidden"
          boxShadow="2xl"
          border="4px solid white"
        >
          <Image
            src={profilePic}
            alt="Jack's profile picture"
            w="100%"
            h="100%"
            objectFit="cover"
            objectPosition="center"
          />
        </Box>
        <VStack spacing={4} textAlign="center" color="white">
          <Heading size="2xl" mb={4}>
            {greeting}
          </Heading>
          <VStack spacing={4}>
            <Heading size="xl">{bio1}</Heading>
            <Heading size="xl">{bio2}</Heading>
            <Text fontSize="lg">{Location}</Text>
            <Text fontSize="lg">Age: {currentage}</Text>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  </FullScreenSection>
);

export default LandingSection;
