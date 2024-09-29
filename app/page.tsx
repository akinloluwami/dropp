"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import Login from "./components/login";
import Signup from "./components/signup";

export default function Home() {
  const [modal, setModal] = useState("");

  const modals: {
    [key: string]: JSX.Element;
  } = {
    login: <Login />,
    signup: <Signup />,
  };

  return (
    <div className="relative">
      {!!modal && (
        <div
          className="absolute right-0 top-0 bg-black/10 backdrop-blur-sm w-full flex items-center justify-center h-screen"
          onClick={() => setModal("")}
        >
          <div className="" onClick={(e) => e.stopPropagation()}>
            {modals[modal]}
          </div>
        </div>
      )}
      <div className="flex items-center font-medium justify-between p-5 max-w-4xl mx-auto">
        <p className="font-semibold">Dropp.</p>
        <div className="flex items-center gap-x-3">
          <button onClick={() => setModal("login")}>Login</button>
          <button
            className="px-4 py-2 rounded-full bg-white text-black"
            onClick={() => setModal("signup")}
          >
            Sign up
          </button>
        </div>
      </div>
      <div className="flex mt-24 items-center flex-col max-w-3xl mx-auto">
        <h1 className="text-7xl text-center">
          Effortless file uploads for everyone
        </h1>
        <p className="text-xl mt-5 text-center text-[#606060]">
          Drag and drop anywhere to upload a file up to{" "}
          <span
            className="font-semibold underline cursor-pointer"
            data-tooltip-content="Up to 150MB if you're logged in"
            data-tooltip-id="tt"
            data-tooltip-variant="light"
          >
            25MB
          </span>
          . No login required.
        </p>
        <button className="bg-white text-black px-10 py-4 rounded-full font-semibold mt-5 flex items-center gap-x-2">
          <Upload />
          Click to upload.
        </button>
        <p className="text-xs italic mt-1">It's free, seriously.</p>
      </div>
    </div>
  );
}
