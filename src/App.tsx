
import { Route, Routes } from "react-router-dom"
import MainLayout from "./components/MainLayout"
import Login from "./pages/Login"

export default function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  )
}


