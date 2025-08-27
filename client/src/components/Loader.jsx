import React from "react";

export default function Loader() {
  return (
    <div className="flex space-x-2 p-5">
      <div
        className="bg-black w-3 h-3 animate-bounce rounded-full"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="bg-black w-3 h-3 animate-bounce rounded-full"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="bg-black w-3 h-3 animate-bounce rounded-full"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );
}
