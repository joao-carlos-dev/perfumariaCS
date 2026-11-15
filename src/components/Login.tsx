import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowUpRight } from 'react-icons/fi';
import { supabase } from '../supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // 1. Autentica no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          throw new Error('Por favor, confirme o seu e-mail através do link que enviámos para a sua caixa de entrada antes de entrar.');
        }
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('E-mail ou senha incorretos.');
        }
        throw new Error(authError.message);
      }

      const userId = authData.user.id;

      // 2. Busca os dados pessoais na tabela 'clientes'
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', userId)
        .single();

      if (clienteError) throw new Error('Erro ao carregar cliente: ' + clienteError.message);

      // 3. Busca as preferências na tabela 'perfis_olfativos'
      const { data: quizData, error: quizError } = await supabase
        .from('perfis_olfativos')
        .select('*')
        .eq('cliente_id', userId)
        .single();

      if (quizError) throw new Error('Erro ao carregar quiz: ' + quizError.message);

      // 4. Monta o objeto unificado para a Vitrine VIP e Header
      const perfilCompleto = {
        nome: clienteData.nome,
        email: clienteData.email,
        telefone: clienteData.telefone,
        consentimentoLGPD: clienteData.consentimento_lgpd,
        dataCadastro: clienteData.data_cadastro,
        ocasiao: quizData.ocasiao,
        personalidade: quizData.personalidade,
        sensacao: quizData.sensacao,
      };

      localStorage.setItem('nomeUsuario', clienteData.nome);
      localStorage.setItem('perfilCompleto', JSON.stringify(perfilCompleto));

      navigate('/', { state: { perfilUsuario: perfilCompleto } });
    } catch (err: any) {
      setErro(err.message || 'Erro ao iniciar sessão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 py-24">
      <div className="bg-neutral-800 border border-amber-700/30 p-8 rounded-lg max-w-md w-full shadow-2xl text-stone-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-amber-500 mb-2">Perfumaria CS</h1>
          <p className="text-sm text-stone-400 tracking-wide">Aceda à sua curadoria exclusiva</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                required
                className="w-full p-3 pr-10 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-500 transition-colors"
              >
                {mostrarSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <div className="text-right mt-2">
              <Link to="/esqueceu-senha" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
                Esqueceu-se da senha?
              </Link>
            </div>
          </div>

          {erro && (
            <div className="bg-red-950/50 border border-red-800/50 text-red-300 p-3 rounded text-xs font-semibold text-center">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-neutral-950 font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'A autenticar...' : 'Entrar'} <FiArrowUpRight className="text-lg" />
          </button>

          <p className="text-center text-sm text-stone-400 mt-4">
            Ainda não descobriu o seu perfil?{' '}
            <Link to="/cadastro" className="text-amber-500 hover:underline font-semibold">
              Fazer Quiz Olfativo
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}