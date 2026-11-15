import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowUpRight, FiSearch } from 'react-icons/fi';
import { supabase } from '../supabase';

interface Perfume {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  sensacao_indicada: string;
}

export function Home() {
  const location = useLocation();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [perfilUsuario, setPerfilUsuario] = useState<any>(null);
  const [busca, setBusca] = useState('');

  // Número do WhatsApp da loja (Substitua pelo seu com o código do país e DDD, sem espaços. Ex: 5548991268854)
  const WHATSAPP_NUMERO = '5548999999999';

  useEffect(() => {
    let perfil = location.state?.perfilUsuario;
    if (!perfil) {
      const guardado = localStorage.getItem('perfilCompleto');
      if (guardado) perfil = JSON.parse(guardado);
    }
    setPerfilUsuario(perfil);

    const carregarCatálogo = async () => {
      try {
        const { data, error } = await supabase.from('perfumes').select('*');
        if (error) throw error;
        setPerfumes(data || []);
      } catch (error) {
        console.error("Erro ao carregar perfumes:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarCatálogo();
  }, [location.state]);

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valor);
  };

  // Separa os perfumes recomendados dos restantes
  const perfumesRecomendados = perfilUsuario
    ? perfumes.filter(p => p.sensacao_indicada === perfilUsuario.sensacao).slice(0, 3)
    : [];

  // Filtra o catálogo completo pela barra de pesquisa
  const catalogoFiltrado = perfumes.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.marca.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-24">

      {loading ? (
        <div className="flex justify-center py-32 text-stone-400 text-sm tracking-widest uppercase animate-pulse">
          A carregar catálogo...
        </div>
      ) : (
        <div className="max-w-350 mx-auto px-6">

          {/* SECÇÃO VIP: SELEÇÃO EXCLUSIVA */}
          {perfilUsuario && perfumesRecomendados.length > 0 && (
            <section className="py-16 border-b border-stone-200 mb-16 animate-fade-in">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-[10px] text-amber-700 font-bold tracking-[0.2em] uppercase">Perfil Analisado</span>
                <h2 className="text-3xl font-serif text-stone-900 mt-2 mb-4">
                  Seleção exclusiva para {perfilUsuario.nome.split(' ')[0]}
                </h2>
                <p className="text-stone-500 text-sm">
                  Com base no seu perfil <strong>{perfilUsuario.personalidade.toLowerCase()}</strong> e preferência por notas <strong>{perfilUsuario.sensacao.toLowerCase()}s</strong>, separamos estas opções para <strong>{perfilUsuario.ocasiao.toLowerCase()}</strong>.
                </p>
              </div>

              {/* Grelha de Recomendações - Proporções ajustadas */}
              <div className="flex justify-center flex-wrap gap-6">
                {perfumesRecomendados.map(perfume => (
                  <div key={`rec-${perfume.id}`} className="bg-white border border-stone-200 flex flex-col group w-full max-w-90">

                    {/* Área da Imagem Fixa e Menor */}
                    <div className="bg-stone-100 h-70 w-full p-8 flex items-center justify-center overflow-hidden">
                      {perfume.imagem_url ? (
                        <img src={perfume.imagem_url} alt={perfume.nome} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-stone-200/50 flex items-center justify-center text-stone-400 font-serif text-xl">
                          {perfume.nome}
                        </div>
                      )}
                    </div>

                    {/* Área de Texto Compacta */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[10px] text-amber-700 font-bold tracking-widest uppercase mb-1 block">
                          {perfume.marca}
                        </span>
                        <h3 className="font-serif text-[22px] text-stone-900 mb-2">{perfume.nome}</h3>
                        <p className="text-stone-500 text-[13px] leading-relaxed line-clamp-2">{perfume.descricao}</p>
                      </div>
                      <div className="mt-8 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest block mb-1">Valor</span>
                          <span className="font-bold text-stone-900 text-lg">{formatarPreco(perfume.preco)}</span>
                        </div>
                        <Link
                          to={`/perfume/${perfume.id}`}
                          state={{ perfume, perfilUsuario }}
                          className="bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 flex items-center gap-1.5 hover:bg-stone-800 transition-colors"
                        >
                          Saiba Mais <FiArrowUpRight className="text-sm" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECÇÃO CATÁLOGO COMPLETO */}
          <section className="py-8">
            <div className="text-center mb-10">
              <span className="text-[10px] text-stone-500 font-bold tracking-[0.2em] uppercase">Catálogo Completo</span>
              <h2 className="text-3xl font-serif text-stone-900 mt-2 mb-8">Nossa Curadoria</h2>

              <div className="max-w-md mx-auto relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar por perfume ou marca..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-stone-300 rounded focus:outline-none focus:border-stone-500 text-sm bg-white"
                />
              </div>
            </div>

            {/* Grelha de Catálogo (com até 4 cartões lado a lado em ecrãs grandes) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {catalogoFiltrado.map(perfume => (
                <div key={perfume.id} className="bg-white border border-stone-200 flex flex-col group w-full max-w-[320px]">

                  {/* Área da Imagem Fixa e Menor para Catálogo */}
                  <div className="bg-stone-100 h-60 w-full p-6 flex items-center justify-center overflow-hidden">
                    {perfume.imagem_url ? (
                      <img src={perfume.imagem_url} alt={perfume.nome} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-stone-200/50 flex items-center justify-center text-stone-400 font-serif text-lg text-center px-2">
                        {perfume.nome}
                      </div>
                    )}
                  </div>

                  {/* Área de Texto Menor para Catálogo */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[10px] text-amber-700 font-bold tracking-widest uppercase mb-1 block">
                        {perfume.marca}
                      </span>
                      <h3 className="font-serif text-[18px] text-stone-900 mb-2 truncate">{perfume.nome}</h3>
                      <p className="text-stone-500 text-[12px] leading-relaxed line-clamp-2">{perfume.descricao}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-100">
                      <span className="font-bold text-stone-900 text-base">{formatarPreco(perfume.preco)}</span>
                      <Link
                        to={`/perfume/${perfume.id}`}
                        state={{ perfume, perfilUsuario }}
                        className="text-[10px] font-bold text-stone-500 hover:text-stone-900 uppercase tracking-widest transition-colors flex items-center gap-1"
                      >
                        Saiba Mais <FiArrowUpRight />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {catalogoFiltrado.length === 0 && (
              <div className="text-center text-stone-500 py-12 text-sm">
                Nenhum perfume encontrado com "{busca}".
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
}