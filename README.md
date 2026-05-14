# 📚 Tutoriais UNIVERSO

Sistema web de tutoriais para alunos do Centro Universitário UNIVERSO — Goiânia.

## 🚀 Como subir no GitHub Pages

1. Crie um repositório no GitHub (ex: `tutoriais-universo`)
2. Envie os 3 arquivos: `index.html`, `style.css`, `app.js`
3. Vá em **Settings → Pages → Deploy from branch (main)**
4. Acesse: `https://SEU-USUARIO.github.io/tutoriais-universo`

---

## 🔥 Configurar Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto (ex: `tutoriais-universo`)
3. Adicione um app web → copie as credenciais
4. No `app.js`, substitua o bloco `firebaseConfig` pelas suas credenciais
5. No Firestore, crie uma coleção chamada `tutoriais`
6. Nas **Regras do Firestore**, use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tutoriais/{doc} {
      allow read: if true;
      allow write: if true; // Simplificado — coloque auth depois
    }
  }
}
```

---

## 🔑 Acessos

| Perfil | Como entrar |
|--------|------------|
| Aluno | Qualquer nome |
| Admin | Senha: `universo2025` |

> Altere a senha no `app.js`, variável `ADMIN_PASSWORD`

---

## ✏️ Como adicionar tutoriais

1. Entre como **Administrador**
2. Clique em **Gerenciar** na barra lateral
3. Clique em **Novo Tutorial**
4. Preencha: título, categoria, tipo de conteúdo, URL, passos
5. Clique em **Salvar**

### Tipos de conteúdo suportados:
- **PDF** — Link direto para arquivo PDF (abre embutido + botão download)
- **Vídeo** — YouTube (embed automático)
- **Link** — URL externa (ex: portal, Google Forms)
- **Imagem** — Exibe imagem do tutorial
- **Texto** — Só passos, sem URL

---

## 📁 Estrutura dos arquivos

```
tutoriais-universo/
├── index.html   ← Imports (React, Firebase, Fontes)
├── style.css    ← Todo o visual
└── app.js       ← Toda a lógica React
```

---

## 🎨 Personalização

- **Logo**: mude a variável `LOGO_URL` no `app.js`
- **Senha admin**: mude `ADMIN_PASSWORD`
- **Categorias**: edite o array `CATEGORIAS`
- **Cores**: edite as variáveis `--red-*` no `style.css`
