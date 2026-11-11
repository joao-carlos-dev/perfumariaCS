import { FaWhatsapp, FaInstagram, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-stone-300 py-12 w-full border-t border-neutral-900">
      <div className="container mx-auto px-4">
        
        {/* Layout em 3 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          
          {/* Coluna 1: Marca e Descrição */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="text-xl font-serif font-bold text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-3 mb-4">
              <span className="border border-amber-600/50 p-1 px-2 text-sm">CS</span>
              <span>CARLOS SOUZA</span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
              Uma curadoria de fragrâncias árabes e importadas para quem sabe que a presença começa nos detalhes.
            </p>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-4">Navegue</h4>
            <ul className="flex flex-col gap-3 text-sm text-stone-400">
              <li>
                <Link to="/" className="hover:text-amber-500 transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/cadastro" className="hover:text-amber-500 transition-colors">Encontre sua fragrância</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento e Redes Sociais */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-4">Atendimento</h4>
            <div className="flex flex-col gap-3 text-sm text-stone-400">
              <a 
                href="https://wa.me/SEUNUMERO" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-amber-500 transition-colors"
              >
                <FaWhatsapp className="text-lg" /> WhatsApp
              </a>
              <a 
                href="https://instagram.com/SEUPERFIL" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-amber-500 transition-colors"
              >
                <FaInstagram className="text-lg" /> Instagram
              </a>
            </div>
          </div>

        </div>

        {/* Linha Inferior: Copyright e Assinatura do Desenvolvedor */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-stone-500">
          <p>© {new Date().getFullYear()} Carlos Souza Perfumaria. Todos os direitos reservados. Imbituba - SC.</p>
          <p className="flex items-center gap-1">
            Desenvolvido por 
            <a 
              href="https://github.com/joao-carlos-dev" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 hover:text-amber-500 transition-colors ml-1"
            >
              <FaGithub className="text-sm" /> João Carlos
            </a>
          </p>
        </div>
        
      </div>
    </footer>
  );
}