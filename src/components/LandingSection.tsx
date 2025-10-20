import { Heading, Text, VStack, Image, Box, HStack, Badge, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import FullScreenSection from "./FullScreenSection";
import profilePic from "../images/IMG_2796.png";

// Introduction message for Full Screen Section
const greeting = "Hello, I am Jack!";
const bio1 = "Aspiring Software Engineer at bp Malaysia";
const Location = "Location: Kuala Lumpur, Malaysian";

// Skills array for interactive display
const skills = ["React.js", "Next.js", "TypeScript", "ASP.Net", "Azure Cloud", "GraphQL"];

// function for getting current age
var currentage = new Date().getFullYear() - 1998;

// Typing animation hook
const useTypingAnimation = (text: string, speed: number = 100) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayedText;
};

const LandingSection = () => {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Typing animation states
  const greetingText = useTypingAnimation(greeting, 150);
  const bio1Text = useTypingAnimation(bio1, 80);

  // Skills rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Visibility tracking for animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleScrollToProjects = () => {
    const element = document.getElementById("projects-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <FullScreenSection
      justifyContent="center"
      alignItems="center"
      isDarkBackground
      backgroundColor="rgba(0,0,0,0.7)"
      backgroundImage
      position="relative"
      overflow="hidden"
    >
      {/* Animated background particles */}
      <Box position="absolute" top="0" left="0" right="0" bottom="0" pointerEvents="none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: "4px",
              height: "4px",
              background: "rgba(255, 255, 255, 0.3)",
              borderRadius: "50%",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </Box>

      {/* Scroll progress bar */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        height="3px"
        bg="linear-gradient(90deg, #667eea, #764ba2)"
        transform={`scaleX(${scrollProgress / 100})`}
        transformOrigin="left"
        zIndex="1000"
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <VStack spacing={8} paddingLeft="2rem" paddingRight="2rem" maxW="800px">
          {/* Enhanced Profile Picture */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Box
              w="300px"
              h="300px"
              borderRadius="50%"
              overflow="hidden"
              boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
              border="4px solid"
              borderColor="rgba(255, 255, 255, 0.3)"
              position="relative"
              _hover={{
                borderColor: "rgba(102, 126, 234, 0.8)",
                boxShadow: "0 25px 50px rgba(102, 126, 234, 0.3)",
              }}
              transition="all 0.3s ease"
            >
              <Image
                src={profilePic}
                alt="Jack's profile picture"
                w="100%"
                h="100%"
                objectFit="cover"
                objectPosition="center"
              />
              {/* Glowing ring effect */}
              <Box
                position="absolute"
                top="-4px"
                left="-4px"
                right="-4px"
                bottom="-4px"
                borderRadius="50%"
                background="linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)"
                opacity="0"
                transition="opacity 0.3s ease"
                _groupHover={{ opacity: 0.7 }}
                zIndex="-1"
              />
            </Box>
          </motion.div>

          <VStack spacing={6} textAlign="center" color="white">
            {/* Animated Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Heading
                size="2xl"
                mb={4}
                bgGradient="linear(to-r, #667eea, #764ba2)"
                bgClip="text"
                fontWeight="bold"
              >
                {greetingText}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  |
                </motion.span>
              </Heading>
            </motion.div>

            <VStack spacing={4}>
              {/* Animated Bio */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <Heading size="xl" color="gray.200">
                  {bio1Text}
                </Heading>
              </motion.div>

              {/* Interactive Skills Display */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <VStack spacing={3}>
                  <Text fontSize="lg" color="gray.300">
                    Core Specialisation in:
                  </Text>
                  <HStack spacing={2} flexWrap="wrap" justify="center">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: index === currentSkillIndex ? 1 : 0.6,
                          scale: index === currentSkillIndex ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge
                          colorScheme="purple"
                          variant="solid"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="sm"
                          fontWeight="medium"
                          bg={index === currentSkillIndex ? "purple.500" : "purple.700"}
                          _hover={{
                            bg: "purple.400",
                            transform: "scale(1.05)",
                          }}
                          transition="all 0.2s ease"
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </HStack>
                </VStack>
              </motion.div>

              {/* Location and Age */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
              >
                <VStack spacing={2}>
                  <Text fontSize="lg" color="gray.300">
                    📍 {Location}
                  </Text>
                  <Text fontSize="lg" color="gray.300">
                    🎂 Age: {currentage}
                  </Text>
                </VStack>
              </motion.div>
            </VStack>
          </VStack>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={handleScrollToProjects}
            >
              <VStack spacing={2} color="white" opacity={0.7}>
                <Text fontSize="sm">Scroll to explore</Text>
                <Icon as={ChevronDownIcon} boxSize={6} />
              </VStack>
            </motion.div>
          </motion.div>
        </VStack>
      </motion.div>
    </FullScreenSection>
  );
};

export default LandingSection;
