import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Cadastro() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    perfilOlfativo: ''
  });
  const navigate = useNavigate();

  // Avança para a pergunta do perfume
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  // Guarda a resposta do perfume e finaliza o cadastro
  const handleFinish = (perfil: string) => {
    const finalData = { ...formData, perfilOlfativo: perfil };
    console.log('Novo utilizador registado:', finalData);
    
    // Futuramente: Salvar no banco de dados e context
    alert('Cadastro concluído! O seu perfil olfativo é: ' + perfil);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="bg-neutral-800 border border-amber-700/30 p-8 rounded-lg max-w-md w-full shadow-2xl text-stone-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-amber-500 mb-2">Perfumaria CS</h1>
          <p className="text-sm text-stone-400 tracking-wide">
            {step === 1 ? 'Crie a sua assinatura' : 'Descubra o seu estilo'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNext} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1 text-stone-300">Nome completo</label>
              <input
                type="text"
                required
                className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                value={formData.nome}
                onChange={e => setFormData({...formData, nome: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-stone-300">E-mail</label>
              <input
                type="email"
                required
                className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-stone-300">Senha</label>
              <input
                type="password"
                required
                className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                value={formData.senha}
                onChange={e => setFormData({...formData, senha: e.target.value})}
              />
            </div>
            
            <button type="submit" className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm">
              Continuar ↗
            </button>
            
            <p className="text-center text-sm text-stone-400 mt-4">
              Já tem conta? <Link to="/login" className="text-amber-500 hover:underline font-semibold">Entrar</Link>
            </p>
          </form>
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in">
            <h3 className="text-lg font-serif text-center text-stone-200 mb-2">Qual sensação prefere num perfume?</h3>
            <p className="text-xs text-center text-stone-400 mb-4">Isto ajudará a nossa curadoria a recomendar-lhe a fragrância ideal.</p>
            
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => handleFinish('doce')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all">
                ☕ Doce e envolvente
              </button>
              <button onClick={() => handleFinish('fresco')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all">
                ☀️ Fresco e versátil
              </button>
              <button onClick={() => handleFinish('floral')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all">
                🌸 Floral e elegante
              </button>
              <button onClick={() => handleFinish('marcante')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all">
                ✦ Marcante e sofisticado
              </button>
            </div>
            
            <button onClick={() => setStep(1)} className="mt-4 text-xs text-stone-500 hover:text-stone-300 text-center uppercase tracking-widest">
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}