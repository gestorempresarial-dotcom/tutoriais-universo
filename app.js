// ============================================================
// TUTORIAIS UNIVERSO — React + Firebase
// Versão 2.0 — Acesso público por URL, sem login para alunos/professores
// Aluno:    URL normal        → área aluno direto
// Professor: URL ?prof=1     → área professor direto
// Gestor:   URL ?g=1         → pede senha → painel gestão
// ============================================================

const { useState, useEffect, useRef } = React;

// ===== FIREBASE =====
const firebaseConfig = {
  apiKey: "AIzaSyDdAvltRFKAD3B0lHh9M77ACqP0HRlSPDM",
  authDomain: "tutorialuniverso.firebaseapp.com",
  projectId: "tutorialuniverso",
  storageBucket: "tutorialuniverso.firebasestorage.app",
  messagingSenderId: "813300235784",
  appId: "1:813300235784:web:c001f9fa7285c7cc369bbd"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== CONSTANTES =====
const GESTOR_SENHA = "universo2025";
const LOGO_TEXTO    = "logo-texto.png";
const LOGO_ESCUDO   = "logo-escud.png";
const LOGO_COMPLETO = "logo-complet.png";

const CATEGORIAS = ["Matrícula","Financeiro","AVA / EAD","Secretaria","Calendário","Estágio / TCC","Bolsas","Outros"];
const TIPOS = ["Texto","PDF","Vídeo","Link","Imagem"];

// Detecta perfil pela URL
function detectarPerfil() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("g")) return "gestor-login";
  if (params.has("prof")) return "professor";
  return "aluno";
}

// Dados demo (quando Firebase não configurado)
const DEMO_TUTORIAIS = [
  { id:"d1", titulo:"Bem-vindos ao UNIVERSO-GO 2026.1", descricao:"Guia completo de boas-vindas para calouros — tudo que você precisa saber ao chegar.", categoria:"Matrícula", tipo:"Link", url:"https://universo.edu.br/wp-content/uploads/2025/12/UNIVERSO-GO-l-MIA-l-2026.1-l-17112025.pdf", imagem:"", destaque:true, numero:"01", publico:["aluno","professor"], passos:["Acesse o link abaixo para o guia completo","Salve o PDF para consulta futura","Dúvidas? Procure a Secretaria Acadêmica"], createdAt:{seconds:Date.now()/1000} },
  { id:"d2", titulo:"Como confirmar sua matrícula", descricao:"Passo a passo para confirmar matrícula no portal acadêmico sem complicação.", categoria:"Matrícula", tipo:"Texto", url:"", imagem:"", destaque:false, numero:"02", publico:["aluno"], passos:["Acesse portal.universo.edu.br","Clique em 'Matrícula' no menu","Confirme os dados e finalize","Guarde o comprovante"], createdAt:{seconds:Date.now()/1000-86400} },
  { id:"d3", titulo:"Renovação de Matrícula", descricao:"Como renovar sua matrícula para o próximo semestre pelo portal do aluno.", categoria:"Matrícula", tipo:"Texto", url:"", imagem:"", destaque:false, numero:"03", publico:["aluno"], passos:["Acesse o Portal do Aluno até a data limite","Selecione as disciplinas para o próximo período","Confirme e imprima o comprovante"], createdAt:{seconds:Date.now()/1000-172800} },
  { id:"d4", titulo:"Acesso ao AVA — Ambiente Virtual", descricao:"Primeiro acesso ao ambiente virtual de aprendizagem e navegação nas disciplinas.", categoria:"AVA / EAD", tipo:"Texto", url:"", imagem:"", destaque:false, numero:"04", publico:["aluno","professor"], passos:["Acesse ava.universo.edu.br","Use seu e-mail @universo.edu.br","Altere a senha provisória no primeiro acesso","Acesse 'Meus Cursos'"], createdAt:{seconds:Date.now()/1000-259200} },
  { id:"d5", titulo:"Lançamento de Notas no AVA", descricao:"Como lançar e gerenciar notas dos alunos pelo ambiente virtual.", categoria:"AVA / EAD", tipo:"Texto", url:"", imagem:"", destaque:false, numero:"05", publico:["professor"], passos:["Acesse ava.universo.edu.br com suas credenciais","Selecione a disciplina e turma","Clique em 'Lançar Notas'","Confirme e salve"], createdAt:{seconds:Date.now()/1000-345600} },
  { id:"d6", titulo:"Entrega de Atestado Médico", descricao:"Procedimento correto para entrega de atestados e abono de faltas.", categoria:"Secretaria", tipo:"Texto", url:"", imagem:"", destaque:false, numero:"06", publico:["aluno"], passos:["Entregue em até 72h após a falta","Protocole na Secretaria com RG e atestado original","Guarde o comprovante de protocolo"], createdAt:{seconds:Date.now()/1000-432000} },
  { id:"d7", titulo:"Financeiro — Boleto e Pagamento", descricao:"Como gerar boleto, pagar mensalidade e consultar histórico financeiro.", categoria:"Financeiro", tipo:"Texto", url:"", imagem:"", destaque:false, numero:"07", publico:["aluno"], passos:["Acesse o Portal do Aluno","Clique em 'Financeiro'","Gere o boleto do mês vigente","Pague até o vencimento"], createdAt:{seconds:Date.now()/1000-518400} },
  { id:"d8", titulo:"Calendário Acadêmico 2026.1", descricao:"Datas importantes do semestre: provas, feriados, entregas e eventos.", categoria:"Calendário", tipo:"Texto", url:"", imagem:"", destaque:false, numero:"08", publico:["aluno","professor"], passos:["Consulte o calendário no portal","Marque as datas de P1, P2 e PS","Fique atento aos prazos de entrega de trabalhos"], createdAt:{seconds:Date.now()/1000-604800} },
];

