import { Link } from 'react-router-dom';
import type { Perfume } from '../data/perfumes';

interface PerfumeCardProps {
    perfume: Perfume;
}

export function PerfumeCard({ perfume }: PerfumeCardProps) {
    return (
        <div className="border rounded-lg p-4 shadow-md bg-purple-400">
            <h1 className="text-xl font-bold text-purple-900">{perfume.name}</h1>
            <img src={perfume.image} alt={perfume.name} className="w-full h-48 object-cover rounded-lg mt-2 mb-2" />
            <p className="text-gray-800">{perfume.brand}</p>
            <p className="text-lg font-bold text-purple-900">${perfume.price.toFixed(2)}</p>
            <p className="text-gray-900">{perfume.description}</p>
            {perfume.notes.map((note, index) => (
                <span key={index} className="inline-block bg-purple-200 rounded-full px-3 py-1 text-sm font-semibold text-pink-500 mr-2 mb-2 border border-purple-900">
                    {note}
                </span>
            ))}
            <Link to={`/perfume/${perfume.name}`} className="mt-2 inline-block align-right bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-800">
                Saiba mais
            </Link>
        </div>
    );
}