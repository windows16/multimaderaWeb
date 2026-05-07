
import { Route, Routes } from "react-router-dom"
import SideBar from "./components/layout/SideBar"
import Login from "./pages/Login"

export default function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<SideBar />} />
    </Routes>
  )
}


