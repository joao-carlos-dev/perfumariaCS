import { useParams, Link } from 'react-router-dom';
import { perfumes } from '../data/perfumes';

export function PerfumeDetail() {
  const { name } = useParams<{ name: string }>();
  const perfume = perfumes.find((p) => p.name === name);

  if (!perfume) {
    return <div className="container mx-auto p-4 bg-purple-100">Perfume not found</div>;
  }

  return (
    <div className="container mx-auto p-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className="text-3xl font-bold text-purple-900">{perfume.name}</h1>
      <img src={perfume.image} alt={perfume.name} className="w-full h-48 object-cover rounded-lg mt-2 mb-2" />
      <p className="text-gray-800">{perfume.brand}</p>
      <p className="text-lg font-bold text-purple-900">${perfume.price.toFixed(2)}</p>
      <p className="text-gray-900">{perfume.description}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {perfume.notes.map((note, index) => (
            <span key={index} className="bg-purple-200 rounded-full px-3 py-1 text-sm font-semibold text-pink-500 mr-2 mb-2 border border-purple-900">
            {note}
            </span>
        ))}
      </div>
      Voltar para a <Link to="/" className="text-purple-900 font-bold hover:underline">Inicio</Link>
    </div>
  )
}   
