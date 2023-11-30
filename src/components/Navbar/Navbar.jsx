import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "./../../firebase.js";
import { PasswordField } from "../PasswordField.jsx";

export default function Navbar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSignIn, setIsSignIn] = useState(true);
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const passwordRef = useRef();

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      setUser(user);
      props?.setUser(user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, [props, setUser, user]);

  const handlerSignIn = async () => {
    const password = passwordRef.current.value;
    console.log(auth);
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        onClose();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode, errorMessage);
      });
  };

  const handlerCreateAccount = async () => {
    const password = passwordRef.current.value;
    await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        onClose();
        updateProfile(auth.currentUser, {
          displayName: name,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode, errorMessage);
      });
  };

  if (user) {
    return (
      <div className="navbar">
        <h2>Kanban Board</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {user?.displayName && (
            <h5 style={{ margin: 0 }}>Welcome, {user?.displayName}</h5>
          )}
          <Button
            variant="ghost"
            onClick={() => {
              signOut(auth).then(() => {
                setUser("");
                props?.setLocalData([]);
              });
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar">
      <h2>Kanban Board</h2>
      <div>
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          style={{ transition: "all 200ms" }}
          onChange={props.switchTheme}
        />
        <Button
          variant="ghost"
          onClick={() => {
            onOpen();
            setIsSignIn(true);
          }}
        >
          Sign In
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            onOpen();
            setIsSignIn(false);
          }}
        >
          Sign Up
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isSignIn ? `Sign In` : "Sign Up"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box
                py={{ base: "0", sm: "8" }}
                px={{ base: "4", sm: "10" }}
                bg={{ base: "transparent", sm: "bg.surface" }}
                borderRadius={{ base: "none", sm: "xl" }}
              >
                <Stack spacing="6">
                  <Stack spacing="5">
                    {!isSignIn && (
                      <FormControl>
                        <FormLabel htmlFor="email">Full Name</FormLabel>
                        <Input
                          id="name"
                          type="text"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                      </FormControl>
                    )}
                    <FormControl>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        id="email"
                        type="email"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </FormControl>

                    <PasswordField ref={passwordRef} />
                  </Stack>
                </Stack>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  (isSignIn ? handlerSignIn : handlerCreateAccount)();
                }}
              >
                {isSignIn ? `Sign In` : "Sign Up"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
