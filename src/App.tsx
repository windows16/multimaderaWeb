
import { Route, Routes } from "react-router-dom"
import SideBar from "./components/layout/SideBar"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import NewPassword from "./pages/NewPassword"
import { ProtectedLayout } from "./components/common/ProtectedLayout"
import { UpdatePrompt } from "./components/layout/UpdateLayout"

export default function App() {

  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar" element={<ForgotPassword />} />
      <Route path="/recuperar/nueva" element={<NewPassword />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/*" element={<SideBar />} />
      </Route>
    </Routes>
    <UpdatePrompt />
    </>
  )
}


