import { Link } from 'react-router-dom';
import type { Perfume } from '../data/perfumes';
import { FiArrowUpRight } from 'react-icons/fi';

interface PerfumeCardProps {
    perfume: Perfume;
}

export function PerfumeCard({ perfume }: PerfumeCardProps) {
    return (
        <div className="bg-white border border-stone-200 hover:border-amber-500 transition-colors flex flex-col h-full shadow-sm">
            
            {/* Área da Imagem */}
            <div className="bg-stone-100 p-6 flex justify-center items-center h-56 relative overflow-hidden">
                <img src={perfume.image} alt={perfume.name} className="h-full object-contain mix-blend-multiply" />
            </div>
            
            {/* Informações do Produto */}
            <div className="p-5 flex flex-col flex-grow">
                <span className="text-amber-700 text-[10px] font-bold tracking-widest uppercase mb-1">
                    {perfume.brand}
                </span>
                
                <h3 className="font-serif text-xl text-neutral-900 mb-2">{perfume.name}</h3>
                
                <p className="text-xs text-stone-500 mb-4 flex-grow line-clamp-3">
                    {perfume.description}
                </p>
                
                <div className="flex justify-between items-end mt-auto">
                    <div>
                        <span className="block text-[10px] text-stone-400 font-semibold uppercase tracking-wider mb-1">
                            Valor
                        </span>
                        <span className="font-bold text-lg text-neutral-900">
                            ${perfume.price.toFixed(2)}
                        </span>
                    </div>
                    
                    <Link 
                        to={`/perfume/${perfume.name}`} 
                        className="bg-neutral-900 hover:bg-amber-600 text-white hover:text-neutral-900 text-[10px] font-bold tracking-widest uppercase px-4 py-2 transition-colors"
                    >
                        Saiba mais <FiArrowUpRight className="text-lg inline-block" />
                    </Link>
                </div>
            </div>
        </div>
    );
}