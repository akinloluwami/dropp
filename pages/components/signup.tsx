import React from "react";
// import { useFormState, useFormStatus } from "react-dom";
// import { signup } from "../actions/auth/signup";

const Signup = () => {
  // const [state, action] = useFormState(signup, undefined);
  // const { pending } = useFormStatus();

  return (
    <form
      className="w-full max-w-[400px] mx-auto bg-black rounded-xl px-5 py-10 flex flex-col"
      // action={action}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-center text-3xl font-bold">Dropp.</h2>
      <p className="text-center text-sm">Create an account</p>
      <input
        type="text"
        placeholder="Name"
        name="name"
        className="bg-[#242424]/40 p-3 rounded-xl mt-7 outline-none"
      />
      {/* {state?.errors?.name && (
        <p className="text-sm text-red-500">{state.errors.name}</p>
      )} */}
      <input
        type="email"
        placeholder="Email"
        name="email"
        className="bg-[#242424]/40 p-3 rounded-xl mt-5 outline-none"
      />
      {/* {state?.errors?.email && (
        <p className="text-sm text-red-500">{state.errors.email}</p>
      )} */}
      <input
        type="password"
        placeholder="Password"
        name="password"
        className="bg-[#242424]/40 p-3 rounded-xl mt-5 outline-none"
      />
      {/* {state?.errors?.password && (
        <p className="text-sm text-red-500">{state.errors.password}</p>
      )} */}
      <input
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        className="bg-[#242424]/40 p-3 rounded-xl mt-5 outline-none"
      />
      {/* {state?.errors?.confirmPassword && (
        <p className="text-sm text-red-500">{state.errors.confirmPassword}</p>
      )} */}
      <button
        className="bg-white text-black rounded-xl font-semibold p-3 mt-5"
        // disabled={pending}
      >
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