// ===== FIREBASE HOOK =====
function useCollection(col) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = db.collection(col).onSnapshot(
      snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setData(docs);
        setLoading(false);
      },
      () => { setData(DEMO_TUTORIAIS); setLoading(false); }
    );
    return unsub;
  }, [col]);

  return { data, loading };
}

// ===== ÍCONES SVG =====
const I = {
  menu:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  book:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  search:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  plus:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  x:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 12 4 8"/></svg>,
  link:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  file:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  video:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  image:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  text:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
  arrow:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  back:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  list:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  chevron:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  info:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  users:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  logout:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const TIPO_ICON = { "PDF": I.file, "Vídeo": I.video, "Link": I.link, "Imagem": I.image, "Texto": I.text };

const CAT_COR = {
  "Matrícula": "pill-navy", "Financeiro": "pill-yellow", "AVA / EAD": "pill-blue",
  "Secretaria": "pill-green", "Calendário": "pill-blue", "Estágio / TCC": "pill-gray",
  "Bolsas": "pill-green", "Outros": "pill-gray",
};

function CatPill({ cat }) {
  return <span className={`pill ${CAT_COR[cat] || "pill-gray"}`}>{cat}</span>;
}

// ===== TOAST =====
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div className={`toast ${type}`}>{type === "success" ? <I.check /> : <I.info />}{msg}</div>;
}

// ===== LOGIN GESTOR =====
function GestorLogin({ onLogin }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function entrar() {
    if (senha === GESTOR_SENHA) onLogin();
    else setErro("Senha incorreta.");
  }

  return (
    <div className="gestor-page">
      <div className="gestor-card">
        <div className="gestor-logo">
          <img src={LOGO_TEXTO} alt="UNIVERSO" onError={e => e.target.style.display="none"} />
        </div>
        <div className="gestor-title">Área do Gestor</div>
        <div className="gestor-subtitle">Acesso restrito — gestão de conteúdo</div>
        <div className="gestor-field">
          <label>Senha</label>
          <input type="password" placeholder="••••••••" value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === "Enter" && entrar()} autoFocus />
        </div>
        {erro && <div className="gestor-error">{erro}</div>}
        <button className="gestor-btn" onClick={entrar}>Entrar</button>
      </div>
    </div>
  );
}

