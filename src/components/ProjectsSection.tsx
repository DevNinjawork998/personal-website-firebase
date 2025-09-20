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
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import Card from "./Card";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const projects = [
  {
    title: "Simple Calculator",
    description:
      "My first front-end development project, built using HTML, JavaScript, and CSS to create a fully functional calculator with basic arithmetic operations.",
    getImageSrc: () => require("../images/photo1.jpg"),
    url: "https://personalcalculator.web.app/",
    tech: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "Pokemon Database",
    description:
      "A React.js application that creates an interactive Pokemon database, demonstrating the use of React Hooks and Reducer for state management. Features pagination for seamless navigation through the Pokemon collection.",
    getImageSrc: () => require("../images/Pokemon.jpg"),
    url: "https://pokemondatabase.web.app/",
    tech: ["ReactJs", "JavaScript", "API"],
  },
  {
    title: "BuberBreakfast",
    description:
      "A C# backend service that hosts a comprehensive breakfast menu database. The application utilizes API integration to fetch and display corresponding breakfast dishes with detailed information.",
    getImageSrc: () => require("../images/BreakfastImage.jpg"),
    url: "https://github.com/jack-ooi-bp/BuberBreakfast",
    tech: ["C#", "ASP.NET", "API"],
  },
  {
    title: "Cocktail Ecommerce App",
    description:
      "A full-stack e-commerce application built with Next.js for cocktail sales. Demonstrates React Hooks implementation, Stripe payment integration, and PostgreSQL database management using Prisma ORM.",
    getImageSrc: () => require("../images/Cocktail.png"),
    url: "https://cocktail-business-project.vercel.app/",
    tech: ["Next.js", "Stripe", "PostgreSQL", "Vercel"],
  },
  {
    title: "ANZ OneFleet Portal",
    description:
      "ANZ OneFleet Web App - a comprehensive web application for fleet managers to manage their fleet transactions with BP. Features include fleet card management, report generation, and payment processing through the web application.",
    getImageSrc: () => require("../images/ANZ OneFleet Portal.png"),
    url: "https://onefleet.bp.com.au/",
    tech: ["Enterprise", "Web App", "NextJs", "TypeScript"],
  },
];

const ProjectsSection = () => {
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
                key={project.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  title={project.title}
                  description={project.description}
                  imageSrc={project.getImageSrc()}
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
