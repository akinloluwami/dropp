import React from "react";

const Login = () => {
  return (
    <div className="w-[400px] bg-black rounded-xl px-5 py-10 flex flex-col">
      <h2 className="text-center text-3xl font-bold">Dropp.</h2>
      <p className="text-center text-sm">Log into your account</p>
      <input
        type="email"
        placeholder="Email"
        className="bg-[#242424]/40 p-3 rounded-xl mt-7 outline-none"
      />
      <input
        type="password"
        placeholder="Password"
        className="bg-[#242424]/40 p-3 rounded-xl mt-5 outline-none"
      />
      <button className="bg-white text-black rounded-xl font-semibold p-3 mt-5">
        Login
      </button>
    </div>
  );
};

export default Login;
