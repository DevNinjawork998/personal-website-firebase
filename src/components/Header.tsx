import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faStackOverflow } from "@fortawesome/free-brands-svg-icons";
import {
  Box,
  HStack,
  useBreakpointValue,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const socials = [
  {
    icon: faEnvelope,
    url: "mailto: thooi998@gmail.com",
  },
  {
    icon: faGithub,
    url: "https://github.com/DevNinjawork998",
  },

  {
    icon: faLinkedin,
    url: "https://www.linkedin.com/in/thooi998",
  },

  {
    icon: faStackOverflow,
    url: "https://stackoverflow.com/users/15035136/ooi-teng-hao",
  },
];

//Function Header Element for scrolling
function Header() {
  const [navbar, setNavbar] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Function for handling clicks
  const handleClick = (anchor: unknown) => () => {
    const id = `${anchor}-section`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    onClose(); // Close mobile menu after click
  };

  // Enhanced scroll detection
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const scrollY = window.scrollY;

      if (scrollY >= 100) {
        setNavbar(true);
      } else {
        setNavbar(false);
      }

      // Detect scroll direction
      if (scrollY > lastScrollY && scrollY > 100) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const MotionBox = motion(Box);
  const MotionHStack = motion(HStack);

  return (
    <>
      <MotionBox
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex="1000"
        bg={navbar ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.3)"}
        backdropFilter="blur(10px)"
        borderBottom={navbar ? "1px solid rgba(255, 255, 255, 0.1)" : "none"}
        initial={{ y: 0 }}
        animate={{
          y: isScrolling ? -100 : 0,
          opacity: navbar ? 1 : 0.9,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Box color="white" maxWidth="auto" margin="auto">
          <HStack
            px={{ base: 4, md: 8, lg: 16 }}
            py={4}
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Social Media Links */}
            <MotionHStack
              spacing={{ base: 4, md: 6, lg: 8 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {socials.map(({ icon, url }, index) => (
                <motion.a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    size="2xl"
                    style={{
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                      transition: "all 0.3s ease",
                    }}
                  />
                </motion.a>
              ))}
            </MotionHStack>

            {/* Desktop Navigation */}
            {!isMobile && (
              <MotionHStack
                spacing={8}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.a
                  href="#projects"
                  onClick={handleClick("projects")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    fontWeight: "500",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  Projects
                </motion.a>
                <motion.a
                  href="#contact-me"
                  onClick={handleClick("contactme")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    fontWeight: "500",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  Contact Me
                </motion.a>
              </MotionHStack>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                aria-label="Open menu"
                icon={<HamburgerIcon />}
                variant="ghost"
                color="white"
                size="lg"
                onClick={onOpen}
                _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
              />
            )}
          </HStack>
        </Box>
      </MotionBox>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="rgba(0, 0, 0, 0.95)" backdropFilter="blur(10px)">
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white" borderBottom="1px solid rgba(255, 255, 255, 0.1)">
            Navigation
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} mt={8}>
              <motion.a
                href="#projects"
                onClick={handleClick("projects")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "500",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Projects
              </motion.a>
              <motion.a
                href="#contact-me"
                onClick={handleClick("contactme")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "500",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Contact Me
              </motion.a>

              {/* Mobile Social Links */}
              <VStack spacing={4} mt={8} pt={8} borderTop="1px solid rgba(255, 255, 255, 0.1)">
                <Text color="gray.300" fontSize="sm">
                  Social Media
                </Text>
                <HStack spacing={6}>
                  {socials.map(({ icon, url }) => (
                    <motion.a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FontAwesomeIcon icon={icon} size="2xl" />
                    </motion.a>
                  ))}
                </HStack>
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default Header;
