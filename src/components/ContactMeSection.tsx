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
  HStack,
  Text,
  Icon,
  useToast,
  Spinner,
  ScaleFade,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CheckIcon, EmailIcon } from "@chakra-ui/icons";
import FullScreenSection from "./FullScreenSection";
import { useAlertContext } from "../context/alertContext";
import { emailService, ContactFormData } from "../services/emailService";
import { env } from "../config/env";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  queryType: string;
  message: string;
};

type FormErrors = {
  firstName?: string;
  email?: string;
  message?: string;
};

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  queryType: "",
  message: "",
};

const queryTypes = [
  { value: "hireMe", label: "Freelance Project Proposal" },
  { value: "collaboration", label: "Collaboration Opportunity" },
  { value: "consultation", label: "Technical Consultation" },
  { value: "job", label: "Job Opportunity" },
  { value: "other", label: "Other" },
];

const ContactMeSection = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { onOpen } = useAlertContext();
  const toast = useToast();

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please fix the errors below",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const contactData: ContactFormData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        queryType: formData.queryType,
        message: formData.message.trim(),
      };

      const response = await emailService.sendContactEmail(contactData);

      if (response.success) {
        setIsSuccess(true);
        onOpen("success", response.message);

        // Reset form after successful submission
        setTimeout(() => {
          setFormData(initialFormData);
          setIsSuccess(false);
        }, 5000);

        // Check if this is a fallback method (no EmailJS configured)
        const isFallback = !env.EMAILJS_SERVICE_ID;

        toast({
          title: isFallback ? "Email client opened!" : "Message sent successfully!",
          description: isFallback
            ? "Your email client should open with a pre-filled message. If not, please email thooi998@gmail.com directly."
            : "I'll get back to you within 24 hours.",
          status: "success",
          duration: 7000,
          isClosable: true,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      onOpen("error", errorMessage);

      toast({
        title: "Failed to send message",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FullScreenSection
      isDarkBackground
      backgroundColor="rgba(0,0,0,0.8)"
      py={16}
      spacing={8}
      position="relative"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        w="150px"
        h="150px"
        bg="linear-gradient(45deg, #134e5e, #71b280)"
        borderRadius="full"
        opacity={0.1}
        filter="blur(40px)"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="10%"
        w="200px"
        h="200px"
        bg="linear-gradient(45deg, #4568dc, #b06ab3)"
        borderRadius="full"
        opacity={0.1}
        filter="blur(30px)"
      />

      <VStack spacing={12} w="full" maxW="800px" mx="auto" px={4}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <VStack spacing={4} textAlign="center">
            <Heading
              as="h1"
              id="contactme-section"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              bgGradient="linear(to-r, #2193b0, #6dd5ed)"
              bgClip="text"
            >
              Get In Touch
            </Heading>
            <Text
              color="gray.300"
              fontSize={{ base: "md", md: "lg" }}
              maxW="600px"
              lineHeight="1.6"
            >
              Have a project in mind or want to collaborate? I'd love to hear from you. Send me a
              message and I'll respond within 24 hours.
            </Text>
          </VStack>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Box
            w="full"
            maxW="600px"
            mx="auto"
            p={8}
            bg="rgba(255, 255, 255, 0.05)"
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.1)"
            boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                {/* Name Fields */}
                <HStack spacing={4} w="full">
                  <FormControl isInvalid={!!errors.firstName} isRequired>
                    <FormLabel color="white" fontWeight="medium">
                      First Name *
                    </FormLabel>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Your first name"
                      bg="rgba(255, 255, 255, 0.1)"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.2)"
                      color="white"
                      _placeholder={{ color: "gray.400" }}
                      _focus={{
                        borderColor: "#2193b0",
                        boxShadow: "0 0 0 1px #2193b0",
                      }}
                    />
                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="medium">
                      Last Name
                    </FormLabel>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Your last name"
                      bg="rgba(255, 255, 255, 0.1)"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.2)"
                      color="white"
                      _placeholder={{ color: "gray.400" }}
                      _focus={{
                        borderColor: "#2193b0",
                        boxShadow: "0 0 0 1px #2193b0",
                      }}
                    />
                  </FormControl>
                </HStack>

                {/* Email and Phone */}
                <HStack spacing={4} w="full">
                  <FormControl isInvalid={!!errors.email} isRequired>
                    <FormLabel color="white" fontWeight="medium">
                      Email Address *
                    </FormLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      bg="rgba(255, 255, 255, 0.1)"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.2)"
                      color="white"
                      _placeholder={{ color: "gray.400" }}
                      _focus={{
                        borderColor: "#2193b0",
                        boxShadow: "0 0 0 1px #2193b0",
                      }}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="medium">
                      Phone Number
                    </FormLabel>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      bg="rgba(255, 255, 255, 0.1)"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.2)"
                      color="white"
                      _placeholder={{ color: "gray.400" }}
                      _focus={{
                        borderColor: "#2193b0",
                        boxShadow: "0 0 0 1px #2193b0",
                      }}
                    />
                  </FormControl>
                </HStack>

                {/* Company */}
                <FormControl>
                  <FormLabel color="white" fontWeight="medium">
                    Company/Organization
                  </FormLabel>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Your company name"
                    bg="rgba(255, 255, 255, 0.1)"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{
                      borderColor: "#2193b0",
                      boxShadow: "0 0 0 1px #2193b0",
                    }}
                  />
                </FormControl>

                {/* Query Type */}
                <FormControl>
                  <FormLabel color="white" fontWeight="medium">
                    Type of Inquiry
                  </FormLabel>
                  <Select
                    id="queryType"
                    name="queryType"
                    value={formData.queryType}
                    onChange={(e) => handleInputChange("queryType", e.target.value)}
                    bg="rgba(255, 255, 255, 0.1)"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    color="white"
                    _focus={{
                      borderColor: "#2193b0",
                      boxShadow: "0 0 0 1px #2193b0",
                    }}
                  >
                    <option
                      value=""
                      style={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        color: "white",
                      }}
                    >
                      Select an option
                    </option>
                    {queryTypes.map((type) => (
                      <option
                        key={type.value}
                        value={type.value}
                        style={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          color: "white",
                        }}
                      >
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Message */}
                <FormControl isInvalid={!!errors.message} isRequired>
                  <FormLabel color="white" fontWeight="medium">
                    Your Message *
                  </FormLabel>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell me about your project, idea, or how I can help you..."
                    height="200px"
                    bg="rgba(255, 255, 255, 0.1)"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{
                      borderColor: "#2193b0",
                      boxShadow: "0 0 0 1px #2193b0",
                    }}
                    resize="vertical"
                  />
                  <FormErrorMessage>{errors.message}</FormErrorMessage>
                </FormControl>

                {/* Submit Button */}
                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  width="full"
                  height="50px"
                  fontSize="lg"
                  fontWeight="semibold"
                  bgGradient="linear(to-r, #2193b0, #6dd5ed)"
                  _hover={{
                    bgGradient: "linear(to-r, #6dd5ed, #2193b0)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                  disabled={isSubmitting}
                  transition="all 0.3s ease"
                >
                  {isSubmitting ? (
                    <HStack spacing={2}>
                      <Spinner size="sm" />
                      <Text>Sending Message...</Text>
                    </HStack>
                  ) : (
                    <HStack spacing={2}>
                      <Icon as={EmailIcon} />
                      <Text>Send Message</Text>
                    </HStack>
                  )}
                </Button>
              </VStack>
            </form>
          </Box>
        </motion.div>

        {/* Success Animation */}
        <ScaleFade in={isSuccess} initialScale={0.8}>
          <Box
            p={6}
            bg="rgba(34, 197, 94, 0.1)"
            border="1px solid"
            borderColor="green.400"
            borderRadius="xl"
            textAlign="center"
          >
            <Icon as={CheckIcon} color="green.400" boxSize={8} mb={2} />
            <Text color="green.400" fontWeight="semibold" mb={2}>
              {!env.EMAILJS_SERVICE_ID
                ? "Email client opened! Check your default email application."
                : "Message sent successfully! I'll get back to you soon."}
            </Text>
            {!env.EMAILJS_SERVICE_ID && (
              <Text color="gray.300" fontSize="sm">
                If your email client didn't open, please email me directly at thooi998@gmail.com
              </Text>
            )}
          </Box>
        </ScaleFade>
      </VStack>
    </FullScreenSection>
  );
};

export default ContactMeSection;
