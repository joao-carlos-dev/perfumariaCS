import { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowUpRight, FiCheck, FiShield, FiUser } from 'react-icons/fi';
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

export function PerfumeDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Tenta usar o perfume já carregado pela Home para transição instantânea
  const [perfume, setPerfume] = useState<Perfume | null>(location.state?.perfume || null);
  const [loading, setLoading] = useState(!location.state?.perfume);
  const [perfilUsuario, setPerfilUsuario] = useState<any>(location.state?.perfilUsuario || null);

  // Coloque o seu número real aqui (com 55 + DDD)
  const WHATSAPP_NUMERO = '5548991268854';

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!perfilUsuario) {
      const guardado = localStorage.getItem('perfilCompleto');
      if (guardado) setPerfilUsuario(JSON.parse(guardado));
    }

    // Se o utilizador acedeu ao link direto (F5), busca o perfume no Supabase pelo ID
    if (!perfume && id) {
      const buscarPerfume = async () => {
        try {
          const { data, error } = await supabase
            .from('perfumes')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          setPerfume(data);
        } catch (error) {
          console.error('Erro ao carregar detalhes do perfume:', error);
        } finally {
          setLoading(false);
        }
      };
      buscarPerfume();
    }
  }, [id, perfume, perfilUsuario]);

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valor);
  };

  const handleComprarWhatsApp = () => {
    if (!perfume) return;

    const texto = perfilUsuario
      ? `Olá! Sou o(a) ${perfilUsuario.nome.split(' ')[0]}, o meu perfil olfativo na Perfumaria CS deu *${perfilUsuario.sensacao}* (${perfilUsuario.ocasiao}) e gostaria de adquirir o perfume *${perfume.nome}* (${perfume.marca}).`
      : `Olá! Vi o perfume *${perfume.nome}* (${perfume.marca}) no catálogo da Perfumaria CS e gostaria de saber mais detalhes para compra.`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-400 text-xs tracking-widest uppercase animate-pulse">
        A carregar detalhes da fragrância...
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl text-stone-800 mb-4">Fragrância não encontrada</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest px-6 py-3"
        >
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  const isMatch = perfilUsuario?.sensacao === perfume.sensacao_indicada;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors mb-8 cursor-pointer"
        >
          <FiArrowLeft className="text-sm" /> Voltar para a curadoria
        </button>

        {/* Card Principal de Detalhes */}
        <div className="bg-white border border-stone-200 grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-sm animate-fade-in">
          
          {/* Coluna Esquerda: Imagem */}
          <div className="bg-stone-100 p-12 flex items-center justify-center min-h-95 md:min-h-125 relative">
            {isMatch && (
              <span className="absolute top-6 left-6 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                Compatível com o seu Perfil ({perfume.sensacao_indicada})
              </span>
            )}
            {perfume.imagem_url ? (
              <img
                src={perfume.imagem_url}
                alt={perfume.nome}
                className="max-h-90 w-auto object-contain mix-blend-multiply"
              />
            ) : (
              <div className="text-stone-400 font-serif text-3xl text-center">
                {perfume.nome}
              </div>
            )}
          </div>

          {/* Coluna Direita: Informações e Botão do WhatsApp */}
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs text-amber-700 font-bold tracking-[0.2em] uppercase block mb-2">
                {perfume.marca}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
                {perfume.nome}
              </h1>

              <div className="inline-block border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] text-stone-600 uppercase tracking-widest mb-6">
                Família Olfativa: <strong>{perfume.sensacao_indicada}</strong>
              </div>

              <p className="text-stone-600 text-sm leading-relaxed mb-8">
                {perfume.descricao}
              </p>

              <div className="border-t border-stone-100 pt-6 space-y-3 text-xs text-stone-500 mb-8">
                <div className="flex items-center gap-2">
                  <FiCheck className="text-amber-700" />
                  <span>Fragrância 100% original com selo de autenticidade</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield className="text-amber-700" />
                  <span>Atendimento personalizado via consultor exclusivo</span>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-6">
              <div className="mb-6">
                <span className="text-[10px] text-stone-400 uppercase tracking-widest block mb-1">
                  Valor do Investimento
                </span>
                <span className="text-3xl font-bold text-stone-900">
                  {formatarPreco(perfume.preco)}
                </span>
              </div>

              <button
                onClick={handleComprarWhatsApp}
                className="w-full bg-neutral-950 hover:bg-stone-800 text-white font-bold py-4 px-6 text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Adquirir via WhatsApp <FiArrowUpRight className="text-base" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}