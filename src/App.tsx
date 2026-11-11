import { Route, Routes } from "react-router-dom"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { Home } from "./components/Home"
import { PerfumeDetail } from "./components/PerfumeDetail"
import { Login } from "./components/Login"
import { Cadastro } from "./components/Cadastro"

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 w-full font-sans">
      
      <Header />
      
      <main className="flex-grow w-full pt-16"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfume/:name" element={<PerfumeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App