// ============================================================
// TUTORIAIS UNIVERSO — v3.0
// Novidades: Avisos no topo | Links de ação | Imagens por passo | Prioridade
// ============================================================

const { useState, useEffect } = React;

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

// ===== CONSTANTES =====
const CATS_ALUNO = ["Matrícula","Financeiro","AVA / EAD","Secretaria","Calendário","Estágio / TCC","Bolsas","Outros"];
const CATS_PROF  = ["Plano de Ensino","Lançamento de Notas","Frequência","AVA / EAD","Documentos","Outros"];
const CAT_EMOJI  = {"Matrícula":"🎓","Financeiro":"💳","AVA / EAD":"💻","Secretaria":"📋","Calendário":"📅","Estágio / TCC":"📝","Bolsas":"🏅","Outros":"📌","Plano de Ensino":"📚","Lançamento de Notas":"✏️","Frequência":"✅","Documentos":"🗂️"};
const TIPO_EMOJI = {"PDF":"📄","Vídeo":"🎬","Link":"🔗","Imagem":"🖼️","Texto":"📝"};
const CAT_COLORS = {"Matrícula":"pill-verm","Financeiro":"pill-amber","AVA / EAD":"pill-azul","Secretaria":"pill-verde","Calendário":"pill-azul","Estágio / TCC":"pill-cinza","Bolsas":"pill-verde","Outros":"pill-cinza","Plano de Ensino":"pill-azul","Lançamento de Notas":"pill-amber","Frequência":"pill-verde","Documentos":"pill-cinza"};
const AVISO_ESTILOS = {info:{bg:"#EFF6FF",border:"#BFDBFE",cor:"#1E40AF",icone:"ℹ️"},alerta:{bg:"#FFFBEB",border:"#FDE68A",cor:"#92400E",icone:"⚠️"},urgente:{bg:"#FEF2F2",border:"#FECACA",cor:"#991B1B",icone:"🚨"}};

// ===== CONVERTER GOOGLE DRIVE URL =====
function driveImg(url) {
  if (!url) return url;
  const m = url.match(/\/file\/d\/([^/]+)/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800`;
  const m2 = url.match(/[?&]id=([^&]+)/);
  if (m2) return `https://drive.google.com/thumbnail?id=${m2[1]}&sz=w800`;
  return url;
}

// ===== HOOKS =====
function useCol(col, perfil) {
  const [data, setData]     = useState([]);
  const [loading, setLoad]  = useState(true);
  useEffect(() => {
    let q = db.collection(col);
    if (perfil && perfil !== "gestor") q = q.where("perfil","==",perfil);
    const unsub = q.onSnapshot(snap => {
      const docs = snap.docs.map(d => ({id:d.id,...d.data()}));
      docs.sort((a,b) => {
        const pa=a.prioridade||999, pb=b.prioridade||999;
        if (pa!==pb) return pa-pb;
        const na=parseInt(a.numero?.replace(/\D/g,""))||999;
        const nb=parseInt(b.numero?.replace(/\D/g,""))||999;
        return na-nb;
      });
      setData(docs); setLoad(false);
    }, () => setLoad(false));
    return unsub;
  }, [col, perfil]);
  return {data, loading};
}

function useAvisos(perfil) {
  const [avisos, setAvisos] = useState([]);
  useEffect(() => {
    const unsub = db.collection("avisos").where("ativo","==",true).onSnapshot(snap => {
      const docs = snap.docs.map(d=>({id:d.id,...d.data()}));
      setAvisos(docs.filter(a=>!a.perfil||a.perfil==="todos"||a.perfil===perfil));
    }, ()=>{});
    return unsub;
  }, [perfil]);
  return avisos;
}

// ===== COMPONENTES BASE =====
function Pill({cat}) { return <span className={`pill ${CAT_COLORS[cat]||"pill-cinza"}`}>{cat}</span>; }

function Toast({msg, type, onClose}) {
  useEffect(()=>{const t=setTimeout(onClose,3000);return()=>clearTimeout(t);},[]);
  return <div className={`toast ${type}`}>{type==="success"?"✓":"!"} {msg}</div>;
}

function FaixaAvisos({avisos}) {
  if (!avisos.length) return null;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1.25rem"}}>
      {avisos.map(av=>{
        const s=AVISO_ESTILOS[av.tipo||"info"];
        return (
          <div key={av.id} style={{background:s.bg,border:`1.5px solid ${s.border}`,borderRadius:"10px",padding:"0.7rem 1rem",display:"flex",alignItems:"center",gap:"0.6rem",fontSize:"0.875rem",color:s.cor}}>
            <span style={{fontSize:"1rem",flexShrink:0}}>{s.icone}</span>
            <span style={{flex:1,fontWeight:600}}>{av.texto}</span>
            {av.url&&<a href={av.url} target="_blank" rel="noopener noreferrer" style={{background:s.cor,color:"white",borderRadius:"6px",padding:"0.25rem 0.6rem",fontSize:"0.75rem",fontWeight:700,flexShrink:0}}>Ver →</a>}
          </div>
        );
      })}
    </div>
  );
}

