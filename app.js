// ============================================================
// TUTORIAIS UNIVERSO — v2.0
// Aluno: acesso direto | Professor: senha | Gestor: ?g=1
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

// ===== SENHAS =====
const SENHA_PROF   = "profuniverso2025";
const SENHA_GESTOR = "gestoruniverso2025";

// ===== LOGOS =====
// Escudo = entrada/login/mobile | Texto = sidebar | Completo = banner/relatórios
const LOGO_TEXTO    = "logo-escud.png";    // login, entrada, mobile
const LOGO_ESCUDO   = "logo-texto.png";    // sidebar lateral
const LOGO_COMPLETO = "logo-complet.png";  // banner e relatórios

// ===== CATEGORIAS =====
const CATS_ALUNO = ["Matrícula", "Financeiro", "AVA / EAD", "Secretaria", "Calendário", "Estágio / TCC", "Bolsas", "Outros"];
const CATS_PROF  = ["Plano de Ensino", "Lançamento de Notas", "Frequência", "AVA / EAD", "Documentos", "Outros"];

// ===== EMOJIS POR CATEGORIA =====
const CAT_EMOJI = {
  "Matrícula": "🎓", "Financeiro": "💳", "AVA / EAD": "💻",
  "Secretaria": "📋", "Calendário": "📅", "Estágio / TCC": "📝",
  "Bolsas": "🏅", "Outros": "📌",
  "Plano de Ensino": "📚", "Lançamento de Notas": "✏️",
  "Frequência": "✅", "Documentos": "🗂️",
};

// ===== TUTORIAL DEMO (MIA 2026.1) =====
const DEMO_ALUNO = [
  {
    id: "mia-2026",
    numero: "01",
    titulo: "Manual do Aluno — MIA 2026.1",
    descricao: "Guia completo com todas as informações essenciais para o semestre 2026.1: matrícula, frequência, avaliações, biblioteca, direitos e deveres.",
    categoria: "Matrícula",
    tipo: "PDF",
    url: "https://universo.edu.br/wp-content/uploads/2025/12/UNIVERSO-GO-l-MIA-l-2026.1-l-17112025.pdf",
    imagem: "",
    destaque: true,
    perfil: "aluno",
    passos: [
      "Acesse o PDF pelo botão abaixo — ele abre direto no navegador",
      "Use o sumário nas primeiras páginas para navegar pelos temas",
      "Guarde o link ou baixe o PDF para consultar quando precisar",
      "Dúvidas? Procure a Secretaria Acadêmica presencialmente ou pelo portal"
    ],
    tags: ["MIA", "manual", "matrícula", "2026"],
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: "matricula-confirmacao",
    numero: "02",
    titulo: "Como Confirmar a Matrícula",
    descricao: "Passo a passo para confirmar sua matrícula no Portal do Aluno. Obrigatório para todos os semestres.",
    categoria: "Matrícula",
    tipo: "Texto",
    url: "",
    imagem: "",
    destaque: false,
    perfil: "aluno",
    passos: [
      "Acesse portal.universo.edu.br com seu CPF e senha",
      "Clique em 'Matrícula' no menu lateral esquerdo",
      "Verifique as disciplinas listadas para o semestre",
      "Clique em 'Confirmar Matrícula' e aguarde a mensagem de sucesso",
      "Imprima ou salve o comprovante gerado — guarde bem!"
    ],
    tags: ["matrícula", "portal", "confirmação"],
    createdAt: { seconds: (Date.now() / 1000) - 86400 }
  },
  {
    id: "ava-acesso",
    numero: "03",
    titulo: "Acessando o AVA (Ambiente Virtual)",
    descricao: "Como fazer login no ambiente virtual e encontrar suas disciplinas online.",
    categoria: "AVA / EAD",
    tipo: "Texto",
    url: "",
    imagem: "",
    destaque: false,
    perfil: "aluno",
    passos: [
      "Acesse ava.universo.edu.br pelo navegador",
      "Use o e-mail institucional @universo.edu.br como usuário",
      "Na primeira entrada, sua senha provisória é seu CPF (só números)",
      "Altere a senha assim que entrar — obrigatório",
      "Clique em 'Meus Cursos' para ver suas disciplinas do semestre"
    ],
    tags: ["AVA", "EAD", "online", "acesso"],
    createdAt: { seconds: (Date.now() / 1000) - 172800 }
  },
  {
    id: "atestado-medico",
    numero: "04",
    titulo: "Entregando Atestado Médico",
    descricao: "Procedimento correto para protocolar atestados e abonar faltas. Prazo: 72h após a falta.",
    categoria: "Secretaria",
    tipo: "Texto",
    url: "",
    imagem: "",
    destaque: false,
    perfil: "aluno",
    passos: [
      "O atestado deve ser entregue em até 72 horas após a(s) falta(s)",
      "Dirija-se à Secretaria Acadêmica com RG e atestado original",
      "Solicite o protocolo de entrega — guarde o comprovante",
      "O abono de falta não substitui as atividades avaliativas perdidas",
      "Para mais de 3 dias, verifique se é necessário laudo médico complementar"
    ],
    tags: ["atestado", "falta", "secretaria", "abono"],
    createdAt: { seconds: (Date.now() / 1000) - 259200 }
  },
];

