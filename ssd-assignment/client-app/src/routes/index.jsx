import { createBrowserRouter } from "react-router-dom";
import { Login, UserAccount, UserList } from "../pages";

export const router = createBrowserRouter([
  {
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "me",
        element: <UserAccount />,
      },
      {
        path: "users",
        element: <UserList />,
      },
    ],
  },
]);
