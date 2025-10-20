import { VStack, Box } from "@chakra-ui/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Green_background from "../../src/images/IMG_5160.png";

/**
 * Illustrates the use of children prop and spread operator with parallax effects
 */
const FullScreenSection = ({ children, isDarkBackground, ...boxProps }: any) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);

  return (
    <VStack
      minWidth="-moz-fit-content"
      backgroundColor={boxProps.backgroundColor}
      color={isDarkBackground ? "white" : "black"}
      position="relative"
      overflow="hidden"
    >
      {/* Parallax Background */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${Green_background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          y: y,
          opacity: opacity,
          zIndex: -1,
        }}
      />

      {/* Additional overlay for better text readability */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor={isDarkBackground ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.3)"}
        zIndex={-1}
      />

      <VStack
        ref={ref}
        minWidth="auto"
        minHeight="100vh"
        position="relative"
        zIndex={1}
        {...boxProps}
      >
        {children}
      </VStack>
    </VStack>
  );
};

export default FullScreenSection;
