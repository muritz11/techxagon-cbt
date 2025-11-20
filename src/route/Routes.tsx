// import { Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Quiz from "../pages/Quiz";
import Admin from "../pages/Admin";
import ErrorPage from "../pages/ErrorPage";
// import RoutesAuth from "./RoutesAuth";
// import Layout from "../components/dashboard/Layout";

// export const Loadable = (Component: any) => (props: any) => {
//   return (
//     <Suspense
//       fallback={
//         <div
//           style={{
//             width: "100%",
//             height: "100vh",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <p className="italic">loading...</p>
//         </div>
//       }
//     >
//       <Component {...props} />
//     </Suspense>
//   );
// };

const Routes = () => {
  let router = createBrowserRouter([
    // auth
    {
      path: "/",
      element: (
        <>
          <Outlet />
        </>
      ),
      children: [
        { path: "", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/start-quiz", element: <Quiz /> },
        { path: "/admin", element: <Admin /> },
      ],
      errorElement: <ErrorPage />,
    },
    // {
    //   path: "/admin",
    //   element: <RoutesAuth children={<Layout />} />,
    //   children: [
    //     {
    //       path: "",
    //       element: <GDriveCallback />,
    //     },
    //   ],
    // },
  ]);

  return router;
};

export default Routes;
