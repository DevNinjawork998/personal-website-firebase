import { Heading, Image, Text } from "@chakra-ui/react";

type CardContent = {
  title: string;
  description: string;
  imageSrc: string;
  url: string;
};

const Card = (card: CardContent) => {
  return (
    <div
      style={{
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        height: "500px",
        width: "500px",
      }}
    >
      <a href={card.url}>
        <Image src={card.imageSrc} />
      </a>
      <Heading>{card.title}</Heading>
      <Text
        style={{
          fontSize: "1.2rem",
          textAlign: "center",
        }}
      >
        {card.description}
      </Text>
    </div>
  );
};
export default Card;
