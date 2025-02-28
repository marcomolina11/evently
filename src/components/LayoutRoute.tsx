import { Outlet } from "react-router";
import Header from "./Header.tsx";

export default function LayoutRoute() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
