import { Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Login from "./components/login";
import Signup from "./components/signup";
import FileInfo from "./components/file-info";
import axios from "axios";
import UserProfile from "./components/user";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useUserStore } from "@/stores/user";
import { toast } from "sonner";
import FileList from "./components/file-list";
import Otp from "./components/otp";

export default function Home() {
  const [modal, setModal] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const { user: userProfile, setUser } = useUserStore();

  const {
    isPending: loadingUser,
    data: user,
    refetch: mutateUser,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () =>
      axios.get("/api/user").then((res) => {
        setUser(res.data);
        return res.data;
      }),
    retry: 0,
  });

  const modals: { [key: string]: JSX.Element } = {
    login: (
      <Login
        onLoginSuccess={() => {
          setModal("");
          mutateUser();
          toast.success("Logged in successfully");
        }}
      />
    ),
    signup: (
      <Signup
        onSignupSuccess={() => {
          setModal("otp");
          mutateUser();
          toast.success("Signed up successfully");
        }}
      />
    ),
    "file-info": <FileInfo file={file} />,
    otp: (
      <Otp
        onVerify={() => {
          setModal("");
          mutateUser();
        }}
      />
    ),
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

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardItems = e.clipboardData?.items;
      if (!clipboardItems) return;

      for (const item of clipboardItems) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            setFile(file);
            setModal("file-info");
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    if (userProfile.id && !userProfile.isVerified) {
      setModal("otp");
    }
  }, [userProfile]);

  return (
    <div className="relative">
      <Head>
        <title>Dropp. • Effortless file hosting</title>
        <meta name="description" content="Effortless file hosting" />
        <link rel="icon" href="https://cdn.dropp.cloud/dropp-circle.png" />
      </Head>
      {!!modal && (
        <div
          className="absolute right-0 top-0 bg-black/80 z-50 backdrop-blur-lg w-full flex items-center justify-center h-screen px-5"
          onClick={() => {
            if (userProfile.id && !userProfile.isVerified && modal === "otp")
              return;
            setModal("");
          }}
        >
          {modals[modal]}
        </div>
      )}
      {isDragging && (
        <div className="absolute right-0 border-[6px] border-white/40 border-dashed p-4 top-0 bg-black/70 backdrop-blur-lg w-full flex items-center justify-center h-screen">
          <h1 className="text-6xl font-bold">Drop the file anywhere</h1>
        </div>
      )}
      <div className="flex items-center font-medium justify-between px-5 h-20 max-w-4xl mx-auto">
        <img src="https://cdn.dropp.cloud/dropp.png" className="" />
        {!loadingUser && (
          <>
            {user ? (
              <div className="flex items-center gap-x-5">
                <FileList />
                <UserProfile
                  user={user}
                  onLogout={() => window.location.reload()}
                />
              </div>
            ) : (
              <div className="flex items-center gap-x-3">
                <button onClick={() => setModal("login")}>Login</button>
                <button
                  className="px-4 py-2 rounded-full bg-white text-black"
                  onClick={() => setModal("signup")}
                >
                  Sign up
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex mt-24 items-center flex-col max-w-3xl mx-auto">
        <h1 className="lg:text-7xl text-6xl text-center">
          <span className="block">Effortless file </span>
          uploads for everyone
        </h1>
        {!userProfile.id && (
          <p className="lg:text-xl px-5 mt-5 text-center text-gray-400">
            Drag and drop anywhere to upload a file up to{" "}
            <span
              className="font-semibold underline cursor-pointer"
              data-tooltip-content="Up to 100MB if you're logged in"
              data-tooltip-id="tt"
              data-tooltip-variant="light"
            >
              25MB
            </span>
            . No login required.
          </p>
        )}

        <input
          type="file"
          className="hidden"
          ref={fileRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file!);
              setModal("file-info");
              fileRef.current!.value = "";
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
        {!userProfile.id && (
          <p className="text-xs italic mt-1">It's free, seriously.</p>
        )}
      </div>
    </div>
  );
}
