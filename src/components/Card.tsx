import { Heading, Image, Text, Box, VStack } from "@chakra-ui/react";

type CardContent = {
  title: string;
  description: string;
  imageSrc: string;
  url: string;
};

const Card = (card: CardContent) => {
  return (
    <Box maxW="400px" w="full" textAlign="center" p={4}>
      <VStack spacing={4}>
        <Box
          as="a"
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          cursor="pointer"
          transition="transform 0.2s"
          _hover={{ transform: "scale(1.05)" }}
        >
          <Image
            src={card.imageSrc}
            alt={card.title}
            w="full"
            h="250px"
            objectFit="cover"
            borderRadius="lg"
            boxShadow="lg"
          />
        </Box>
        <Heading size="lg" color="white">
          {card.title}
        </Heading>
        <Text
          fontSize="md"
          color="gray.300"
          textAlign="center"
          lineHeight="1.5"
        >
          {card.description}
        </Text>
      </VStack>
    </Box>
  );
};
export default Card;
