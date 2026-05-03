import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const GOLD = "#C9A843";

const AboutSection = () => {
  return (
    <Box as="section" id="about" bg="#0D0C0A" py={{ base: 20, md: 28 }}>
      <Box maxW="1200px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
        <Flex direction={{ base: "column", md: "row" }} gap={{ base: 10, md: 20 }}>
          {/* Left label */}
          <Box minW={{ md: "160px" }} pt={2}>
            <Flex align="center" gap={2}>
              <Box h="1px" w="16px" bg={GOLD} flexShrink={0} />
              <Text
                fontSize="xs"
                fontFamily="'Inter', sans-serif"
                fontWeight="500"
                letterSpacing="0.2em"
                textTransform="uppercase"
                color={GOLD}
              >
                About
              </Text>
            </Flex>
          </Box>

          {/* Right content */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <Heading
              as="h2"
              fontFamily="'Inter', sans-serif"
              fontWeight="700"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              color="white"
              lineHeight="1.25"
              mb={7}
              maxW="780px"
            >
              I turn ideas into interfaces — moving fluidly between front-end polish and back-end
              architecture to ship products that feel inevitable.
            </Heading>

            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="rgba(255,255,255,0.5)"
              lineHeight="1.75"
              maxW="620px"
              fontFamily="'Inter', sans-serif"
            >
              At bp Malaysia I work across the stack on tools that scale to thousands of users
              daily. Outside of work, I tinker with side projects, read about systems design, and
              try to keep my keyboard cleaner than my code.
            </Text>
          </MotionBox>
        </Flex>
      </Box>
    </Box>
  );
};

export default AboutSection;
