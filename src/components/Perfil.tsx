import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiEdit3 } from 'react-icons/fi';

export function Perfil() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dados');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // Estados dos dados do utilizador
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    ocasiao: 'Trabalho e dia a dia',
    personalidade: 'Elegante',
    sensacao: 'Amadeirado'
  });

  // Carrega os dados da memória ao entrar na página
  useEffect(() => {
    const nomeSalvo = localStorage.getItem('nomeUsuario') || 'Visitante Elegante';
    const perfilSalvo = localStorage.getItem('perfilCompleto');
    
    if (perfilSalvo) {
      setUserData(JSON.parse(perfilSalvo));
    } else {
      setUserData(prev => ({ ...prev, nome: nomeSalvo }));
    }
  }, []);

  const handleSaveDados = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('nomeUsuario', userData.nome);
    localStorage.setItem('perfilCompleto', JSON.stringify(userData));
    mostrarSucesso('Dados pessoais atualizados com sucesso!');
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
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('perfilCompleto');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-2">Minha Conta</h1>
          <p className="text-stone-500 text-sm">Faça a gestão da sua assinatura e dados pessoais.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* MENU LATERAL */}
          <div className="w-full md:w-1/4">
            <div className="bg-white border border-stone-200 p-4 shadow-sm flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('dados')}
                className={`flex items-center gap-3 w-full p-4 text-left text-sm uppercase tracking-wider font-bold cursor-pointer transition-colors ${activeTab === 'dados' ? 'bg-neutral-950 text-amber-500' : 'text-stone-500 hover:bg-stone-50 hover:text-neutral-900'}`}
              >
                <FiUser className="text-lg" /> Meus Dados
              </button>
              
              <button 
                onClick={() => setActiveTab('assinatura')}
                className={`flex items-center gap-3 w-full p-4 text-left text-sm uppercase tracking-wider font-bold cursor-pointer transition-colors ${activeTab === 'assinatura' ? 'bg-neutral-950 text-amber-500' : 'text-stone-500 hover:bg-stone-50 hover:text-neutral-900'}`}
              >
                <FiSettings className="text-lg" /> Perfil Olfativo
              </button>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-4 text-left text-sm uppercase tracking-wider font-bold text-red-700 hover:bg-red-50 transition-colors mt-4 border-t border-stone-100 cursor-pointer"
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
                        onChange={e => setUserData({...userData, nome: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">E-mail</label>
                      <input 
                        type="email" 
                        required
                        className="w-full p-3 border border-stone-300 text-stone-700 focus:border-amber-500 focus:outline-none"
                        value={userData.email}
                        onChange={e => setUserData({...userData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">Telefone</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full p-3 border border-stone-300 text-stone-700 focus:border-amber-500 focus:outline-none"
                        value={userData.telefone}
                        onChange={e => setUserData({...userData, telefone: e.target.value})}
                      />
                    </div>
                    <button type="submit" className="mt-4 bg-neutral-950 hover:bg-amber-600 text-white hover:text-neutral-950 font-bold py-4 px-6 text-xs uppercase tracking-widest transition-colors w-full md:w-auto self-start">
                      Guardar Alterações
                    </button>
                  </form>
                </div>
              )}

              {/* ABA: ASSINATURA OLFATIVA (REFAZER QUIZ) */}
              {activeTab === 'assinatura' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-serif text-neutral-900 mb-2 flex items-center gap-2">
                    A sua Assinatura Olfativa
                  </h2>
                  <p className="text-sm text-stone-500 mb-8">Refaça a sua descoberta sempre que o seu estilo mudar. A nossa vitrine na página inicial irá adaptar-se às suas novas escolhas.</p>
                  
                  <form onSubmit={handleSaveOlfativo} className="flex flex-col gap-6 max-w-lg">
                    
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-900 mb-3 font-bold">Ocasião Principal</label>
                      <select 
                        className="w-full p-3 border border-stone-300 text-stone-700 focus:border-amber-500 focus:outline-none bg-white"
                        value={userData.ocasiao}
                        onChange={e => setUserData({...userData, ocasiao: e.target.value})}
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
                        onChange={e => setUserData({...userData, personalidade: e.target.value})}
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
                        onChange={e => setUserData({...userData, sensacao: e.target.value})}
                      >
                        <option value="Doce">Doce, quente e envolvente</option>
                        <option value="Fresco">Fresco, limpo e versátil</option>
                        <option value="Floral">Floral, macio e elegante</option>
                        <option value="Amadeirado">Madeiras fortes e especiarias</option>
                      </select>
                    </div>

                    <button type="submit" className="mt-4 bg-amber-600 hover:bg-neutral-950 text-neutral-950 hover:text-white font-bold py-4 px-6 text-xs uppercase tracking-widest transition-colors w-full md:w-auto self-start">
                      Atualizar Recomendações
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}