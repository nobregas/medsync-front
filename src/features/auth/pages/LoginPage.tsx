import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAuth } from "@/hooks/useAuth";

import { loginSchema, type LoginFormData } from "../schemas";

type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setIsLoading(true);

    const success = await login(result.data);

    setIsLoading(false);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("E-mail ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <svg
            className="login-logo"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="64" height="64" rx="16" fill="var(--color-primary-500)" />
            <path
              d="M32 16C23.164 16 16 23.164 16 32C16 40.836 23.164 48 32 48C40.836 48 48 40.836 48 32C48 23.164 40.836 16 32 16ZM32 44C25.373 44 20 38.627 20 32C20 25.373 25.373 20 32 20C38.627 20 44 25.373 44 32C44 38.627 38.627 44 32 44Z"
              fill="white"
            />
            <path
              d="M32 24C27.582 24 24 27.582 24 32C24 36.418 27.582 40 32 40C36.418 40 40 36.418 40 32C40 27.582 36.418 24 32 24ZM32 36C29.791 36 28 34.209 28 32C28 29.791 29.791 28 32 28C34.209 28 36 29.791 36 32C36 34.209 34.209 36 32 36Z"
              fill="white"
            />
            <circle cx="32" cy="32" r="4" fill="white" />
          </svg>
          <h1 className="login-title">MedSync</h1>
          <p className="login-subtitle">Sistema Administrativo para Clínicas</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="login-error">{error}</p>}

          <Input
            type="email"
            name="email"
            label="E-mail"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            type="password"
            name="password"
            label="Senha"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
            disabled={isLoading}
          />

          <Button type="submit" isLoading={isLoading}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
