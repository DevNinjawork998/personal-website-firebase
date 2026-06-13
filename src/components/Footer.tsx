import { Box, Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box as="footer" bg="#0D0C0A" borderTop="1px solid rgba(201,168,67,0.2)" py={6}>
      <Flex
        maxW="1200px"
        mx="auto"
        px={{ base: 6, md: 12, lg: 16 }}
        justify="space-between"
        align="center"
      >
        <Text
          fontSize="xs"
          fontFamily="'Inter', sans-serif"
          fontWeight="400"
          letterSpacing="0.14em"
          textTransform="uppercase"
          color="rgba(255,255,255,0.28)"
        >
          © {year} Jack Ooi
        </Text>
        <Text
          fontSize="xs"
          fontFamily="'Inter', sans-serif"
          fontWeight="400"
          letterSpacing="0.14em"
          textTransform="uppercase"
          color="rgba(255,255,255,0.28)"
        >
          Designed &amp; Built With Care
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
