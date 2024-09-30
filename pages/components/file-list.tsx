import {
  CircleX,
  Download,
  FileAudio,
  FileCheck,
  FileVideo,
  FolderClosed,
  Images,
  Loader,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import axios from "axios";
import { readableSize, truncateFromEnd } from "@/utils/files";
import { read } from "fs";
import { toast } from "sonner";

const FileList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true); // To check if there are more files to load
  const limit = 1; // Set the limit for pagination

  // Fetch files function
  const fetchFiles = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/files?page=${page}&limit=${limit}`
      );
      const { files: newFiles, totalPages } = response.data;

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setHasMore(page < totalPages); // Check if there are more pages to load
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError("Something went wrong while fetching files.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect to load files when the page changes
  useEffect(() => {
    fetchFiles(page);
  }, [page]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const types: {
    [key: string]: React.ReactNode;
  } = {
    image: <Images />,
    video: <FileVideo />,
    audio: <FileAudio />,
    default: <FileCheck />,
  };

  return (
    <div className={classNames("relative")}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <FolderClosed />
      </button>
      <div
        className={classNames(
          "absolute w-screen hidden h-[95vh] backdrop-blur-sm top-0 right-0 bg-black/20",
          {
            "lg:block": isOpen,
          }
        )}
        onClick={() => setIsOpen(!isOpen)}
      ></div>
      <div
        className={classNames(
          "bg-black-001 transition-all h-[95vh] translate-x-[150%] lg:top-4 lg:right-4 top-0 right-1 w-full lg:max-w-sm fixed z-10 shadow-lg rounded-md overflow-y-auto",
          {
            "!translate-x-0": isOpen,
          }
        )}
      >
        <div className="flex items-center justify-between sticky top-0 bg-black-001 px-7 py-4">
          <p className="font-semibold text-lg">Files</p>
          <button onClick={() => setIsOpen(false)}>
            <CircleX />
          </button>
        </div>

        <div className="flex flex-col gap-y-3 px-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-black/30 p-3 rounded-xl"
            >
              <div className="flex gap-x-2">
                {file?.type.includes("image") ? (
                  <img
                    src={file.url}
                    className="size-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="size-10 p-1 flex items-center justify-center bg-white/10 rounded-md flex-col">
                    {types[file?.type.split("/")[0]!] || types["default"]}
                    <p className="text-xs">.{file.extension}</p>
                  </div>
                )}
                <div className="text-sm">
                  <p>{truncateFromEnd(file.originalName, 15)}</p>
                  <p
                    className="text-xs text-gray-500 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(file.url);
                      toast.success("File URL copied to clipboard");
                    }}
                  >
                    {file.url}
                  </p>
                  <p className="text-xs text-gray-500">
                    {readableSize(file.size)}
                  </p>
                </div>
              </div>
              {/* <button
                onClick={() => {
                  const url = window.URL.createObjectURL(new Blob([file.url]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", file.generatedName);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download />
              </button> */}
            </div>
          ))}
        </div>
        <div className="w-full flex items-center justify-center my-5">
          {hasMore && !loading && (
            <button onClick={handleLoadMore} className="text-sm">
              Load More
            </button>
          )}
          {loading && !error && <Loader className="animate-spin" />}
        </div>
      </div>
    </div>
  );
};

export default FileList;