const DEMO_PROF = [
  {
    id: "notas-lancamento",
    numero: "P01",
    titulo: "Lançamento de Notas no Portal",
    descricao: "Como lançar as notas das avaliações no sistema acadêmico dentro do prazo.",
    categoria: "Lançamento de Notas",
    tipo: "Texto",
    url: "",
    imagem: "",
    destaque: true,
    perfil: "professor",
    passos: [
      "Acesse o Portal do Professor em portal.universo.edu.br",
      "Clique em 'Diário de Classe' no menu",
      "Selecione a disciplina e a turma desejada",
      "Clique em 'Lançar Notas' e preencha os campos corretamente",
      "Salve e confirme — o prazo para lançamento é definido pelo calendário acadêmico"
    ],
    tags: ["notas", "diário", "portal", "avaliação"],
    createdAt: { seconds: Date.now() / 1000 }
  },
];

// ===== HOOK FIREBASE =====
function useCollection(colecao, filtro) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firebaseConfig.apiKey === "COLE_AQUI") {
      setData(filtro === "professor" ? DEMO_PROF : DEMO_ALUNO.filter(t => !filtro || t.perfil === filtro || filtro === "gestor"));
      setLoading(false);
      return;
    }
    let q = db.collection(colecao);
    if (filtro && filtro !== "gestor") q = q.where("perfil", "==", filtro);
    const unsub = q.onSnapshot(snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setData(docs);
      setLoading(false);
    }, () => {
      setData(filtro === "professor" ? DEMO_PROF : DEMO_ALUNO);
      setLoading(false);
    });
    return unsub;
  }, [colecao, filtro]);

  return { data: data || [], loading };
}

// ===== TOAST =====
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div className={`toast ${type}`}>{type === "success" ? "✓" : "!"} {msg}</div>;
}

// ===== PILL CATEGORIA =====
const CAT_COLORS = {
  "Matrícula": "pill-verm", "Financeiro": "pill-amber", "AVA / EAD": "pill-azul",
  "Secretaria": "pill-verde", "Calendário": "pill-azul", "Estágio / TCC": "pill-cinza",
  "Bolsas": "pill-verde", "Outros": "pill-cinza",
  "Plano de Ensino": "pill-azul", "Lançamento de Notas": "pill-amber",
  "Frequência": "pill-verde", "Documentos": "pill-cinza",
};
function Pill({ cat }) {
  return <span className={`pill ${CAT_COLORS[cat] || "pill-cinza"}`}>{cat}</span>;
}

// ===== TIPO EMOJI =====
const TIPO_EMOJI = { "PDF": "📄", "Vídeo": "🎬", "Link": "🔗", "Imagem": "🖼️", "Texto": "📝" };

