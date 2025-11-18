import { RouterProvider } from "react-router-dom";
import Routes from "./route/Routes";


function App() {

  return (
    <>
      <RouterProvider router={Routes()} />
    </>
  )
}

export default App
