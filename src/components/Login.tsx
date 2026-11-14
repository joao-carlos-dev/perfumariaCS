import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import ReactGA from 'react-ga4';

// Sanitização básica contra injeção de tags HTML
function sanitizeText(value: string): string {
  return value.replace(/[<>]/g, '');
}

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (senha.length < 8) {
      setErro('Credenciais inválidas. Verifique o seu e-mail e senha.');
      return;
    }

    // Verifica se existe um perfil registado neste dispositivo
    const perfilSalvo = localStorage.getItem('perfilCompleto');

    if (perfilSalvo) {
      const dados = JSON.parse(perfilSalvo);
      
      // Se o e-mail coincidir com o registado, carrega o perfil dele
      if (dados.email && dados.email.toLowerCase() === email.toLowerCase()) {
        localStorage.setItem('nomeUsuario', dados.nome);
        
        ReactGA.event({
          category: 'Autenticação',
          action: 'Login_Sucesso'
        });

        navigate('/perfil');
        return;
      } else {
        setErro('E-mail não encontrado neste dispositivo. Crie a sua assinatura primeiro.');
        return;
      }
    }

    // Caso ainda não tenha feito o cadastro na máquina atual
    setErro('Nenhuma assinatura encontrada para este e-mail. Crie a sua conta abaixo.');
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 py-24">
      <div className="bg-neutral-800 border border-amber-700/30 p-8 rounded-lg max-w-md w-full shadow-2xl text-stone-200 min-h-[420px] flex flex-col justify-center animate-fade-in">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-amber-500 mb-2">Perfumaria CS</h1>
          <p className="text-sm text-stone-400 tracking-wide">
            Aceda à sua assinatura olfativa
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1 text-stone-300">E-mail</label>
            <input
              type="email"
              required
              maxLength={100}
              autoComplete="email"
              placeholder="seu@email.com"
              className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
              value={email}
              onChange={(e) => setEmail(sanitizeText(e.target.value.trim()))}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-stone-300">Senha</label>
            </div>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                required
                maxLength={15}
                autoComplete="current-password"
                className="w-full p-3 pr-10 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-500 transition-colors"
              >
                {mostrarSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {erro && (
            <div className="bg-red-950/50 border border-red-800/50 text-red-300 p-3 rounded text-xs font-semibold text-center mt-1">
              {erro}
            </div>
          )}

          <button
            type="submit"
            className="mt-4 bg-amber-600 hover:bg-amber-700 text-neutral-950 font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2"
          >
            Entrar <FiArrowUpRight className="text-lg" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 mt-1">
            <FiShield className="text-amber-600" />
            <span>Acesso protegido · Ambiente seguro</span>
          </div>

          <p className="text-center text-sm text-stone-400 mt-4">
            Ainda não descobriu o seu perfil?{' '}
            <Link to="/cadastro" className="text-amber-500 hover:underline font-semibold">
              Criar assinatura
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}