import { Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Login from "./components/login";
import Signup from "./components/signup";
import FileInfo from "./components/file-info";

export default function Home() {
  const [modal, setModal] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const modals: { [key: string]: JSX.Element } = {
    login: <Login />,
    signup: <Signup />,
    "file-info": <FileInfo file={file} />,
  };

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current += 1;
      if (dragCounter.current === 1) {
        setIsDragging(true);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current -= 1;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const file = e.dataTransfer?.files?.[0];
      if (file) {
        setFile(file);
        setModal("file-info");
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  return (
    <div className="relative">
      {!!modal && (
        <div
          className="absolute right-0 top-0 bg-black/10 backdrop-blur-sm w-full flex items-center justify-center h-screen"
          onClick={() => setModal("")}
        >
          {modals[modal]}
        </div>
      )}
      {isDragging && (
        <div className="absolute right-0 border-[6px] border-white/40 border-dashed p-4 top-0 bg-black/70 backdrop-blur-lg w-full flex items-center justify-center h-screen">
          <h1 className="text-6xl font-bold">Drop the file anywhere</h1>
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
        <h1 className="lg:text-7xl text-6xl text-center">
          <span className="block">Effortless file </span>
          uploads for everyone
        </h1>
        <p className="lg:text-xl px-5 mt-5 text-center text-gray-400">
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

        <input
          type="file"
          className="hidden"
          ref={fileRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file!);
              setModal("file-info");
            }
          }}
        />

        <button
          className="bg-white text-black px-10 py-4 rounded-full font-semibold mt-5 flex items-center gap-x-2"
          onClick={() => fileRef.current?.click()}
        >
          <Upload />
          Click to upload.
        </button>
        <p className="text-xs italic mt-1">It's free, seriously.</p>
      </div>
    </div>
  );
}
