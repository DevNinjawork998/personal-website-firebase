import { Heading, Image, Text } from "@chakra-ui/react";
import ReactGA from "react-ga4";

type CardContent = {
  title: string;
  description: string;
  imageSrc: string;
  url: string;
};

// function handleClick() {
//   // Track a custom event
//   ReactGA.event({
//     category: "Button Click",
//     action: "Pokemon DataBase",
//     label: "Project Page Pokemon Database",
//   });
//   ReactGA.event({
//     category: "Button Click",
//     action: "Simple Calculator",
//     label: "Project Page Simple Calculator",
//   });
// }

// OnClick function for Car
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
      <a href={card.url} /*onClick = { handleClick }*/>
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
