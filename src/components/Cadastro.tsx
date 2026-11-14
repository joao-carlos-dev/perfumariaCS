import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import ReactGA from 'react-ga4';
import { supabase } from '../supabase';

// Helper para verificar sequência de números (crescente ou decrescente)
function checkSequentialNumbers(password: string): boolean {
  const sequences = [
    '012', '123', '234', '345', '456', '567', '678', '789', '890',
    '987', '876', '765', '654', '543', '432', '321', '210'
  ];
  return sequences.some(seq => password.includes(seq));
}

// Helper para aplicar máscara automática de telefone brasileiro: (00) 00000-0000
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

// Helper simples de sanitização para evitar injeção de tags HTML (<script>, etc.)
function sanitizeText(value: string): string {
  return value.replace(/[<>]/g, '');
}

export function Cadastro() {
  const [step, setStep] = useState(1);
  const [quizQuestion, setQuizQuestion] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: '',
    ocasiao: '',
    personalidade: '',
    sensacao: ''
  });

  const navigate = useNavigate();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const { nome, telefone, senha } = formData;
    const apenasNumerosTelefone = telefone.replace(/\D/g, '');

    // 1. Validação de Nome mínimo
    if (nome.trim().length < 3) {
      setErro('Por favor, insira o seu nome completo.');
      return;
    }

    // 2. Validação de Telefone (DDD + 8 ou 9 dígitos)
    if (apenasNumerosTelefone.length < 10 || apenasNumerosTelefone.length > 11) {
      setErro('Insira um número de telefone válido com DDD.');
      return;
    }

    // 3. Validação de Tamanho da Senha (8 a 15 caracteres)
    if (senha.length < 8 || senha.length > 15) {
      setErro('A senha deve ter entre 8 e 15 caracteres.');
      return;
    }

    // 4. Validação de senhas iguais
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    // 5. Validação de Letra Maiúscula
    if (!/[A-Z]/.test(senha)) {
      setErro('A senha deve conter pelo menos uma letra maiúscula.');
      return;
    }

    // 6. Validação de Caractere Especial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
      setErro('A senha deve conter pelo menos um caractere especial (ex: @, #, !).');
      return;
    }

    // 7. Validação de Números em Sequência
    if (checkSequentialNumbers(senha)) {
      setErro('A senha não pode conter números em sequência (ex: 123 ou 321).');
      return;
    }

    // 8. Validação de Consentimento LGPD
    if (!aceitouTermos) {
      setErro('Você precisa concordar com a Política de Privacidade (LGPD) para continuar.');
      return;
    }

    setStep(2);
  };

  const handleAnswer = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (quizQuestion < 3) {
      setQuizQuestion(quizQuestion + 1);
    } else {
      finishRegistration({ ...formData, [field]: value });
    }
  };

  const finishRegistration = async (finalData: any) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErro('');

    const { senha, ...dadosSeguros } = finalData;

    try {
      // Envia tudo num único pedido; a Trigger do PostgreSQL grava nas tabelas clientes e perfis_olfativos
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: dadosSeguros.email,
        password: senha,
        options: {
          data: {
            nome: dadosSeguros.nome,
            telefone: dadosSeguros.telefone,
            consentimento_lgpd: true,
            ocasiao: dadosSeguros.ocasiao,
            personalidade: dadosSeguros.personalidade,
            sensacao: dadosSeguros.sensacao,
          }
        }
      });

      if (authError) {
        if (authError.status === 429) {
          throw new Error('Limite de envio de e-mails atingido (429). Configure um Custom SMTP no Supabase ou aguarde 1 hora.');
        }
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Erro ao criar utilizador.');
      }

      const perfilParaSalvar = {
        ...dadosSeguros,
        consentimentoLGPD: true,
        dataCadastro: new Date().toISOString()
      };

      // Guarda localmente para exibir a Vitrine VIP enquanto ele ainda não clicou no link do e-mail
      localStorage.setItem('nomeUsuario', dadosSeguros.nome);
      localStorage.setItem('perfilCompleto', JSON.stringify(perfilParaSalvar));

      ReactGA.event({
        category: 'Conversão',
        action: 'Cadastro_Finalizado',
        label: dadosSeguros.sensacao
      });

      setIsAnalyzing(true);
      setTimeout(() => {
        navigate('/', { state: { perfilUsuario: perfilParaSalvar } });
      }, 4500);

    } catch (error: any) {
      setErro('Erro no registo: ' + error.message);
      setStep(1);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-center overflow-hidden">
          <style>{`
            @keyframes float-particle {
              0% { transform: translateY(0px) scale(0.5); opacity: 0; }
              30% { opacity: 0.8; }
              100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
            }
            .particle { animation: float-particle ease-in-out infinite; }
          `}</style>

          <div className="absolute w-[40rem] h-[40rem] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
            {[...Array(40)].map((_, i) => {
              const size = Math.random() * 5 + 2;
              const left = Math.random() * 100;
              const top = Math.random() * 100;
              const delay = Math.random() * 2;
              const duration = Math.random() * 2 + 2;

              return (
                <div
                  key={i}
                  className="particle absolute rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                  style={{
                    width: `${size}px`, height: `${size}px`,
                    left: `${left}%`, top: `${top}%`,
                    animationDelay: `${delay}s`, animationDuration: `${duration}s`, opacity: 0
                  }}
                ></div>
              );
            })}
          </div>

          <div className="relative z-10 flex flex-col items-center animate-fade-in">
            <div className="relative w-20 h-20 flex items-center justify-center mb-6">
              <div className="absolute inset-0 border border-amber-500/20 rotate-45 animate-pulse" style={{ animationDuration: '3s' }}></div>
              <span className="font-serif text-3xl text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">CS</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-amber-500/90 mb-3 tracking-widest text-center font-light">Vaporizando a essência</h2>
            <p className="text-stone-500 text-[10px] tracking-[0.4em] uppercase">Apurando o seu perfil olfativo</p>
          </div>
        </div>
      )}

      <div className={`min-h-screen bg-neutral-900 flex items-center justify-center p-4 py-24 ${isAnalyzing ? 'hidden' : ''}`}>
        <div className="bg-neutral-800 border border-amber-700/30 p-8 rounded-lg max-w-md w-full shadow-2xl text-stone-200 min-h-[450px] flex flex-col justify-center">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-amber-500 mb-2">Perfumaria CS</h1>
            <p className="text-sm text-stone-400 tracking-wide">
              {step === 1 ? 'Crie a sua assinatura' : 'Descubra o seu estilo'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="flex flex-col gap-4 animate-fade-in">
              <div>
                <label className="block text-sm mb-1 text-stone-300">Nome completo</label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: sanitizeText(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-stone-300">Número de telefone</label>
                <input
                  type="tel"
                  required
                  placeholder="(00) 00000-0000"
                  className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                  value={formData.telefone}
                  onChange={e => setFormData({ ...formData, telefone: formatPhoneNumber(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-stone-300">E-mail</label>
                <input
                  type="email"
                  required
                  maxLength={100}
                  className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: sanitizeText(e.target.value.trim()) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-stone-300">Senha</label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    required
                    maxLength={15}
                    autoComplete="new-password"
                    className="w-full p-3 pr-10 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                    value={formData.senha}
                    onChange={e => setFormData({ ...formData, senha: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-500 transition-colors"
                  >
                    {mostrarSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">
                  A senha deve ter entre 8 e 15 caracteres, e incluir pelo menos 1 letra maiúscula, 1 caractere especial e não possuir números em sequência (ex: 123).
                </p>
              </div>

              <div>
                <label className="block text-sm mb-1 text-stone-300">Confirmar senha</label>
                <div className="relative">
                  <input
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    required
                    maxLength={15}
                    autoComplete="new-password"
                    className="w-full p-3 pr-10 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors"
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-500 transition-colors"
                  >
                    {mostrarConfirmarSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Checkbox de Consentimento LGPD */}
              <div className="mt-2 p-3 bg-neutral-900/60 border border-neutral-700/60 rounded">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aceitouTermos}
                    onChange={e => setAceitouTermos(e.target.checked)}
                    className="mt-1 accent-amber-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-[11px] text-stone-400 leading-relaxed">
                    Concordo com o armazenamento dos meus dados para personalização olfativa e contacto via WhatsApp, em conformidade com a <strong className="text-amber-500/90 font-normal">LGPD</strong>.
                  </span>
                </label>
              </div>

              {erro && (
                <div className="bg-red-950/50 border border-red-800/50 text-red-300 p-3 rounded text-xs font-semibold text-center mt-1">
                  {erro}
                </div>
              )}

              <button type="submit" className="mt-2 bg-amber-600 hover:bg-amber-700 text-neutral-950 font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                Continuar <FiArrowUpRight className="text-lg" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 mt-1">
                <FiShield className="text-amber-600" />
                <span>Os seus dados estão protegidos e a sua senha nunca fica exposta.</span>
              </div>

              <p className="text-center text-sm text-stone-400 mt-2">
                Já tem conta? <Link to="/login" className="text-amber-500 hover:underline font-semibold">Entrar</Link>
              </p>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-center gap-2 mb-4">
                <div className={`h-1 w-8 rounded-full ${quizQuestion >= 1 ? 'bg-amber-500' : 'bg-neutral-700'}`}></div>
                <div className={`h-1 w-8 rounded-full ${quizQuestion >= 2 ? 'bg-amber-500' : 'bg-neutral-700'}`}></div>
                <div className={`h-1 w-8 rounded-full ${quizQuestion >= 3 ? 'bg-amber-500' : 'bg-neutral-700'}`}></div>
              </div>

              {quizQuestion === 1 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif text-center text-stone-200 mb-2">Qual é o uso principal do seu perfume?</h3>
                  <p className="text-xs text-center text-stone-400 mb-6">A intensidade ideal depende de onde você vai.</p>
                  <div className="grid grid-cols-1 gap-3">
                    <button onClick={() => handleAnswer('ocasiao', 'Trabalho e dia a dia')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">💼 Trabalho e dia a dia (Discreto)</button>
                    <button onClick={() => handleAnswer('ocasiao', 'Festas e eventos')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">🥂 Festas e eventos (Marcante)</button>
                    <button onClick={() => handleAnswer('ocasiao', 'Encontros a dois')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">🍷 Encontros a dois (Intimista)</button>
                    <button onClick={() => handleAnswer('ocasiao', 'Assinatura')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">✨ Assinatura (Uso para tudo)</button>
                  </div>
                </div>
              )}

              {quizQuestion === 2 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif text-center text-stone-200 mb-2">Como descreveria a sua personalidade?</h3>
                  <p className="text-xs text-center text-stone-400 mb-6">Perfumes também comunicam quem você é.</p>
                  <div className="grid grid-cols-1 gap-3">
                    <button onClick={() => handleAnswer('personalidade', 'Elegante')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">👑 Elegante e sofisticado(a)</button>
                    <button onClick={() => handleAnswer('personalidade', 'Comunicativo')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">⚡ Dinâmico(a) e comunicativo(a)</button>
                    <button onClick={() => handleAnswer('personalidade', 'Misterioso')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">🔥 Intenso(a) e sedutor(a)</button>
                    <button onClick={() => handleAnswer('personalidade', 'Minimalista')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">🍃 Calmo(a) e minimalista</button>
                  </div>
                </div>
              )}

              {quizQuestion === 3 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif text-center text-stone-200 mb-2">Qual sensação mais lhe agrada?</h3>
                  <p className="text-xs text-center text-stone-400 mb-6">Isto define o caminho olfativo ideal para si.</p>
                  <div className="grid grid-cols-1 gap-3">
                    <button onClick={() => handleAnswer('sensacao', 'Doce')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">☕ Doce, quente e envolvente</button>
                    <button onClick={() => handleAnswer('sensacao', 'Fresco')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">☀️ Fresco, limpo e versátil</button>
                    <button onClick={() => handleAnswer('sensacao', 'Floral')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">🌸 Floral, macio e elegante</button>
                    <button onClick={() => handleAnswer('sensacao', 'Amadeirado')} className="p-4 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm">✦ Madeiras fortes e especiarias</button>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => quizQuestion > 1 ? setQuizQuestion(quizQuestion - 1) : setStep(1)}
                  className="text-xs text-stone-500 hover:text-stone-300 uppercase tracking-widest p-2 transition-colors"
                >
                  ← Voltar
                </button>
                <span className="text-xs text-stone-600 p-2">{quizQuestion}/3</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}