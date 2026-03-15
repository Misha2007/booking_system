import { useSyncExternalStore } from "react";

const getIsAdminFromLocalStorage = () => {
  return localStorage.getItem("admin") || false;
};

const subscribe = (callback) => {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
};

const useIsAdminStore = () => {
  const isAdmin = useSyncExternalStore(subscribe, getIsAdminFromLocalStorage);

  const setIsAdmin = (isAdminNew) => {
    localStorage.setItem("admin", isAdminNew);
    window.dispatchEvent(new Event("storage"));
  };

  return [isAdmin, setIsAdmin];
};

export default useIsAdminStore;
