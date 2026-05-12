"use client";

import { useState } from "react";

import type { LoginInput, RegisterInput } from "../models/auth.types";
import { authService } from "../services/auth.service";

type Status = "idle" | "loading" | "success" | "error";

export function useAuthController() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function login(input: LoginInput) {
    try {
      setStatus("loading");
      setErrorMessage(null);
      const response = await authService.login(input);
      setStatus("success");

      return response;
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Falha no login");
      throw error;
    }
  }

  async function register(input: RegisterInput) {
    try {
      setStatus("loading");
      setErrorMessage(null);
      const response = await authService.register(input);
      setStatus("success");

      return response;
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Falha no cadastro");
      throw error;
    }
  }

  return {
    status,
    errorMessage,
    login,
    register,
  };
}
