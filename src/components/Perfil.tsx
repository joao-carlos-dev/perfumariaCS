import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiUser,
  FiSettings,
  FiShield,
  FiShoppingBag,
  FiLogOut,
  FiEdit2,
  FiTrash2,
  FiRefreshCcw
} from 'react-icons/fi';
import { supabase } from '../supabase';

export function Perfil() {
  const [activeTab, setActiveTab] = useState('dados');
  const [loading, setLoading] = useState(false);
  const [perfilUsuario, setPerfilUsuario] = useState<any>(null);

  // Estados para o formulário de Meus Dados
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [showQuizModal, setShowQuizModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const dadosLocais = localStorage.getItem('perfilCompleto');
    if (dadosLocais) {
      const parsed = JSON.parse(dadosLocais);
      setPerfilUsuario(parsed);
      setNome(parsed.nome || '');
      setTelefone(parsed.telefone || '');
    }
  }, []);

  // --- ATUALIZAR DADOS (NOME E TELEFONE) ---
  const handleGuardarAlteracoes = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado.");

      const { error } = await supabase
        .from('clientes')
        .update({ nome, telefone })
        .eq('id', user.id);

      if (error) throw error;

      const perfilAtualizado = { ...perfilUsuario, nome, telefone };
      setPerfilUsuario(perfilAtualizado);
      localStorage.setItem('perfilCompleto', JSON.stringify(perfilAtualizado));

      alert('Informações atualizadas com sucesso!');
    } catch (error: any) {
      console.error("Erro ao atualizar:", error.message);
      alert('Erro ao guardar alterações.');
    } finally {
      setLoading(false);
    }
  };

  // --- REFAZER QUIZ ---
  const handleAbrirModalQuiz = () => {
    setShowQuizModal(true);
  };

  const confirmarRefazerQuiz = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Apaga o perfil olfativo antigo no banco
        const { error } = await supabase.from('perfis_olfativos').delete().eq('cliente_id', user.id);
        if (error) throw error;
      }

      // Limpa apenas o perfil completo, mantendo o nome do utilizador logado
      localStorage.removeItem('perfilCompleto');

      // Redireciona para o cadastro enviando um sinal de que está logado
      navigate('/cadastro', { state: { isRefazendo: true } });
    } catch (error: any) {
      alert("Não foi possível reiniciar o quiz.");
    } finally {
      setLoading(false);
      setShowQuizModal(false);
    }
  };

  // --- EXCLUIR CONTA (LGPD) ---
  const handleExcluirConta = async () => {
    const confirmar = window.confirm("Tem a certeza que deseja excluir a sua conta permanentemente? Todos os seus dados serão apagados.");
    if (!confirmar) return;
    setLoading(true);

    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      await supabase.auth.signOut();
      localStorage.clear();
      navigate('/');
    } catch (error: any) {
      alert("Ocorreu um erro ao tentar apagar a sua conta.");
    } finally {
      setLoading(false);
    }
  };

  // --- TERMINAR SESSÃO ---
  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex justify-center p-4 py-24 text-stone-800">
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-6">

        {/* SIDEBAR - MENU LATERAL */}
        <div className="w-full md:w-64 bg-white border border-stone-200 shadow-sm flex flex-col py-4 h-fit">
          <button
            onClick={() => setActiveTab('dados')}
            className={`flex items-center gap-3 w-full text-left px-6 py-4 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${activeTab === 'dados' ? 'bg-neutral-950 text-amber-500' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
              }`}
          >
            <FiUser className="text-lg" /> Meus Dados
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`flex items-center gap-3 w-full text-left px-6 py-4 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${activeTab === 'perfil' ? 'bg-neutral-950 text-amber-500' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
              }`}
          >
            <FiSettings className="text-lg" /> Perfil Olfativo
          </button>

          <button
            onClick={() => setActiveTab('privacidade')}
            className={`flex items-center gap-3 w-full text-left px-6 py-4 text-xs font-bold tracking-wider uppercase transition-colors ${activeTab === 'privacidade' ? 'bg-neutral-950 text-amber-500' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900 cursor-pointer'
              }`}
          >
            <FiShield className="text-lg" /> Privacidade (LGPD)
          </button>

          <Link
            to="/"
            className="flex items-center gap-3 w-full text-left px-6 py-4 text-xs font-bold tracking-wider uppercase text-amber-600 hover:bg-stone-100 transition-colors mt-4 border-t border-stone-100 cursor-pointer"
          >
            <FiShoppingBag className="text-lg" /> Minha Vitrine VIP
          </Link>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-3 w-full text-left px-6 py-4 text-xs font-bold tracking-wider uppercase text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <FiLogOut className="text-lg" /> Sair da Conta
          </button>
        </div>

        {/* ÁREA DE CONTEÚDO PRINCIPAL */}
        <div className="flex-1 bg-white border border-stone-200 shadow-sm p-8 min-h-125">

          {/* CONTEÚDO: MEUS DADOS */}
          {activeTab === 'dados' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-8 text-stone-800">
                <FiEdit2 className="text-amber-600 text-xl" />
                <h2 className="text-2xl font-serif">Informações Pessoais</h2>
              </div>

              <form onSubmit={handleGuardarAlteracoes} className="flex flex-col gap-6 max-w-md">
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-stone-500 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded focus:border-amber-500 focus:outline-none text-stone-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-stone-500 mb-2">E-mail</label>
                  <input
                    type="email"
                    readOnly
                    value={perfilUsuario?.email || ''}
                    className="w-full p-3 border border-stone-200 rounded text-stone-500 bg-stone-50 cursor-not-allowed"
                    title="O e-mail não pode ser alterado por motivos de segurança."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-stone-500 mb-2">Telefone</label>
                  <input
                    type="tel"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded focus:border-amber-500 focus:outline-none text-stone-800 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-neutral-950 hover:bg-neutral-800 text-white font-bold py-3 px-6 rounded transition-colors text-xs tracking-widest uppercase disabled:opacity-50 self-start"
                >
                  {loading ? 'A Guardar...' : 'Guardar Alterações'}
                </button>
              </form>
            </div>
          )}

          {/* CONTEÚDO: PERFIL OLFATIVO */}
          {activeTab === 'perfil' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-8 text-stone-800">
                <FiSettings className="text-amber-600 text-xl" />
                <h2 className="text-2xl font-serif cursor-pointer">O Seu Perfil Olfativo</h2>
              </div>

              {perfilUsuario ? (
                <div className="bg-stone-50 border border-stone-200 p-6 rounded mb-8">
                  <p className="text-sm text-stone-500 mb-4">Baseado nas suas respostas, o seu caminho olfativo ideal é:</p>
                  <div className="bg-white p-6 rounded text-center border border-amber-600/30 shadow-sm">
                    <span className="block text-2xl text-amber-600 font-medium mb-2">{perfilUsuario.sensacao}</span>
                    <span className="text-xs text-stone-500 uppercase tracking-widest block">
                      {perfilUsuario.personalidade} • {perfilUsuario.ocasiao}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-stone-500 mb-8">Perfil não encontrado.</p>
              )}

              <div className="border-t border-stone-200 pt-6">
                <p className="text-sm text-stone-600 mb-4">Sente que os seus gostos mudaram? Refaça o quiz para atualizar a sua curadoria.</p>
                <button
                  onClick={handleAbrirModalQuiz}
                  disabled={loading}
                  className="flex items-center gap-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-3 px-6 rounded transition-colors text-xs tracking-widest uppercase disabled:opacity-50"
                >
                  <FiRefreshCcw className="text-lg" /> Refazer Quiz Olfativo
                </button>
              </div>
            </div>
          )}

          {/* CONTEÚDO: PRIVACIDADE */}
          {activeTab === 'privacidade' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-8 text-stone-800">
                <FiShield className="text-amber-600 text-xl" />
                <h2 className="text-2xl font-serif cursor-pointer">Privacidade e Dados</h2>
              </div>

              <div className="prose prose-sm text-stone-600 mb-8">
                <p>Em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>, você tem controlo total sobre as suas informações.</p>
                <p>A Perfumaria CS utiliza os seus dados exclusivamente para personalizar a sua Vitrine VIP e facilitar o contacto via WhatsApp.</p>
                <p>Caso deseje revogar o consentimento, pode excluir a sua conta permanentemente abaixo. Esta ação apagará o seu histórico, perfil olfativo e credenciais de acesso das nossas bases de dados.</p>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <button
                  onClick={handleExcluirConta}
                  disabled={loading}
                  className="flex items-center gap-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-6 rounded transition-colors text-xs tracking-widest uppercase disabled:opacity-50"
                >
                  <FiTrash2 className="text-lg" /> Excluir Conta Definitivamente
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      {/* MODAL DE CONFIRMAÇÃO DO QUIZ */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 border border-stone-200">
            <h3 className="text-xl font-serif text-stone-800 mb-3">Refazer o Quiz?</h3>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              O seu perfil olfativo atual será apagado. Terá de responder novamente às 3 perguntas para gerar uma nova assinatura olfativa. Deseja continuar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQuizModal(false)}
                className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarRefazerQuiz}
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {loading ? 'Aguarde...' : 'Continuar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}