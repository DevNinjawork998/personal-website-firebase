import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  useBreakpointValue,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const GOLD = "#C9A843";
const BG = "#0D0C0A";

const navLinks = [
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
  { label: "Contact", id: "contact" },
];

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

function Header() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg={BG}
        borderBottom="1px solid rgba(201,168,67,0.12)"
      >
        <Flex
          maxW="1200px"
          mx="auto"
          px={{ base: 6, md: 12, lg: 16 }}
          py={5}
          align="center"
          justify="space-between"
        >
          {/* Logo */}
          <Text
            fontFamily="'Inter', sans-serif"
            fontWeight="700"
            fontSize="xl"
            color="white"
            letterSpacing="-0.02em"
            cursor="pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            _hover={{ color: "white" }}
          >
            Jack.
          </Text>

          {/* Desktop nav */}
          {!isMobile && (
            <HStack spacing={10}>
              {navLinks.map(({ label, id }) => (
                <Text
                  key={id}
                  as="button"
                  fontSize="sm"
                  color="rgba(255,255,255,0.6)"
                  fontWeight="400"
                  fontFamily="'Inter', sans-serif"
                  letterSpacing="0.02em"
                  cursor="pointer"
                  _hover={{ color: "white" }}
                  transition="color 0.2s"
                  onClick={() => scrollTo(id)}
                  bg="transparent"
                  border="none"
                >
                  {label}
                </Text>
              ))}
            </HStack>
          )}

          {/* CTA + mobile toggle */}
          <HStack spacing={4}>
            {!isMobile && (
              <Button
                onClick={() => scrollTo("contact")}
                variant="outline"
                borderColor={GOLD}
                color="white"
                size="sm"
                borderRadius="full"
                px={6}
                fontFamily="'Inter', sans-serif"
                fontSize="xs"
                fontWeight="500"
                letterSpacing="0.08em"
                textTransform="uppercase"
                _hover={{ bg: "rgba(201,168,67,0.08)", borderColor: GOLD }}
                _active={{ bg: "rgba(201,168,67,0.15)" }}
              >
                Get In Touch ↗
              </Button>
            )}
            {isMobile && (
              <IconButton
                aria-label="Open menu"
                icon={<HamburgerIcon />}
                variant="ghost"
                color="white"
                onClick={onOpen}
                _hover={{ bg: "rgba(255,255,255,0.05)" }}
              />
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={BG} borderLeft="1px solid rgba(201,168,67,0.15)">
          <DrawerCloseButton color="white" top={5} right={5} />
          <DrawerBody pt={16} px={8}>
            <VStack spacing={8} align="flex-start">
              {navLinks.map(({ label, id }) => (
                <Text
                  key={id}
                  fontSize="2xl"
                  fontFamily="'Cormorant Garamond', serif"
                  fontWeight="600"
                  color="white"
                  cursor="pointer"
                  _hover={{ color: GOLD }}
                  transition="color 0.2s"
                  onClick={() => {
                    scrollTo(id);
                    onClose();
                  }}
                >
                  {label}
                </Text>
              ))}
              <Box pt={4} borderTop="1px solid rgba(201,168,67,0.2)" w="full">
                <Button
                  onClick={() => {
                    scrollTo("contact");
                    onClose();
                  }}
                  variant="outline"
                  borderColor={GOLD}
                  color="white"
                  w="full"
                  borderRadius="full"
                  fontFamily="'Inter', sans-serif"
                  fontSize="xs"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  _hover={{ bg: "rgba(201,168,67,0.08)" }}
                >
                  Get In Touch ↗
                </Button>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Header;
