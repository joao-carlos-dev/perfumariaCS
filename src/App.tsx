import { PerfumeCard } from "./components/PerfumeCard"
import { perfumes } from "./data/perfumes"

function App() {
 

  return (
    <div className="container mx-auto p-4 bg-purple-100">
      <h1 className="text-3xl font-bold text-purple-900">Perfumaria CS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {perfumes.map((perfume) => (
          <PerfumeCard key={perfume.id} perfume={perfume} />
        ))}
      </div>
    </div>
  )
}

export default App
