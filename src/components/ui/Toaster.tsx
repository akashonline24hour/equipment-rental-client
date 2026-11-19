"use client";

import { ToastContainer } from "react-toastify";

export default function Toaster() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      theme="colored"
    />
  );
}