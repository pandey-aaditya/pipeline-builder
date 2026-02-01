import { useState } from "react";

export const useModal = () => {
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    details: null,
  });

  const openModal = (type, title, message, details = null) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      details,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  return { modal, openModal, closeModal };
};
