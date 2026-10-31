import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import { animate } from "animejs";
import { useInView, useReducedMotion } from "framer-motion";

const GOLD = "#C9A843";

const Hairline = ({ w }: { w: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || reducedMotion || !ref.current) return;

    const draw = animate(ref.current, { scaleX: [0, 1], duration: 700, ease: "outExpo" });
    return () => {
      draw.cancel();
    };
  }, [inView, reducedMotion]);

  return (
    <Box
      ref={ref}
      h="1px"
      w={w}
      bg={GOLD}
      flexShrink={0}
      transformOrigin="left"
      transform={reducedMotion ? undefined : "scaleX(0)"}
    />
  );
};

export default Hairline;