// ===== PERFIL SELECTOR =====
function PerfilSelector({ onSelect }) {

  return (
    <div className="perfil-page">
      <div className="perfil-logo">
        <img src="logo-escud.png" alt="UNIVERSO" onError={e => e.target.style.display="none"} />
      </div>
      <div className="perfil-titulo">Portal de Tutoriais</div>
      <div className="perfil-sub">Centro Universitário UNIVERSO Goiânia</div>

      <div className="perfil-cards">
        <div className="perfil-card" onClick={() => onSelect("aluno")}>
          <div className="perfil-card-icon">🎓</div>
          <div className="perfil-card-label">Sou Aluno</div>
          <div className="perfil-card-desc">Acesso direto aos tutoriais</div>
        </div>
        <div className="perfil-card" onClick={() => onSelect("professor-login")}>
          <div className="perfil-card-icon">👩‍🏫</div>
          <div className="perfil-card-label">Sou Professor</div>
          <div className="perfil-card-desc">Área exclusiva docente</div>
        </div>
      </div>

      {/* Links de acesso rápido */}
      <div className="perfil-links">
        <a href="https://universo.edu.br/" target="_blank" rel="noopener noreferrer" className="perfil-link-btn">
          🌐 Site UNIVERSO
        </a>
        <a href="https://universo.edu.br/wp-content/uploads/2025/12/UNIVERSO-GO-l-MIA-l-2026.1-l-17112025.pdf" target="_blank" rel="noopener noreferrer" className="perfil-link-btn">
          📘 Manual do Aluno — MIA 2026.1
        </a>
        <a href="https://api.whatsapp.com/send?phone=+5508007210251" target="_blank" rel="noopener noreferrer" className="perfil-link-btn whatsapp">
          📱 WhatsApp Institucional
        </a>
      </div>
    </div>
  );
}

// ===== LOGIN COM SENHA =====
function LoginSenha({ perfil, onSuccess, onBack }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function tentar() {
    const correta = perfil === "professor" ? SENHA_PROF : SENHA_GESTOR;
    if (senha === correta) { onSuccess(); }
    else { setErro("Senha incorreta. Tente novamente."); }
  }

  const labels = {
    professor: { titulo: "Área do Professor", sub: "Digite a senha para acessar os tutoriais docentes" },
    gestor: { titulo: "Área do Gestor", sub: "Acesso restrito à gestão do sistema" },
  };
  const l = labels[perfil];

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-logo">
          <img src="logo-escud.png" alt="UNIVERSO" onError={e => e.target.style.display="none"} style={{ height:72, width:"auto", objectFit:"contain" }} />
        </div>
        <div className="login-card-title">{l.titulo}</div>
        <div className="login-card-sub">{l.sub}</div>
        <div className="login-field">
          <label className="form-label">Senha de acesso</label>
          <input className="form-input" type="password" placeholder="••••••••" value={senha}
            onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === "Enter" && tentar()} autoFocus />
        </div>
        {erro && <div className="login-error">{erro}</div>}
        <button className="login-btn" onClick={tentar}>Entrar</button>
        {onBack && <div className="login-back" onClick={onBack}>← Voltar</div>}
      </div>
    </div>
  );
}

// ===== CARD TUTORIAL =====
function TCard({ t, onClick }) {
  const emoji = CAT_EMOJI[t.categoria] || "📌";
  const tipoEmoji = TIPO_EMOJI[t.tipo] || "📝";
  return (
    <div className="tcard" onClick={() => onClick(t)}>
      <div className="tcard-thumb">
        {t.imagem ? (
          <img src={t.imagem} alt={t.titulo} onError={e => e.target.style.display="none"} />
        ) : (
          <div className="tcard-thumb-placeholder">{emoji}</div>
        )}
        {t.numero && <div className="tcard-badge">Tutorial {t.numero}</div>}
      </div>
      <div className="tcard-body">
        <div className="tcard-title">{t.titulo}</div>
        <div className="tcard-desc">{t.descricao}</div>
        <div className="tcard-footer">
          <div className="tcard-tipo">{tipoEmoji} {t.tipo}</div>
          <Pill cat={t.categoria} />
          <div className="tcard-ver">Ver →</div>
        </div>
      </div>
    </div>
  );
}

