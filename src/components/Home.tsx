import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PerfumeCard } from './PerfumeCard';
import { perfumes } from '../data/perfumes';
import { FiArrowUpRight } from 'react-icons/fi';
import logo from '../assets/logo-perfumariaCS.png';

export function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const location = useLocation();
  const perfilUsuario = location.state?.perfilUsuario;

  // Efeito que faz o scroll automático se o utilizador vier do cadastro
  useEffect(() => {
    if (perfilUsuario) {
      // Usamos um pequeno atraso (300ms) para garantir que a página já foi desenhada pelo React
      setTimeout(() => {
        const elementoVIP = document.getElementById('perfil-analisado');
        if (elementoVIP) {
          elementoVIP.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [perfilUsuario]);

  const filteredPerfumes = perfumes.filter((perfume) => {
    const term = searchTerm.toLowerCase();
    const matchesName = perfume.name.toLowerCase().includes(term);
    const matchesBrand = perfume.brand.toLowerCase().includes(term);
    return matchesName || matchesBrand;
  });

  let recomendados: typeof perfumes = [];
  if (perfilUsuario) {
    const sensacao = perfilUsuario.sensacao;
    
    recomendados = perfumes.filter(p => {
      const texto = (p.description + " " + p.notes.join(" ")).toLowerCase();
      if (sensacao === 'Doce') return texto.includes('vanilla') || texto.includes('amber') || texto.includes('doce') || texto.includes('coffee') || texto.includes('oud');
      if (sensacao === 'Fresco') return texto.includes('fresh') || texto.includes('bergamot') || texto.includes('fresco') || texto.includes('citrus');
      if (sensacao === 'Floral') return texto.includes('floral') || texto.includes('jasmine') || texto.includes('rose') || texto.includes('flor');
      if (sensacao === 'Amadeirado') return texto.includes('wood') || texto.includes('cedar') || texto.includes('amadeirado') || texto.includes('oud');
      return true;
    }).slice(0, 3);

    if (recomendados.length === 0) recomendados = perfumes.slice(0, 3);
  }

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
              <a href="#produtos" className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-neutral-950 font-bold py-3 px-6 text-xs tracking-widest uppercase transition-colors">
                Explorar Perfumes <FiArrowUpRight className="text-lg" />
              </a>
              <Link to="/cadastro" className="flex items-center gap-2 border border-stone-600 hover:border-amber-500 text-white font-bold py-3 px-6 text-xs tracking-widest uppercase transition-colors">
                Encontre o seu <FiArrowUpRight className="text-lg" />
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center items-center min-h-[400px]">
            <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
            <div className="absolute w-64 h-64 md:w-80 md:h-80 border border-amber-600/20 rounded-full"></div>
            <img src={logo} alt="logo da marca" className="relative z-10 w-3/5 object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <section id="produtos" className="bg-stone-50 py-16 px-4 border-t border-stone-200">
        <div className="container mx-auto">
          
          {/* VITRINE VIP COM ID PARA O SCROLL AUTOMÁTICO */}
          {perfilUsuario && (
            <div id="perfil-analisado" className="mb-16 p-8 border border-amber-500/30 bg-white shadow-sm scroll-mt-24">
              <div className="text-center mb-8">
                <span className="text-amber-700 text-[10px] tracking-widest uppercase font-bold">Perfil Analisado</span>
                <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mt-2">
                  Seleção exclusiva para {perfilUsuario.nome.split(' ')[0]}
                </h2>
                <p className="text-stone-500 mt-2 text-sm max-w-lg mx-auto">
                  Com base no seu perfil <strong>{perfilUsuario.personalidade.toLowerCase()}</strong> e preferência por notas <strong>{perfilUsuario.sensacao.toLowerCase()}s</strong>, separamos estas 3 opções para <strong>{perfilUsuario.ocasiao.toLowerCase()}</strong>.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recomendados.map((perfume) => (
                  <PerfumeCard key={`rec-${perfume.id}`} perfume={perfume} />
                ))}
              </div>
            </div>
          )}

          {/* VITRINE GERAL */}
          <div className="text-center max-w-2xl mx-auto mb-10 mt-10">
            <span className="text-amber-700 text-xs tracking-widest uppercase font-bold">Catálogo Completo</span>
            <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mt-2 mb-4">Nossa Curadoria</h2>
          </div>

          <div className="max-w-xl mx-auto mb-12">
            <input
              type="text"
              placeholder="Buscar por perfume ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 bg-white border border-stone-300 text-stone-700 placeholder-stone-400 rounded focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all shadow-sm"
            />
          </div>

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