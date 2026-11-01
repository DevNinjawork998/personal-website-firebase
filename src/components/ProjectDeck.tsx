import { MouseEvent, ReactNode, useRef, useState } from "react";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  PanInfo,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

const MotionBox = motion.create(Box);

const GOLD = "#C9A843";
const BG = "#0D0C0A";
const SWIPE_PX = 100;
const SWIPE_SPEED = 500;
const VISIBLE_CARDS = 3;
const STACK_STEP_PX = 14;
const STACK_SCALE_STEP = 0.05;
const STACK_FADE_STEP = 0.25;
const MOVE_SECONDS = 0.25;

export const swipeDirection = (offsetX: number, velocityX: number) => {
  if (offsetX > SWIPE_PX || velocityX > SWIPE_SPEED) return 1;
  if (offsetX < -SWIPE_PX || velocityX < -SWIPE_SPEED) return -1;
  return 0;
};

const controlProps = {
  variant: "outline",
  borderRadius: "full",
  boxSize: "44px",
  borderColor: "rgba(201,168,67,0.35)",
  color: GOLD,
  _hover: { bg: "rgba(201,168,67,0.08)" },
  _active: { bg: "rgba(201,168,67,0.15)" },
};

const ProjectDeck = ({ cards }: { cards: ReactNode[] }) => {
  const reducedMotion = useReducedMotion();
  const [top, setTop] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const moved = useRef(false);
  const flying = useRef(false);
  const count = cards.length;

  if (!count) return null;

  const showNext = () => setTop((current) => (current + 1) % count);

  const flyOut = async (direction: number) => {
    if (reducedMotion) return showNext();
    if (flying.current) return;

    flying.current = true;
    await animate(x, direction * window.innerWidth * 1.2, {
      duration: MOVE_SECONDS,
      ease: "easeIn",
    });
    x.set(0);
    showNext();
    flying.current = false;
  };

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    const direction = swipeDirection(offset.x, velocity.x);
    if (direction) flyOut(direction);
  };

  // A swipe ending on the card must not count as a tap on its link
  const blockClickAfterDrag = (event: MouseEvent) => {
    if (!moved.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Box>
      <Box
        display="grid"
        gridTemplateColumns="minmax(0, 1fr)"
        pb={`${STACK_STEP_PX * (VISIBLE_CARDS - 1)}px`}
      >
        {cards.map((card, index) => {
          const depth = (index - top + count) % count;
          const isTop = depth === 0;

          return (
            <MotionBox
              key={index}
              data-testid={isTop ? "deck-top" : undefined}
              gridArea="1 / 1"
              bg={BG}
              borderRadius="12px"
              zIndex={count - depth}
              visibility={depth < VISIBLE_CARDS ? "visible" : "hidden"}
              aria-hidden={isTop ? undefined : true}
              {...(isTop ? {} : { inert: "" })}
              initial={false}
              animate={{
                scale: 1 - depth * STACK_SCALE_STEP,
                y: depth * STACK_STEP_PX,
                opacity: 1 - depth * STACK_FADE_STEP,
              }}
              transition={{ duration: reducedMotion ? 0 : MOVE_SECONDS }}
              style={isTop ? { x, rotate } : undefined}
              drag={isTop && !reducedMotion ? "x" : false}
              dragSnapToOrigin
              dragElastic={0.7}
              onPointerDownCapture={() => {
                moved.current = false;
              }}
              onDrag={() => {
                moved.current = true;
              }}
              onDragEnd={onDragEnd}
            >
              <Box
                h="full"
                onClickCapture={blockClickAfterDrag}
                onDragStart={(event) => event.preventDefault()}
              >
                {card}
              </Box>
            </MotionBox>
          );
        })}
      </Box>

      {count > 1 && (
        <Flex align="center" justify="space-between" mt={4}>
          <IconButton
            {...controlProps}
            aria-label="Previous project"
            icon={<ChevronLeftIcon boxSize={6} />}
            onClick={() => setTop((current) => (current - 1 + count) % count)}
          />
          <Box textAlign="center" fontFamily="'Inter', sans-serif">
            <Text aria-live="polite" fontSize="sm" color={GOLD} letterSpacing="0.06em">
              {top + 1} / {count}
            </Text>
            <Text fontSize="xs" color="rgba(255,255,255,0.4)" letterSpacing="0.04em">
              Swipe to browse
            </Text>
          </Box>
          <IconButton
            {...controlProps}
            aria-label="Next project"
            icon={<ChevronRightIcon boxSize={6} />}
            onClick={() => flyOut(-1)}
          />
        </Flex>
      )}
    </Box>
  );
};

export default ProjectDeck;