// ===== VISUALIZAÇÃO TUTORIAL =====
function TView({ t, onBack }) {
  function renderConteudo() {
    if (t.tipo === "PDF" && t.url) return (
      <div>
        <a href={t.url} target="_blank" rel="noopener noreferrer" className="link-btn" style={{ display: "flex", marginBottom: "1rem" }}>
          <span className="link-btn-icon">📥</span> Abrir / Baixar PDF
        </a>
        <iframe src={t.url} className="tutorial-iframe" title={t.titulo} />
      </div>
    );
    if (t.tipo === "Vídeo" && t.url) {
      const id = t.url.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1];
      const embed = id ? `https://www.youtube.com/embed/${id}` : t.url;
      return <iframe src={embed} className="tutorial-iframe" allowFullScreen title={t.titulo} />;
    }
    if (t.tipo === "Link" && t.url) return (
      <a href={t.url} target="_blank" rel="noopener noreferrer" className="link-btn">
        <span className="link-btn-icon">🔗</span>
        {t.url.length > 55 ? t.url.slice(0, 55) + "…" : t.url}
      </a>
    );
    if (t.tipo === "Imagem" && t.url) return <img src={t.url} alt={t.titulo} className="tutorial-img" />;
    return null;
  }

  return (
    <div className="tview">
      <div className="tview-header">
        <div className="tview-breadcrumb">
          <a onClick={onBack}>Tutoriais</a>
          <span>›</span>
          <Pill cat={t.categoria} />
          <span>›</span>
          <span style={{ color: "var(--cinza-texto)" }}>{t.titulo.length > 45 ? t.titulo.slice(0,45)+"…" : t.titulo}</span>
        </div>
        <div className="tview-title">{t.titulo}</div>
        <div className="tview-meta">
          <Pill cat={t.categoria} />
          <span>{TIPO_EMOJI[t.tipo]} {t.tipo}</span>
          {t.numero && <span>📌 Tutorial {t.numero}</span>}
        </div>
      </div>

      {t.descricao && (
        <div className="tblock">
          <div className="tblock-title"><span className="tblock-icon">ℹ️</span> Sobre este tutorial</div>
          <div className="tview-desc">{t.descricao}</div>
        </div>
      )}

      {(t.passos || []).filter(Boolean).length > 0 && (
        <div className="tblock">
          <div className="tblock-title"><span className="tblock-icon">📋</span> Passo a passo</div>
          <div className="steps">
            {t.passos.filter(Boolean).map((p, i) => (
              <div className="step" key={i}>
                <div className="step-num">{i + 1}</div>
                <div className="step-txt">{p}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {renderConteudo() && (
        <div className="tblock">
          <div className="tblock-title"><span className="tblock-icon">{TIPO_EMOJI[t.tipo]}</span> Conteúdo</div>
          {renderConteudo()}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "1.5rem", marginBottom: "1rem" }}>
        <button className="btn btn-outline" onClick={onBack}>← Voltar aos tutoriais</button>
      </div>
    </div>
  );
}

// ===== MÓDULO TUTORIAIS (leitura) =====
function ModuloTutoriais({ perfil, tutoriais, shareUrl }) {
  const [busca, setBusca] = useState("");
  const [cat, setCat] = useState("Todos");
  const [aberto, setAberto] = useState(null);

  const cats = perfil === "professor" ? CATS_PROF : CATS_ALUNO;
  const catsUsadas = ["Todos", ...cats.filter(c => tutoriais.some(t => t.categoria === c))];

  const filtrados = tutoriais.filter(t => {
    const okCat = cat === "Todos" || t.categoria === cat;
    const q = busca.toLowerCase();
    const okBusca = !q || t.titulo.toLowerCase().includes(q) || t.descricao?.toLowerCase().includes(q) || (t.tags || []).some(tg => tg.toLowerCase().includes(q));
    return okCat && okBusca;
  });

  if (aberto) return <TView t={aberto} onBack={() => setAberto(null)} />;

  const heroBanner = perfil === "professor"
    ? { emoji: "👩‍🏫", titulo: "Tutoriais para Professores", sub: "Guias práticos para o dia a dia docente na UNIVERSO Goiânia" }
    : { emoji: "🎓", titulo: "Tutoriais para Alunos", sub: "Tudo que você precisa saber para aproveitar ao máximo a sua vida acadêmica" };

  function copiarLink() {
    navigator.clipboard.writeText(shareUrl).then(() => alert("Link copiado! Compartilhe com seus " + (perfil === "professor" ? "colegas professores" : "colegas alunos") + "."));
  }

  return (
    <div>
      {/* Banner */}
      <div className="hero-banner">
        <div className="hero-banner-logo">
          <img src="logo-complet.png" alt="UNIVERSO" onError={e => e.target.style.display="none"} style={{ height:52, width:"auto", maxWidth:220, objectFit:"contain" }} />
        </div>
        <div className="hero-banner-text">
          <h2>{heroBanner.titulo}</h2>
          <p>{heroBanner.sub}</p>
        </div>
        <button className="hero-share-btn" onClick={copiarLink}>
          🔗 Compartilhar esta página
        </button>
      </div>

      {/* Busca mobile */}
      <div className="searchbar" style={{ marginBottom: "1rem", maxWidth: "100%", display: "flex" }}>
        <span className="searchbar-icon">🔍</span>
        <input placeholder="Buscar tutoriais…" value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {/* Filtros */}
      <div className="filter-bar">
        {catsUsadas.map(c => (
          <button key={c} className={`filter-chip${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>
            {CAT_EMOJI[c] || ""} {c}
            {c !== "Todos" && <span style={{ marginLeft: "0.3rem", opacity: 0.65 }}>({tutoriais.filter(t => t.categoria === c).length})</span>}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtrados.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>Nenhum tutorial encontrado</h3>
          <p>Tente outros termos ou mude o filtro de categoria</p>
        </div>
      ) : (
        <div className="tutorials-grid">
          {filtrados.map(t => <TCard key={t.id} t={t} onClick={setAberto} />)}
        </div>
      )}
    </div>
  );
}

// ===== MODAL ADMIN =====
function ModalTutorial({ tutorial, perfil, onClose, onSave, onDelete }) {
  const isNew = !tutorial?.id;
  const cats = perfil === "professor" ? CATS_PROF : CATS_ALUNO;
  const [form, setForm] = useState(tutorial || {
    numero: "", titulo: "", descricao: "", categoria: cats[0],
    tipo: "Texto", url: "", imagem: "", destaque: false,
    perfil: perfil, passos: ["", "", ""]
  });

  function sf(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function setPasso(i, v) { const p = [...form.passos]; p[i] = v; sf("passos", p); }
  function addPasso() { sf("passos", [...form.passos, ""]); }
  function rmPasso(i) { const p = [...form.passos]; p.splice(i, 1); sf("passos", p); }

  async function salvar() {
    if (!form.titulo.trim()) { alert("Digite o título"); return; }
    onSave(form);
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-hdr">
          <div className="modal-hdr-title">{isNew ? "Novo Tutorial" : "Editar Tutorial"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Número</label>
              <input className="form-input" placeholder="Ex: 01" value={form.numero} onChange={e => sf("numero", e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">Perfil</label>
              <select className="form-input" value={form.perfil} onChange={e => sf("perfil", e.target.value)}>
                <option value="aluno">Aluno</option>
                <option value="professor">Professor</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Categoria</label>
            <select className="form-input" value={form.categoria} onChange={e => sf("categoria", e.target.value)}>
              {(form.perfil === "professor" ? CATS_PROF : CATS_ALUNO).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Título *</label>
            <input className="form-input" placeholder="Título do tutorial" value={form.titulo} onChange={e => sf("titulo", e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Descrição</label>
            <textarea className="form-input" rows={2} placeholder="Breve explicação do tutorial" value={form.descricao} onChange={e => sf("descricao", e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Tipo de conteúdo</label>
              <select className="form-input" value={form.tipo} onChange={e => sf("tipo", e.target.value)}>
                {["Texto","PDF","Vídeo","Link","Imagem"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-field" style={{ display: "flex", alignItems: "center", paddingTop: "1.5rem" }}>
              <div className="form-check">
                <input type="checkbox" id="destaque" checked={!!form.destaque} onChange={e => sf("destaque", e.target.checked)} />
                <label htmlFor="destaque">Destaque</label>
              </div>
            </div>
          </div>
          {form.tipo !== "Texto" && (
            <div className="form-field">
              <label className="form-label">URL do conteúdo</label>
              <input className="form-input" placeholder="https://…" value={form.url} onChange={e => sf("url", e.target.value)} />
              <div className="form-hint">
                {form.tipo === "PDF" && "Link direto para o PDF"}
                {form.tipo === "Vídeo" && "Link do YouTube"}
                {form.tipo === "Link" && "URL a ser aberta"}
                {form.tipo === "Imagem" && "URL da imagem"}
              </div>
            </div>
          )}
          <div className="form-field">
            <label className="form-label">Imagem de capa (URL, opcional)</label>
            <input className="form-input" placeholder="https://…imagem.jpg" value={form.imagem || ""} onChange={e => sf("imagem", e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Passo a passo</label>
            {form.passos.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:"var(--azul)", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700, flexShrink:0 }}>{i+1}</div>
                <input className="form-input" style={{ flex:1 }} placeholder={`Passo ${i+1}`} value={p} onChange={e => setPasso(i, e.target.value)} />
                {form.passos.length > 1 && <button onClick={() => rmPasso(i)} style={{ color:"var(--cinza-muted)", flexShrink:0 }}>✕</button>}
              </div>
            ))}
            <button onClick={addPasso} style={{ color:"var(--azul)", fontSize:"0.82rem", fontWeight:700, display:"flex", alignItems:"center", gap:"0.3rem", marginTop:"0.25rem" }}>
              + Adicionar passo
            </button>
          </div>
        </div>
        <div className="modal-ftr">
          <div>{!isNew && <button className="btn btn-danger btn-sm" onClick={() => onDelete(tutorial.id)}>🗑 Excluir</button>}</div>
          <div style={{ display:"flex", gap:"0.5rem" }}>
            <button className="btn btn-outline btn-sm" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary btn-sm" onClick={salvar}>✓ Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== MÓDULO GESTOR =====
function ModuloGestor({ todos, setToast }) {
  const [modal, setModal] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroPerfil, setFiltroPerfil] = useState("todos");
  const base = window.location.origin + window.location.pathname;

  const filtrados = todos.filter(t => {
    const okP = filtroPerfil === "todos" || t.perfil === filtroPerfil;
    const q = busca.toLowerCase();
    const okB = !q || t.titulo.toLowerCase().includes(q);
    return okP && okB;
  });

  async function salvar(form) {
    const dados = {
      numero: form.numero || "", titulo: form.titulo, descricao: form.descricao || "",
      categoria: form.categoria, tipo: form.tipo, url: form.url || "",
      imagem: form.imagem || "", destaque: !!form.destaque, perfil: form.perfil,
      passos: (form.passos || []).filter(Boolean),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    try {
      if (form.id) {
        await db.collection("tutoriais").doc(form.id).update(dados);
        setToast({ msg: "Tutorial atualizado!", type: "success" });
      } else {
        dados.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection("tutoriais").add(dados);
        setToast({ msg: "Tutorial criado!", type: "success" });
      }
      setModal(null);
    } catch (e) { setToast({ msg: "Erro: " + e.message, type: "error" }); }
  }

  async function excluir(id) {
    if (!confirm("Excluir este tutorial?")) return;
    try {
      await db.collection("tutoriais").doc(id).delete();
      setToast({ msg: "Excluído.", type: "success" });
      setModal(null);
    } catch (e) { setToast({ msg: "Erro ao excluir.", type: "error" }); }
  }

  function copiar(url) {
    navigator.clipboard.writeText(url).then(() => setToast({ msg: "Link copiado!", type: "success" }));
  }

  const nAluno = todos.filter(t => t.perfil === "aluno").length;
  const nProf  = todos.filter(t => t.perfil === "professor").length;

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card destaque">
          <div className="stat-label">Total</div>
          <div className="stat-value">{todos.length}</div>
          <div className="stat-sub">tutoriais cadastrados</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">🎓 Alunos</div>
          <div className="stat-value">{nAluno}</div>
          <div className="stat-sub">tutoriais</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">👩‍🏫 Professores</div>
          <div className="stat-value">{nProf}</div>
          <div className="stat-sub">tutoriais</div>
        </div>
      </div>

      {/* Links de compartilhamento */}
      <div style={{ marginBottom: "1.75rem" }}>
        <div className="sec-title" style={{ marginBottom: "0.75rem" }}>Links para compartilhar</div>
        <div className="share-box">
          <span style={{ fontSize: "1.1rem" }}>🎓</span>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--azul)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.2rem" }}>Página dos Alunos</div>
            <div className="share-box-url">{base}</div>
          </div>
          <button className="share-copy-btn" onClick={() => copiar(base)}>Copiar</button>
        </div>
        <div className="share-box">
          <span style={{ fontSize: "1.1rem" }}>👩‍🏫</span>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--azul)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.2rem" }}>Página dos Professores</div>
            <div className="share-box-url">{base}?prof=1</div>
          </div>
          <button className="share-copy-btn" onClick={() => copiar(base + "?prof=1")}>Copiar</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sec-header">
        <div>
          <div className="sec-title">Gerenciar Tutoriais</div>
          <div className="sec-sub">Adicione, edite ou remova tutoriais de qualquer perfil</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal("new")}>+ Novo Tutorial</button>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <div className="searchbar" style={{ maxWidth: "320px" }}>
          <span className="searchbar-icon">🔍</span>
          <input placeholder="Buscar…" value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        {["todos","aluno","professor"].map(p => (
          <button key={p} className={`filter-chip${filtroPerfil === p ? " active" : ""}`} onClick={() => setFiltroPerfil(p)}>
            {p === "todos" ? "Todos" : p === "aluno" ? "🎓 Alunos" : "👩‍🏫 Professores"}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ background: "white", borderRadius: "14px", border: "1px solid var(--cinza-linha)", overflow: "hidden" }}>
        <table className="adm-table">
          <thead>
            <tr>
              <th>Nº</th><th>Título</th><th>Perfil</th><th>Categoria</th><th>Tipo</th><th style={{ textAlign:"right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:"center", padding:"2rem", color:"var(--cinza-muted)" }}>Nenhum tutorial encontrado</td></tr>
            ) : filtrados.map(t => (
              <tr key={t.id}>
                <td style={{ color:"var(--cinza-muted)", fontSize:"0.78rem" }}>{t.numero || "—"}</td>
                <td className="td-title">{t.titulo}</td>
                <td><span className={`pill ${t.perfil === "professor" ? "pill-azul" : "pill-verde"}`}>{t.perfil === "professor" ? "👩‍🏫 Prof" : "🎓 Aluno"}</span></td>
                <td><Pill cat={t.categoria} /></td>
                <td style={{ fontSize:"0.8rem", color:"var(--cinza-muted)" }}>{TIPO_EMOJI[t.tipo]} {t.tipo}</td>
                <td>
                  <div className="td-actions">
                    <button className="btn-icon" onClick={() => setModal(t)} title="Editar">✏️</button>
                    <button className="btn-icon danger" onClick={() => excluir(t.id)} title="Excluir">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <ModalTutorial
          tutorial={modal === "new" ? null : modal}
          perfil={filtroPerfil === "professor" ? "professor" : "aluno"}
          onClose={() => setModal(null)}
          onSave={salvar}
          onDelete={excluir}
        />
      )}
    </div>
  );
}

// ===== SIDEBAR CONTENT =====
function SidebarConteudo({ perfil, tab, setTab, onSair }) {
  const navAluno = [
    { id: "tutoriais", label: "Tutoriais", emoji: "📚" },
  ];
  const navProf = [
    { id: "tutoriais", label: "Tutoriais", emoji: "📚" },
  ];
  const navGestor = [
    { id: "tutoriais-aluno", label: "Ver — Alunos", emoji: "🎓" },
    { id: "tutoriais-prof", label: "Ver — Professores", emoji: "👩‍🏫" },
    { id: "gestor", label: "Gerenciar", emoji: "⚙️" },
  ];

  const nav = perfil === "gestor" ? navGestor : perfil === "professor" ? navProf : navAluno;
  const perfilLabel = perfil === "gestor" ? "Gestor" : perfil === "professor" ? "Professor" : "Aluno";

  return (
    <>
      <div className="sidebar-brand">
        <img src="logo-escud.png" alt="UNIVERSO" onError={e => e.target.style.display="none"} style={{ height:56, width:"auto", objectFit:"contain" }} />
      </div>
      <div className="sidebar-nav">
        <div className="sidebar-section">Menu</div>
        {nav.map(item => (
          <div key={item.id} className={`sidebar-item${tab === item.id ? " active" : ""}`} onClick={() => setTab(item.id)}>
            <span className="si-icon">{item.emoji}</span> {item.label}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-perfil-tag">{perfilLabel === "Aluno" ? "🎓" : perfilLabel === "Professor" ? "👩‍🏫" : "⚙️"} {perfilLabel}</div>
        {perfil !== "aluno" && <button className="btn-sair" onClick={onSair}>Sair</button>}
      </div>
    </>
  );
}

// ===== APP =====
function App() {
  // Detectar perfil pela URL
  const params = new URLSearchParams(window.location.search);
  const urlProf = params.get("prof") === "1";
  const urlGestor = params.get("g") === "1";

  const [tela, setTela] = useState(
    urlGestor ? "gestor-login" :
    urlProf   ? "professor-login" :
                "selector"
  );
  const [perfil, setPerfil] = useState(null); // "aluno" | "professor" | "gestor"
  const [tab, setTab] = useState("tutoriais");
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtroFirebase = perfil === "gestor" ? null : perfil;
  const { data: tutoriais, loading } = useCollection("tutoriais", filtroFirebase || "aluno");
  const { data: todosT } = useCollection("tutoriais", "gestor");

  function entrar(p) { setPerfil(p); setTela("app"); setTab("tutoriais"); }
  function sair() { setPerfil(null); setTela("selector"); setTab("tutoriais"); }

  // Telas de acesso
  if (tela === "selector") return <PerfilSelector onSelect={t => setTela(t)} />;
  if (tela === "professor-login") return <LoginSenha perfil="professor" onSuccess={() => entrar("professor")} onBack={urlProf ? null : () => setTela("selector")} />;
  if (tela === "gestor-login") return <LoginSenha perfil="gestor" onSuccess={() => entrar("gestor")} onBack={urlGestor ? null : () => setTela("selector")} />;
  if (tela === "aluno-direto" || (!tela && !perfil)) { entrar("aluno"); return null; }

  // Auto-entrar como aluno ao selecionar
  if (!perfil) { entrar("aluno"); return null; }

  const base = window.location.origin + window.location.pathname;
  const shareUrl = perfil === "professor" ? base + "?prof=1" : base;

  const pageTitle = {
    "tutoriais": perfil === "professor" ? "Tutoriais para Professores" : "Tutoriais para Alunos",
    "tutoriais-aluno": "Tutoriais — Alunos",
    "tutoriais-prof": "Tutoriais — Professores",
    "gestor": "Gerenciar Tutoriais",
  }[tab] || "Tutoriais";

  // Qual lista mostrar
  const listaAtual = tab === "tutoriais-prof"
    ? todosT.filter(t => t.perfil === "professor")
    : tab === "tutoriais-aluno"
    ? todosT.filter(t => t.perfil === "aluno")
    : tutoriais;

  const perfilVista = tab === "tutoriais-prof" ? "professor" : "aluno";

  return (
    <div className="app-layout">
      {/* Sidebar desktop */}
      <div className="sidebar-desktop">
        <SidebarConteudo perfil={perfil} tab={tab} setTab={setTab} onSair={sair} />
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-drawer-bg" onClick={() => setMenuOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <SidebarConteudo perfil={perfil} tab={tab} setTab={t => { setTab(t); setMenuOpen(false); }} onSair={sair} />
          </div>
        </div>
      )}

      <div className="main-content">
        {/* Header mobile */}
        <div className="header-mobile">
          <div className="header-mobile-logo">
            <button className="header-menu-btn" onClick={() => setMenuOpen(true)}>☰</button>
            <img src={LOGO_TEXTO} alt="UNIVERSO" onError={e => e.target.style.display="none"} style={{ height:30, width:"auto", maxWidth:120, marginLeft:8, objectFit:"contain" }} />
          </div>
        </div>

        {/* Topbar desktop */}
        <div className="topbar">
          <div className="topbar-title">{pageTitle}</div>
          <div className="topbar-perfil">
            <span className="topbar-perfil-badge">
              {perfil === "gestor" ? "⚙️ Gestor" : perfil === "professor" ? "👩‍🏫 Professor" : "🎓 Aluno"}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="page">
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <>
              {(tab === "tutoriais" || tab === "tutoriais-aluno" || tab === "tutoriais-prof") && (
                <ModuloTutoriais
                  perfil={tab === "tutoriais-prof" ? "professor" : perfil === "professor" ? "professor" : "aluno"}
                  tutoriais={listaAtual}
                  shareUrl={shareUrl}
                />
              )}
              {tab === "gestor" && perfil === "gestor" && (
                <ModuloGestor todos={todosT} setToast={setToast} />
              )}
            </>
          )}
        </div>

        {/* Nav mobile */}
        <div className="nav-mobile">
          {perfil === "gestor" ? (
            <>
              <div className={`nav-mobile-item${tab === "tutoriais-aluno" ? " active" : ""}`} onClick={() => setTab("tutoriais-aluno")}><span className="nav-mobile-icon">🎓</span>Alunos</div>
              <div className={`nav-mobile-item${tab === "tutoriais-prof" ? " active" : ""}`} onClick={() => setTab("tutoriais-prof")}><span className="nav-mobile-icon">👩‍🏫</span>Profs</div>
              <div className={`nav-mobile-item${tab === "gestor" ? " active" : ""}`} onClick={() => setTab("gestor")}><span className="nav-mobile-icon">⚙️</span>Gestão</div>
            </>
          ) : (
            <div className={`nav-mobile-item active`}><span className="nav-mobile-icon">📚</span>Tutoriais</div>
          )}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ===== RENDER =====
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
