import { Box, Flex, Heading, Text, Image, Wrap, WrapItem, Badge } from "@chakra-ui/react";

const GOLD = "#C9A843";

type CardContent = {
  title: string;
  description: string;
  imageSrc: string;
  url: string;
  tech?: string[];
  category?: string;
  year?: number;
  index: number;
};

const Card = ({ title, description, imageSrc, url, tech, category, year, index }: CardContent) => {
  const number = String(index + 1).padStart(2, "0");

  return (
    <Box
      as="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      display="block"
      textDecoration="none"
      border="1px solid rgba(201,168,67,0.22)"
      borderRadius="12px"
      overflow="hidden"
      bg="rgba(255,255,255,0.015)"
      _hover={{
        borderColor: "rgba(201,168,67,0.55)",
        bg: "rgba(255,255,255,0.03)",
        textDecoration: "none",
      }}
      transition="all 0.3s ease"
      cursor="pointer"
    >
      {/* Inner wrapper with role="group" enables _groupHover on children */}
      <Box role="group" h="full">
        <Flex direction={{ base: "column", md: "row" }} align="stretch">
          {/* Left — number + image */}
          <Box position="relative" w={{ base: "full", md: "42%" }} flexShrink={0}>
            <Text
              position="absolute"
              top={5}
              left={5}
              fontFamily="'Inter', sans-serif"
              fontWeight="400"
              fontSize="sm"
              color="rgba(255,255,255,0.3)"
              letterSpacing="0.06em"
              zIndex={1}
            >
              {number}
            </Text>

            <Image
              src={imageSrc}
              alt={title}
              w="full"
              h={{ base: "220px", md: "100%" }}
              minH={{ md: "280px" }}
              objectFit="cover"
              display="block"
              fallback={
                <Box
                  w="full"
                  h="100%"
                  minH="280px"
                  bg="rgba(255,255,255,0.03)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="sm" color="rgba(255,255,255,0.2)">
                    No image
                  </Text>
                </Box>
              }
            />
          </Box>

          {/* Right — content */}
          <Flex direction="column" justify="space-between" p={{ base: 6, md: 8 }} flex={1} gap={4}>
            <Flex justify="space-between" align="center">
              <Text
                fontSize="xs"
                fontFamily="'Inter', sans-serif"
                fontWeight="500"
                letterSpacing="0.18em"
                textTransform="uppercase"
                color="rgba(255,255,255,0.38)"
              >
                {category ?? "PROJECT"}
              </Text>
              {year && (
                <Text
                  fontSize="xs"
                  fontFamily="'Inter', sans-serif"
                  fontWeight="400"
                  letterSpacing="0.1em"
                  color="rgba(255,255,255,0.38)"
                >
                  {year}
                </Text>
              )}
            </Flex>

            <Heading
              as="h3"
              fontFamily="'Cormorant Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "2xl", md: "3xl" }}
              color="white"
              lineHeight="1.2"
              _groupHover={{ color: "white" }}
            >
              {title}{" "}
              <Box
                as="span"
                color={GOLD}
                fontFamily="'Inter', sans-serif"
                fontWeight="300"
                fontSize="xl"
              >
                {url ? "↗" : "→"}
              </Box>
            </Heading>

            <Text
              fontSize="sm"
              color="rgba(255,255,255,0.5)"
              lineHeight="1.7"
              fontFamily="'Inter', sans-serif"
              noOfLines={4}
            >
              {description}
            </Text>

            {tech && tech.length > 0 && (
              <Wrap spacing={2} mt={2}>
                {tech.map((t) => (
                  <WrapItem key={t}>
                    <Badge
                      variant="outline"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontFamily="'Inter', sans-serif"
                      fontWeight="400"
                      letterSpacing="0.04em"
                      borderColor="rgba(255,255,255,0.2)"
                      color="rgba(255,255,255,0.55)"
                      _groupHover={{
                        borderColor: "rgba(255,255,255,0.3)",
                        color: "rgba(255,255,255,0.7)",
                      }}
                      transition="all 0.2s"
                    >
                      {t}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Card;
