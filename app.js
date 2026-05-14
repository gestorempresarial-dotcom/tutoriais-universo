// ============================================================
// TUTORIAIS UNIVERSO — React + Firebase
// Padrão: arquivo único, CDN, GitHub Pages
// Versão: 1.0 — Etapa 1+2+3 (Base + Tutoriais + Admin)
// ============================================================

const { useState, useEffect, useRef, useCallback } = React;

// ===== FIREBASE CONFIG =====
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
const ADMIN_PASSWORD = "universo2025";
const LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/UNIVERSO_Logo.svg/220px-UNIVERSO_Logo.svg.png";

const CATEGORIAS = [
  "Todos",
  "Matrícula",
  "Financeiro",
  "AVA / EAD",
  "Secretaria",
  "Calendário",
  "Estágio / TCC",
  "Bolsas",
  "Outros",
];

const TIPOS_CONTEUDO = ["PDF", "Vídeo", "Link", "Imagem", "Texto"];

const TIPO_ICONS = {
  "PDF":    "file-text",
  "Vídeo":  "video",
  "Link":   "external-link",
  "Imagem": "image",
  "Texto":  "align-left",
};

// Dados de exemplo (serão substituídos pelo Firebase quando configurado)
const TUTORIAIS_DEMO = [
  {
    id: "demo1",
    numero: "01",
    titulo: "Bem-vindos ao UNIVERSO-GO",
    descricao: "Guia completo de boas-vindas para calouros do semestre 2026.1",
    categoria: "Matrícula",
    tipo: "Link",
    url: "https://universo.edu.br/wp-content/uploads/2025/12/UNIVERSO-GO-l-MIA-l-2026.1-l-17112025.pdf",
    imagem: "",
    destaque: true,
    passos: [
      "Acesse o link abaixo para visualizar o guia completo",
      "Salve o PDF para consulta futura",
      "Em caso de dúvidas, procure a Secretaria Acadêmica"
    ],
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: "demo2",
    numero: "02",
    titulo: "Confirmação de Matrícula — Calouros",
    descricao: "Passo a passo de como confirmar sua matrícula no portal acadêmico",
    categoria: "Matrícula",
    tipo: "Texto",
    url: "",
    imagem: "",
    destaque: false,
    passos: [
      "Acesse o Portal do Aluno em portal.universo.edu.br",
      "Clique em 'Matrícula' no menu lateral",
      "Confirme os dados e clique em 'Confirmar Matrícula'",
      "Guarde o comprovante gerado"
    ],
    createdAt: { seconds: (Date.now() / 1000) - 86400 }
  },
  {
    id: "demo3",
    numero: "03",
    titulo: "Como acessar o AVA (Ambiente Virtual)",
    descricao: "Tutorial completo para login e navegação no ambiente virtual de aprendizagem",
    categoria: "AVA / EAD",
    tipo: "Texto",
    url: "",
    imagem: "",
    destaque: false,
    passos: [
      "Acesse ava.universo.edu.br",
      "Use seu e-mail institucional @universo.edu.br",
      "Na primeira entrada, altere sua senha provisória",
      "Acesse 'Meus Cursos' para ver suas disciplinas"
    ],
    createdAt: { seconds: (Date.now() / 1000) - 172800 }
  },
  {
    id: "demo4",
    numero: "04",
    titulo: "Segunda Chamada de Matrícula",
    descricao: "Informações sobre o processo de segunda chamada e documentação necessária",
    categoria: "Matrícula",
    tipo: "Texto",
    url: "",
    imagem: "",
    destaque: false,
    passos: [
      "Fique atento ao calendário acadêmico para as datas",
      "Compareça à Secretaria com os documentos exigidos",
      "Realize o pagamento da taxa conforme orientação"
    ],
    createdAt: { seconds: (Date.now() / 1000) - 259200 }
  },
  {
    id: "demo5",
    numero: "05",
    titulo: "Renovação de Matrícula",
    descricao: "Como renovar sua matrícula para o próximo semestre pelo portal",
    categoria: "Matrícula",
    tipo: "Texto",
    url: "",
    imagem: "",
    destaque: false,
    passos: [
      "Acesse o Portal do Aluno até a data limite",
      "Selecione as disciplinas para o próximo período",
      "Confirme a renovação e imprima o comprovante"
    ],
    createdAt: { seconds: (Date.now() / 1000) - 345600 }
  },
  {
    id: "demo6",
    numero: "06",
    titulo: "Atestado Médico — Como Entregar",
    descricao: "Procedimento correto para entrega de atestados médicos e abono de faltas",
    categoria: "Secretaria",
    tipo: "Texto",
    url: "",
    imagem: "",
    destaque: false,
    passos: [
      "O atestado deve ser entregue em até 72h após a falta",
      "Protocolize na Secretaria Acadêmica com RG e atestado original",
      "Guarde o comprovante de protocolo"
    ],
    createdAt: { seconds: (Date.now() / 1000) - 432000 }
  }
];

