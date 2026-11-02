import type { Perfume } from '../data/perfumes';

interface PerfumeCardProps {
    perfume: Perfume;
}

export function PerfumeCard({ perfume }: PerfumeCardProps) {
    return (
        <div className="border rounded-lg p-4 shadow-md">
            <h1>{perfume.name}</h1>
            <p>{perfume.brand}</p>
            <p>${perfume.price.toFixed(2)}</p>
            <p>{perfume.description}</p>
            {perfume.notes.map((note, index) => (
                <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {note}
                </span>
            ))}
        </div>
    );
}