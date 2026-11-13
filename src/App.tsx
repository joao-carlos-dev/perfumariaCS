import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./components/Home";
import { PerfumeDetail } from "./components/PerfumeDetail";
import { Login } from "./components/Login";
import { Cadastro } from "./components/Cadastro";
import { Perfil } from "./components/Perfil";
import ReactGA from 'react-ga4';
import { useEffect } from "react";

// 1. Inicializa o Analytics com o seu ID (coloque o seu ID real aqui)
ReactGA.initialize('G-XXXXXXXXXX');

// 2. Componente invisível que regista as mudanças de página
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Envia o caminho da página atual para o Google Analytics
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return null;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 w-full font-sans">

      <Header />
      <AnalyticsTracker />
      <main className="flex-grow w-full pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfume/:name" element={<PerfumeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App