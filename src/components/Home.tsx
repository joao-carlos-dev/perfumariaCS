import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PerfumeCard } from './PerfumeCard';
import { perfumes } from '../data/perfumes';
import logo from '../assets/logo-perfumariaCS.png';

export function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPerfumes = perfumes.filter((perfume) => {
    const term = searchTerm.toLowerCase();
    const matchesName = perfume.name.toLowerCase().includes(term);
    const matchesBrand = perfume.brand.toLowerCase().includes(term);
    return matchesName || matchesBrand;
  });

  return (
    <div className="w-full flex flex-col">
      
      {/* SECÇÃO HERO (Banner Escuro Premium) */}
      <section className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white pt-24 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <div className="z-10">
            <span className="text-amber-600 text-xs tracking-[0.2em] uppercase font-bold mb-4 block">
              Carlos Souza · Perfumaria
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 leading-tight tracking-tight">
              Sua presença começa pela <i className="text-amber-500 font-light italic">fragrância.</i>
            </h1>
            <p className="text-stone-400 mb-8 max-w-md text-sm md:text-base leading-relaxed">
              Perfumes árabes e importados escolhidos para quem transforma cada momento em uma assinatura inesquecível.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#produtos" 
                className="bg-amber-600 hover:bg-amber-700 text-neutral-950 font-bold py-3 px-6 text-xs tracking-widest uppercase transition-colors"
              >
                Explorar Perfumes ↗
              </a>
              <Link 
                to="/cadastro" 
                className="border border-stone-600 hover:border-amber-500 text-white font-bold py-3 px-6 text-xs tracking-widest uppercase transition-colors"
              >
                Encontre o seu ↗
              </Link>
            </div>
          </div>

          {/* Imagem de Destaque com efeito de Halo */}
          <div className="relative flex justify-center items-center min-h-[400px]">
            <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
            <div className="absolute w-64 h-64 md:w-80 md:h-80 border border-amber-600/20 rounded-full"></div>
            
            {/* Substitua o src por uma imagem real do seu projeto depois */}
            <img 
              src={logo} 
              alt="Perfume Destaque" 
              className="relative z-10 w-3/5 object-contain  drop-shadow-2xl"
            />
          </div>
          
        </div>
      </section>

      {/* SECÇÃO DE PRODUTOS (Fundo Claro/Creme) */}
      <section id="produtos" className="bg-stone-50 py-16 px-4 border-t border-stone-200">
        <div className="container mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-amber-700 text-xs tracking-widest uppercase font-bold">Nossa Curadoria</span>
            <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mt-2 mb-4">Perfumes em destaque</h2>
          </div>

          {/* Barra de Pesquisa */}
          <div className="max-w-xl mx-auto mb-12">
            <input
              type="text"
              placeholder="Buscar por perfume ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 bg-white border border-stone-300 text-stone-700 placeholder-stone-400 rounded focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all shadow-sm"
            />
          </div>

          {/* Grid de Perfumes */}
          {filteredPerfumes.length === 0 ? (
            <div className="text-center text-stone-500 py-10 border border-dashed border-stone-300">
              Nenhum perfume encontrado. Tente outro nome ou marca.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPerfumes.map((perfume) => (
                <PerfumeCard key={perfume.id} perfume={perfume} />
              ))}
            </div>
          )}
          
        </div>
      </section>
      
    </div>
  );
}