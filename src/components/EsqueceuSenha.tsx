import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiMail } from 'react-icons/fi';
import { supabase } from '../supabase';

export function EsqueceuSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setMensagem('');

    try {
      // Dispara o e-mail de recuperação e redireciona para a tela de nova senha
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/atualizar-senha`,
      });

      if (error) {
        if (error.status === 429) throw new Error('Muitos pedidos. Aguarde alguns minutos.');
        throw error;
      }

      setMensagem('Enviámos um link de recuperação para o seu e-mail. Por favor, verifique a sua caixa de entrada e o spam.');
    } catch (error: any) {
      setErro('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 py-24">
      <div className="bg-neutral-800 border border-amber-700/30 p-8 rounded-lg max-w-md w-full shadow-2xl text-stone-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-amber-500 mb-2">Perfumaria CS</h1>
          <p className="text-sm text-stone-400 tracking-wide">Recuperação de Palavra-passe</p>
        </div>

        {mensagem ? (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-700/50">
              <FiMail className="text-3xl" />
            </div>
            <p className="text-stone-300 text-sm leading-relaxed mb-6">{mensagem}</p>
            <Link to="/login" className="text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest text-xs border border-amber-600/50 px-6 py-3 rounded transition-colors inline-block">
              Voltar ao Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRecuperar} className="flex flex-col gap-4 animate-fade-in">
            <p className="text-xs text-stone-400 mb-2 text-center">
              Introduza o e-mail associado à sua conta e enviar-lhe-emos as instruções para redefinir a palavra-passe.
            </p>

            <div>
              <label className="block text-sm mb-1 text-stone-300">E-mail</label>
              <input
                type="email"
                required
                className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {erro && (
              <div className="bg-red-950/50 border border-red-800/50 text-red-300 p-3 rounded text-xs font-semibold text-center mt-2">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="mt-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-neutral-950 font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2"
            >
              {loading ? 'A Enviar...' : 'Enviar Link'} <FiArrowUpRight className="text-lg" />
            </button>

            <Link to="/login" className="text-center text-xs text-stone-500 hover:text-stone-300 uppercase tracking-widest mt-4 transition-colors">
              Cancelar e voltar
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}