import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import { PerfumeCard } from "./components/PerfumeCard"
import { perfumes } from "./data/perfumes"
import { PerfumeDetail } from "./components/PerfumeDetail"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredPerfumes = perfumes.filter((perfume) => {
    const term = searchTerm.toLowerCase();
    const matchesName = perfume.name.toLowerCase().includes(term);
    const matchesBrand = perfume.brand.toLowerCase().includes(term);
    return matchesName || matchesBrand;
  });


  return (
    <>
      <div className="min-h-screen flex flex-col bg-purple-100 w-full">
        <Header />
        <main className="flex-grow w-full pt-20">
          <Routes>
            <Route path="/" element={<div className="container mx-auto p-4 bg-purple-100">

              <div className="max-w-md mx-auto mt-4">
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou marca"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-purple-900 rounded mt-4 mb-4 border-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              {filteredPerfumes.length === 0 ? (
                <div className="text-center text-purple-900 mt-4">Nenhum perfume encontrado.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {filteredPerfumes.map((perfume) => (
                    <PerfumeCard key={perfume.id} perfume={perfume} />
                  ))}
                </div>

              )}
            </div>} />
            <Route path="/perfume/:name" element={<PerfumeDetail />} />
          </Routes>
          <Footer />
        </main>

      </div>

    </>

  )
}

export default App
