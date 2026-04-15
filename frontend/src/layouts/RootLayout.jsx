import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <>
      <h1>My App</h1>
      <Outlet />
    </>
  );
}

export default RootLayout;
