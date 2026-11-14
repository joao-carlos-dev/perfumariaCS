import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiEdit3, FiTrash2, FiShield, FiArrowUpRight, FiShoppingBag } from 'react-icons/fi';

function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11);
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

export function Perfil() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dados');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    ocasiao: 'Trabalho e dia a dia',
    personalidade: 'Elegante',
    sensacao: 'Amadeirado'
  });

  useEffect(() => {
    const nomeSalvo = localStorage.getItem('nomeUsuario') || 'Visitante Elegante';
    const perfilSalvo = localStorage.getItem('perfilCompleto');

    if (perfilSalvo) {
      const parsed = JSON.parse(perfilSalvo);
      const { senha, ...dadosLimpos } = parsed;
      setUserData(prev => ({ ...prev, ...dadosLimpos }));
    } else {
      setUserData(prev => ({ ...prev, nome: nomeSalvo }));
    }
  }, []);

  const handleSaveDados = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('nomeUsuario', userData.nome);
    localStorage.setItem('perfilCompleto', JSON.stringify(userData));
    mostrarSucesso('Dados pessoais atualizados com segurança!');
  };

  const handleSaveOlfativo = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('perfilCompleto', JSON.stringify(userData));
    mostrarSucesso('Nova assinatura olfativa registada!');
  };

  const mostrarSucesso = (msg: string) => {
    setMensagemSucesso(msg);
    setTimeout(() => setMensagemSucesso(''), 4000);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleExcluirConta = () => {
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('perfilCompleto');
    navigate('/cadastro');
  };

  // Nova função para levar o utilizador e os seus dados para a Home
  const handleVerVitrine = () => {
    navigate('/', { state: { perfilUsuario: userData } });
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">

        <div className="flex flex-col md:flex-row gap-8">

          {/* MENU LATERAL */}
          <div className="w-full md:w-1/4">
            <div className="bg-white border border-stone-200 p-4 shadow-sm flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('dados')}
                className={`flex items-center gap-3 w-full p-4 text-left text-sm uppercase tracking-wider font-bold transition-colors ${activeTab === 'dados' ? 'bg-neutral-950 text-amber-500' : 'text-stone-500 hover:bg-stone-50 hover:text-neutral-900 cursor-pointer'}`}
              >
                <FiUser className="text-lg" /> Meus Dados
              </button>

              <button
                onClick={() => setActiveTab('assinatura')}
                className={`flex items-center gap-3 w-full p-4 text-left text-sm uppercase tracking-wider font-bold transition-colors ${activeTab === 'assinatura' ? 'bg-neutral-950 text-amber-500' : 'text-stone-500 hover:bg-stone-50 hover:text-neutral-900 cursor-pointer'}`}
              >
                <FiSettings className="text-lg" /> Perfil Olfativo
              </button>

              <button
                onClick={() => setActiveTab('privacidade')}
                className={`flex items-center gap-3 w-full p-4 text-left text-sm uppercase tracking-wider font-bold transition-colors ${activeTab === 'privacidade' ? 'bg-neutral-950 text-amber-500' : 'text-stone-500 hover:bg-stone-50 hover:text-neutral-900 cursor-pointer'}`}
              >
                <FiShield className="text-lg" /> Privacidade (LGPD)
              </button>

              {/* NOVO BOTÃO: VITRINE VIP */}
              <button
                onClick={handleVerVitrine}
                className="flex items-center gap-3 w-full p-4 text-left text-sm uppercase tracking-wider font-bold text-amber-700 hover:bg-amber-50 hover:text-amber-900 transition-colors mt-2 cursor-pointer"
              >
                <FiShoppingBag className="text-lg" /> Minha Vitrine VIP
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-4 text-left text-sm uppercase tracking-wider font-bold text-stone-600 hover:bg-stone-100 transition-colors mt-2 border-t border-stone-100 cursor-pointer"
              >
                <FiLogOut className="text-lg" /> Sair da Conta
              </button>
            </div>
          </div>

          {/* ÁREA DE CONTEÚDO */}
          <div className="w-full md:w-3/4">

            {mensagemSucesso && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 text-sm font-semibold flex items-center justify-between animate-fade-in">
                {mensagemSucesso}
              </div>
            )}

            <div className="bg-white border border-stone-200 p-8 shadow-sm min-h-[400px]">

              {/* ABA: MEUS DADOS */}
              {activeTab === 'dados' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-serif text-neutral-900 mb-6 flex items-center gap-2">
                    <FiEdit3 className="text-amber-600" /> Informações Pessoais
                  </h2>

                  <form onSubmit={handleSaveDados} className="flex flex-col gap-5 max-w-lg">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">Nome Completo</label>
                      <input
                        type="text"
                        required
                        className="w-full p-3 border border-stone-300 text-stone-700 focus:border-amber-500 focus:outline-none"
                        value={userData.nome}
                        onChange={e => setUserData({ ...userData, nome: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">E-mail</label>
                      <input
                        type="email"
                        required
                        className="w-full p-3 border border-stone-300 text-stone-700 focus:border-amber-500 focus:outline-none"
                        value={userData.email}
                        onChange={e => setUserData({ ...userData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">Telefone</label>
                      <input
                        type="tel"
                        required
                        placeholder="(00) 00000-0000"
                        className="w-full p-3 border border-stone-300 text-stone-700 focus:border-amber-500 focus:outline-none"
                        value={userData.telefone}
                        onChange={e => setUserData({ ...userData, telefone: formatPhoneNumber(e.target.value) })}
                      />
                    </div>
                    <button type="submit" className="mt-4 bg-neutral-950 hover:bg-amber-600 text-white hover:text-neutral-950 font-bold py-4 px-6 text-xs uppercase tracking-widest transition-colors w-full md:w-auto self-start">
                      Guardar Alterações
                    </button>
                  </form>
                </div>
              )}

              {/* ABA: ASSINATURA OLFATIVA */}
              {activeTab === 'assinatura' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-serif text-neutral-900 mb-2">A sua Assinatura Olfativa</h2>
                  <p className="text-sm text-stone-500 mb-8">Refaça a sua descoberta sempre que o seu estilo mudar. A nossa vitrine na página inicial irá adaptar-se às suas novas escolhas.</p>

                  <form onSubmit={handleSaveOlfativo} className="flex flex-col gap-6 max-w-lg mb-8">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-900 mb-3 font-bold">Ocasião Principal</label>
                      <select
                        className="w-full p-3 border border-stone-300 text-stone-700 focus:border-amber-500 focus:outline-none bg-white"
                        value={userData.ocasiao}
                        onChange={e => setUserData({ ...userData, ocasiao: e.target.value })}
                      >
                        <option value="Trabalho e dia a dia">Trabalho e dia a dia (Discreto)</option>
                        <option value="Festas e eventos">Festas e eventos (Marcante)</option>
                        <option value="Encontros a dois">Encontros a dois (Intimista)</option>
                        <option value="Assinatura">Assinatura (Uso para tudo)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-900 mb-3 font-bold">Personalidade</label>
                      <select
                        className="w-full p-3 border border-stone-300 text-stone-700 focus:border-amber-500 focus:outline-none bg-white"
                        value={userData.personalidade}
                        onChange={e => setUserData({ ...userData, personalidade: e.target.value })}
                      >
                        <option value="Elegante">Elegante e sofisticado(a)</option>
                        <option value="Comunicativo">Dinâmico(a) e comunicativo(a)</option>
                        <option value="Misterioso">Intenso(a) e sedutor(a)</option>
                        <option value="Minimalista">Calmo(a) e minimalista</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-900 mb-3 font-bold">Sensação Preferida</label>
                      <select
                        className="w-full p-3 border border-stone-300 text-stone-700 focus:border-amber-500 focus:outline-none bg-white"
                        value={userData.sensacao}
                        onChange={e => setUserData({ ...userData, sensacao: e.target.value })}
                      >
                        <option value="Doce">Doce, quente e envolvente</option>
                        <option value="Fresco">Fresco, limpo e versátil</option>
                        <option value="Floral">Floral, macio e elegante</option>
                        <option value="Amadeirado">Madeiras fortes e especiarias</option>
                      </select>
                    </div>

                    <button type="submit" className="mt-4 border border-stone-300 hover:border-amber-500 text-neutral-900 font-bold py-4 px-6 text-xs uppercase tracking-widest transition-colors w-full md:w-auto self-start">
                      Gravar Novas Escolhas
                    </button>
                  </form>

                  {/* BLOCO DE REDIRECIONAMENTO RÁPIDO */}
                  <div className="bg-amber-50/50 border border-amber-200/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-8 max-w-lg">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 mb-1">Pronto para descobrir?</h4>
                      <p className="text-xs text-stone-600">A sua vitrine VIP já foi atualizada na página inicial.</p>
                    </div>
                    <button
                      onClick={handleVerVitrine}
                      className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-neutral-950 text-neutral-950 hover:text-white text-[10px] font-bold uppercase tracking-widest px-5 py-3 transition-colors w-full md:w-auto whitespace-nowrap"
                    >
                      Ir para a Loja <FiArrowUpRight className="text-lg" />
                    </button>
                  </div>

                </div>
              )}

              {/* ABA: PRIVACIDADE & LGPD */}
              {activeTab === 'privacidade' && (
                <div className="animate-fade-in max-w-lg">
                  <h2 className="text-xl font-serif text-neutral-900 mb-2 flex items-center gap-2">
                    <FiShield className="text-amber-600" /> Privacidade e Proteção de Dados
                  </h2>
                  <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                    Em conformidade com a Lei Geral de Proteção de Dados (LGPD), os seus dados são utilizados exclusivamente para personalizar a sua experiência olfativa na Perfumaria CS e agilizar o seu atendimento via WhatsApp.
                  </p>

                  <div className="p-5 border border-red-200 bg-red-50/40">
                    <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider mb-2">
                      Excluir Meus Dados
                    </h3>
                    <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                      Ao excluir os seus dados, todas as suas informações pessoais e preferências olfativas serão removidas permanentemente deste dispositivo.
                    </p>

                    {!confirmarExclusao ? (
                      <button
                        type="button"
                        onClick={() => setConfirmarExclusao(true)}
                        className="flex items-center gap-2 border border-red-700 text-red-700 hover:bg-red-700 hover:text-white text-xs font-bold uppercase tracking-widest px-5 py-3 transition-colors"
                      >
                        <FiTrash2 /> Solicitar Exclusão de Dados
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={handleExcluirConta}
                          className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-widest px-5 py-3 transition-colors text-center"
                        >
                          Confirmar Exclusão
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmarExclusao(false)}
                          className="border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-bold uppercase tracking-widest px-5 py-3 transition-colors text-center"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}