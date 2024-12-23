import {
  Copy,
  CopyCheck,
  Database,
  FileAudio,
  FileCheck,
  FileType,
  FileVideo,
  Images,
  LoaderCircleIcon,
  LoaderIcon,
  Text,
} from "lucide-react";
import React, { FC, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { toast } from "sonner";
import { readableSize, truncateFromEnd } from "@/utils/files";

const FileInfo: FC<{
  file: File | null;
  onLoginClick: () => void;
  onSignUpClick: () => void;
}> = ({ file, onLoginClick, onSignUpClick }) => {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [copyIcon, setCopyIcon] = useState(<Copy size={16} />);

  const { user } = useUserStore();

  if (!file) return null;

  const types: {
    [key: string]: React.ReactNode;
  } = {
    image: <Images size={150} />,
    video: <FileVideo size={150} />,
    audio: <FileAudio size={150} />,
    default: <FileCheck size={150} />,
  };

  const uploadFile = async () => {
    if (!file) return;

    const twentyFiveMB = 25 * 1024 * 1024;
    const oneHundredMB = 100 * 1024 * 1024;

    if (!user.id && file.size > twentyFiveMB) {
      toast.error("You need to be logged in to upload files larger than 25MB");
      return;
    }

    if (user.id && file.size > oneHundredMB) {
      toast.error("Max file size is 100MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFileUrl(data.secureUrl);
    } catch (error: any) {
      toast.error(
        error.response.data.error || "Something went wrong. Please try again"
      );
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (!fileUrl) return;

    navigator.clipboard.writeText(fileUrl).then(() => {
      setCopyButtonText("Copied");
      setCopyIcon(<CopyCheck size={16} />);
      setTimeout(() => {
        setCopyButtonText("Copy");
        setCopyIcon(<Copy size={16} />);
      }, 2000);
    });
  };

  return (
    <div
      className="w-full max-w-[700px] mx-auto bg-black-001 rounded-xl lg:px-10 px-7 py-10 flex lg:flex-row flex-col items-center gap-10"
      onClick={(e) => e.stopPropagation()}
    >
      {file?.type.includes("image") ? (
        <div className="lg:w-[50%] w-full h-[300px] rounded-md overflow-auto">
          <img
            src={URL.createObjectURL(file)}
            className="w-full h-auto rounded-md object-cover"
            style={{ minWidth: "100%", minHeight: "100%" }}
          />
        </div>
      ) : (
        <div className="lg:w-[50%] w-full h-[300px] flex items-center justify-center">
          {types[file?.type.split("/")[0]!] || types["default"]}
        </div>
      )}
      <div className="flex flex-col gap-y-3 text-sm w-full max-w-xs">
        <p
          className="flex items-center gap-x-2"
          data-tooltip-id="tt"
          data-tooltip-content={file?.name!}
        >
          <Text />
          {truncateFromEnd(file?.name!, 30)}
        </p>
        <p className="flex items-center gap-x-2">
          <FileType />
          {file?.type || "Unknown"}
        </p>
        <p className="flex items-center gap-x-2">
          <Database />
          {readableSize(file?.size!)}
        </p>

        {!fileUrl ? (
          <button
            onClick={uploadFile}
            disabled={uploading}
            className="rounded-full px-10 py-3 flex items-center justify-center bg-white text-black font-medium text-base w-full disabled:opacity-50 disabled:cursor-progress"
          >
            {uploading ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              "Upload"
            )}
          </button>
        ) : (
          <div className="flex flex-col gap-y-3 w-full">
            <p className="text-green-400">File uploaded successfully:</p>
            <div className="flex items-center justify-between gap-x-2 bg-[#242424]/40 p-2 rounded-full px-3">
              <input
                type="text"
                value={fileUrl}
                readOnly
                className="bg-transparent w-[80%] text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="size-10 rounded-full bg-white/10 flex items-center justify-center"
                data-tooltip-id="tt"
                data-tooltip-content={copyButtonText}
              >
                {copyIcon}
              </button>
            </div>
          </div>
        )}
        {!user.id && (
          <p className="text-xs bg-orange-700/10 text-orange-700 p-2 rounded-md">
            Guests uploads are deleted after 30 days.{" "}
            <span
              className="font-semibold underline cursor-pointer hover:text-white transition-colors"
              onClick={onLoginClick}
            >
              Login
            </span>{" "}
            or{" "}
            <span
              className="font-semibold underline cursor-pointer hover:text-white transition-colors"
              onClick={onSignUpClick}
            >
              Signup
            </span>{" "}
            to keep your files forever.
          </p>
        )}
      </div>
    </div>
  );
};

export default FileInfo;
