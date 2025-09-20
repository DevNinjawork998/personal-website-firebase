import {
  Heading,
  Image,
  Text,
  Box,
  VStack,
  HStack,
  Icon,
  Badge,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

type CardContent = {
  title: string;
  description: string;
  imageSrc: string;
  url: string;
  tech?: string[];
};

const Card = (card: CardContent) => {
  const cardBg = useColorModeValue(
    "rgba(255, 255, 255, 0.1)",
    "rgba(0, 0, 0, 0.2)"
  );
  const borderColor = useColorModeValue(
    "rgba(255, 255, 255, 0.2)",
    "rgba(255, 255, 255, 0.1)"
  );

  return (
    <Box maxW="400px" w="full" textAlign="center" p={0} position="relative">
      <Box
        bg={cardBg}
        backdropFilter="blur(10px)"
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        p={6}
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          borderColor: "rgba(255, 255, 255, 0.3)",
        }}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
        _groupHover={{
          _before: {
            opacity: 1,
          },
        }}
      >
        <VStack spacing={5} align="stretch">
          <Box position="relative" overflow="hidden" borderRadius="lg">
            <Box
              as="a"
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              cursor="pointer"
              display="block"
              position="relative"
              _hover={{
                "& .overlay": {
                  opacity: 1,
                },
              }}
            >
              <Image
                src={card.imageSrc}
                alt={card.title}
                w="full"
                h="250px"
                objectFit="cover"
                borderRadius="lg"
                transition="transform 0.3s ease"
                _groupHover={{
                  transform: "scale(1.05)",
                }}
              />
              <Box
                className="overlay"
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0, 0, 0, 0.7)"
                opacity={0}
                transition="opacity 0.3s ease"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="lg"
              >
                <HStack spacing={2} color="white">
                  <Text fontSize="sm" fontWeight="semibold">
                    View Project
                  </Text>
                  <Icon as={ExternalLinkIcon} boxSize={4} />
                </HStack>
              </Box>
            </Box>
          </Box>

          <VStack spacing={3} align="stretch">
            <HStack justify="space-between" align="center">
              <Heading
                size="lg"
                color="white"
                fontWeight="bold"
                fontSize="xl"
                lineHeight="1.2"
              >
                {card.title}
              </Heading>
              <Badge
                colorScheme="purple"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="medium"
              >
                Live
              </Badge>
            </HStack>

            <Text
              fontSize="sm"
              color="gray.300"
              textAlign="left"
              lineHeight="1.6"
              noOfLines={4}
            >
              {card.description}
            </Text>

            {card.tech && card.tech.length > 0 && (
              <Wrap spacing={2} mt={2}>
                {card.tech.map((technology, index) => (
                  <WrapItem key={index}>
                    <Badge
                      colorScheme="blue"
                      variant="outline"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="medium"
                      borderColor="rgba(255, 255, 255, 0.3)"
                      color="gray.300"
                      _hover={{
                        borderColor: "blue.400",
                        color: "blue.300",
                      }}
                    >
                      {technology}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};
export default Card;
