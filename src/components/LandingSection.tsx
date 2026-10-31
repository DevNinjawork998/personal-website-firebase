import { ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import { Box, Flex, Text, Heading, Button, HStack, Image } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { animate, createScope, createTimeline, stagger, utils } from "animejs";
import { useInView, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import profilePic from "../images/profile.jpg";

const GOLD = "#C9A843";
const BG = "#0D0C0A";

const scrollLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const socials = [
  { icon: faEnvelope, url: "mailto:thooi998@gmail.com", label: "Email" },
  { icon: faGithub, url: "https://github.com/DevNinjawork998", label: "GitHub" },
  { icon: faLinkedin, url: "https://www.linkedin.com/in/thooi998", label: "LinkedIn" },
];

const marqueeItems = [
  "TYPESCRIPT",
  "GRAPHQL",
  "PYTHON",
  "AWS",
  "SQL",
  "NODE",
  "REACT",
  "NEXT.JS",
  "FIREBASE",
  "PRISMA",
  "DOCKER",
];

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// The padding keeps the mask from clipping descenders at this line height
const HeadlineLine = ({ children }: { children: ReactNode }) => (
  <Box as="span" display="block" overflow="hidden" pb="0.12em" mb="-0.12em">
    <Box as="span" display="block" data-intro="line">
      {children}
    </Box>
  </Box>
);

const LandingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const photoInView = useInView(photoRef, { once: true });
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const scope = createScope({ root: sectionRef }).add(() => {
      utils.set('[data-intro="hairline"]', { scaleX: 0 });
      utils.set('[data-intro="eyebrow"], [data-intro="fade"]', { opacity: 0 });
      utils.set('[data-intro="line"]', { translateY: "110%" });
      utils.set('[data-intro="photo"]', { clipPath: "inset(100% 0% 0% 0%)" });

      createTimeline({ defaults: { ease: "outExpo" } })
        .add('[data-intro="hairline"]', { scaleX: 1, duration: 400 }, 0)
        .add('[data-intro="eyebrow"]', { opacity: 1, duration: 300 }, 200)
        .add('[data-intro="line"]', { translateY: "0%", duration: 700, delay: stagger(120) }, 400)
        .add('[data-intro="fade"]', { opacity: 1, duration: 500, delay: stagger(100) }, 1100);
    });

    return () => scope.revert();
  }, [reducedMotion]);

  // Apart from the timeline because phones stack the portrait below the fold
  useEffect(() => {
    if (!photoInView || reducedMotion || !photoRef.current) return;

    const unveil = animate(photoRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 900,
      delay: 300,
      ease: "outExpo",
    });
    return () => {
      unveil.cancel();
    };
  }, [photoInView, reducedMotion]);

  return (
    <Box as="section" pt="80px" id="landing" ref={sectionRef}>
      {/* Hero */}
      <Box maxW="1200px" mx="auto" px={{ base: 6, md: 12, lg: 16 }} py={{ base: 16, md: 24 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          gap={{ base: 12, md: 10, xl: 20 }}
        >
          {/* Left column: wider on tablets so the headline keeps its four lines */}
          <Box flex={{ base: "1", md: "1.5", xl: "1" }} maxW={{ md: "58%" }}>
            {/* Eyebrow */}
            <HStack spacing={3} mb={8} align="center">
              <Box
                h="1px"
                w="32px"
                bg="rgba(255,255,255,0.35)"
                flexShrink={0}
                transformOrigin="left"
                data-intro="hairline"
              />
              <Text
                data-intro="eyebrow"
                fontSize="xs"
                fontFamily="'Inter', sans-serif"
                fontWeight="500"
                letterSpacing="0.22em"
                textTransform="uppercase"
                color="rgba(255,255,255,0.5)"
              >
                Software Engineer · Kuala Lumpur
              </Text>
            </HStack>

            {/* Display headline */}
            <Heading
              as="h1"
              fontFamily="'Cormorant Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "5xl", md: "6xl", lg: "7xl" }}
              lineHeight="1.05"
              color="white"
              mb={8}
            >
              <HeadlineLine>Crafting digital</HeadlineLine>
              <HeadlineLine>products with</HeadlineLine>
              <HeadlineLine>
                <Box as="span" color={GOLD} fontStyle="italic">
                  precision
                </Box>
              </HeadlineLine>
              <HeadlineLine>and care.</HeadlineLine>
            </Heading>

            {/* Bio */}
            <Text
              data-intro="fade"
              fontSize={{ base: "md", md: "lg" }}
              color="rgba(255,255,255,0.6)"
              lineHeight="1.75"
              mb={10}
              fontFamily="'Inter', sans-serif"
              maxW={{ base: "500px", md: "340px", lg: "430px", xl: "500px" }}
            >
              I'm{" "}
              <Box as="span" color="white" fontWeight="600">
                Jack Ooi
              </Box>{" "}
              — an aspiring software engineer at{" "}
              <Box as="span" color="white" fontWeight="600">
                bp Malaysia
              </Box>{" "}
              and{" "}
              <Box as="span" color="white" fontWeight="600">
                owner of JNS Nexion Enterprise
              </Box>
              . I build performant, thoughtful web experiences with React, TypeScript and a healthy
              obsession for detail.
            </Text>

            {/* CTA + socials */}
            <HStack
              spacing={{ base: 4, md: 3, xl: 4 }}
              flexWrap="wrap"
              align="center"
              data-intro="fade"
            >
              <Button
                onClick={() => scrollTo("work")}
                bg={GOLD}
                color={BG}
                borderRadius="full"
                px={7}
                h="46px"
                fontSize="sm"
                fontWeight="600"
                fontFamily="'Inter', sans-serif"
                letterSpacing="0.01em"
                _hover={{ bg: "#d4b252", transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
              >
                View selected work ↗
              </Button>

              {socials.map(({ icon, url, label }) => (
                <Box
                  key={url}
                  as="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  w="44px"
                  h="44px"
                  borderRadius="full"
                  border="1px solid rgba(255,255,255,0.18)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="rgba(255,255,255,0.6)"
                  _hover={{
                    borderColor: "rgba(255,255,255,0.45)",
                    color: "white",
                  }}
                  transition="all 0.2s"
                >
                  <FontAwesomeIcon icon={icon} />
                </Box>
              ))}
            </HStack>
          </Box>

          {/* Right column — B&W photo */}
          <Box flex="1" maxW={{ md: "42%" }}>
            <Box position="relative" data-intro="photo" ref={photoRef}>
              <Image
                id="portrait"
                src={profilePic}
                alt="Jack Ooi"
                w="full"
                maxH={{ base: "380px", md: "520px" }}
                objectFit="cover"
                objectPosition="center top"
                borderRadius="4px"
                filter="grayscale(100%)"
                transition="filter 0.4s ease"
                _hover={{ filter: "grayscale(0%)" }}
                display="block"
              />
              <Flex justify="space-between" mt={3} px={1}>
                <Text
                  fontSize="xs"
                  color="rgba(255,255,255,0.35)"
                  fontFamily="'Inter', sans-serif"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  Est. 1998
                </Text>
                <Text
                  fontSize="xs"
                  color="rgba(255,255,255,0.35)"
                  fontFamily="'Inter', sans-serif"
                  letterSpacing="0.06em"
                >
                  📍 KL, MY
                </Text>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>

      {/* Skills marquee */}
      <Box borderTop="1px solid rgba(255,255,255,0.05)" py={6} overflow="hidden">
        <Box
          display="flex"
          width="max-content"
          animation={`${scrollLeft} 28s linear infinite`}
          sx={{ "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <HStack key={i} spacing={0} mr={0} flexShrink={0}>
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontFamily="'Inter', sans-serif"
                fontWeight="600"
                letterSpacing="0.18em"
                color="rgba(255,255,255,0.15)"
                textTransform="uppercase"
                whiteSpace="nowrap"
                px={6}
              >
                {item}
              </Text>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={GOLD}
                opacity={0.45}
                lineHeight={1}
                px={2}
              >
                ✦
              </Text>
            </HStack>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LandingSection;
