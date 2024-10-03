import React, { FC, useState } from "react";
import axios from "axios";
import { LoginFormSchema, LoginFormState } from "../../lib/definitions";
import { LoaderCircle } from "lucide-react";

const Login: FC<{
  onLoginSuccess: () => void;
  forgotPasswordClick: () => void;
}> = ({ onLoginSuccess, forgotPasswordClick }) => {
  const [state, setState] = useState<LoginFormState>(undefined);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setState(undefined);

    const result = LoginFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setState({
        errors: {
          email: fieldErrors.email || [],
          password: fieldErrors.password || [],
        },
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/login", formData);
      onLoginSuccess();
    } catch (error: any) {
      setState({
        message:
          error.response.data.error || "Failed to login. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="w-full max-w-[400px] mx-auto bg-black-001 rounded-xl px-5 py-10 flex flex-col"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-center text-3xl font-bold">Dropp.</h2>
      <p className="text-center text-sm">Log into your account</p>
      <form className="w-full">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="bg-[#242424]/40 p-3 rounded-xl mt-7 outline-none w-full"
        />
        {state?.errors?.email && (
          <p className="text-sm text-red-500 mt-1">{state.errors.email[0]}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="bg-[#242424]/40 p-3 rounded-xl mt-5 outline-none w-full"
        />
        {state?.errors?.password && (
          <p className="text-sm text-red-500 mt-1">
            {state.errors.password[0]}
          </p>
        )}

        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <button
          className="bg-white text-black rounded-xl font-semibold p-3 mt-5 w-full disabled:opacity-50 flex items-center justify-center disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? <LoaderCircle className="animate-spin" /> : "Login"}
        </button>
      </form>
      <button className="mt-5 mx-auto w-fit" onClick={forgotPasswordClick}>
        Forgot password?
      </button>
    </div>
  );
};

export default Login;
