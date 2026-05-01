
import { Route, Routes } from "react-router-dom"
import MainLayout from "./components/MainLayout"
import Login from "./pages/Login"
import { useEffect } from "react";
import { statusApi } from "./services/api-client";

export default function App() {


  useEffect(() => {
    const fetchData = async () => {
      const result = await statusApi();
      console.log(result)
    };

    fetchData();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  )
}


