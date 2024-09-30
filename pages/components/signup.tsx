import React, { FC, useState } from "react";
import axios from "axios";
import { SignupFormSchema, SignupFormState } from "../../lib/definitions";
import { LoaderCircle } from "lucide-react";

const fields = [
  {
    name: "name",
    type: "text",
    placeholder: "Name",
    errorKey: "name",
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email",
    errorKey: "email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    errorKey: "password",
  },
  {
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
    errorKey: "confirmPassword",
  },
];

const Signup: FC<{
  onSignupSuccess: () => void;
}> = ({ onSignupSuccess }) => {
  const [state, setState] = useState<SignupFormState>(undefined);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setState(undefined);

    const result = SignupFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setState({
        errors: {
          name: fieldErrors.name || [],
          email: fieldErrors.email || [],
          password: fieldErrors.password || [],
          confirmPassword: fieldErrors.confirmPassword || [],
        },
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/signup", formData);
      onSignupSuccess();
    } catch (error: any) {
      setState({
        message:
          error.response.data.error || "Failed to sign up. Please try again.",
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
    <form
      className="w-full max-w-[400px] mx-auto bg-black rounded-xl px-5 py-10 flex flex-col"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-center text-3xl font-bold">Dropp.</h2>
      <p className="text-center text-sm">Create an account</p>

      {fields.map((field) => (
        <div key={field.name}>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleInputChange}
            className="bg-[#242424]/40 p-3 rounded-xl mt-5 outline-none w-full"
          />

          {
            //@ts-ignore
            state?.errors?.[field.errorKey] && (
              <p className="text-sm text-red-500">
                {
                  //@ts-ignore
                  state.errors[field.errorKey]?.[0]
                }
              </p>
            )
          }
        </div>
      ))}

      {state?.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      <button
        className="bg-white text-black rounded-xl font-semibold p-3 mt-5 disabled:opacity-50 flex items-center justify-center disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? <LoaderCircle className="animate-spin" /> : "Sign Up"}
      </button>
    </form>
  );
};

export default Signup;
