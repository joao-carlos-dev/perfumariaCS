import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { supabase } from '../supabase';

export function AtualizarSenha() {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  // Verifica se o utilizador chegou aqui com o token correto (via link do e-mail)
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setErro('');
      } else if (!session) {
        setErro('Link inválido ou expirado. Por favor, solicite uma nova recuperação.');
      }
    });
  }, []);

  const handleAtualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      // Atualiza a palavra-passe do utilizador autenticado pelo link
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) throw error;
      
      setSucesso(true);
      setTimeout(() => navigate('/login'), 4000);
    } catch (error: any) {
      setErro('Erro ao atualizar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 py-24">
      <div className="bg-neutral-800 border border-amber-700/30 p-8 rounded-lg max-w-md w-full shadow-2xl text-stone-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-amber-500 mb-2">Perfumaria CS</h1>
          <p className="text-sm text-stone-400 tracking-wide">Criar nova palavra-passe</p>
        </div>

        {sucesso ? (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-700/50">
              <FiCheck className="text-3xl" />
            </div>
            <p className="text-stone-200 font-bold mb-2">Palavra-passe atualizada!</p>
            <p className="text-stone-400 text-sm">Será redirecionado para o Login em instantes...</p>
          </div>
        ) : (
          <form onSubmit={handleAtualizar} className="flex flex-col gap-4 animate-fade-in">
            <div>
              <label className="block text-sm mb-1 text-stone-300">Nova Senha</label>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  required
                  className="w-full p-3 pr-10 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-500"
                >
                  {mostrarSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-stone-300">Confirmar Nova Senha</label>
              <input
                type={mostrarSenha ? "text" : "password"}
                required
                className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>

            {erro && (
              <div className="bg-red-950/50 border border-red-800/50 text-red-300 p-3 rounded text-xs font-semibold text-center mt-2">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !senha || !confirmarSenha}
              className="mt-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-neutral-950 font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm flex items-center justify-center"
            >
              {loading ? 'A Guardar...' : 'Guardar e Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}