// ===== CARD =====
function TCard({t, onClick}) {
  const emoji = CAT_EMOJI[t.categoria]||"📌";
  const temLinks = (t.links||[]).filter(l=>l.titulo&&l.url).length>0;
  return (
    <div className="tcard" onClick={()=>onClick(t)}>
      <div className="tcard-thumb">
        {t.imagem ? <img src={driveImg(t.imagem)} alt={t.titulo} onError={e=>e.target.style.display="none"}/> : <div className="tcard-thumb-placeholder">{emoji}</div>}
        {t.numero&&<div className="tcard-badge">Tutorial {t.numero}</div>}
        {t.destaque&&<div style={{position:"absolute",top:10,right:10,fontSize:"1rem"}}>⭐</div>}
      </div>
      <div className="tcard-body">
        <div className="tcard-title">{t.titulo}</div>
        <div className="tcard-desc">{t.descricao}</div>
        <div className="tcard-footer">
          <div className="tcard-tipo">{TIPO_EMOJI[t.tipo]} {t.tipo}</div>
          <Pill cat={t.categoria}/>
          {temLinks&&<span style={{fontSize:"0.7rem",color:"var(--azul)",fontWeight:700}}>🔗</span>}
          <div className="tcard-ver">Ver →</div>
        </div>
      </div>
    </div>
  );
}

