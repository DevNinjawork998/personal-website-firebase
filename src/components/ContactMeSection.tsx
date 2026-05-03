import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const GOLD = "#C9A843";
const BG = "#0D0C0A";
const EMAIL = "thooi998@gmail.com";

const socials = [
  { icon: faEnvelope, url: `mailto:${EMAIL}`, label: "Email" },
  { icon: faGithub, url: "https://github.com/DevNinjawork998", label: "GitHub" },
  { icon: faLinkedin, url: "https://www.linkedin.com/in/thooi998", label: "LinkedIn" },
];

const ContactMeSection = () => {
  return (
    <Box as="section" id="contact" bg={BG} py={{ base: 20, md: 28 }}>
      <Box maxW="1200px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
        {/* Bordered CTA card */}
        <Box
          border="1px solid rgba(201,168,67,0.28)"
          borderRadius="16px"
          py={{ base: 16, md: 24 }}
          px={{ base: 8, md: 16 }}
          bg="rgba(255,255,255,0.015)"
          textAlign="center"
        >
          <VStack spacing={8}>
            {/* Label */}
            <Flex align="center" justify="center" gap={2}>
              <Box h="1px" w="20px" bg={GOLD} />
              <Text
                fontSize="xs"
                fontFamily="'Inter', sans-serif"
                fontWeight="500"
                letterSpacing="0.22em"
                textTransform="uppercase"
                color={GOLD}
              >
                Let's Talk
              </Text>
            </Flex>

            {/* Headline */}
            <VStack spacing={1}>
              <Heading
                as="h2"
                fontFamily="'Inter', sans-serif"
                fontWeight="700"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                color="white"
                lineHeight="1.1"
              >
                Have a project in mind?
              </Heading>
              <Heading
                as="h2"
                fontFamily="'Cormorant Garamond', serif"
                fontWeight="600"
                fontStyle="italic"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                color={GOLD}
                lineHeight="1.1"
              >
                {`Let's make it real.`}
              </Heading>
            </VStack>

            {/* Email CTA */}
            <Box
              as="a"
              href={`mailto:${EMAIL}`}
              display="inline-flex"
              alignItems="center"
              gap={2}
              bg={GOLD}
              color={BG}
              borderRadius="full"
              px={8}
              py={4}
              fontSize="sm"
              fontWeight="600"
              fontFamily="'Inter', sans-serif"
              letterSpacing="0.02em"
              _hover={{ bg: "#d4b252", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              textDecoration="none"
            >
              {EMAIL} ↗
            </Box>

            {/* Social icons */}
            <Flex gap={4} justify="center">
              {socials.map(({ icon, url, label }) => (
                <Box
                  key={url}
                  as="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  w="46px"
                  h="46px"
                  borderRadius="full"
                  border="1px solid rgba(255,255,255,0.18)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="rgba(255,255,255,0.55)"
                  _hover={{
                    borderColor: "rgba(255,255,255,0.4)",
                    color: "white",
                  }}
                  transition="all 0.2s"
                >
                  <FontAwesomeIcon icon={icon} />
                </Box>
              ))}
            </Flex>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactMeSection;