// ===== HOOKS =====
function useCollection(colecao, orderField = "createdAt") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se Firebase não configurado, usa dados demo
    if (firebaseConfig.apiKey === "COLE_SUA_API_KEY_AQUI") {
      setData(TUTORIAIS_DEMO);
      setLoading(false);
      return;
    }
    const unsub = db.collection(colecao).onSnapshot(snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => {
        const av = a[orderField]?.seconds || 0;
        const bv = b[orderField]?.seconds || 0;
        return bv - av;
      });
      setData(docs);
      setLoading(false);
    }, () => { setData(TUTORIAIS_DEMO); setLoading(false); });
    return unsub;
  }, [colecao]);

  return { data, loading };
}

// ===== ÍCONES (Lucide) =====
function Icon({ name, size = 18, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && lucide) {
      ref.current.innerHTML = "";
      const el = document.createElement("i");
      el.setAttribute("data-lucide", name);
      ref.current.appendChild(el);
      lucide.createIcons({ icons: { [name]: lucide[name.replace(/-([a-z])/g, (_, l) => l.toUpperCase())] } });
      const svg = ref.current.querySelector("svg");
      if (svg) {
        svg.style.width = size + "px";
        svg.style.height = size + "px";
      }
    }
  }, [name, size]);
  return <span ref={ref} style={{ display: "inline-flex", alignItems: "center", ...style }} />;
}

// Ícones inline simples (SVG)
const Icons = {
  menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  book: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  x: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 12 4 8"/></svg>,
  link: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  file: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  video: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  image: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  text: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
  arrow: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  back: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  star: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  info: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  list: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  chevron: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
};

function IBtn({ icon: IconComp, onClick, danger = false, title = "" }) {
  return (
    <button className={`btn-icon${danger ? " danger" : ""}`} onClick={onClick} title={title} style={{ width: 32, height: 32 }}>
      <IconComp />
    </button>
  );
}

// ===== TOAST =====
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`toast ${type}`}>
      {type === "success" ? <Icons.check /> : <Icons.info />}
      {msg}
    </div>
  );
}

// ===== PILL DE CATEGORIA =====
const catColors = {
  "Matrícula": "pill-red",
  "Financeiro": "pill-yellow",
  "AVA / EAD": "pill-blue",
  "Secretaria": "pill-green",
  "Calendário": "pill-blue",
  "Estágio / TCC": "pill-gray",
  "Bolsas": "pill-green",
  "Outros": "pill-gray",
};
function CatPill({ cat }) {
  return <span className={`pill ${catColors[cat] || "pill-gray"}`}>{cat}</span>;
}

