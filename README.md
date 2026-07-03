# ⚔️ Respawn Patrol - Guild Spawn Control System

Sistema de controle de respawns para guildas de Tibia, com verificação de status e sistema de pontuação.

## 🎯 Funcionalidades

### Verificação de Respawns
- **5 tipos de status** para verificação:
  - 🔵 **Sem PT** (+1 ponto) - Respawn vazio, sem PT formada
  - 🟡 **Com PT** (+2 pontos) - PT formada aguardando membros
  - 🟣 **Acabou PT** (+2 pontos) - PT encerrou e saiu do local
  - 🟢 **Matamos** (+8 pontos) - Nossa PT assumiu o respawn
  - 🔴 **Fraguei** (+12 pontos) - Nossa PT morreu na disputa

### Sistema de Upload de Prints
- **Drag & Drop** - Arraste imagens para a área de upload
- **Ctrl+V** - Cole prints diretamente da área de transferência
- **Clique** - Selecione arquivos do computador
- Formatos suportados: PNG, JPG, JPEG, WEBP (máx. 10MB)

### Ranking
- Pontuação baseada no tipo de verificação
- Ranking em tempo real de todos os jogadores
- Histórico completo de verificações

### Painel Administrativo
- Visualização de todas as verificações
- Filtros por jogador, hunt, status e período
- Exclusão de verificações incorretas
- Visualização de prints em tela cheia

## 🚀 Como Usar

1. **Login**: Digite seu código de acesso fornecido pela guilda
2. **Verificar**: Clique em "VERIFIQUEI AGORA" em um respawn disponível
3. **Selecionar Status**: Escolha qual foi o resultado da verificação
4. **Enviar Print** (se necessário): 
   - Arraste uma imagem
   - Ou cole com Ctrl+V
   - Ou clique para selecionar
5. **Confirmar**: Clique em "Confirmar Verificação"

## 📋 Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conexão com a internet
- Código de acesso válido da guilda

## 🗄️ Banco de Dados

O sistema utiliza Supabase como backend. As tabelas principais são:

- `hunts` - Lista de respawns com cooldown
- `hunt_checks` - Histórico de verificações com status e prints
- `access_codes` - Códigos de acesso dos jogadores

### Migration Necessária

Execute a migration `20260614020000_add_verification_status_and_images.sql` para adicionar as colunas `status` e `image_url` na tabela `hunt_checks`.

## 📁 Estrutura do Projeto

```
├── index.html          # Página principal (dashboard)
├── admin.html          # Painel administrativo
├── script.js           # Lógica do frontend
├── style.css           # Estilos (tema MMORPG dark)
├── supabase/
│   └── migrations/     # Migrations do banco de dados
└── README.md           # Este arquivo
```

## 🎨 Tema Visual

O sistema utiliza um tema dark MMORPG com:
- Cores inspiradas em interfaces de jogos
- Animações suaves
- Cards com efeitos de hover
- Status com cores semânticas

## 🔧 Configuração

### Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute as migrations na ordem:
   - `20260614013000_respawn_patrol_complete.sql`
   - `20260614020000_add_verification_status_and_images.sql`
3. Crie um bucket de storage chamado `verification-images` (público)
4. Atualize as credenciais no `script.js` e `admin.html`

### Storage Bucket

No painel do Supabase:
1. Vá em Storage
2. Crie um novo bucket: `verification-images`
3. Defina como público
4. Adicione políticas de acesso adequadas

## 📊 Pontos por Verificação

| Status | Pontos | Print Obrigatório |
|--------|--------|-------------------|
| Sem PT | +1 | Não |
| Com PT | +2 | Sim |
| Acabou PT | +2 | Sim |
| Matamos | +8 | Sim |
| Fraguei | +12 | Sim |

## 🛡️ Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Códigos de acesso para autenticação
- Validação de cooldown por hunt
- Upload de imagens com validação de tipo e tamanho

## 📝 Licença

Uso interno para guildas de Tibia.

---

Desenvolvido para a comunidade de Tibia �️