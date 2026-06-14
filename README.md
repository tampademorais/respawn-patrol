# ⚔️ Respawn Patrol

Sistema de controle de respawns para guilds de Tibia. Uma aplicação web estática que conecta com Supabase para gerenciar verificações de hunts, ranking de jogadores e sistema de acesso por código.

## 🎮 Funcionalidades

- **Fila Inteligente de Respawns**: Ordenação automática baseada no status (pronto, nunca verificado, em cooldown)
- **Sistema de Cooldown**: Cada hunt tem seu próprio tempo de respawn (6h, 8h, 12h, 24h)
- **Check-in Rápido**: Botão "VERIFIQUEI AGORA" para registrar verificações
- **Ranking em Tempo Real**: Pontuação automática baseada em prioridades
- **Acesso por Código**: Sistema seguro sem necessidade de login/senha
- **Alterar Nick**: Jogadores podem atualizar seu apelido
- **Status Visual**: Indicadores coloridos para tempo restante (🟢🟡🟠🔴)

## 🚀 Deploy no Vercel

Este projeto é **100% estático** e está pronto para deploy imediato no Vercel.

### Pré-requisitos

1. **GitHub Account** - para versionamento
2. **Vercel Account** - para deploy (gratuito)
3. **Supabase Project** - banco de dados (gratuito)

### Passo a Passo

#### 1. Preparar Repositório GitHub

```bash
# Navegue até a pasta do projeto
cd father-hood

# Inicialize o repositório Git (se ainda não tiver)
git init

# Adicione todos os arquivos
git add .

# Crie o primeiro commit
git commit -m "Initial commit: Respawn Patrol complete system"

# Crie uma branch main (opcional, mas recomendado)
git branch -M main

# Adicione o repositório remoto (substitua SEU_USUARIO pelo seu usuário GitHub)
git remote add origin https://github.com/SEU_USUARIO/respawn-patrol.git

# Faça o push
git push -u origin main
```

#### 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Após criar, vá em **Settings > API** e copie:
   - **Project URL**
   - **anon/public key**
3. Vá em **SQL Editor** e cole o conteúdo do arquivo `supabase/migrations/20260614013000_respawn_patrol_complete.sql`
4. Clique em **Run** para executar o SQL

#### 3. Atualizar Credenciais no Código

Edite o arquivo `script.js` e substitua as credenciais do Supabase:

```javascript
// Linha 18-19 do script.js
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON_AQUI';
```

#### 4. Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Importe o repositório GitHub que você criou
4. **Importante**: Nas configurações de build, deixe como está:
   - **Build Command**: (vazio)
   - **Output Directory**: (vazio)
   - **Install Command**: (vazio)
5. Clique em **"Deploy"**

#### 5. Pronto! 🎉

Seu projeto estará disponível em `https://respawn-patrol.vercel.app` (ou domínio personalizado)

## 📁 Estrutura do Projeto

```
father-hood/
├── index.html                    # Página principal
├── script.js                     # Lógica da aplicação
├── style.css                     # Estilos
├── vercel.json                   # Configuração Vercel
├── .gitignore                    # Arquivos ignorados
├── README.md                     # Este arquivo
├── package.json                  # (apenas para Father Hood React)
├── vite.config.js                # (apenas para Father Hood React)
├── supabase/
│   └── migrations/
│       └── 20260614013000_respawn_patrol_complete.sql
└── src/                          # (apenas para Father Hood React)
```

## 🗄️ Banco de Dados

O sistema utiliza as seguintes tabelas no Supabase:

### `hunts`
- `id` - Identificador único
- `name` - Nome do respawn
- `priority` - Pontos/prioridade
- `image_url` - URL da imagem (opcional)
- `last_check` - Data da última verificação
- `updated_by` - Último jogador que atualizou
- `updated_at` - Data de atualização
- `cooldown_hours` - Horas de cooldown (padrão: 24)

### `hunt_checks`
- `id` - Identificador único
- `hunt_id` - Referência à hunt
- `player_name` - Nome do jogador
- `checked_at` - Data/hora do check
- `points` - Pontos ganhos

### `access_codes`
- `id` - Identificador único
- `code` - Código de acesso
- `player_name` - Nome do jogador
- `is_active` - Se o código está ativo
- `created_at` / `updated_at` - Datas

## 🔒 Segurança

- **RLS (Row Level Security)**: Habilitado em todas as tabelas
- **Políticas**: Apenas operações necessárias para `anon`
- **Códigos de Acesso**: Validados no banco de dados
- **Sem senhas**: Sistema baseado em códigos únicos

## 🎨 Personalização

### Adicionar Imagens às Hunts

Atualize o campo `image_url` na tabela `hunts` via Supabase Dashboard:

```sql
UPDATE public.hunts 
SET image_url = 'https://exemplo.com/imagem.jpg' 
WHERE name = 'Livraria Gelo';
```

Ou use Supabase Storage:
1. Crie um bucket chamado `hunt-images`
2. Faça upload das imagens
3. Use a URL pública no campo `image_url`

### Adicionar Novos Códigos de Acesso

```sql
INSERT INTO public.access_codes (code, player_name) 
VALUES ('NOVO_CODIGO', 'Nome do Jogador');
```

### Alterar Cooldown das Hunts

```sql
UPDATE public.hunts 
SET cooldown_hours = 6 
WHERE name LIKE 'Livraria%';
```

## 🛠️ Desenvolvimento Local

Para testar localmente:

```bash
# Opção 1: Servidor simples (Python)
python -m http.server 8000

# Opção 2: Extensão "Live Server" do VS Code
# Clique com botão direito em index.html > "Open with Live Server"

# Opção 3: Node.js (npx)
npx serve .
```

Acesse `http://localhost:8000` (ou porta indicada)

## ⚠️ Notas Importantes

1. **Credenciais do Supabase**: Estão hardcoded no `script.js` por ser um projeto estático. As chaves `anon` são seguras para exposição pública (RLS protege os dados).

2. **Imagens**: Se não houver `image_url`, o card mostra um gradiente escuro limpo.

3. **React/Father Hood**: A pasta `src/` contém um projeto React separado (Father Hood) que não é usado pelo Respawn Patrol. Pode ser removido se desejar.

4. **Vercel.json**: Configurado para servir como site estático sem build.

## 📞 Suporte

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

---

**Desenvolvido para guilds de Tibia** ⚔️
