"use client";

import { useState } from "react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

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
      const message = error instanceof Error ? error.message : "";
      
      // Tentativa de extrair mensagem específica do Zod
      try {
        if (message.includes("[") && message.includes("message")) {
          const parsed = JSON.parse(message);
          if (Array.isArray(parsed) && parsed[0]?.message) {
            setErrorMessage(parsed[0].message);
            throw error;
          }
        }
      } catch (e) { /* fallback */ }

      if (message.includes("[") || message.includes("validation") || message.includes("code")) {
        setErrorMessage("E-mail ou senha inválidos");
      } else if (message === "Unauthorized" || message.includes("401") || message.includes("Invalid login credentials")) {
        setErrorMessage("E-mail ou senha incorretos");
      } else if (message.includes("Invalid API key")) {
        setErrorMessage("Erro na configuração do serviço de autenticação.");
      } else if (message.includes("fetch failed") || message.includes("Failed to fetch")) {
        setErrorMessage("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
      } else {
        setErrorMessage(message || "Falha no login");
      }
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
      const message = error instanceof Error ? error.message : "";

      // Tentativa de extrair mensagem específica do Zod
      try {
        if (message.includes("[") && message.includes("message")) {
          const parsed = JSON.parse(message);
          if (Array.isArray(parsed) && parsed[0]?.message) {
            setErrorMessage(parsed[0].message);
            throw error;
          }
        }
      } catch (e) { /* fallback */ }
      
      if (message.includes("[") || message.includes("validation") || message.includes("code")) {
        setErrorMessage("Verifique se todos os campos foram preenchidos corretamente");
      } else if (message.includes("fetch failed") || message.includes("Failed to fetch")) {
        setErrorMessage("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
      } else if (message.includes("prisma") || message.includes("database") || message.includes("table") || message.includes("invocation")) {
        setErrorMessage("Erro interno ao processar seu cadastro. Tente novamente em alguns instantes.");
      } else if (message.includes("User already exists") || message.includes("already registered")) {
        setErrorMessage("Este e-mail já está cadastrado.");
      } else {
        setErrorMessage("Ocorreu um erro no cadastro. Verifique os dados e tente novamente.");
      }
      throw error;
    }
  }

  function reset() {
    setStatus("idle");
    setErrorMessage(null);
  }

  const router = useRouter();

  function logout() {
    deleteCookie("inoveesg_token");
    router.push("/");
    router.refresh();
  }

  return {
    status,
    errorMessage,
    login,
    register,
    reset,
    logout,
  };
}
