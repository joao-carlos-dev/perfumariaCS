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
      }, 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <header
      className={`bg-neutral-950 border-b border-neutral-800 text-stone-200 w-full fixed top-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto p-4 flex justify-between items-center">
        
        {/* Logótipo Premium */}
        <Link to="/" className="text-lg font-serif font-bold text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-3">
          <span className="border border-amber-600/50 p-1 px-2 text-sm">CS</span>
          <span className="hidden sm:inline">CARLOS SOUZA</span>
        </Link>

        {/* Menu */}
        <nav>
          <ul className="flex gap-6 font-semibold text-xs tracking-widest uppercase items-center">
            <li>
              <Link to="/" className="hover:text-amber-500 transition-colors">Início</Link>
            </li>
            <li>
              <Link to="/cadastro" className="bg-amber-600 hover:bg-amber-700 text-neutral-950 px-4 py-2 transition-colors">
                Entrar / Cadastrar
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}