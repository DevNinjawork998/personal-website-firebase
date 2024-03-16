import { Heading, Image, Text } from "@chakra-ui/react";
import ReactGA from "react-ga4";

function handleClick() {
  // Track a custom event
  ReactGA.event({
    category: "Button Click",
    action: "Pokemon DataBase",
    label: "Project Page",
  });
  ReactGA.event({
    category: "Button Click",
    action: "Simple Calculator",
    label: "Project Page",
  });
}

// OnClick function for Car
const Card = ({ title, description, imageSrc, url }: any) => {
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
      <a href={url} onClick={handleClick}>
        <Image src={imageSrc} />
      </a>
      <Heading>{title}</Heading>
      <Text
        style={{
          fontSize: "1.2rem",
          textAlign: "center",
        }}
      >
        {description}
      </Text>
    </div>
  );
};
export default Card;
