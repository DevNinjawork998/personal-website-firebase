import FullScreenSection from "./FullScreenSection";
import { Box, Flex, Heading, flexbox } from "@chakra-ui/react";
import Card from "./Card";
import React from "react";

const projects = [
  {
    title: "Simple Calculator",
    description:
      "This was first ever Front-End Development project, Using Simple HTML, JavaScript and CSS to create a simple calculator",
    getImageSrc: () => require("../images/photo1.jpg"),
    url: "https://simple-calculator-ravenslayer.netlify.app/",
  },
  {
    title: "Pokemon DataBase",
    description:
      "Using React.js Framework to create a Pokemon Database, demonstrate the use of React Hooks and Reducer. Added some pagination at the bottom for easy navigation.",
    getImageSrc: () => require("../images/Pokemon.jpg"),
    url: "https://pokemon-database-ravenslayer998.netlify.app/",
  },
  {
    title: "BuberBreakfast",
    description:
      "This was a projet base on C#, a backend service to host a list of breakfast menu and using API calling to fetch the corresponding breakfast dishes",
    getImageSrc: () => require("../images/BreakfastImage.jpg"),
    url: "https://github.com/jack-ooi-bp/BuberBreakfast",
  },
  // {
  //   title: "Event planner",
  //   description:
  //     "A mobile application for leisure seekers to discover unique events and activities in their city with a few taps",
  //   getImageSrc: () => require("../images/photo4.jpg"),
  //   url: "",
  // },
];

const ProjectsSection = () => {
  return (
    <FullScreenSection
      backgroundColor="rgba(0,0,0,0.7)"
      isDarkBackground
      p={8}
      alignItems="flex-start"
      spacing={8}
    >
      <Heading as="h1" id="projects-section">
        Featured Projects
      </Heading>
      <Box
        gridTemplateColumns="repeat(2,minmax(auto,auto))"
        gridGap={8}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {projects.map((project) => (
          <Card
            key={project.title}
            title={project.title}
            description={project.description}
            imageSrc={project.getImageSrc()}
            url={project.url}
          />
        ))}
      </Box>
    </FullScreenSection>
  );
};
export default ProjectsSection;
