"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const registrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      registrationSchema.parse({ email, password }); // Validate input

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await res.text();
      let data = null;

      if (responseText) {
        data = JSON.parse(responseText);
      }

      if (res.ok) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data?.message || "Registration failed");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message); // Show Zod validation error
      } else {
        setError("An error occurred during registration");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600"
        >
          Register
        </button>
        <p className="mt-4 text-sm">
          Already have an account?
          <a href="/login" className="text-blue-500 hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
