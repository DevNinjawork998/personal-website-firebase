import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Text,
  Divider,
  HStack,
  useColorModeValue,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { authService } from "../services/authService";
import { FirebaseError } from "firebase/app";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    displayName?: string;
  }>({});

  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setDisplayName("");
    setErrors({});
    setIsSignUp(false);
    onClose();
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-in-use":
          return "This email is already registered. Please sign in instead.";
        case "auth/invalid-email":
          return "Invalid email address.";
        case "auth/weak-password":
          return "Password should be at least 6 characters.";
        case "auth/user-not-found":
          return "No account found with this email.";
        case "auth/wrong-password":
          return "Incorrect password.";
        case "auth/popup-closed-by-user":
          return "Sign-in popup was closed. Please try again.";
        case "auth/account-exists-with-different-credential":
          return "An account already exists with the same email but different sign-in method.";
        default:
          return error.message;
      }
    }
    return "An error occurred. Please try again.";
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      if (provider === "google") {
        await authService.signInWithGoogle();
      } else {
        await authService.signInWithGithub();
      }
      toast({
        title: "Success",
        description: "You have successfully signed in!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
      displayName?: string;
    } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignUp && !displayName) {
      newErrors.displayName = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await authService.signUpWithEmail(email, password, displayName);
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await authService.signInWithEmail(email, password);
        toast({
          title: "Welcome back",
          description: "You have successfully signed in!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>{isSignUp ? "Create Account" : "Sign In"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            {/* Social Sign In Buttons */}
            <Button
              w="full"
              leftIcon={<FontAwesomeIcon icon={faGoogle} />}
              colorScheme="red"
              variant="outline"
              onClick={() => handleSocialSignIn("google")}
              isLoading={loading}
            >
              Continue with Google
            </Button>

            <Button
              w="full"
              leftIcon={<FontAwesomeIcon icon={faGithub} />}
              colorScheme="gray"
              variant="outline"
              onClick={() => handleSocialSignIn("github")}
              isLoading={loading}
            >
              Continue with GitHub
            </Button>

            <HStack w="full">
              <Divider />
              <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
                or
              </Text>
              <Divider />
            </HStack>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} style={{ width: "100%" }}>
              <VStack spacing={4}>
                {isSignUp && (
                  <FormControl isInvalid={!!errors.displayName}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                    />
                    <FormErrorMessage>{errors.displayName}</FormErrorMessage>
                  </FormControl>
                )}

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Button type="submit" colorScheme="blue" w="full" isLoading={loading}>
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </VStack>
            </form>

            <Text fontSize="sm" color="gray.600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Button
                variant="link"
                colorScheme="blue"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </Button>
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