// ===== LOGIN =====
function Login({ onLogin }) {
  const [tab, setTab] = useState("aluno");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleEntrar() {
    setErro("");
    if (tab === "aluno") {
      if (!nome.trim()) { setErro("Digite seu nome para entrar."); return; }
      onLogin({ perfil: "aluno", nome: nome.trim() });
    } else {
      if (senha !== ADMIN_PASSWORD) { setErro("Senha incorreta."); return; }
      onLogin({ perfil: "admin", nome: "Administrador" });
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src={LOGO_URL} alt="UNIVERSO" onError={e => e.target.style.display = "none"} />
        </div>
        <div className="login-title">Tutoriais UNIVERSO</div>
        <div className="login-subtitle">Guias e passo a passos para alunos</div>

        <div className="login-tabs">
          <button className={`login-tab${tab === "aluno" ? " active" : ""}`} onClick={() => { setTab("aluno"); setErro(""); }}>Sou Aluno</button>
          <button className={`login-tab${tab === "admin" ? " active" : ""}`} onClick={() => { setTab("admin"); setErro(""); }}>Administrador</button>
        </div>

        {tab === "aluno" ? (
          <div className="login-field">
            <label>Seu nome</label>
            <input
              type="text" placeholder="Ex: Maria da Silva"
              value={nome} onChange={e => setNome(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEntrar()}
              autoFocus
            />
          </div>
        ) : (
          <div className="login-field">
            <label>Senha de administrador</label>
            <input
              type="password" placeholder="••••••••"
              value={senha} onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEntrar()}
              autoFocus
            />
          </div>
        )}

        {erro && <div className="login-error">{erro}</div>}
        <button className="login-btn" onClick={handleEntrar}>
          {tab === "aluno" ? "Acessar Tutoriais" : "Entrar como Admin"}
        </button>
        <div className="login-footer">
          Centro Universitário UNIVERSO — Goiânia
        </div>
      </div>
    </div>
  );
}

// ===== CARD DE TUTORIAL =====
function TutorialCard({ t, onClick }) {
  const IconComp = Icons[TIPO_ICONS[t.tipo]] || Icons.file;
  return (
    <div className="tutorial-card" onClick={() => onClick(t)}>
      <div className="tutorial-card-thumb">
        {t.imagem ? (
          <img src={t.imagem} alt={t.titulo} onError={e => { e.target.style.display = "none"; }} />
        ) : (
          <div className="tutorial-card-thumb-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            </svg>
          </div>
        )}
        {t.numero && <div className="tutorial-card-badge">Tutorial {t.numero}</div>}
        {t.destaque && !t.numero && <div className="tutorial-card-badge">⭐ Destaque</div>}
      </div>
      <div className="tutorial-card-body">
        <div className="tutorial-card-title">{t.titulo}</div>
        <div className="tutorial-card-desc">{t.descricao}</div>
        <div className="tutorial-card-footer">
          <div className="tutorial-card-type">
            <IconComp /> {t.tipo}
          </div>
          <CatPill cat={t.categoria} />
          <div className="tutorial-card-action">
            Ver <Icons.arrow />
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== VISUALIZAÇÃO DO TUTORIAL =====
function TutorialView({ t, onBack }) {
  const IconComp = Icons[TIPO_ICONS[t.tipo]] || Icons.file;

  function renderConteudo() {
    if (t.tipo === "PDF" && t.url) {
      return (
        <div>
          <a href={t.url} target="_blank" rel="noopener noreferrer" className="tutorial-link-btn" style={{ display: "flex", marginBottom: "1rem" }}>
            <Icons.download />
            Abrir / Baixar PDF
          </a>
          <iframe src={t.url} className="tutorial-iframe" title={t.titulo} />
        </div>
      );
    }
    if (t.tipo === "Vídeo" && t.url) {
      const isYT = t.url.includes("youtu");
      let embedUrl = t.url;
      if (isYT) {
        const id = t.url.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1];
        if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
      }
      return (
        <iframe src={embedUrl} className="tutorial-iframe" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={t.titulo} />
      );
    }
    if (t.tipo === "Link" && t.url) {
      return (
        <a href={t.url} target="_blank" rel="noopener noreferrer" className="tutorial-link-btn">
          <Icons.link />
          Acessar: {t.url.length > 60 ? t.url.slice(0, 60) + "…" : t.url}
        </a>
      );
    }
    if (t.tipo === "Imagem" && t.url) {
      return <img src={t.url} alt={t.titulo} className="tutorial-img" />;
    }
    return null;
  }

  return (
    <div className="tutorial-view">
      <div className="tutorial-view-header">
        <div className="tutorial-breadcrumb">
          <a onClick={onBack}>Tutoriais</a>
          <Icons.chevron />
          {t.categoria}
          <Icons.chevron />
          {t.titulo.length > 40 ? t.titulo.slice(0, 40) + "…" : t.titulo}
        </div>
        <div className="tutorial-view-title">{t.titulo}</div>
        <div className="tutorial-view-meta">
          <span><CatPill cat={t.categoria} /></span>
          <span><IconComp /> {t.tipo}</span>
          {t.numero && <span><Icons.list /> Tutorial {t.numero}</span>}
        </div>
      </div>

      {t.descricao && (
        <div className="tutorial-content-block">
          <h3><Icons.info /> Sobre este tutorial</h3>
          <p style={{ color: "var(--gray-text)", lineHeight: 1.7, fontSize: "0.9rem" }}>{t.descricao}</p>
        </div>
      )}

      {(t.passos && t.passos.filter(Boolean).length > 0) && (
        <div className="tutorial-content-block">
          <h3><Icons.list /> Passo a passo</h3>
          <div className="tutorial-steps">
            {t.passos.filter(Boolean).map((p, i) => (
              <div className="tutorial-step" key={i}>
                <div className="tutorial-step-num">{i + 1}</div>
                <div className="tutorial-step-text">{p}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(t.url || t.tipo !== "Texto") && renderConteudo() && (
        <div className="tutorial-content-block">
          <h3><IconComp /> Conteúdo</h3>
          {renderConteudo()}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "1.5rem", marginBottom: "1rem" }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <Icons.back /> Voltar aos Tutoriais
        </button>
      </div>
    </div>
  );
}

// ===== MÓDULO TUTORIAIS (Aluno) =====
function ModuloTutoriais({ tutoriais }) {
  const [busca, setBusca] = useState("");
  const [catAtiva, setCatAtiva] = useState("Todos");
  const [tutorialAberto, setTutorialAberto] = useState(null);

  const filtrados = tutoriais.filter(t => {
    const matchCat = catAtiva === "Todos" || t.categoria === catAtiva;
    const q = busca.toLowerCase();
    const matchBusca = !q || t.titulo.toLowerCase().includes(q) || t.descricao?.toLowerCase().includes(q) || t.categoria?.toLowerCase().includes(q);
    return matchCat && matchBusca;
  });

  if (tutorialAberto) {
    return <TutorialView t={tutorialAberto} onBack={() => setTutorialAberto(null)} />;
  }

  // Categorias que existem nos tutoriais atuais
  const catsUsadas = ["Todos", ...CATEGORIAS.slice(1).filter(c => tutoriais.some(t => t.categoria === c))];

  return (
    <div>
      {/* Barra de busca */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <div className="top-bar-search" style={{ maxWidth: "400px", background: "white", border: "1.5px solid var(--gray-line)", flex: 1 }}>
          <Icons.search />
          <input
            placeholder="Buscar tutoriais…"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        {busca && (
          <span style={{ fontSize: "0.82rem", color: "var(--gray-muted)" }}>
            {filtrados.length} resultado{filtrados.length !== 1 ? "s" : ""} encontrado{filtrados.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Filtros por categoria */}
      <div className="filter-bar">
        {catsUsadas.map(c => (
          <button key={c} className={`filter-chip${catAtiva === c ? " active" : ""}`} onClick={() => setCatAtiva(c)}>
            {c} {c !== "Todos" && <span style={{ opacity: 0.7 }}>({tutoriais.filter(t => t.categoria === c).length})</span>}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="empty-state">
          <Icons.book />
          <h3>Nenhum tutorial encontrado</h3>
          <p>Tente mudar os filtros ou a busca</p>
        </div>
      ) : (
        <div className="tutorials-grid">
          {filtrados.map(t => (
            <TutorialCard key={t.id} t={t} onClick={setTutorialAberto} />
          ))}
        </div>
      )}
    </div>
  );
}

// ===== MODAL ADMIN — ADICIONAR / EDITAR TUTORIAL =====
function ModalTutorial({ tutorial, onClose, onSave, onDelete }) {
  const isNew = !tutorial?.id;
  const [form, setForm] = useState(tutorial || {
    numero: "", titulo: "", descricao: "", categoria: CATEGORIAS[1],
    tipo: "Texto", url: "", imagem: "", destaque: false,
    passos: ["", "", "", ""]
  });

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function setPasso(i, v) {
    const p = [...(form.passos || ["", "", "", ""])];
    p[i] = v;
    setForm(f => ({ ...f, passos: p }));
  }
  function addPasso() { setForm(f => ({ ...f, passos: [...(f.passos || []), ""] })); }
  function removePasso(i) {
    const p = [...(form.passos || [])];
    p.splice(i, 1);
    setForm(f => ({ ...f, passos: p }));
  }

  function handleSave() {
    if (!form.titulo.trim()) { alert("Digite o título do tutorial"); return; }
    onSave(form);
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isNew ? "Novo Tutorial" : "Editar Tutorial"}</div>
          <button className="modal-close" onClick={onClose}><Icons.x /></button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-field">
              <label>Número (opcional)</label>
              <input placeholder="Ex: 01" value={form.numero} onChange={e => setField("numero", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Categoria</label>
              <select value={form.categoria} onChange={e => setField("categoria", e.target.value)}>
                {CATEGORIAS.slice(1).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Título *</label>
            <input placeholder="Ex: Como confirmar matrícula" value={form.titulo} onChange={e => setField("titulo", e.target.value)} />
          </div>

          <div className="form-field">
            <label>Descrição curta</label>
            <textarea rows={2} placeholder="Breve explicação do que este tutorial ensina" value={form.descricao} onChange={e => setField("descricao", e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Tipo de conteúdo</label>
              <select value={form.tipo} onChange={e => setField("tipo", e.target.value)}>
                {TIPOS_CONTEUDO.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-field" style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "1.5rem" }}>
              <input type="checkbox" id="destaque" checked={!!form.destaque} onChange={e => setField("destaque", e.target.checked)} style={{ width: "auto" }} />
              <label htmlFor="destaque" style={{ textTransform: "none", fontSize: "0.9rem" }}>Marcar como destaque</label>
            </div>
          </div>

          {form.tipo !== "Texto" && (
            <div className="form-field">
              <label>URL do conteúdo ({form.tipo})</label>
              <input
                placeholder={
                  form.tipo === "PDF" ? "https://...seu-arquivo.pdf"
                  : form.tipo === "Vídeo" ? "https://youtube.com/watch?v=..."
                  : "https://..."
                }
                value={form.url}
                onChange={e => setField("url", e.target.value)}
              />
              <div className="form-hint">
                {form.tipo === "PDF" && "Cole o link direto do PDF (Google Drive, site da instituição, etc.)"}
                {form.tipo === "Vídeo" && "Links do YouTube são automaticamente convertidos para reprodução"}
                {form.tipo === "Link" && "URL que será aberta em nova aba ao clicar"}
                {form.tipo === "Imagem" && "URL direta da imagem (termina em .png, .jpg, etc.)"}
              </div>
            </div>
          )}

          <div className="form-field">
            <label>Imagem de capa (URL)</label>
            <input placeholder="https://...imagem-capa.jpg (opcional)" value={form.imagem || ""} onChange={e => setField("imagem", e.target.value)} />
            <div className="form-hint">Imagem que aparece no card do tutorial. Deixe em branco para usar o ícone padrão.</div>
          </div>

          <div className="form-field">
            <label>Passo a passo</label>
            {(form.passos || []).map((p, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--red-main)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <input
                  placeholder={`Passo ${i + 1}…`}
                  value={p}
                  onChange={e => setPasso(i, e.target.value)}
                  style={{ flex: 1 }}
                />
                {(form.passos || []).length > 1 && (
                  <button onClick={() => removePasso(i)} style={{ color: "var(--gray-muted)", flexShrink: 0 }}><Icons.x /></button>
                )}
              </div>
            ))}
            <button onClick={addPasso} style={{ color: "var(--red-main)", fontSize: "0.82rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.25rem" }}>
              <Icons.plus /> Adicionar passo
            </button>
          </div>
        </div>
        <div className="modal-footer">
          <div className="modal-footer-left">
            {!isNew && <button className="btn btn-danger" onClick={() => onDelete(tutorial.id)}><Icons.trash /> Excluir</button>}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave}><Icons.check /> Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== MÓDULO ADMIN =====
function ModuloAdmin({ tutoriais, setToast }) {
  const [modal, setModal] = useState(null); // null | "new" | tutorial obj
  const [busca, setBusca] = useState("");

  const filtrados = tutoriais.filter(t => {
    const q = busca.toLowerCase();
    return !q || t.titulo.toLowerCase().includes(q) || t.categoria?.toLowerCase().includes(q);
  });

  async function salvarTutorial(form) {
    const dados = {
      numero: form.numero || "",
      titulo: form.titulo,
      descricao: form.descricao || "",
      categoria: form.categoria,
      tipo: form.tipo,
      url: form.url || "",
      imagem: form.imagem || "",
      destaque: !!form.destaque,
      passos: (form.passos || []).filter(Boolean),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Se Firebase não configurado, só atualiza localmente com demo
    if (firebaseConfig.apiKey === "COLE_SUA_API_KEY_AQUI") {
      setToast({ msg: "⚠️ Firebase não configurado. Em produção, os dados serão salvos.", type: "error" });
      setModal(null);
      return;
    }

    try {
      if (form.id) {
        await db.collection("tutoriais").doc(form.id).update(dados);
        setToast({ msg: "Tutorial atualizado com sucesso!", type: "success" });
      } else {
        dados.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection("tutoriais").add(dados);
        setToast({ msg: "Tutorial criado com sucesso!", type: "success" });
      }
      setModal(null);
    } catch (e) {
      setToast({ msg: "Erro ao salvar: " + e.message, type: "error" });
    }
  }

  async function excluirTutorial(id) {
    if (!confirm("Tem certeza que deseja excluir este tutorial?")) return;
    if (firebaseConfig.apiKey === "COLE_SUA_API_KEY_AQUI") {
      setToast({ msg: "⚠️ Firebase não configurado.", type: "error" });
      setModal(null);
      return;
    }
    try {
      await db.collection("tutoriais").doc(id).delete();
      setToast({ msg: "Tutorial excluído.", type: "success" });
      setModal(null);
    } catch (e) {
      setToast({ msg: "Erro ao excluir.", type: "error" });
    }
  }

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-card-label">Total de Tutoriais</div>
          <div className="stat-card-value">{tutoriais.length}</div>
          <div className="stat-card-sub">cadastrados no sistema</div>
        </div>
        {CATEGORIAS.slice(1).filter(c => tutoriais.some(t => t.categoria === c)).map(c => (
          <div key={c} className="stat-card">
            <div className="stat-card-label">{c}</div>
            <div className="stat-card-value">{tutoriais.filter(t => t.categoria === c).length}</div>
            <div className="stat-card-sub">tutoriais</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="section-header">
        <div>
          <div className="section-title">Gerenciar Tutoriais</div>
          <div className="section-subtitle">Adicione, edite ou remova tutoriais</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal("new")}>
          <Icons.plus /> Novo Tutorial
        </button>
      </div>

      {/* Busca */}
      <div className="top-bar-search" style={{ marginBottom: "1rem", maxWidth: "400px", background: "white", border: "1.5px solid var(--gray-line)" }}>
        <Icons.search />
        <input placeholder="Buscar tutorial…" value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {/* Tabela */}
      <div style={{ background: "white", borderRadius: "14px", border: "1px solid var(--gray-line)", overflow: "hidden" }}>
        <table className="tutorial-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Título</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Destaque</th>
              <th style={{ textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--gray-muted)" }}>Nenhum tutorial encontrado</td></tr>
            ) : filtrados.map(t => (
              <tr key={t.id}>
                <td style={{ color: "var(--gray-muted)", fontSize: "0.8rem" }}>{t.numero || "—"}</td>
                <td className="td-title">{t.titulo}</td>
                <td><CatPill cat={t.categoria} /></td>
                <td style={{ color: "var(--gray-muted)", fontSize: "0.82rem" }}>{t.tipo}</td>
                <td>{t.destaque ? <span style={{ color: "#F5A623" }}>⭐</span> : "—"}</td>
                <td>
                  <div className="td-actions" style={{ justifyContent: "flex-end" }}>
                    <IBtn icon={Icons.edit} onClick={() => setModal(t)} title="Editar" />
                    <IBtn icon={Icons.trash} onClick={() => excluirTutorial(t.id)} danger title="Excluir" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Aviso Firebase */}
      {firebaseConfig.apiKey === "COLE_SUA_API_KEY_AQUI" && (
        <div style={{ marginTop: "1.5rem", background: "#FFFBEB", border: "1px solid #F59E0B", borderRadius: "12px", padding: "1rem 1.25rem", fontSize: "0.85rem", color: "#92400E" }}>
          <strong>⚠️ Firebase não configurado.</strong> Substitua as credenciais no início do arquivo <code>app.js</code> para ativar persistência de dados.
        </div>
      )}

      {modal && (
        <ModalTutorial
          tutorial={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={salvarTutorial}
          onDelete={excluirTutorial}
        />
      )}
    </div>
  );
}

// ===== SIDEBAR CONTENT =====
function SidebarContent({ perfil, tab, setTab, onLogout, usuario }) {
  const initials = usuario.nome.slice(0, 2).toUpperCase();

  const navAluno = [
    { id: "tutoriais", label: "Tutoriais", icon: Icons.book },
  ];
  const navAdmin = [
    { id: "tutoriais", label: "Ver Tutoriais", icon: Icons.book },
    { id: "admin", label: "Gerenciar", icon: Icons.settings },
  ];
  const nav = perfil === "admin" ? navAdmin : navAluno;

  return (
    <>
      <div className="sidebar-brand">
        <img src={LOGO_URL} alt="UNIVERSO" onError={e => e.target.style.display = "none"} />
        <div className="sidebar-brand-text">
          Tutoriais<br /><span>Centro Universitário UNIVERSO</span>
        </div>
      </div>
      <div className="sidebar-nav">
        <div className="sidebar-section-title">Menu</div>
        {nav.map(item => (
          <div key={item.id} className={`sidebar-item${tab === item.id ? " active" : ""}`} onClick={() => setTab(item.id)}>
            <item.icon />
            {item.label}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div>
            <div className="sidebar-user-name">{usuario.nome}</div>
            <div className="sidebar-user-role">{perfil === "admin" ? "Administrador" : "Aluno"}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          Sair
        </button>
      </div>
    </>
  );
}

// ===== APP PRINCIPAL =====
function App() {
  const [usuario, setUsuario] = useState(null);
  const [tab, setTab] = useState("tutoriais");
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: tutoriais, loading } = useCollection("tutoriais", "createdAt");

  if (!usuario) return <Login onLogin={u => { setUsuario(u); }} />;

  const pageTitle = {
    tutoriais: "Tutoriais",
    admin: "Gerenciar Tutoriais",
  }[tab] || "Tutoriais";

  return (
    <div className="app-layout">
      {/* Sidebar Desktop */}
      <div className="sidebar-desktop">
        <SidebarContent perfil={usuario.perfil} tab={tab} setTab={t => { setTab(t); setMobileMenuOpen(false); }} onLogout={() => setUsuario(null)} usuario={usuario} />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <SidebarContent perfil={usuario.perfil} tab={tab} setTab={t => { setTab(t); setMobileMenuOpen(false); }} onLogout={() => setUsuario(null)} usuario={usuario} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="main-content">
        {/* Header Mobile */}
        <div className="header-mobile">
          <div className="header-mobile-logo">
            <button className="header-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Icons.menu />
            </button>
            <div className="header-mobile-title">Tutoriais UNIVERSO</div>
          </div>
        </div>

        {/* Top Bar Desktop */}
        <div className="top-bar">
          <div className="top-bar-title">{pageTitle}</div>
          <div className="top-bar-search">
            <Icons.search />
            <input placeholder="Buscar tutoriais…" />
          </div>
        </div>

        {/* Content */}
        <div className="page-content">
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <>
              {tab === "tutoriais" && <ModuloTutoriais tutoriais={tutoriais} />}
              {tab === "admin" && usuario.perfil === "admin" && <ModuloAdmin tutoriais={tutoriais} setToast={setToast} />}
            </>
          )}
        </div>

        {/* Nav Mobile */}
        <div className="nav-mobile">
          <div className={`nav-mobile-item${tab === "tutoriais" ? " active" : ""}`} onClick={() => setTab("tutoriais")}>
            <Icons.book /> Tutoriais
          </div>
          {usuario.perfil === "admin" && (
            <div className={`nav-mobile-item${tab === "admin" ? " active" : ""}`} onClick={() => setTab("admin")}>
              <Icons.settings /> Admin
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ===== RENDER =====
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
