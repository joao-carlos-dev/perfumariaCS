import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { supabase } from '../supabase';

export function Header() {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Verifica se já existe sessão ao carregar a página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Fica "à escuta" de alterações (Login ou Logout) para atualizar o cabeçalho na hora
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="bg-neutral-950 border-b border-neutral-900 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-4">
          <div className="w-10 h-10 border border-amber-600 flex items-center justify-center">
            <span className="font-serif text-amber-500 font-bold text-lg">CS</span>
          </div>
          <span className="font-serif text-xl tracking-widest text-amber-500 hidden sm:block">
            CARLOS SOUZA
          </span>
        </Link>

        {/* NAVEGAÇÃO */}
        <nav className="flex items-center gap-6 text-xs font-bold tracking-widest uppercase text-stone-200">
          <Link to="/" className="hover:text-amber-500 transition-colors">
            Início
          </Link>
          
          {session ? (
            /* --- VISUAL PARA UTILIZADOR LOGADO --- */
            <div className="flex items-center gap-5 ml-2 border-l border-neutral-800 pl-6">
              <Link 
                to="/perfil" 
                className="flex items-center gap-2 hover:text-amber-500 transition-colors"
                title="Aceder ao Perfil"
              >
                <FiUser className="text-lg" />
                <span className="hidden sm:block">Meu Perfil</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Sair da Conta"
              >
                <FiLogOut className="text-lg" />
              </button>
            </div>
          ) : (
            /* --- VISUAL PARA VISITANTE --- */
            <div className="flex items-center gap-5 ml-2">
              <Link 
                to="/login" 
                className="bg-amber-600 hover:bg-amber-700 text-neutral-950 px-5 py-2.5 transition-colors hidden sm:block"
              >
                Entrar / Cadastrar
              </Link>
              <Link 
                to="/login" 
                className="hover:text-amber-500 transition-colors"
                title="Entrar"
              >
                <FiUser className="text-xl" />
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}