import { useEffect, useRef, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { animate } from "animejs";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useActiveSection } from "../hooks/useActiveSection";

const MotionBox = motion.create(Box);

const GOLD = "#C9A843";
const INK = "#0D0C0A";
const CODE_FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
// Side margins only fit commit hashes from here up
const WIDE = "@media (min-width: 1400px)";

const RAIL_START = 0.12;
const RAIL_END = 0.96;
const CHAR_MS = 14;
const MAX_TYPE_MS = 1800;

export const SNIPPETS: Record<string, string> = {
  landing: `export const Hero = () => {
  const reduced = useReducedMotion();
  useLayoutEffect(() => intro(reduced), [reduced]);
  return <LandingSection />;
};`,
  about: `export const handler = async (event) => {
  const user = await verify(event.headers.auth);
  const items = await db.projects.find(user.id);
  return { statusCode: 200, body: json(items) };
};`,
  work: `const site = new s3.Bucket(this, "Site", {
  versioned: true,
});
new cloudfront.Distribution(this, "Edge", {
  defaultBehavior: { origin: new S3Origin(site) },
});`,
  contact: `$ pnpm test
✓ all tests passed
$ git push origin master
$ firebase deploy --only hosting
✓ Deploy complete`,
};

const SECTION_IDS = Object.keys(SNIPPETS);

const WALL = [
  ...Object.values(SNIPPETS),
  `SELECT p.title, COUNT(c.id) AS commits
FROM projects p
JOIN commits c ON c.project_id = p.id
GROUP BY p.title
ORDER BY commits DESC;`,
  `type Query {
  projects(first: Int): [Project!]!
}

query Work {
  projects(first: 7) { title stack url }
}`,
  `def handler(event, context):
    for record in event["Records"]:
        process(json.loads(record["body"]))
    return {"batchItemFailures": []}`,
];

// Real commits from this repo: [lane, percent down the rail, hash]
const COMMITS: [number, number, string][] = [
  [0, 10, "64e7e83"],
  [0, 16, "f8962be"],
  [1, 24, "f0c8936"],
  [2, 32, "0003029"],
  [1, 40, "3f372f8"],
  [0, 46, "69a0c29"],
  [0, 54, "52ddb82"],
  [0, 60, "f5fecb7"],
  [1, 68, "c977c53"],
  [2, 74, "f1eed81"],
  [1, 80, "13fddaa"],
  [0, 86, "11dfe02"],
  [0, 94, "41e53a5"],
];

// [lane, percent it leaves main, percent it merges back]
const BRANCHES = [
  [1, 16, 46],
  [2, 26, 38],
  [1, 60, 86],
  [2, 66, 80],
];

const CURVE = 3;
const PATHS = [
  "M0 0V100",
  ...BRANCHES.map(
    ([lane, from, to]) =>
      `M0 ${from}C0 ${from + CURVE} ${lane} ${from} ${lane} ${from + CURVE}V${to - CURVE}C${lane} ${to} 0 ${to - CURVE} 0 ${to}`
  ),
];

const blink = keyframes`
  50% { opacity: 0; }
`;

const Graph = () => (
  <>
    <Box
      as="svg"
      viewBox="0 0 2 100"
      preserveAspectRatio="none"
      position="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      overflow="visible"
      fill="none"
      stroke={GOLD}
    >
      {PATHS.map((path) => (
        <path key={path} d={path} vectorEffect="non-scaling-stroke" />
      ))}
    </Box>
    {COMMITS.map(([lane, y, hash]) => (
      <Box key={hash} position="absolute" left={`${lane * 50}%`} top={`${y}%`}>
        <Box
          position="absolute"
          w={{ base: "4px", md: "6px" }}
          h={{ base: "4px", md: "6px" }}
          borderRadius="full"
          bg={GOLD}
          transform="translate(-50%, -50%)"
        />
        <Text
          position="absolute"
          top="-7px"
          left={`${68 - lane * 24}px`}
          display="none"
          sx={{ [WIDE]: { display: "block" } }}
          fontFamily={CODE_FONT}
          fontSize="10px"
          color={GOLD}
        >
          {hash}
        </Text>
      </Box>
    ))}
  </>
);

