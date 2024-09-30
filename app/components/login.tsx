import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "../actions/auth/login";

const Login = () => {
  const [state, action] = useFormState(login, undefined);
  const { pending } = useFormStatus();
  return (
    <form
      className="w-full max-w-[400px] mx-auto bg-black rounded-xl px-5 py-10 flex flex-col"
      action={action}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-center text-3xl font-bold">Dropp.</h2>
      <p className="text-center text-sm">Log into your account</p>
      <input
        type="email"
        placeholder="Email"
        name="email"
        className="bg-[#242424]/40 p-3 rounded-xl mt-7 outline-none"
      />
      {state?.errors?.email && (
        <p className="text-sm text-red-500">{state.errors.email}</p>
      )}
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="bg-[#242424]/40 p-3 rounded-xl mt-5 outline-none"
      />
      {state?.errors?.password && (
        <p className="text-sm text-red-500">{state.errors.password}</p>
      )}
      <button
        className="bg-white text-black rounded-xl font-semibold p-3 mt-5"
        disabled={pending}
        type="submit"
      >
        {pending ? "..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