// ===== VIEW TUTORIAL =====
function TView({t, onBack}) {
  const links  = (t.links||[]).filter(l=>l.titulo&&l.url);
  const passos = (t.passos||[]).filter(p=>typeof p==="string"?p:p?.texto);

  function conteudo() {
    if (t.tipo==="PDF"&&t.url) return (<div><a href={t.url} target="_blank" rel="noopener noreferrer" className="link-btn" style={{display:"flex",marginBottom:"1rem"}}><span className="link-btn-icon">📥</span>Abrir / Baixar PDF</a><iframe src={t.url} className="tutorial-iframe" title={t.titulo}/></div>);
    if (t.tipo==="Vídeo"&&t.url) { const id=t.url.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]; return <iframe src={id?`https://www.youtube.com/embed/${id}`:t.url} className="tutorial-iframe" allowFullScreen title={t.titulo}/>; }
    if (t.tipo==="Imagem"&&t.url) return <img src={driveImg(t.url)} alt={t.titulo} className="tutorial-img"/>;
    return null;
  }

  return (
    <div className="tview">
      <div className="tview-header">
        <div className="tview-breadcrumb"><a onClick={onBack}>Tutoriais</a><span>›</span><Pill cat={t.categoria}/><span>›</span><span style={{color:"var(--cinza-texto)"}}>{t.titulo.length>45?t.titulo.slice(0,45)+"…":t.titulo}</span></div>
        <div className="tview-title">{t.titulo}</div>
        <div className="tview-meta"><Pill cat={t.categoria}/><span>{TIPO_EMOJI[t.tipo]} {t.tipo}</span>{t.numero&&<span>📌 Tutorial {t.numero}</span>}</div>
      </div>

      {t.descricao&&<div className="tblock"><div className="tblock-title"><span className="tblock-icon">ℹ️</span>Sobre este tutorial</div><div className="tview-desc">{t.descricao}</div></div>}

      {links.length>0&&(
        <div className="tblock">
          <div className="tblock-title"><span className="tblock-icon">🔗</span>Links e Ações</div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
            {links.map((l,i)=>(
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="link-btn">
                <span className="link-btn-icon">{l.emoji||"🔗"}</span>
                <div><div style={{fontWeight:700,fontSize:"0.9rem"}}>{l.titulo}</div>{l.descricao&&<div style={{fontSize:"0.75rem",opacity:0.75,marginTop:"0.1rem"}}>{l.descricao}</div>}</div>
                <span style={{marginLeft:"auto",fontSize:"0.8rem",opacity:0.7}}>→</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {passos.length>0&&(
        <div className="tblock">
          <div className="tblock-title"><span className="tblock-icon">📋</span>Passo a passo</div>
          <div className="steps">
            {passos.map((p,i)=>{
              const txt = typeof p==="string"?p:(p.texto||"");
              const img = typeof p==="object"?p.imagem:"";
              return (
                <div key={i} className="step">
                  <div className="step-num">{i+1}</div>
                  <div style={{flex:1}}>
                    <div className="step-txt">{txt}</div>
                    {img&&<img src={driveImg(img)} alt={`Passo ${i+1}`} style={{marginTop:"0.6rem",borderRadius:"8px",border:"1px solid var(--cinza-linha)",maxWidth:"100%",display:"block"}} onError={e=>e.target.style.display="none"}/>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {conteudo()&&<div className="tblock"><div className="tblock-title"><span className="tblock-icon">{TIPO_EMOJI[t.tipo]}</span>Conteúdo</div>{conteudo()}</div>}

      <div style={{textAlign:"center",marginTop:"1.5rem",marginBottom:"1rem"}}>
        <button className="btn btn-outline" onClick={onBack}>← Voltar aos tutoriais</button>
      </div>
    </div>
  );
}

// ===== MODULO TUTORIAIS =====
function ModuloTutoriais({perfil, tutoriais, avisos}) {
  const [busca, setBusca] = useState("");
  const [cat, setCat]     = useState("Todos");
  const [aberto, setAb]   = useState(null);

  if (aberto) return <TView t={aberto} onBack={()=>setAb(null)}/>;

  const cats = perfil==="professor"?CATS_PROF:CATS_ALUNO;
  const catsUsadas = ["Todos",...cats.filter(c=>tutoriais.some(t=>t.categoria===c))];
  const filtrados  = tutoriais.filter(t=>{
    const okC = cat==="Todos"||t.categoria===cat;
    const q   = busca.toLowerCase();
    return okC&&(!q||t.titulo.toLowerCase().includes(q)||t.descricao?.toLowerCase().includes(q)||(t.tags||[]).some(tg=>tg.toLowerCase().includes(q)));
  });

  return (
    <div>
      <FaixaAvisos avisos={avisos}/>
      <div className="hero-banner">
        <div className="hero-banner-logo"><img src="logo-complet.png" alt="UNIVERSO" onError={e=>e.target.style.display="none"} style={{height:52,width:"auto",maxWidth:220,objectFit:"contain"}}/></div>
        <div className="hero-banner-text">
          <h2>{perfil==="professor"?"Tutoriais para Professores":"Tutoriais para Alunos"}</h2>
          <p>{perfil==="professor"?"Guias práticos para o dia a dia docente":"Tudo que você precisa para aproveitar sua vida acadêmica"}</p>
        </div>
        <button className="hero-share-btn" onClick={()=>{const u=window.location.origin+window.location.pathname+(perfil==="professor"?"?prof=1":"");navigator.clipboard.writeText(u).then(()=>alert("Link copiado!"));}}>🔗 Compartilhar</button>
      </div>
      <div className="searchbar" style={{marginBottom:"1rem",maxWidth:"100%",display:"flex",background:"white",border:"1.5px solid var(--cinza-linha)"}}>
        <span className="searchbar-icon">🔍</span>
        <input placeholder="Buscar tutoriais…" value={busca} onChange={e=>setBusca(e.target.value)}/>
        {busca&&<button onClick={()=>setBusca("")} style={{color:"var(--cinza-muted)",padding:"0 0.5rem"}}>✕</button>}
      </div>
      <div className="filter-bar">
        {catsUsadas.map(c=>(
          <button key={c} className={`filter-chip${cat===c?" active":""}`} onClick={()=>setCat(c)}>
            {CAT_EMOJI[c]||""} {c}{c!=="Todos"&&<span style={{marginLeft:"0.3rem",opacity:0.65}}>({tutoriais.filter(t=>t.categoria===c).length})</span>}
          </button>
        ))}
      </div>
      {filtrados.length===0?(<div className="empty"><div className="empty-icon">📭</div><h3>Nenhum tutorial encontrado</h3><p>Tente outros termos ou mude o filtro</p></div>):(
        <div className="tutorials-grid">{filtrados.map(t=><TCard key={t.id} t={t} onClick={setAb}/>)}</div>
      )}
    </div>
  );
}

// ===== MODAL AVISO =====
function ModalAviso({aviso, onClose, onSave, onDelete}) {
  const isNew = !aviso?.id;
  const [form, setF] = useState(aviso||{texto:"",tipo:"info",perfil:"todos",url:"",ativo:true});
  const sf=(k,v)=>setF(f=>({...f,[k]:v}));
  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-hdr"><div className="modal-hdr-title">{isNew?"Novo Aviso":"Editar Aviso"}</div><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-field"><label className="form-label">Texto *</label><textarea className="form-input" rows={2} value={form.texto} onChange={e=>sf("texto",e.target.value)} placeholder="Ex: Prazo de matrícula encerra dia 20/05"/></div>
          <div className="form-row">
            <div className="form-field"><label className="form-label">Tipo</label><select className="form-input" value={form.tipo} onChange={e=>sf("tipo",e.target.value)}><option value="info">ℹ️ Informativo</option><option value="alerta">⚠️ Alerta</option><option value="urgente">🚨 Urgente</option></select></div>
            <div className="form-field"><label className="form-label">Para quem</label><select className="form-input" value={form.perfil} onChange={e=>sf("perfil",e.target.value)}><option value="todos">Todos</option><option value="aluno">Só Alunos</option><option value="professor">Só Professores</option></select></div>
          </div>
          <div className="form-field"><label className="form-label">Link (opcional)</label><input className="form-input" placeholder="https://…" value={form.url||""} onChange={e=>sf("url",e.target.value)}/><div className="form-hint">Aparece botão "Ver →" se preenchido</div></div>
          <div className="form-check"><input type="checkbox" id="ativo" checked={!!form.ativo} onChange={e=>sf("ativo",e.target.checked)}/><label htmlFor="ativo" style={{fontSize:"0.9rem",fontWeight:500}}>Aviso ativo (visível)</label></div>
        </div>
        <div className="modal-ftr">
          <div>{!isNew&&<button className="btn btn-danger btn-sm" onClick={()=>onDelete(aviso.id)}>🗑 Excluir</button>}</div>
          <div style={{display:"flex",gap:"0.5rem"}}><button className="btn btn-outline btn-sm" onClick={onClose}>Cancelar</button><button className="btn btn-primary btn-sm" onClick={()=>{if(!form.texto.trim()){alert("Digite o texto");return;}onSave(form);}}>✓ Salvar</button></div>
        </div>
      </div>
    </div>
  );
}

// ===== MODAL TUTORIAL =====
function ModalTutorial({tutorial, perfilDef, onClose, onSave, onDelete}) {
  const isNew = !tutorial?.id;
  const normPassos = ps => (ps||["",""]).map(p=>typeof p==="string"?{texto:p,imagem:""}:p);
  const [form, setF] = useState({numero:"",titulo:"",descricao:"",categoria:CATS_ALUNO[0],tipo:"Texto",url:"",imagem:"",destaque:false,perfil:perfilDef||"aluno",prioridade:"",passos:normPassos(tutorial?.passos),links:tutorial?.links||[],...(tutorial||{})});
  const sf=(k,v)=>setF(f=>({...f,[k]:v}));
  const cats = form.perfil==="professor"?CATS_PROF:CATS_ALUNO;

  const setPasso=(i,k,v)=>{const p=[...form.passos];p[i]={...p[i],[k]:v};sf("passos",p);};
  const addPasso=()=>sf("passos",[...form.passos,{texto:"",imagem:""}]);
  const rmPasso=(i)=>{const p=[...form.passos];p.splice(i,1);sf("passos",p);};
  const setLink=(i,k,v)=>{const l=[...form.links];l[i]={...l[i],[k]:v};sf("links",l);};
  const addLink=()=>sf("links",[...form.links,{titulo:"",url:"",descricao:"",emoji:"🔗"}]);
  const rmLink=(i)=>{const l=[...form.links];l.splice(i,1);sf("links",l);};

  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:640}}>
        <div className="modal-hdr"><div className="modal-hdr-title">{isNew?"Novo Tutorial":"Editar Tutorial"}</div><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-field"><label className="form-label">Número</label><input className="form-input" placeholder="01" value={form.numero} onChange={e=>sf("numero",e.target.value)}/></div>
            <div className="form-field"><label className="form-label">Prioridade</label><input className="form-input" type="number" min="1" placeholder="1 = topo" value={form.prioridade||""} onChange={e=>sf("prioridade",parseInt(e.target.value)||"")}/></div>
          </div>
          <div className="form-row">
            <div className="form-field"><label className="form-label">Perfil</label><select className="form-input" value={form.perfil} onChange={e=>sf("perfil",e.target.value)}><option value="aluno">🎓 Aluno</option><option value="professor">👩‍🏫 Professor</option></select></div>
            <div className="form-field"><label className="form-label">Categoria</label><select className="form-input" value={form.categoria} onChange={e=>sf("categoria",e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="form-field"><label className="form-label">Título *</label><input className="form-input" value={form.titulo} onChange={e=>sf("titulo",e.target.value)}/></div>
          <div className="form-field"><label className="form-label">Descrição</label><textarea className="form-input" rows={2} value={form.descricao} onChange={e=>sf("descricao",e.target.value)}/></div>
          <div className="form-row">
            <div className="form-field"><label className="form-label">Tipo</label><select className="form-input" value={form.tipo} onChange={e=>sf("tipo",e.target.value)}>{["Texto","PDF","Vídeo","Link","Imagem"].map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="form-field" style={{display:"flex",alignItems:"center",paddingTop:"1.4rem"}}><div className="form-check"><input type="checkbox" id="dest" checked={!!form.destaque} onChange={e=>sf("destaque",e.target.checked)}/><label htmlFor="dest" style={{fontSize:"0.875rem",fontWeight:500}}>⭐ Destaque</label></div></div>
          </div>
          {form.tipo!=="Texto"&&<div className="form-field"><label className="form-label">URL do conteúdo</label><input className="form-input" placeholder="https://…" value={form.url||""} onChange={e=>sf("url",e.target.value)}/><div className="form-hint">{form.tipo==="PDF"?"Link direto do PDF":form.tipo==="Vídeo"?"Link do YouTube":form.tipo==="Imagem"?"URL ou Google Drive":"URL que abre ao clicar"}</div></div>}
          <div className="form-field"><label className="form-label">Imagem de capa (URL ou Google Drive)</label><input className="form-input" placeholder="https://drive.google.com/file/d/…/view" value={form.imagem||""} onChange={e=>sf("imagem",e.target.value)}/><div className="form-hint">Links do Google Drive são convertidos automaticamente</div></div>

          {/* PASSOS */}
          <div className="form-field">
            <label className="form-label">Passo a passo</label>
            {(form.passos||[]).map((p,i)=>(
              <div key={i} style={{background:"#F8F9FF",borderRadius:"10px",padding:"0.75rem",marginBottom:"0.6rem",border:"1px solid var(--cinza-linha)"}}>
                <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.4rem",alignItems:"flex-start"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"var(--azul)",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.72rem",fontWeight:700,flexShrink:0,marginTop:2}}>{i+1}</div>
                  <textarea className="form-input" style={{flex:1,minHeight:50}} placeholder={`Texto do passo ${i+1}`} value={p.texto||""} onChange={e=>setPasso(i,"texto",e.target.value)}/>
                  {(form.passos||[]).length>1&&<button onClick={()=>rmPasso(i)} style={{color:"var(--cinza-muted)",flexShrink:0}}>✕</button>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"0.4rem",paddingLeft:32}}>
                  <span style={{fontSize:"0.72rem",color:"var(--cinza-muted)",flexShrink:0}}>🖼 Imagem (opcional):</span>
                  <input className="form-input" style={{fontSize:"0.78rem",padding:"0.35rem 0.6rem"}} placeholder="URL ou Google Drive" value={p.imagem||""} onChange={e=>setPasso(i,"imagem",e.target.value)}/>
                </div>
              </div>
            ))}
            <button onClick={addPasso} style={{color:"var(--azul)",fontSize:"0.82rem",fontWeight:700,display:"flex",alignItems:"center",gap:"0.3rem"}}>+ Adicionar passo</button>
          </div>

          {/* LINKS */}
          <div className="form-field">
            <label className="form-label">🔗 Links e Ações <span style={{fontWeight:400,textTransform:"none",fontSize:"0.75rem",color:"var(--cinza-muted)"}}>— só aparecem se cadastrados</span></label>
            {(form.links||[]).map((l,i)=>(
              <div key={i} style={{background:"#F0F4FF",borderRadius:"10px",padding:"0.75rem",marginBottom:"0.6rem",border:"1px solid var(--azul-border)"}}>
                <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.4rem",alignItems:"center"}}>
                  <input className="form-input" style={{width:48,textAlign:"center",padding:"0.35rem"}} placeholder="🔗" value={l.emoji||"🔗"} onChange={e=>setLink(i,"emoji",e.target.value)} title="Emoji"/>
                  <input className="form-input" style={{flex:1}} placeholder="Nome do link (ex: Inscrever no evento)" value={l.titulo||""} onChange={e=>setLink(i,"titulo",e.target.value)}/>
                  <button onClick={()=>rmLink(i)} style={{color:"var(--cinza-muted)",flexShrink:0}}>✕</button>
                </div>
                <input className="form-input" style={{marginBottom:"0.4rem"}} placeholder="https://…" value={l.url||""} onChange={e=>setLink(i,"url",e.target.value)}/>
                <input className="form-input" style={{fontSize:"0.78rem"}} placeholder="Descrição curta (opcional)" value={l.descricao||""} onChange={e=>setLink(i,"descricao",e.target.value)}/>
              </div>
            ))}
            <button onClick={addLink} style={{color:"var(--azul)",fontSize:"0.82rem",fontWeight:700,display:"flex",alignItems:"center",gap:"0.3rem"}}>+ Adicionar link</button>
          </div>
        </div>
        <div className="modal-ftr">
          <div>{!isNew&&<button className="btn btn-danger btn-sm" onClick={()=>onDelete(tutorial.id)}>🗑 Excluir</button>}</div>
          <div style={{display:"flex",gap:"0.5rem"}}>
            <button className="btn btn-outline btn-sm" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary btn-sm" onClick={()=>{if(!form.titulo.trim()){alert("Digite o título");return;}onSave(form);}}>✓ Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== GESTOR =====
function ModuloGestor({todos, setToast}) {
  const [modalT, setModalT] = useState(null);
  const [modalA, setModalA] = useState(null);
  const [aba, setAba]       = useState("tutoriais");
  const [busca, setBusca]   = useState("");
  const [filtP, setFiltP]   = useState("todos");
  const {data: avisos}      = useAvisos("gestor");
  const base = window.location.origin+window.location.pathname;

  async function salvT(form) {
    const d={numero:form.numero||"",titulo:form.titulo,descricao:form.descricao||"",categoria:form.categoria,tipo:form.tipo,url:form.url||"",imagem:form.imagem||"",destaque:!!form.destaque,perfil:form.perfil,prioridade:form.prioridade||999,passos:(form.passos||[]).filter(p=>p.texto||typeof p==="string"&&p),links:(form.links||[]).filter(l=>l.titulo&&l.url),updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
    try{if(form.id){await db.collection("tutoriais").doc(form.id).update(d);setToast({msg:"Tutorial atualizado!",type:"success"});}else{d.createdAt=firebase.firestore.FieldValue.serverTimestamp();await db.collection("tutoriais").add(d);setToast({msg:"Tutorial criado!",type:"success"});}setModalT(null);}catch(e){setToast({msg:"Erro: "+e.message,type:"error"});}
  }
  async function delT(id){if(!confirm("Excluir?"))return;try{await db.collection("tutoriais").doc(id).delete();setToast({msg:"Excluído.",type:"success"});setModalT(null);}catch(e){setToast({msg:"Erro.",type:"error"});}}
  async function salvA(form){const d={texto:form.texto,tipo:form.tipo||"info",perfil:form.perfil||"todos",url:form.url||"",ativo:!!form.ativo,updatedAt:firebase.firestore.FieldValue.serverTimestamp()};try{if(form.id){await db.collection("avisos").doc(form.id).update(d);setToast({msg:"Aviso atualizado!",type:"success"});}else{d.createdAt=firebase.firestore.FieldValue.serverTimestamp();await db.collection("avisos").add(d);setToast({msg:"Aviso criado!",type:"success"});}setModalA(null);}catch(e){setToast({msg:"Erro: "+e.message,type:"error"});}}
  async function delA(id){if(!confirm("Excluir aviso?"))return;try{await db.collection("avisos").doc(id).delete();setToast({msg:"Aviso excluído.",type:"success"});setModalA(null);}catch(e){setToast({msg:"Erro.",type:"error"});}}
  function copiar(u){navigator.clipboard.writeText(u).then(()=>setToast({msg:"Link copiado!",type:"success"}));}

  const filtrados = todos.filter(t=>(filtP==="todos"||t.perfil===filtP)&&(!busca||t.titulo.toLowerCase().includes(busca.toLowerCase())));

  return (
    <div>
      <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem",borderBottom:"2px solid var(--cinza-linha)",paddingBottom:"0.75rem"}}>
        {[["tutoriais","📚 Tutoriais"],["avisos","🔔 Avisos"],["links","🔗 Links"]].map(([id,lb])=>(
          <button key={id} onClick={()=>setAba(id)} style={{padding:"0.5rem 1.1rem",borderRadius:"8px",fontWeight:700,fontSize:"0.85rem",background:aba===id?"var(--azul)":"transparent",color:aba===id?"white":"var(--cinza-muted)",border:aba===id?"none":"1.5px solid var(--cinza-linha)"}}>{lb}</button>
        ))}
      </div>

      {aba==="tutoriais"&&(
        <div>
          <div className="stats-grid">
            <div className="stat-card destaque"><div className="stat-label">Total</div><div className="stat-value">{todos.length}</div></div>
            <div className="stat-card"><div className="stat-label">🎓 Alunos</div><div className="stat-value">{todos.filter(t=>t.perfil==="aluno").length}</div></div>
            <div className="stat-card"><div className="stat-label">👩‍🏫 Professores</div><div className="stat-value">{todos.filter(t=>t.perfil==="professor").length}</div></div>
          </div>
          <div className="sec-header"><div><div className="sec-title">Tutoriais</div><div className="sec-sub">Crie, edite e organize</div></div><button className="btn btn-primary" onClick={()=>setModalT("new")}>+ Novo Tutorial</button></div>
          <div style={{display:"flex",gap:"0.5rem",marginBottom:"1rem",flexWrap:"wrap",alignItems:"center"}}>
            <div className="searchbar" style={{maxWidth:300,background:"white",border:"1.5px solid var(--cinza-linha)"}}><span className="searchbar-icon">🔍</span><input placeholder="Buscar…" value={busca} onChange={e=>setBusca(e.target.value)}/></div>
            {["todos","aluno","professor"].map(p=><button key={p} className={`filter-chip${filtP===p?" active":""}`} onClick={()=>setFiltP(p)}>{p==="todos"?"Todos":p==="aluno"?"🎓 Alunos":"👩‍🏫 Professores"}</button>)}
          </div>
          <div style={{background:"white",borderRadius:"14px",border:"1px solid var(--cinza-linha)",overflow:"hidden"}}>
            <table className="adm-table">
              <thead><tr><th>Nº</th><th>Título</th><th>Perfil</th><th>Categoria</th><th>Prio.</th><th style={{textAlign:"right"}}>Ações</th></tr></thead>
              <tbody>
                {filtrados.length===0?<tr><td colSpan={6} style={{textAlign:"center",padding:"2rem",color:"var(--cinza-muted)"}}>Nenhum tutorial</td></tr>
                :filtrados.map(t=>(
                  <tr key={t.id}>
                    <td style={{color:"var(--cinza-muted)",fontSize:"0.78rem"}}>{t.numero||"—"}</td>
                    <td className="td-title">{t.titulo}</td>
                    <td><span className={`pill ${t.perfil==="professor"?"pill-azul":"pill-verde"}`}>{t.perfil==="professor"?"👩‍🏫":"🎓"} {t.perfil}</span></td>
                    <td><Pill cat={t.categoria}/></td>
                    <td style={{color:"var(--cinza-muted)",fontSize:"0.8rem"}}>{t.prioridade||"—"}</td>
                    <td><div className="td-actions"><button className="btn-icon" onClick={()=>setModalT(t)}>✏️</button><button className="btn-icon danger" onClick={()=>delT(t.id)}>🗑</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aba==="avisos"&&(
        <div>
          <div className="sec-header"><div><div className="sec-title">Avisos</div><div className="sec-sub">Faixas de aviso no topo das páginas</div></div><button className="btn btn-primary" onClick={()=>setModalA("new")}>+ Novo Aviso</button></div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
            {avisos.length===0&&<div className="empty"><div className="empty-icon">🔔</div><h3>Nenhum aviso</h3></div>}
            {avisos.map(av=>{const s=AVISO_ESTILOS[av.tipo||"info"];return(
              <div key={av.id} style={{background:"white",border:"1px solid var(--cinza-linha)",borderRadius:"12px",padding:"0.85rem 1rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                <span style={{fontSize:"1.2rem"}}>{s.icone}</span>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:"0.875rem",color:s.cor}}>{av.texto}</div><div style={{fontSize:"0.75rem",color:"var(--cinza-muted)",marginTop:"0.2rem"}}>{av.ativo?"✅ Ativo":"⭕ Inativo"} · Para: {av.perfil}</div></div>
                <button className="btn-icon" onClick={()=>setModalA(av)}>✏️</button>
              </div>
            );})}
          </div>
        </div>
      )}

      {aba==="links"&&(
        <div>
          <div className="sec-title" style={{marginBottom:"1rem"}}>Links para compartilhar</div>
          <div className="share-box"><span>🎓</span><div><div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--azul)",textTransform:"uppercase",marginBottom:"0.2rem"}}>Página dos Alunos</div><div className="share-box-url">{base}</div></div><button className="share-copy-btn" onClick={()=>copiar(base)}>Copiar</button></div>
          <div className="share-box"><span>👩‍🏫</span><div><div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--azul)",textTransform:"uppercase",marginBottom:"0.2rem"}}>Página dos Professores</div><div className="share-box-url">{base}?prof=1</div></div><button className="share-copy-btn" onClick={()=>copiar(base+"?prof=1")}>Copiar</button></div>
        </div>
      )}

      {modalT&&<ModalTutorial tutorial={modalT==="new"?null:modalT} perfilDef={filtP==="professor"?"professor":"aluno"} onClose={()=>setModalT(null)} onSave={salvT} onDelete={delT}/>}
      {modalA&&<ModalAviso aviso={modalA==="new"?null:modalA} onClose={()=>setModalA(null)} onSave={salvA} onDelete={delA}/>}
    </div>
  );
}

// ===== SIDEBAR =====
function SidebarConteudo({perfil, tab, setTab, onSair}) {
  const nav = perfil==="gestor"?[{id:"tutoriais-aluno",label:"Ver — Alunos",emoji:"🎓"},{id:"tutoriais-prof",label:"Ver — Professores",emoji:"👩‍🏫"},{id:"gestor",label:"Gerenciar",emoji:"⚙️"}]:[{id:"tutoriais",label:"Tutoriais",emoji:"📚"}];
  return (
    <>
      <div className="sidebar-brand"><img src="logo-escud.png" alt="UNIVERSO" onError={e=>e.target.style.display="none"} style={{height:52,width:"auto",objectFit:"contain"}}/></div>
      <div className="sidebar-nav">
        <div className="sidebar-section">Menu</div>
        {nav.map(i=><div key={i.id} className={`sidebar-item${tab===i.id?" active":""}`} onClick={()=>setTab(i.id)}><span className="si-icon">{i.emoji}</span>{i.label}</div>)}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-perfil-tag">{perfil==="gestor"?"⚙️ Gestor":perfil==="professor"?"👩‍🏫 Professor":"🎓 Aluno"}</div>
        {perfil!=="aluno"&&<button className="btn-sair" onClick={onSair}>Sair</button>}
      </div>
    </>
  );
}

// ===== PERFIL SELECTOR =====
function PerfilSelector({onSelect}) {
  return (
    <div className="perfil-page">
      <div className="perfil-logo"><img src="logo-escud.png" alt="UNIVERSO" onError={e=>e.target.style.display="none"}/></div>
      <div className="perfil-titulo">Portal de Tutoriais</div>
      <div className="perfil-sub">Centro Universitário UNIVERSO Goiânia</div>
      <div className="perfil-cards">
        <div className="perfil-card" onClick={()=>onSelect("aluno")}><div className="perfil-card-icon">🎓</div><div className="perfil-card-label">Sou Aluno</div><div className="perfil-card-desc">Acesso direto aos tutoriais</div></div>
        <div className="perfil-card" onClick={()=>onSelect("professor-login")}><div className="perfil-card-icon">👩‍🏫</div><div className="perfil-card-label">Sou Professor</div><div className="perfil-card-desc">Área exclusiva docente</div></div>
      </div>
      <div className="perfil-links">
        <a href="https://universo.edu.br/" target="_blank" rel="noopener noreferrer" className="perfil-link-btn">🌐 Site UNIVERSO</a>
        <a href="https://universo.edu.br/wp-content/uploads/2025/12/UNIVERSO-GO-l-MIA-l-2026.1-l-17112025.pdf" target="_blank" rel="noopener noreferrer" className="perfil-link-btn">📘 Manual do Aluno — MIA 2026.1</a>
        <a href="https://api.whatsapp.com/send?phone=+5508007210251" target="_blank" rel="noopener noreferrer" className="perfil-link-btn whatsapp">📱 WhatsApp Institucional</a>
      </div>
    </div>
  );
}

// ===== LOGIN =====
function LoginSenha({perfil, onSuccess, onBack}) {
  const [s,setS]=useState(""); const [e,setE]=useState("");
  function t(){if(s===(perfil==="professor"?SENHA_PROF:SENHA_GESTOR)){onSuccess();}else{setE("Senha incorreta.");}}
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-logo"><img src="logo-escud.png" alt="UNIVERSO" style={{height:72,width:"auto",objectFit:"contain"}} onError={ev=>ev.target.style.display="none"}/></div>
        <div className="login-card-title">{perfil==="professor"?"Área do Professor":"Área do Gestor"}</div>
        <div className="login-card-sub">{perfil==="professor"?"Tutoriais exclusivos para docentes":"Acesso restrito à gestão"}</div>
        <div className="login-field"><label className="form-label">Senha</label><input className="form-input" type="password" placeholder="••••••••" value={s} onChange={ev=>setS(ev.target.value)} onKeyDown={ev=>ev.key==="Enter"&&t()} autoFocus/></div>
        {e&&<div className="login-error">{e}</div>}
        <button className="login-btn" onClick={t}>Entrar</button>
        {onBack&&<div className="login-back" onClick={onBack}>← Voltar</div>}
      </div>
    </div>
  );
}

// ===== APP =====
function App() {
  const params    = new URLSearchParams(window.location.search);
  const urlP      = params.get("prof")==="1";
  const urlG      = params.get("g")==="1";
  const [tela,setTela]   = useState(urlG?"gestor-login":urlP?"professor-login":"selector");
  const [perfil,setPerfil]=useState(null);
  const [tab,setTab]     = useState("tutoriais");
  const [toast,setToast] = useState(null);
  const [menu,setMenu]   = useState(false);

  const {data:tutoriais,loading} = useCol("tutoriais", perfil&&perfil!=="gestor"?perfil:"aluno");
  const {data:todos}             = useCol("tutoriais","gestor");
  const avisos = useAvisos(perfil||"aluno");

  function entrar(p){setPerfil(p);setTela("app");setTab(p==="gestor"?"tutoriais-aluno":"tutoriais");}
  function sair(){setPerfil(null);setTela("selector");}

  if(tela==="selector") return <PerfilSelector onSelect={t=>{if(t==="aluno")entrar("aluno");else setTela(t);}}/>;
  if(tela==="professor-login") return <LoginSenha perfil="professor" onSuccess={()=>entrar("professor")} onBack={urlP?null:()=>setTela("selector")}/>;
  if(tela==="gestor-login")    return <LoginSenha perfil="gestor"    onSuccess={()=>entrar("gestor")}    onBack={urlG?null:()=>setTela("selector")}/>;
  if(!perfil){entrar("aluno");return null;}

  const lista = tab==="tutoriais-prof"?todos.filter(t=>t.perfil==="professor"):tab==="tutoriais-aluno"?todos.filter(t=>t.perfil==="aluno"):tutoriais;
  const pVista= tab==="tutoriais-prof"?"professor":"aluno";
  const titulo= {tutoriais:"Tutoriais","tutoriais-aluno":"Tutoriais — Alunos","tutoriais-prof":"Tutoriais — Professores",gestor:"Gerenciar"}[tab]||"Tutoriais";

  return (
    <div className="app-layout">
      <div className="sidebar-desktop"><SidebarConteudo perfil={perfil} tab={tab} setTab={setTab} onSair={sair}/></div>
      {menu&&<div className="mobile-drawer-bg" onClick={()=>setMenu(false)}><div className="mobile-drawer" onClick={e=>e.stopPropagation()}><SidebarConteudo perfil={perfil} tab={tab} setTab={t=>{setTab(t);setMenu(false);}} onSair={sair}/></div></div>}
      <div className="main-content">
        <div className="header-mobile"><div className="header-mobile-logo"><button className="header-menu-btn" onClick={()=>setMenu(true)}>☰</button><img src="logo-escud.png" alt="UNIVERSO" onError={e=>e.target.style.display="none"} style={{height:30,width:"auto",marginLeft:8,objectFit:"contain",filter:"brightness(0) invert(1)"}}/></div></div>
        <div className="topbar"><div className="topbar-title">{titulo}</div><div className="topbar-perfil"><span className="topbar-perfil-badge">{perfil==="gestor"?"⚙️ Gestor":perfil==="professor"?"👩‍🏫 Professor":"🎓 Aluno"}</span></div></div>
        <div className="page">
          {loading?<div className="spinner-wrap"><div className="spinner"/></div>:(
            <>
              {(tab==="tutoriais"||tab==="tutoriais-aluno"||tab==="tutoriais-prof")&&<ModuloTutoriais perfil={pVista} tutoriais={lista} avisos={avisos}/>}
              {tab==="gestor"&&perfil==="gestor"&&<ModuloGestor todos={todos} setToast={setToast}/>}
            </>
          )}
        </div>
        <div className="nav-mobile">
          {perfil==="gestor"?(
            <><div className={`nav-mobile-item${tab==="tutoriais-aluno"?" active":""}`} onClick={()=>setTab("tutoriais-aluno")}><span className="nav-mobile-icon">🎓</span>Alunos</div><div className={`nav-mobile-item${tab==="tutoriais-prof"?" active":""}`} onClick={()=>setTab("tutoriais-prof")}><span className="nav-mobile-icon">👩‍🏫</span>Profs</div><div className={`nav-mobile-item${tab==="gestor"?" active":""}`} onClick={()=>setTab("gestor")}><span className="nav-mobile-icon">⚙️</span>Gestão</div></>
          ):<div className="nav-mobile-item active"><span className="nav-mobile-icon">📚</span>Tutoriais</div>}
        </div>
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
