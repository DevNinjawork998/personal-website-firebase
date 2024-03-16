import { VStack } from "@chakra-ui/react";
import Green_background from "../../src/images/IMG_5160.png";

/**
 * Illustrates the use of children prop and spread operator
 */
const FullScreenSection = ({
  children,
  isDarkBackground,
  ...boxProps
}: any) => {
  return (
    <VStack
      minWidth="-moz-fit-content"
      backgroundColor={boxProps.backgroundColor}
      color={isDarkBackground ? "white" : "black"}
      backgroundImage={Green_background}
    >
      <VStack minWidth="auto" minHeight="100vh" {...boxProps}>
        {children}
      </VStack>
    </VStack>
  );
};

export default FullScreenSection;