const TypedCode = ({ reducedMotion }: { reducedMotion: boolean | null }) => {
  const ref = useRef<HTMLPreElement>(null);
  const active = useActiveSection(SECTION_IDS);
  const [section, setSection] = useState("landing");
  const snippet = SNIPPETS[section];

  // Sections can briefly report none while the middle of the view crosses a boundary
  useEffect(() => {
    if (active) setSection(active);
  }, [active]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (reducedMotion) {
      element.textContent = snippet;
      return;
    }

    const cursor = { chars: 0 };
    element.textContent = "";
    const typing = animate(cursor, {
      chars: snippet.length,
      duration: Math.min(snippet.length * CHAR_MS, MAX_TYPE_MS),
      ease: "linear",
      onUpdate: () => {
        element.textContent = snippet.slice(0, Math.round(cursor.chars));
      },
    });
    return () => {
      typing.cancel();
    };
  }, [snippet, reducedMotion]);

  return (
    <Box
      as="pre"
      ref={ref}
      data-testid="typed-code"
      position="absolute"
      right={{ base: "12px", md: "3vw" }}
      bottom={{ base: "2lvh", md: "5lvh" }}
      p={3}
      borderRadius="6px"
      bg="rgba(13,12,10,0.82)"
      fontFamily={CODE_FONT}
      fontSize={{ base: "9px", md: "11.5px" }}
      lineHeight="1.75"
      color={`${GOLD}A0`}
      whiteSpace="pre"
      _after={
        reducedMotion
          ? undefined
          : { content: '"▍"', color: GOLD, animation: `${blink} 1s step-end infinite` }
      }
    />
  );
};

const CodeRail = () => {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const head = useTransform(progress, [0, 1], [RAIL_START, RAIL_END]);
  // Wide side insets, or the clip would slice through the hash labels
  const clipPath = useTransform(head, (h) => `inset(0 -100vw ${100 - h * 100}% -100vw)`);
  const headTop = useTransform(head, (h) => `${h * 100}%`);
  const drift = useTransform(progress, [0, 1], ["0lvh", "-30lvh"]);

  return (
    <Box
      data-testid="code-rail"
      aria-hidden
      position="fixed"
      top={0}
      left={0}
      w="100%"
      h="100lvh"
      zIndex={0}
      overflow="hidden"
      pointerEvents="none"
    >
      {/* Drifts slower than the page, so the code reads as sitting further back */}
      <MotionBox
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }}
        gridAutoRows="1fr"
        gap={{ base: 8, md: 6 }}
        h="130lvh"
        pt="100px"
        pl={{ base: "34px", md: "52px" }}
        sx={{ [WIDE]: { pl: "160px" } }}
        fontFamily={CODE_FONT}
        fontSize={{ base: "9px", md: "11.5px" }}
        lineHeight="1.75"
        color={{ base: `${GOLD}16`, md: `${GOLD}22` }}
        style={reducedMotion ? undefined : { y: drift }}
      >
        {[...WALL, ...WALL].map((code, index) => (
          <Box as="pre" key={index} whiteSpace="pre">
            {code}
          </Box>
        ))}
      </MotionBox>

      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={{ base: "4px", md: "10px" }}
        w={{ base: "16px", md: "24px" }}
        sx={{ [WIDE]: { left: "40px", w: "48px" } }}
      >
        <Box position="absolute" top={0} left={0} w="100%" h="100%" opacity={0.18}>
          <Graph />
        </Box>
        <MotionBox
          data-testid="rail-lit"
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          opacity={0.75}
          style={reducedMotion ? undefined : { clipPath }}
        >
          <Graph />
        </MotionBox>
        {!reducedMotion && (
          <MotionBox
            data-testid="rail-head"
            position="absolute"
            left={0}
            w={{ base: "6px", md: "8px" }}
            h={{ base: "6px", md: "8px" }}
            borderRadius="full"
            bg={GOLD}
            boxShadow={`0 0 12px 4px ${GOLD}66, 0 0 2px 1px ${INK}`}
            style={{ top: headTop, x: "-50%", y: "-50%" }}
          />
        )}
      </Box>

      <TypedCode reducedMotion={reducedMotion} />
    </Box>
  );
};

export default CodeRail;