// ===== CARD TUTORIAL =====
function TutorialCard({ t, onClick }) {
  const Icone = TIPO_ICON[t.tipo] || I.file;
  return (
    <div className="tutorial-card" onClick={() => onClick(t)}>
      <div className="tutorial-card-thumb">
        {t.imagem
          ? <img src={t.imagem} alt={t.titulo} onError={e => e.target.style.display="none"} />
          : <div className="tutorial-card-thumb-placeholder"><I.book /></div>
        }
        {t.numero && <div className="tutorial-card-badge">Tutorial {t.numero}</div>}
        {!t.numero && t.destaque && <div className="tutorial-card-badge destaque">★ Destaque</div>}
      </div>
      <div className="tutorial-card-body">
        <div className="tutorial-card-title">{t.titulo}</div>
        <div className="tutorial-card-desc">{t.descricao}</div>
        <div className="tutorial-card-footer">
          <div className="tutorial-card-type"><Icone /> {t.tipo}</div>
          <CatPill cat={t.categoria} />
          <div className="tutorial-card-action">Ver <I.arrow /></div>
        </div>
      </div>
    </div>
  );
}

// ===== VISUALIZAÇÃO =====
function TutorialView({ t, onBack }) {
  const Icone = TIPO_ICON[t.tipo] || I.file;

  function renderConteudo() {
    if (t.tipo === "PDF" && t.url) return (
      <div>
        <a href={t.url} target="_blank" rel="noopener noreferrer" className="tutorial-link-btn" style={{display:"flex",marginBottom:"1rem"}}>
          <I.download /> Abrir / Baixar PDF
        </a>
        <iframe src={t.url} className="tutorial-iframe" title={t.titulo} />
      </div>
    );
    if (t.tipo === "Vídeo" && t.url) {
      const id = t.url.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1];
      const src = id ? `https://www.youtube.com/embed/${id}` : t.url;
      return <iframe src={src} className="tutorial-iframe" allowFullScreen title={t.titulo} />;
    }
    if (t.tipo === "Link" && t.url) return (
      <a href={t.url} target="_blank" rel="noopener noreferrer" className="tutorial-link-btn">
        <I.link /> {t.url.length > 65 ? t.url.slice(0,65)+"…" : t.url}
      </a>
    );
    if (t.tipo === "Imagem" && t.url) return <img src={t.url} alt={t.titulo} className="tutorial-img" />;
    return null;
  }

  const conteudo = renderConteudo();

  return (
    <div className="tutorial-view">
      <div className="tutorial-view-header">
        <div className="tutorial-breadcrumb">
          <a onClick={onBack}>Tutoriais</a>
          <I.chevron />
          <span>{t.categoria}</span>
          <I.chevron />
          <span>{t.titulo.length > 40 ? t.titulo.slice(0,40)+"…" : t.titulo}</span>
        </div>
        <div className="tutorial-view-title">{t.titulo}</div>
        <div className="tutorial-view-meta">
          <CatPill cat={t.categoria} />
          <span style={{display:"flex",alignItems:"center",gap:4}}><Icone /> {t.tipo}</span>
          {t.numero && <span>Tutorial {t.numero}</span>}
        </div>
      </div>

      {t.descricao && (
        <div className="tutorial-content-block">
          <h3><I.info /> Sobre este tutorial</h3>
          <p style={{color:"var(--gray-text)",lineHeight:1.7,fontSize:"0.88rem"}}>{t.descricao}</p>
        </div>
      )}

      {(t.passos || []).filter(Boolean).length > 0 && (
        <div className="tutorial-content-block">
          <h3><I.list /> Passo a passo</h3>
          <div className="tutorial-steps">
            {t.passos.filter(Boolean).map((p, i) => (
              <div className="tutorial-step" key={i}>
                <div className="tutorial-step-num">{i+1}</div>
                <div className="tutorial-step-text">{p}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {conteudo && (
        <div className="tutorial-content-block">
          <h3><Icone /> Conteúdo</h3>
          {conteudo}
        </div>
      )}

      <div style={{textAlign:"center",marginTop:"1.25rem",marginBottom:"0.5rem"}}>
        <button className="btn btn-secondary" onClick={onBack}><I.back /> Voltar</button>
      </div>
    </div>
  );
}

// ===== MÓDULO TUTORIAIS (público) =====
function ModuloTutoriais({ tutoriais, perfil }) {
  const [busca, setBusca] = useState("");
  const [catAtiva, setCatAtiva] = useState("Todos");
  const [aberto, setAberto] = useState(null);

  // Filtra por perfil
  const dosPerfil = tutoriais.filter(t => {
    if (!t.publico || t.publico.length === 0) return true;
    return t.publico.includes(perfil);
  });

  const filtrados = dosPerfil.filter(t => {
    const ok1 = catAtiva === "Todos" || t.categoria === catAtiva;
    const q = busca.toLowerCase();
    const ok2 = !q || t.titulo.toLowerCase().includes(q) || t.descricao?.toLowerCase().includes(q) || t.categoria?.toLowerCase().includes(q);
    return ok1 && ok2;
  });

  const catsUsadas = ["Todos", ...CATEGORIAS.filter(c => dosPerfil.some(t => t.categoria === c))];

  const titulo = perfil === "professor" ? "Tutoriais para Professores" : "Tutoriais para Alunos";
  const subtitulo = perfil === "professor"
    ? "Guias e procedimentos para docentes do UNIVERSO Goiânia"
    : "Tudo que você precisa saber sobre a vida acadêmica no UNIVERSO";

  if (aberto) return <TutorialView t={aberto} onBack={() => setAberto(null)} />;

  return (
    <div>
      {/* Hero */}
      <div className="hero-banner">
        <img src={LOGO_COMPLETO} alt="UNIVERSO" onError={e => e.target.style.display="none"} />
        <div>
          <div className="hero-title">{titulo}</div>
          <div className="hero-sub">{subtitulo}</div>
        </div>
        <div className="hero-count">
          <div className="hero-count-num">{dosPerfil.length}</div>
          <div className="hero-count-label">tutoriais disponíveis</div>
        </div>
      </div>

      {/* Busca */}
      <div style={{display:"flex",gap:"0.75rem",marginBottom:"1.1rem",flexWrap:"wrap",alignItems:"center"}}>
        <div className="top-bar-search" style={{maxWidth:420,flex:1,background:"white"}}>
          <I.search />
          <input placeholder="Buscar por título, categoria…" value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        {busca && <span style={{fontSize:"0.8rem",color:"var(--gray-muted)"}}>{filtrados.length} resultado{filtrados.length !== 1 ? "s" : ""}</span>}
      </div>

      {/* Filtros */}
      <div className="filter-bar">
        {catsUsadas.map(c => (
          <button key={c} className={`filter-chip${catAtiva === c ? " active" : ""}`} onClick={() => setCatAtiva(c)}>
            {c} {c !== "Todos" && <span style={{opacity:0.65}}>({dosPerfil.filter(t => t.categoria === c).length})</span>}
          </button>
        ))}
      </div>

      {filtrados.length === 0
        ? <div className="empty-state"><I.book /><h3>Nenhum tutorial encontrado</h3><p>Tente mudar os filtros ou a busca</p></div>
        : <div className="tutorials-grid">{filtrados.map(t => <TutorialCard key={t.id} t={t} onClick={setAberto} />)}</div>
      }
    </div>
  );
}

// ===== MODAL GESTOR =====
function ModalTutorial({ tutorial, onClose, onSave, onDelete }) {
  const isNew = !tutorial?.id;
  const [form, setForm] = useState(tutorial || {
    numero:"", titulo:"", descricao:"", categoria:CATEGORIAS[0],
    tipo:"Texto", url:"", imagem:"", destaque:false,
    publico:["aluno"], passos:["","","",""]
  });

  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const setPasso = (i, v) => { const p=[...(form.passos||[])]; p[i]=v; setForm(f=>({...f,passos:p})); };
  const addPasso = () => setForm(f => ({...f, passos:[...(f.passos||[]),""] }));
  const remPasso = i => { const p=[...(form.passos||[])]; p.splice(i,1); setForm(f=>({...f,passos:p})); };
  const togglePublico = v => {
    const cur = form.publico || [];
    const novo = cur.includes(v) ? cur.filter(x=>x!==v) : [...cur,v];
    set("publico", novo);
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isNew ? "Novo Tutorial" : "Editar Tutorial"}</div>
          <button className="modal-close" onClick={onClose}><I.x /></button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-field">
              <label>Número</label>
              <input placeholder="Ex: 01" value={form.numero} onChange={e=>set("numero",e.target.value)} />
            </div>
            <div className="form-field">
              <label>Categoria</label>
              <select value={form.categoria} onChange={e=>set("categoria",e.target.value)}>
                {CATEGORIAS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Título *</label>
            <input placeholder="Título claro e direto" value={form.titulo} onChange={e=>set("titulo",e.target.value)} />
          </div>

          <div className="form-field">
            <label>Descrição</label>
            <textarea rows={2} placeholder="Breve descrição do que este tutorial ensina" value={form.descricao} onChange={e=>set("descricao",e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Tipo de conteúdo</label>
              <select value={form.tipo} onChange={e=>set("tipo",e.target.value)}>
                {TIPOS.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Visível para</label>
              <div style={{display:"flex",gap:"0.75rem",paddingTop:"0.3rem"}}>
                {["aluno","professor"].map(p => (
                  <label key={p} style={{display:"flex",alignItems:"center",gap:"0.4rem",cursor:"pointer",fontSize:"0.875rem",fontWeight:500}}>
                    <input type="checkbox" checked={(form.publico||[]).includes(p)} onChange={()=>togglePublico(p)} style={{width:"auto",accentColor:"var(--navy)"}} />
                    {p.charAt(0).toUpperCase()+p.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {form.tipo !== "Texto" && (
            <div className="form-field">
              <label>URL ({form.tipo})</label>
              <input
                placeholder={form.tipo==="PDF"?"https://...arquivo.pdf":form.tipo==="Vídeo"?"https://youtube.com/watch?v=...":"https://..."}
                value={form.url} onChange={e=>set("url",e.target.value)}
              />
              <div className="form-hint">
                {form.tipo==="PDF" && "Link direto do PDF (Google Drive, site da instituição…)"}
                {form.tipo==="Vídeo" && "YouTube — o embed é gerado automaticamente"}
                {form.tipo==="Link" && "Abre em nova aba ao clicar"}
                {form.tipo==="Imagem" && "URL direta da imagem (.jpg, .png…)"}
              </div>
            </div>
          )}

          <div className="form-field">
            <label>Imagem de capa (URL, opcional)</label>
            <input placeholder="https://...capa.jpg" value={form.imagem||""} onChange={e=>set("imagem",e.target.value)} />
          </div>

          <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"1.1rem"}}>
            <input type="checkbox" id="dest" checked={!!form.destaque} onChange={e=>set("destaque",e.target.checked)} style={{width:"auto",accentColor:"var(--navy)"}} />
            <label htmlFor="dest" style={{textTransform:"none",fontSize:"0.875rem",fontWeight:500,cursor:"pointer"}}>Marcar como destaque</label>
          </div>

          <div className="form-field">
            <label>Passo a passo</label>
            {(form.passos||[]).map((p,i) => (
              <div key={i} style={{display:"flex",gap:"0.5rem",marginBottom:"0.45rem",alignItems:"center"}}>
                <div style={{width:23,height:23,borderRadius:"50%",background:"var(--navy)",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700,flexShrink:0}}>{i+1}</div>
                <input placeholder={`Passo ${i+1}…`} value={p} onChange={e=>setPasso(i,e.target.value)} style={{flex:1}} />
                {(form.passos||[]).length > 1 && <button onClick={()=>remPasso(i)} style={{color:"var(--gray-muted)",padding:"0 4px"}}><I.x /></button>}
              </div>
            ))}
            <button onClick={addPasso} style={{color:"var(--navy)",fontSize:"0.8rem",fontWeight:600,display:"flex",alignItems:"center",gap:"0.3rem",marginTop:"0.2rem"}}>
              <I.plus /> Adicionar passo
            </button>
          </div>
        </div>
        <div className="modal-footer">
          <div>{!isNew && <button className="btn btn-danger" onClick={()=>onDelete(tutorial.id)}><I.trash /> Excluir</button>}</div>
          <div style={{display:"flex",gap:"0.5rem"}}>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={()=>{ if(!form.titulo.trim()){alert("Digite o título");return;} onSave(form); }}><I.check /> Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== MÓDULO GESTOR =====
function ModuloGestor({ tutoriais, setToast }) {
  const [modal, setModal] = useState(null);
  const [tabPerfil, setTabPerfil] = useState("aluno");
  const [busca, setBusca] = useState("");

  const filtrados = tutoriais.filter(t => {
    const matchPerfil = !t.publico || t.publico.length === 0 || t.publico.includes(tabPerfil);
    const q = busca.toLowerCase();
    const matchBusca = !q || t.titulo.toLowerCase().includes(q);
    return matchPerfil && matchBusca;
  });

  async function salvar(form) {
    const dados = {
      numero: form.numero||"", titulo: form.titulo, descricao: form.descricao||"",
      categoria: form.categoria, tipo: form.tipo, url: form.url||"",
      imagem: form.imagem||"", destaque: !!form.destaque,
      publico: form.publico||["aluno"],
      passos: (form.passos||[]).filter(Boolean),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    try {
      if (form.id) {
        await db.collection("tutoriais").doc(form.id).update(dados);
        setToast({msg:"Tutorial atualizado!", type:"success"});
      } else {
        dados.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection("tutoriais").add(dados);
        setToast({msg:"Tutorial criado!", type:"success"});
      }
      setModal(null);
    } catch(e) { setToast({msg:"Erro: "+e.message, type:"error"}); }
  }

  async function excluir(id) {
    if (!confirm("Excluir este tutorial?")) return;
    try {
      await db.collection("tutoriais").doc(id).delete();
      setToast({msg:"Excluído.", type:"success"});
      setModal(null);
    } catch(e) { setToast({msg:"Erro ao excluir.", type:"error"}); }
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-card-label">Total de tutoriais</div>
          <div className="stat-card-value">{tutoriais.length}</div>
          <div className="stat-card-sub">no sistema</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Para Alunos</div>
          <div className="stat-card-value">{tutoriais.filter(t=>!t.publico||t.publico.includes("aluno")).length}</div>
          <div className="stat-card-sub">tutoriais visíveis</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Para Professores</div>
          <div className="stat-card-value">{tutoriais.filter(t=>t.publico&&t.publico.includes("professor")).length}</div>
          <div className="stat-card-sub">tutoriais visíveis</div>
        </div>
        {CATEGORIAS.filter(c=>tutoriais.some(t=>t.categoria===c)).slice(0,3).map(c=>(
          <div key={c} className="stat-card">
            <div className="stat-card-label">{c}</div>
            <div className="stat-card-value">{tutoriais.filter(t=>t.categoria===c).length}</div>
            <div className="stat-card-sub">tutoriais</div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <div>
          <div className="section-title">Gerenciar Tutoriais</div>
          <div className="section-subtitle">Adicione, edite ou remova tutoriais por perfil</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setModal("new")}><I.plus /> Novo Tutorial</button>
      </div>

      {/* Tabs de perfil */}
      <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1rem",flexWrap:"wrap"}}>
        <div className="perfil-tabs">
          {["aluno","professor"].map(p => (
            <button key={p} className={`perfil-tab${tabPerfil===p?" active":""}`} onClick={()=>setTabPerfil(p)}>
              {p.charAt(0).toUpperCase()+p.slice(1)}
            </button>
          ))}
        </div>
        <div className="top-bar-search" style={{maxWidth:320,background:"white"}}>
          <I.search />
          <input placeholder="Buscar…" value={busca} onChange={e=>setBusca(e.target.value)} />
        </div>
      </div>

      <div style={{background:"white",borderRadius:14,border:"1px solid var(--gray-line)",overflow:"hidden"}}>
        <table className="tutorial-table">
          <thead>
            <tr>
              <th>Nº</th><th>Título</th><th>Categoria</th><th>Tipo</th><th>Destaque</th><th style={{textAlign:"right"}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0
              ? <tr><td colSpan={6} style={{textAlign:"center",padding:"2rem",color:"var(--gray-muted)"}}>Nenhum tutorial encontrado</td></tr>
              : filtrados.map(t => (
                <tr key={t.id}>
                  <td style={{color:"var(--gray-muted)",fontSize:"0.78rem"}}>{t.numero||"—"}</td>
                  <td className="td-title">{t.titulo}</td>
                  <td><CatPill cat={t.categoria} /></td>
                  <td style={{color:"var(--gray-muted)",fontSize:"0.8rem"}}>{t.tipo}</td>
                  <td>{t.destaque ? "★" : "—"}</td>
                  <td>
                    <div className="td-actions" style={{justifyContent:"flex-end"}}>
                      <button className="btn-icon" onClick={()=>setModal(t)} title="Editar"><I.edit /></button>
                      <button className="btn-icon danger" onClick={()=>excluir(t.id)} title="Excluir"><I.trash /></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <div style={{marginTop:"1.25rem",background:"var(--navy-light)",border:"1px solid var(--navy-border)",borderRadius:12,padding:"0.9rem 1.1rem",fontSize:"0.82rem",color:"var(--navy-dark)"}}>
        <strong>Links para divulgar:</strong><br/>
        🎓 Alunos: <code style={{background:"white",padding:"2px 6px",borderRadius:4}}>{window.location.origin}{window.location.pathname}</code><br/>
        👩‍🏫 Professores: <code style={{background:"white",padding:"2px 6px",borderRadius:4}}>{window.location.origin}{window.location.pathname}?prof=1</code>
      </div>

      {modal && (
        <ModalTutorial
          tutorial={modal === "new" ? null : modal}
          onClose={()=>setModal(null)}
          onSave={salvar}
          onDelete={excluir}
        />
      )}
    </div>
  );
}

// ===== SIDEBAR =====
function SidebarConteudo({ perfil, tab, setTab, onSair }) {
  const navAluno = [{ id:"tutoriais", label:"Tutoriais", Icon:I.book }];
  const navProf  = [{ id:"tutoriais", label:"Tutoriais", Icon:I.book }];
  const navGestor = [
    { id:"tutoriais-aluno", label:"Ver (Aluno)", Icon:I.book },
    { id:"tutoriais-prof",  label:"Ver (Professor)", Icon:I.users },
    { id:"gestor",          label:"Gerenciar", Icon:I.settings },
  ];
  const nav = perfil==="gestor" ? navGestor : perfil==="professor" ? navProf : navAluno;
  const labelPerfil = perfil==="gestor" ? "Gestor" : perfil==="professor" ? "Professor" : "Aluno";

  return (
    <>
      <div className="sidebar-brand">
        <img src={LOGO_ESCUDO} alt="UNIVERSO" onError={e=>e.target.style.display="none"} />
      </div>
      <div className="sidebar-perfil-badge">{labelPerfil}</div>
      <div className="sidebar-nav">
        <div className="sidebar-section-title">Menu</div>
        {nav.map(item => (
          <div key={item.id} className={`sidebar-item${tab===item.id?" active":""}`} onClick={()=>setTab(item.id)}>
            <item.Icon /> {item.label}
          </div>
        ))}
      </div>
      {perfil==="gestor" && (
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={onSair}>Sair da gestão</button>
        </div>
      )}
    </>
  );
}

// ===== APP =====
function App() {
  const perfilUrl = detectarPerfil();
  const [gestorLogado, setGestorLogado] = useState(false);
  const [tab, setTab] = useState("tutoriais");
  const [toast, setToast] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: tutoriais, loading } = useCollection("tutoriais");

  const perfil = (perfilUrl === "gestor-login" && gestorLogado) ? "gestor"
    : perfilUrl === "professor" ? "professor"
    : "aluno";

  // Se gestor-login mas não logado, mostra tela de login
  if (perfilUrl === "gestor-login" && !gestorLogado) {
    return <GestorLogin onLogin={() => { setGestorLogado(true); setTab("gestor"); }} />;
  }

  const pageTitle = {
    "tutoriais": perfil==="professor" ? "Tutoriais — Professores" : "Tutoriais — Alunos",
    "tutoriais-aluno": "Tutoriais — Alunos",
    "tutoriais-prof":  "Tutoriais — Professores",
    "gestor": "Gerenciar Tutoriais",
  }[tab] || "Tutoriais";

  function renderConteudo() {
    if (tab === "gestor" && perfil === "gestor") return <ModuloGestor tutoriais={tutoriais} setToast={setToast} />;
    const p = tab === "tutoriais-prof" ? "professor" : tab === "tutoriais-aluno" ? "aluno" : perfil;
    return <ModuloTutoriais tutoriais={tutoriais} perfil={p} />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar desktop */}
      <div className="sidebar-desktop">
        <SidebarConteudo perfil={perfil} tab={tab} setTab={t=>{setTab(t);setDrawerOpen(false);}} onSair={()=>{setGestorLogado(false);}} />
      </div>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={()=>setDrawerOpen(false)}>
          <div className="mobile-drawer" onClick={e=>e.stopPropagation()}>
            <SidebarConteudo perfil={perfil} tab={tab} setTab={t=>{setTab(t);setDrawerOpen(false);}} onSair={()=>{setGestorLogado(false);}} />
          </div>
        </div>
      )}

      <div className="main-content">
        {/* Header mobile */}
        <div className="header-mobile">
          <div className="header-mobile-logo">
            <button className="header-menu-btn" onClick={()=>setDrawerOpen(true)}><I.menu /></button>
            <img src={LOGO_TEXTO} alt="UNIVERSO" onError={e=>e.target.style.display="none"} />
          </div>
        </div>

        {/* Top bar desktop */}
        <div className="top-bar">
          <div className="top-bar-title">{pageTitle}</div>
          <div className="top-bar-search">
            <I.search />
            <input placeholder="Buscar tutoriais…" disabled style={{cursor:"default"}} />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="page-content">
          {loading
            ? <div className="spinner-wrap"><div className="spinner" /></div>
            : renderConteudo()
          }
        </div>

        {/* Nav mobile */}
        <div className="nav-mobile">
          {perfil === "gestor" ? (
            <>
              <div className={`nav-mobile-item${tab==="tutoriais-aluno"?" active":""}`} onClick={()=>setTab("tutoriais-aluno")}><I.book />Alunos</div>
              <div className={`nav-mobile-item${tab==="tutoriais-prof"?" active":""}`} onClick={()=>setTab("tutoriais-prof")}><I.users />Professores</div>
              <div className={`nav-mobile-item${tab==="gestor"?" active":""}`} onClick={()=>setTab("gestor")}><I.settings />Gerir</div>
            </>
          ) : (
            <div className={`nav-mobile-item active`}><I.book />Tutoriais</div>
          )}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
