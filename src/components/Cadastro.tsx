import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FiArrowUpRight, FiEye, FiEyeOff, FiShield, FiCheck, FiMail, FiMessageCircle } from 'react-icons/fi';
import { supabase } from '../supabase';

function checkSequentialNumbers(password: string): boolean {
  const sequences = [
    '012', '123', '234', '345', '456', '567', '678', '789', '890',
    '987', '876', '765', '654', '543', '432', '321', '210'
  ];
  return sequences.some(seq => password.includes(seq));
}

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

function sanitizeText(value: string): string {
  return value.replace(/[<>]/g, '');
}

const TOTAL_QUESTIONS = 7;
// Número do WhatsApp do responsável (55 + DDD + número, sem espaços)
const WHATSAPP_RESPONSAVEL = '5548998396111';

export function Cadastro() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isRefazendo = location.state?.isRefazendo || false;
  const veioDoEmail = searchParams.get('etapa') === 'quiz';

  // step 1 = Formulário | step 2 = Aviso de E-mail | step 3 = Quiz | step 4 = Finalização + WhatsApp
  const [step, setStep] = useState(isRefazendo || veioDoEmail ? 3 : 1);
  const [quizQuestion, setQuizQuestion] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [perfilFinalizado, setPerfilFinalizado] = useState<any>(null);

  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: '',
    estilo: '',
    ocasiao: '',
    personalidade: '',
    sensacao: '',
    intensidade: '',
    orcamento: '',
    perfume_favorito: ''
  });

  // Garante que, ao voltar do link do e-mail, o Supabase autentique a sessão e abra o quiz
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || session) && veioDoEmail) {
        setStep(3);
      }
    });
    return () => subscription.unsubscribe();
  }, [veioDoEmail]);

  // ETAPA 1: CADASTRAR CONTA E ENVIAR E-MAIL DE CONFIRMAÇÃO
  const handleCadastrarConta = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const { nome, telefone, email, senha } = formData;
    const apenasNumerosTelefone = telefone.replace(/\D/g, '');

    if (nome.trim().length < 3) {
      setErro('Por favor, insira o seu nome completo.'); return;
    }
    if (apenasNumerosTelefone.length < 10 || apenasNumerosTelefone.length > 11) {
      setErro('Insira um número de telefone válido com DDD.'); return;
    }
    if (senha.length < 8 || senha.length > 15) {
      setErro('A senha deve ter entre 8 e 15 caracteres.'); return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.'); return;
    }
    if (!/[A-Z]/.test(senha)) {
      setErro('A senha deve conter pelo menos uma letra maiúscula.'); return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
      setErro('A senha deve conter pelo menos um caractere especial (ex: @, #, !).'); return;
    }
    if (checkSequentialNumbers(senha)) {
      setErro('A senha não pode conter números em sequência (ex: 123 ou 321).'); return;
    }
    if (!aceitouTermos) {
      setErro('Você precisa concordar com a Política de Privacidade (LGPD) para continuar.'); return;
    }

    setIsSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          emailRedirectTo: `${window.location.origin}/cadastro?etapa=quiz`,
          data: {
            nome,
            telefone,
            consentimento_lgpd: true,
          }
        }
      });

      if (authError) {
        if (authError.status === 429) throw new Error('Limite de envios atingido. Tente novamente mais tarde.');
        throw new Error(authError.message);
      }
      if (!authData.user) {
        throw new Error('Erro ao criar conta. Tente novamente.');
      }

      localStorage.setItem('nomeUsuario', nome);
      setStep(2); // Vai para a tela "Verifique seu e-mail"
    } catch (error: any) {
      setErro('Erro no cadastro: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ETAPA 3: RESPONDER O QUIZ
  const handleAnswer = (field: keyof typeof formData, value: string) => {
    if (isSubmitting) return;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (quizQuestion < TOTAL_QUESTIONS) {
      setQuizQuestion(quizQuestion + 1);
    }
  };

  const handleFinishQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErro('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sessão expirada. Faça login novamente para salvar seu perfil.');

      // 1. Salva as 7 respostas na tabela perfis_olfativos
      const { error: quizError } = await supabase
        .from('perfis_olfativos')
        .insert([
          {
            cliente_id: user.id,
            estilo: formData.estilo,
            ocasiao: formData.ocasiao,
            personalidade: formData.personalidade,
            sensacao: formData.sensacao,
            intensidade: formData.intensidade,
            orcamento: formData.orcamento,
            perfume_favorito: formData.perfume_favorito.trim() || null,
          }
        ]);

      if (quizError) throw new Error('Erro ao salvar no banco: ' + quizError.message);

      // 2. Busca nome e telefone reais do cliente
      const { data: cliente } = await supabase
        .from('clientes')
        .select('nome, telefone, consentimento_lgpd, data_cadastro')
        .eq('id', user.id)
        .single();

      const perfilAtualizado = {
        nome: cliente?.nome || localStorage.getItem('nomeUsuario') || 'Cliente',
        email: user.email,
        telefone: cliente?.telefone || '',
        consentimentoLGPD: cliente?.consentimento_lgpd || true,
        dataCadastro: cliente?.data_cadastro || new Date().toISOString(),
        estilo: formData.estilo,
        ocasiao: formData.ocasiao,
        personalidade: formData.personalidade,
        sensacao: formData.sensacao,
        intensidade: formData.intensidade,
        orcamento: formData.orcamento,
        perfume_favorito: formData.perfume_favorito.trim(),
      };

      localStorage.setItem('nomeUsuario', perfilAtualizado.nome);
      localStorage.setItem('perfilCompleto', JSON.stringify(perfilAtualizado));
      setPerfilFinalizado(perfilAtualizado);

      // 3. Animação e exibe a tela final com o botão do WhatsApp
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep(4);
      }, 3500);

    } catch (error: any) {
      setErro(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ETAPA 4: DISPARO PARA O WHATSAPP DO RESPONSÁVEL
  const handleEnviarWhatsApp = () => {
    if (!perfilFinalizado) return;

    const mensagem = [
      `Olá! Acabei de concluir a minha *Pesquisa Olfativa* na Perfumaria CS.`,
      ``,
      `*Cliente:* ${perfilFinalizado.nome}`,
      perfilFinalizado.telefone ? `*Telefone:* ${perfilFinalizado.telefone}` : null,
      `*1. Estilo:* ${perfilFinalizado.estilo}`,
      `*2. Ocasiões:* ${perfilFinalizado.ocasiao}`,
      `*3. Impressão:* ${perfilFinalizado.personalidade}`,
      `*4. Aroma:* ${perfilFinalizado.sensacao}`,
      `*5. Intensidade:* ${perfilFinalizado.intensidade}`,
      `*6. Investimento:* ${perfilFinalizado.orcamento}`,
      perfilFinalizado.perfume_favorito ? `*7. Perfume que gosta:* ${perfilFinalizado.perfume_favorito}` : null,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WHATSAPP_RESPONSAVEL}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
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
          <div className="absolute w-160 h-160 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
            {[...Array(40)].map((_, i) => {
              const size = Math.random() * 5 + 2;
              const left = Math.random() * 100;
              const top = Math.random() * 100;
              const delay = Math.random() * 2;
              const duration = Math.random() * 2 + 2;
              return (
                <div key={i} className="particle absolute rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                  style={{
                    width: `${size}px`, height: `${size}px`, left: `${left}%`, top: `${top}%`,
                    animationDelay: `${delay}s`, animationDuration: `${duration}s`, opacity: 0
                  }}>
                </div>
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
        <div className="bg-neutral-800 border border-amber-700/30 p-8 rounded-lg max-w-md w-full shadow-2xl text-stone-200 min-h-120 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-amber-500 mb-2">Perfumaria CS</h1>
            <p className="text-sm text-stone-400 tracking-wide">
              {step === 1 && 'Crie a sua assinatura'}
              {step === 2 && 'Confirme o seu e-mail'}
              {step === 3 && 'Descubra o seu estilo'}
              {step === 4 && 'Perfil Olfativo Concluído'}
            </p>
          </div>

          {/* STEP 1: FORMULÁRIO DE CADASTRO */}
          {step === 1 && (
            <form onSubmit={handleCadastrarConta} className="flex flex-col gap-4 animate-fade-in">
              <div><label className="block text-sm mb-1 text-stone-300">Nome completo</label><input type="text" required maxLength={80} className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors" value={formData.nome} onChange={e => setFormData({ ...formData, nome: sanitizeText(e.target.value) })} /></div>
              <div><label className="block text-sm mb-1 text-stone-300">Número de telefone</label><input type="tel" required placeholder="(00) 00000-0000" className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: formatPhoneNumber(e.target.value) })} /></div>
              <div><label className="block text-sm mb-1 text-stone-300">E-mail</label><input type="email" required maxLength={100} className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors" value={formData.email} onChange={e => setFormData({ ...formData, email: sanitizeText(e.target.value.trim()) })} /></div>

              <div>
                <label className="block text-sm mb-1 text-stone-300">Senha</label>
                <div className="relative">
                  <input type={mostrarSenha ? "text" : "password"} required maxLength={15} autoComplete="new-password" className="w-full p-3 pr-10 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors" value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-500 transition-colors">
                    {mostrarSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">A senha deve ter entre 8 e 15 caracteres, incluir pelo menos 1 letra maiúscula, 1 caractere especial e não possuir números em sequência.</p>
              </div>

              <div>
                <label className="block text-sm mb-1 text-stone-300">Confirmar senha</label>
                <div className="relative">
                  <input type={mostrarConfirmarSenha ? "text" : "password"} required maxLength={15} autoComplete="new-password" className="w-full p-3 pr-10 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white transition-colors" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} />
                  <button type="button" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-500 transition-colors">
                    {mostrarConfirmarSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="mt-2 p-3 bg-neutral-900/60 border border-neutral-700/60 rounded">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={aceitouTermos} onChange={e => setAceitouTermos(e.target.checked)} className="mt-1 accent-amber-500 w-4 h-4 rounded cursor-pointer" />
                  <span className="text-[11px] text-stone-400 leading-relaxed">Concordo com o armazenamento dos meus dados para personalização olfativa e contato via WhatsApp, em conformidade com a <strong className="text-amber-500/90 font-normal">LGPD</strong>.</span>
                </label>
              </div>

              {erro && <div className="bg-red-950/50 border border-red-800/50 text-red-300 p-3 rounded text-xs font-semibold text-center mt-1">{erro}</div>}

              <button type="submit" disabled={isSubmitting} className="mt-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-neutral-950 font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                {isSubmitting ? 'Criando conta...' : 'Cadastrar e Receber Link'} <FiArrowUpRight className="text-lg" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 mt-1">
                <FiShield className="text-amber-600" /> <span>Seus dados estão protegidos e sua senha nunca fica exposta.</span>
              </div>
              <p className="text-center text-sm text-stone-400 mt-2">
                Já tem conta? <Link to="/login" className="text-amber-500 hover:underline font-semibold">Entrar</Link>
              </p>
            </form>
          )}

          {/* STEP 2: CONFIRMAÇÃO DE E-MAIL */}
          {step === 2 && (
            <div className="text-center animate-fade-in py-4">
              <div className="w-16 h-16 bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-amber-700/50">
                <FiMail className="text-3xl" />
              </div>
              <h3 className="text-xl font-serif text-stone-100 mb-3">Verifique a sua caixa de entrada</h3>
              <p className="text-sm text-stone-400 leading-relaxed mb-6">
                Enviamos um link de confirmação para <strong className="text-amber-400">{formData.email}</strong>.
                Clique no botão do e-mail para ativar sua conta e iniciar a sua <strong className="text-stone-200">Pesquisa Olfativa</strong>.
              </p>
              <Link to="/login" className="text-xs text-stone-400 hover:text-amber-500 uppercase tracking-widest transition-colors">
                Ir para o Login
              </Link>
            </div>
          )}

          {/* STEP 3: QUIZ DE 7 PERGUNTAS */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-center gap-1.5 mb-4">
                {[...Array(TOTAL_QUESTIONS)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      quizQuestion >= idx + 1 ? 'bg-amber-500' : 'bg-neutral-700'
                    }`}
                  />
                ))}
              </div>

              {quizQuestion === 1 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif text-center text-stone-200 mb-6">Qual estilo de fragrância você procura?</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {['Masculina', 'Feminina', 'Unissex', 'Estou aberto(a) a todas as opções'].map(opcao => (
                      <button key={opcao} disabled={isSubmitting} onClick={() => handleAnswer('estilo', opcao)} className="p-3.5 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm disabled:opacity-50">{opcao}</button>
                    ))}
                  </div>
                </div>
              )}

              {quizQuestion === 2 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif text-center text-stone-200 mb-6">Em quais ocasiões você pretende usar seu perfume?</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {['Trabalho e dia a dia', 'Festas e eventos especiais', 'Encontros e momentos a dois', 'Lazer e momentos casuais', 'Todas as ocasiões — busco versatilidade'].map(opcao => (
                      <button key={opcao} disabled={isSubmitting} onClick={() => handleAnswer('ocasiao', opcao)} className="p-3.5 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm disabled:opacity-50">{opcao}</button>
                    ))}
                  </div>
                </div>
              )}

              {quizQuestion === 3 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif text-center text-stone-200 mb-6">Que impressão você deseja transmitir com seu perfume?</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {['Elegância e sofisticação', 'Frescor e naturalidade', 'Sensualidade e mistério', 'Confiança e personalidade', 'Delicadeza e romantismo'].map(opcao => (
                      <button key={opcao} disabled={isSubmitting} onClick={() => handleAnswer('personalidade', opcao)} className="p-3.5 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm disabled:opacity-50">{opcao}</button>
                    ))}
                  </div>
                </div>
              )}

              {quizQuestion === 4 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif text-center text-stone-200 mb-6">Qual tipo de aroma mais agrada você?</h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      'Doce e cremoso — baunilha e caramelo',
                      'Fresco e cítrico — limão e bergamota',
                      'Floral e delicado — rosas e jasmim',
                      'Amadeirado e sofisticado — cedro e sândalo',
                      'Quente e especiado — âmbar e canela',
                      'Frutado e vibrante — frutas tropicais e vermelhas',
                      'Limpo e suave — almíscar e notas atalcadas',
                      'Não sei, quero descobrir'
                    ].map(opcao => (
                      <button key={opcao} disabled={isSubmitting} onClick={() => handleAnswer('sensacao', opcao)} className="p-3 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm disabled:opacity-50">{opcao}</button>
                    ))}
                  </div>
                </div>
              )}

              {quizQuestion === 5 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif text-center text-stone-200 mb-6">Qual intensidade você prefere em um perfume?</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {['Discreta — percebida de perto', 'Moderada — presença sem exageros', 'Marcante — percebida pelas pessoas ao redor', 'Intensa — alta projeção e presença', 'Não tenho preferência'].map(opcao => (
                      <button key={opcao} disabled={isSubmitting} onClick={() => handleAnswer('intensidade', opcao)} className="p-3.5 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm disabled:opacity-50">{opcao}</button>
                    ))}
                  </div>
                </div>
              )}

              {quizQuestion === 6 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif text-center text-stone-200 mb-6">Quanto você pretende investir em sua próxima fragrância?</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {['Até R$ 300', 'De R$ 301 a R$ 400', 'De R$ 401 a R$ 600', 'Acima de R$ 600', 'Não tenho um orçamento definido'].map(opcao => (
                      <button key={opcao} disabled={isSubmitting} onClick={() => handleAnswer('orcamento', opcao)} className="p-3.5 border border-amber-700/40 hover:bg-amber-900/40 hover:border-amber-500 rounded text-left transition-all text-sm disabled:opacity-50">{opcao}</button>
                    ))}
                  </div>
                </div>
              )}

              {quizQuestion === 7 && (
                <form onSubmit={handleFinishQuiz} className="animate-fade-in flex flex-col gap-4">
                  <h3 className="text-xl font-serif text-center text-stone-200 mb-1">Existe algum perfume que você já usa ou gosta muito?</h3>
                  <p className="text-xs text-center text-stone-400 mb-2">Opcional — isso ajuda a refinar ainda mais a sua curadoria.</p>
                  <textarea
                    rows={3}
                    maxLength={200}
                    placeholder="Ex: Sauvage, La Vie Est Belle, Lattafa Asad..."
                    className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded focus:border-amber-500 focus:outline-none text-white text-sm resize-none transition-colors"
                    value={formData.perfume_favorito}
                    onChange={e => setFormData({ ...formData, perfume_favorito: sanitizeText(e.target.value) })}
                  />
                  <button type="submit" disabled={isSubmitting} className="mt-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-neutral-950 font-bold py-3.5 px-4 rounded transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                    {isSubmitting ? 'Salvando...' : 'Finalizar Pesquisa'} <FiCheck className="text-lg" />
                  </button>
                </form>
              )}

              {erro && <div className="bg-red-950/50 border border-red-800/50 text-red-300 p-3 rounded text-xs font-semibold text-center mt-2">{erro}</div>}

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  disabled={isSubmitting || quizQuestion === 1}
                  onClick={() => setQuizQuestion(quizQuestion - 1)}
                  className="text-xs text-stone-500 hover:text-stone-300 uppercase tracking-widest p-2 transition-colors disabled:opacity-30"
                >
                  ← Voltar
                </button>
                <span className="text-xs text-stone-500 p-2">{quizQuestion}/{TOTAL_QUESTIONS}</span>
              </div>
            </div>
          )}

          {/* STEP 4: CONCLUSÃO + BOTÃO WHATSAPP */}
          {step === 4 && (
            <div className="text-center animate-fade-in flex flex-col gap-4 py-2">
              <div className="w-16 h-16 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-700/50">
                <FiCheck className="text-3xl" />
              </div>
              <h3 className="text-xl font-serif text-stone-100">Seu perfil olfativo foi definida!</h3>
              <p className="text-sm text-stone-400 leading-relaxed mb-2">
                Envie o seu perfil olfativo diretamente para o nosso consultor no WhatsApp para receber uma indicação personalizada, ou explore a sua Vitrine VIP agora.
              </p>

              <button
                onClick={handleEnviarWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2"
              >
                <FiMessageCircle className="text-lg" /> Enviar Perfil no WhatsApp
              </button>

              <button
                onClick={() => navigate('/', { state: { perfilUsuario: perfilFinalizado } })}
                className="w-full border border-amber-600/50 hover:bg-amber-600/10 text-amber-500 font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-xs"
              >
                Ver Minha Vitrine VIP
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}