import React, { FormEvent, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import useSubmit from "../hooks/useSubmit.js";
import { useAlertContext } from "../context/alertContext";

type FormData = {
  firstName: string;
  email: string;
  querType: string;
};

const initialDataForm: FormData = {
  firstName: "",
  email: "",
  querType: "",
};
const LandingSection = () => {
  const [data, setData] = useState(initialDataForm);

  function updateFields(fields: Partial<FormData>) {
    setData((prev) => {
      return {
        ...prev,
        ...fields,
      };
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
  }
  useSubmit();
  useAlertContext();

  return (
    <FullScreenSection
      isDarkBackground
      backgroundColor="rgba(0,0,0,0.5)"
      py={16}
      spacing={8}
    >
      <VStack w="100vh" p={10} alignItems="flex-start">
        <Heading as="h1" id="contactme-section">
          Contact me
        </Heading>
        <Box p={6} rounded="md" w="100%">
          <form>
            <VStack spacing={4}>
              <FormControl isInvalid={false}>
                <FormLabel htmlFor="firstName">Name</FormLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  {...data}
                  onChange={(e) => updateFields({ firstName: e.target.value })}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={false}>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  {...data}
                  onChange={(e) => updateFields({ email: e.target.value })}
                />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="type">Type of enquiry</FormLabel>
                <Select
                  id="type"
                  name="type"
                  {...data}
                  onChange={(e) => updateFields({ querType: e.target.value })}
                >
                  <option
                    value="hireMe"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    Freelance project proposal
                  </option>
                  <option
                    value="openSource"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    Open source consultancy session
                  </option>
                  <option
                    value="other"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    Other
                  </option>
                </Select>
              </FormControl>
              <FormControl isInvalid={false}>
                <FormLabel htmlFor="comment">Your message</FormLabel>
                <Textarea id="comment" name="comment" height={250} />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
              <Button
                type="submit"
                colorScheme="purple"
                width="full"
                onSubmit={onSubmit}
              >
                Submit
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </FullScreenSection>
  );
};

export default LandingSection;
