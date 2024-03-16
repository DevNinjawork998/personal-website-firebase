import { Box, Flex, HStack } from "@chakra-ui/react";

// Function to get current year for Copyright section
function getCurrentYear() {
  const currentDate = new Date();
  return currentDate.getFullYear();
}

const Footer = () => {
  return (
    <Box backgroundColor="#18181b">
      <footer>
        <HStack>
          <Flex
            margin="0 auto"
            px={12}
            color="white"
            justifyContent="center"
            alignItems="center"
            maxWidth="1024px"
            height={16}
          >
            <p>Jack • © {getCurrentYear()}</p>
          </Flex>
        </HStack>
      </footer>
    </Box>
  );
};
export default Footer;
