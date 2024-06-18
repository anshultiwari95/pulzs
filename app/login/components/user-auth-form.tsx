"use client";
import * as React from "react";

import { useEffect, useState } from "react";

import { Label } from "../../components/label";
import { Input } from "../../components/input";

import { redirect, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import { z } from "zod";
import {fetchData} from "../../utils/axios"
interface ApiResponse {
  ok: boolean;
  success?: boolean; // This is optional, as it might not always be present
  error?: string; // This is optional, as it might not always be present
  // Add other properties as needed
}

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters" }),
});

async function validateInput(data) {
  try {
    await schema.parseAsync(data);
    return null;
  } catch (error) {
    return error.errors
      .map((e) => e.message)
      .filter((message) => !message.includes("Required"));
  }
}
export function UserAuthForm() {
  // const { push } = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const phonenumber = "123456789";
  const { data: session } = useSession() as { data: Session };
  const [errors, setErrors] = useState({ email: "", password: "" });

  const router = useRouter();
  // const [error, setError] = useState("");
  // const [token, setToken] = useState(localStorage.getItem("token") || "");
  // const [login, { data }] = useMutation(LOGIN_MUTATION);
  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
      // toast.success("Logged In");
    }
  });

  const validateField = async (name, value) => {
    const validationResult = await validateInput({ [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationResult ? validationResult : "",
    }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const emailError = await validateInput({ email });
    const passwordError = await validateInput({ password });
    setErrors({
      email: emailError
        ? emailError.find((e) => e.includes("Invalid email"))
        : null,
      password: passwordError
        ? passwordError.find((e) =>
            e.includes("Password should be at least 6 characters")
          )
        : null,
    });

    try {
      // if (errors) {
      //   toast.error("Invalid email or password.");
      //   return;
      // }
      setIsLoading(true);
      // Call your API endpoint for registration
      console.log("login response")
      const response = await fetchData({
        url: "/registerOrLogin",
        body: JSON.stringify({ email, password }),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        }
      });
      // if (response.ok) {
      // const responseData = await response.json();
      if (response) {
        // Registration successful, sign in the user
        await signIn("credentials", {
          email: email,
          password: password,
          phonenumber: phonenumber,
          redirect: false,
          // Add other necessary fields if needed
        });

        toast.success(response.message);
        // toast.success(response.message);
        // }
      } else {
        // const errorData = await response.json();
        // console.log("error data:", errorData);

        toast.error(`${response.message}`);
        router.push("/signup");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Something went wrong during registration");
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   // Save the token in localStorage when it changes
  //   localStorage.setItem("token", token);
  //   console.log(token);
  // }, [token]);

  return (
    // <form onSubmit={handleSubmit}>
    <form onSubmit={registerUser}>
      {/* {error && <p>Error: {error}</p>} */}
      <Label htmlFor="email">Email</Label>
      <Input
        type="email"
        id="email"
        value={email}
        // onChange={(e) => setEmail(e.target.value)}
        onChange={(e) => {
          setEmail(e.target.value);
          validateField("email", e.target.value);
        }}
        // onChange={handleChange}
        // onBlur={() => validateField("email", email)}
        required
      />
      {errors.email && <p className="text-red-500">{errors.email}</p>}
      <Label htmlFor="password">Password</Label>
      <Input
        type="password"
        id="password"
        value={password}
        // onChange={(e) => setPassword(e.target.value)}
        onChange={(e) => {
          setPassword(e.target.value);
          validateField("password", e.target.value);
        }}
        // onBlur={() => validateField("password", password)}
        required
      />
      {errors.password && <p className="text-red-500">{errors.password}</p>}
      {/* onClick={handleSubmit} */}
      {/* <Button type="submit" disabled={isLoading}>
        {isLoading ? "Logging up..." : "Login"}
      </Button> */}
      <button
        className="font-exbold bg-[#8645FF] h-10 text-[#F3E8FF] rounded-lg text-xl w-full mt-2"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Logging up..." : "Continue with email"}
      </button>
      {/* {JSON.stringify(session)} */}
    </form>
  );
}

function push(arg0: string) {
  throw new Error("Function not implemented.");
}
