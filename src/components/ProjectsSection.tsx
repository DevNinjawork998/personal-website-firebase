import { Box, Flex, Heading, Text, VStack, Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Card from "./Card";
import { useProjects } from "../hooks/useProjects";

import photo1 from "../images/photo1.jpg";
import pokemon from "../images/Pokemon.jpg";
import breakfast from "../images/BreakfastImage.jpg";
import cocktail from "../images/Cocktail.png";
import anzPortal from "../images/ANZ OneFleet Portal.png";
import digicraft from "../images/Digicraft.png";
import infiniteCabinet from "../images/InfiniteCabinet.png";

const MotionBox = motion(Box);

const GOLD = "#C9A843";

const imageMap: Record<string, string> = {
  "photo1.jpg": photo1,
  "Pokemon.jpg": pokemon,
  "BreakfastImage.jpg": breakfast,
  "Cocktail.png": cocktail,
  "ANZ OneFleet Portal.png": anzPortal,
  "Digicraft.png": digicraft,
  "InfiniteCabinet.png": infiniteCabinet,
};

const ProjectsSection = () => {
  const { projects, loading, error, refetch } = useProjects();

  if (loading) {
    return (
      <Box as="section" id="work" bg="#0D0C0A" py={{ base: 20, md: 28 }}>
        <Box maxW="1200px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
          <Flex align="center" justify="center" minH="300px">
            <VStack spacing={4}>
              <Spinner size="lg" color={GOLD} />
              <Text color="rgba(255,255,255,0.4)" fontSize="sm" fontFamily="'Inter', sans-serif">
                Loading projects...
              </Text>
            </VStack>
          </Flex>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box as="section" id="work" bg="#0D0C0A" py={{ base: 20, md: 28 }}>
        <Box maxW="1200px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
          <Flex align="center" justify="center" minH="300px" direction="column" gap={4}>
            <Text color="rgba(255,255,255,0.5)" fontFamily="'Inter', sans-serif">
              {error}
            </Text>
            <Box
              as="button"
              onClick={refetch}
              fontSize="sm"
              color={GOLD}
              textDecoration="underline"
              fontFamily="'Inter', sans-serif"
              cursor="pointer"
              bg="transparent"
              border="none"
            >
              Try again
            </Box>
          </Flex>
        </Box>
      </Box>
    );
  }

  return (
    <Box as="section" id="work" bg="#0D0C0A" py={{ base: 20, md: 28 }}>
      <Box maxW="1200px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
        <Flex align="center" gap={2} mb={4}>
          <Box h="1px" w="16px" bg={GOLD} flexShrink={0} />
          <Text
            fontSize="xs"
            fontFamily="'Inter', sans-serif"
            fontWeight="500"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={GOLD}
          >
            Selected Work
          </Text>
        </Flex>

        <Flex justify="space-between" align="flex-end" mb={12}>
          <Heading
            as="h2"
            fontFamily="'Cormorant Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            color="white"
            lineHeight="1.05"
          >
            {`Things I've built.`}
          </Heading>
          <Text
            fontSize="sm"
            fontFamily="'Inter', sans-serif"
            color={GOLD}
            letterSpacing="0.06em"
            display={{ base: "none", md: "block" }}
          >
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </Text>
        </Flex>

        <VStack spacing={5} align="stretch">
          {projects.map((project, index) => (
            <MotionBox
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                title={project.title}
                description={project.description}
                imageSrc={imageMap[project.imageSrc] ?? ""}
                url={project.url}
                tech={project.tech}
                category={project.category}
                year={project.year}
                index={index}
              />
            </MotionBox>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default ProjectsSection;
