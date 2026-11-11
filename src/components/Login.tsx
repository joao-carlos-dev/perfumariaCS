import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tentativa de login:', { email, senha });
    // Futuramente: Lógica de autenticação (ex: Firebase Auth)
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="bg-neutral-800 border border-amber-700/30 p-8 rounded-lg max-w-md w-full shadow-2xl text-stone-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-amber-500 mb-2">Perfumaria CS</h1>
          <p className="text-sm text-stone-400 tracking-wide">Bem-vindo de volta</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm mb-1 text-stone-300">E-mail</label>
            <input
              type="email"
              required
              className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-stone-300">Senha</label>
            <input
              type="password"
              required
              className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
          </div>
          
          <button type="submit" className="mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm">
            Entrar
          </button>
          
          <p className="text-center text-sm text-stone-400 mt-4">
            Ainda não tem conta? <Link to="/cadastro" className="text-amber-500 hover:underline font-semibold">Criar conta</Link>
          </p>
          <p className="text-center mt-2">
            <Link to="/" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">← Voltar para a loja</Link>
          </p>
        </form>
      </div>
    </div>
  );
}