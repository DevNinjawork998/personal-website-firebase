import FullScreenSection from "./FullScreenSection";
import {
  Heading,
  SimpleGrid,
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Divider,
  useBreakpointValue,
  Spinner,
  Alert,
  AlertIcon,
  Button,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import Card from "./Card";
import { motion } from "framer-motion";
import { useProjects } from "../hooks/useProjects";

// Import all images at the top level for better performance
import photo1 from "../images/photo1.jpg";
import pokemon from "../images/Pokemon.jpg";
import breakfast from "../images/BreakfastImage.jpg";
import cocktail from "../images/Cocktail.png";
import anzPortal from "../images/ANZ OneFleet Portal.png";

const MotionBox = motion(Box);

// Image mapping for cleaner code
const imageMap: { [key: string]: string } = {
  "photo1.jpg": photo1,
  "Pokemon.jpg": pokemon,
  "BreakfastImage.jpg": breakfast,
  "Cocktail.png": cocktail,
  "ANZ OneFleet Portal.png": anzPortal,
};

const getImageSrc = (imageName: string): string => {
  return imageMap[imageName] || "";
};

const ProjectsSection = () => {
  const { projects, loading, error, refetch } = useProjects();
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Loading state
  if (loading) {
    return (
      <FullScreenSection
        backgroundColor="rgba(0,0,0,0.8)"
        isDarkBackground
        p={{ base: 6, md: 8, lg: 12 }}
        alignItems="center"
        justifyContent="center"
        spacing={8}
        position="relative"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="white" />
          <Text color="gray.300" fontSize="lg">
            Loading projects...
          </Text>
        </VStack>
      </FullScreenSection>
    );
  }

  // Error state
  if (error) {
    return (
      <FullScreenSection
        backgroundColor="rgba(0,0,0,0.8)"
        isDarkBackground
        p={{ base: 6, md: 8, lg: 12 }}
        alignItems="center"
        justifyContent="center"
        spacing={8}
        position="relative"
      >
        <VStack spacing={4} maxW="600px">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
          <Button onClick={refetch} colorScheme="blue">
            Try Again
          </Button>
        </VStack>
      </FullScreenSection>
    );
  }

  return (
    <FullScreenSection
      backgroundColor="rgba(0,0,0,0.8)"
      isDarkBackground
      p={{ base: 6, md: 8, lg: 12 }}
      alignItems="flex-start"
      spacing={8}
      position="relative"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top="10%"
        right="10%"
        w="200px"
        h="200px"
        bg="linear-gradient(45deg, #667eea, #764ba2)"
        borderRadius="full"
        opacity={0.1}
        filter="blur(40px)"
      />
      <Box
        position="absolute"
        bottom="20%"
        left="5%"
        w="150px"
        h="150px"
        bg="linear-gradient(45deg, #f093fb, #f5576c)"
        borderRadius="full"
        opacity={0.1}
        filter="blur(30px)"
      />

      <VStack spacing={8} w="full" align="stretch">
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <VStack spacing={4} align="center" textAlign="center">
            <HStack spacing={2} align="center">
              <Icon as={StarIcon} color="yellow.400" boxSize={6} />
              <Heading
                as="h1"
                id="projects-section"
                color="white"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                bgGradient="linear(to-r, #667eea, #764ba2)"
                bgClip="text"
              >
                Featured Projects
              </Heading>
              <Icon as={StarIcon} color="yellow.400" boxSize={6} />
            </HStack>

            <Text
              color="gray.300"
              fontSize={{ base: "md", md: "lg" }}
              maxW="600px"
              lineHeight="1.6"
            >
              A showcase of my development journey, featuring projects that
              demonstrate my skills in front-end, back-end, and full-stack
              development.
            </Text>

            <Divider
              borderColor="rgba(255, 255, 255, 0.2)"
              w="100px"
              borderWidth="2px"
              borderRadius="full"
            />
          </VStack>
        </MotionBox>

        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <SimpleGrid
            columns={columns}
            spacing={{ base: 6, md: 8, lg: 10 }}
            w="full"
            justifyItems="center"
          >
            {projects.map((project, index) => (
              <MotionBox
                key={project.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  title={project.title}
                  description={project.description}
                  imageSrc={getImageSrc(project.imageSrc)}
                  url={project.url}
                  tech={project.tech}
                />
              </MotionBox>
            ))}
          </SimpleGrid>
        </MotionBox>
      </VStack>
    </FullScreenSection>
  );
};
export default ProjectsSection;
