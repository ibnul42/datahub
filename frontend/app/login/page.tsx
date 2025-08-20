"use client";

import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext"; // ✅ Import context

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthContext(); // ✅ Access setUser from context

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (searchParams.get("registered")) {
      toast.success("Registered successfully! Please login.");
    }
  }, [searchParams]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          toast.error(
            "Validation error: " +
              data.errors.map((err: any) => err.msg).join(", ")
          );
        } else if (data.message) {
          toast.error(data.message);
        } else {
          toast.error("Login failed");
        }
        return;
      }

      // ✅ Save token in localStorage
      localStorage.setItem("token", data.token);

      // ✅ Update global user state immediately
      setUser(data.user);

      toast.success(`Welcome back, ${data.user.username}!`);

      // ✅ Redirect without reload
      router.push("/dashboard");
    } catch {
      toast.error("Failed to login. Please try again later.");
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-4 md:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            🔐 Login to DataHub
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your database management system
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="login-username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </form>
        <div className="text-center text-xs text-gray-500">
          Demo: Create an account or use existing credentials
        </div>
        <div className="text-center">
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Don't have an account? Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
