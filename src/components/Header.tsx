import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faStackOverflow,
} from "@fortawesome/free-brands-svg-icons";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Box, HStack } from "@chakra-ui/react";

const socials = [
  {
    icon: faEnvelope,
    url: "mailto: thooi998@gmail.com",
  },
  {
    icon: faGithub,
    url: "https://github.com/DevNinjawork998",
  },

  {
    icon: faLinkedin,
    url: "https://www.linkedin.com/in/thooi998",
  },

  {
    icon: faStackOverflow,
    url: "https://stackoverflow.com/users/15035136/ooi-teng-hao",
  },
];

//Function Header Element for scrolling
function Header() {
  // Function for handling clicks
  const handleClick = (anchor: unknown) => () => {
    const id = `${anchor}-section`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Initialise the useState Function for dynamic scrolling
  const [navbar, setNavbar] = useState(false);

  //Function Navbar for creating dynamic navbar opaque properties.
  const changeBackground = () => {
    if (window.scrollY >= 150) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  -window.addEventListener("scrollY", changeBackground);
  // console.log(window.scrollY);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      translateY={0}
      transitionProperty="transform"
      transitionDuration=".3s"
      transitionTimingFunction="ease-in-out"
      className={navbar ? "navbar active" : "navbar"}
    >
      <Box color="white" maxWidth="auto" margin="auto">
        <HStack
          px={16}
          py={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <nav>
            <HStack spacing={8}>
              {/* Add social media links based on the `socials` data */}
              {socials.map(({ icon, url }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={icon} size="2xl" key={url} />
                </a>
              ))}
            </HStack>
          </nav>

          <nav>
            <HStack spacing={8}>
              {/* Add links to Projects and Contact me section */}
              <a href="#projects" onClick={handleClick("projects")}>
                Projects
              </a>
              <a href="#contact-me" onClick={handleClick("contactme")}>
                Contact Me
              </a>
            </HStack>
          </nav>
        </HStack>
      </Box>
    </Box>
  );
}
export default Header;
