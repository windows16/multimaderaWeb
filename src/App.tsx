
import { Route, Routes } from "react-router-dom"
import SideBar from "./components/layout/SideBar"
import Login from "./pages/Login"
import { ProtectedLayout } from "./components/common/ProtectedLayout"

export default function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/*" element={<SideBar />} />
      </Route>
    
    </Routes>
  )
}


