import FullScreenSection from "./FullScreenSection";
import { Heading, SimpleGrid } from "@chakra-ui/react";
import Card from "./Card";

const projects = [
  {
    title: "Simple Calculator",
    description:
      "This was first ever Front-End Development project, Using Simple HTML, JavaScript and CSS to create a simple calculator",
    getImageSrc: () => require("../images/photo1.jpg"),
    url: "https://personalcalculator.web.app/",
  },
  {
    title: "Pokemon DataBase",
    description:
      "Using React.js Framework to create a Pokemon Database, demonstrate the use of React Hooks and Reducer. Added some pagination at the bottom for easy navigation.",
    getImageSrc: () => require("../images/Pokemon.jpg"),
    url: "https://pokemondatabase.web.app/",
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
      <Heading as="h1" id="projects-section" color="white" mb={8}>
        Featured Projects
      </Heading>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={8}
        w="full"
        justifyItems="center"
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
      </SimpleGrid>
    </FullScreenSection>
  );
};
export default ProjectsSection;
