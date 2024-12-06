import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/**
 * Here, we specify all the paths
 */

import Username from "../../LoginComponents/Username";
import Password from "../../LoginComponents/Password";
import Register from "../../LoginComponents/Register";
import Profile from "../../LoginComponents/Profile";
import Recovery from "../../LoginComponents/Recovery";
import Reset from "../../LoginComponents/Reset";
import PageNotFound from "../../LoginComponents/PageNotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Username></Username>,
  },
  {
    path: "/username",
    element: <Username></Username>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/password",
    element: <Password></Password>,
  },
  {
    path: "/profile",
    element: <Profile></Profile>,
  },
  {
    path: "/recovery",
    element: <Recovery></Recovery>,
  },
  {
    path: "/reset",
    element: <Reset></Reset>,
  },
  {
    path: "*",
    element: <PageNotFound></PageNotFound>,
  },
]);

export default function LoginPage() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}
