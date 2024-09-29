import {
  Database,
  FileAudio,
  FileCheck,
  FileType,
  FileVideo,
  Images,
  Text,
} from "lucide-react";
import React, { FC } from "react";

const FileInfo: FC<{ file: File | null }> = ({ file }) => {
  const types: {
    [key: string]: React.ReactNode;
  } = {
    image: <Images size={150} />,
    video: <FileVideo size={150} />,
    audio: <FileAudio size={150} />,
    default: <FileCheck size={150} />,
  };

  const readableSize = (size: number) => {
    const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let i = 0;
    while (size >= 1024) {
      size /= 1024;
      i++;
    }
    return `${size?.toFixed(2)} ${units[i]}`;
  };

  const truncateFromEnd = (str: string, length: number) => {
    if (str.length > length) {
      return `...${str.substring(str.length - length)}`;
    }
    return str;
  };

  return (
    <div className="w-[600px] bg-black rounded-xl px-5 py-10 flex flex-col">
      <div className="flex items-center gap-x-10">
        <div className="">
          {types[file?.type.split("/")[0]!] || types["default"]}
        </div>
        <div className="flex flex-col gap-y-3 text-sm w-full">
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
          <button className="rounded-full px-10 py-3 bg-white text-black font-medium text-base w-full">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileInfo;
