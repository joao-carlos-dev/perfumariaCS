import { useParams, Link } from 'react-router-dom';
import { perfumes } from '../data/perfumes';
import { FaWhatsapp } from 'react-icons/fa';
import ReactGA from 'react-ga4';

export function PerfumeDetail() {
  const { name } = useParams<{ name: string }>();
  const perfume = perfumes.find((p) => p.name === name);

  // Tratamento caso o perfume não seja encontrado
  if (!perfume) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50">
        <h2 className="text-3xl font-serif text-neutral-900 mb-4">Fragrância não encontrada</h2>
        <Link to="/" className="text-amber-600 hover:text-amber-700 font-bold uppercase tracking-widest text-xs">
          ← Voltar à vitrine
        </Link>
      </div>
    );
  }

  // --- CONFIGURAÇÃO DO WHATSAPP COM NOME DO UTILIZADOR ---
  const numeroWhatsApp = "5548998396111"; 
  
  // Tenta procurar o nome do utilizador na memória do navegador
  const nomeUsuario = localStorage.getItem('nomeUsuario');
  
  // Cria a saudação de forma dinâmica: com ou sem nome
  const saudacao = nomeUsuario 
    ? `Olá! O meu nome é *${nomeUsuario}* e vim pelo site Perfumaria CS. Tenho interesse` 
    : `Olá! Vim pelo site Perfumaria CS e tenho interesse`;

  const mensagem = `${saudacao} no perfume *${perfume.name}* da marca ${perfume.brand}. Gostaria de obter mais informações!`;
  const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  const handleWhatsAppClick = () => {
  // Regista o clique especificando qual perfume gerou o interesse
  ReactGA.event({
    category: 'Conversão',
    action: 'Clique_Botao_WhatsApp',
    label: perfume.name // Ex: 'Vanilla Powder'
  });
};

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Coluna Esquerda: Imagem */}
          <div className="bg-white border border-stone-200 p-8 flex justify-center items-center h-[400px] md:h-[550px] shadow-sm relative group">
            <span className="absolute top-4 left-4 bg-neutral-950 text-amber-500 text-[10px] uppercase tracking-widest px-3 py-1 font-bold z-10">
              Destaque
            </span>
            <img
              src={perfume.image}
              alt={perfume.name}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Coluna Direita: Detalhes do Produto */}
          <div className="flex flex-col h-full justify-center">
            <span className="text-amber-700 text-xs tracking-widest uppercase font-bold mb-2">
              {perfume.brand}
            </span>
            
            <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6 leading-tight">
              {perfume.name}
            </h1>
            
            <div className="mb-6 pb-6 border-b border-stone-200">
              <span className="block text-[10px] text-stone-500 uppercase tracking-wider mb-1">Valor</span>
              <span className="text-3xl font-bold text-neutral-900">
                ${perfume.price.toFixed(2)}
              </span>
            </div>

            <p className="text-stone-600 mb-8 leading-relaxed text-sm md:text-base">
              {perfume.description}
            </p>

            {/* Notas Olfativas */}
            <div className="mb-10">
              <span className="block text-[10px] text-neutral-900 font-bold uppercase tracking-wider mb-3">
                Notas Olfativas
              </span>
              <div className="flex flex-wrap gap-2">
                {perfume.notes.map((note, index) => (
                  <span
                    key={index}
                    className="bg-stone-100 border border-stone-200 text-stone-600 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              
              <Link 
                to="/" 
                className="border border-stone-300 hover:border-amber-500 text-neutral-900 text-xs font-bold tracking-widest uppercase px-8 py-4 transition-colors text-center w-full sm:w-auto"
              >
                Voltar à Loja
              </Link>

              <a 
                href={linkWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="bg-neutral-950 hover:bg-amber-600 text-white hover:text-neutral-950 text-xs font-bold tracking-widest uppercase px-8 py-4 transition-colors text-center w-full sm:w-auto shadow-md flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="text-lg" />
                Comprar pelo WhatsApp
              </a>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}