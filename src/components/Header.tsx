import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Header() {
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const handleScroll = () => {
            setIsVisible(false);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsVisible(true);
            }, 300); // 2 segundos de atraso
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <header className={`bg-purple-900 text-white shadow-md w-full fixed top-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
            <div className="container mx-auto p-4 flex justify-between items-center">
                
                {/* Logótipo / Nome da Loja apontando para a Home */}
        <Link to="/" className="text-2xl font-bold hover:text-pink-300 transition-colors">
          Perfumaria CS
        </Link>

        {/* Menu de Navegação Básico */}
        <nav>
          <ul className="flex gap-4 font-semibold">
            <li>
              <Link to="/" className="hover:text-pink-300 transition-colors">
                Início
              </Link>
            </li>
            {/* Espaço reservado para futuros links como "Sobre" ou "Carrinho" */}
          </ul>
        </nav>
        
      </div>
    </header>
  );
}