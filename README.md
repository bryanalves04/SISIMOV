# SISIMOV - Sistema de Movimentação de Militares

Sistema web para gerenciamento de movimentações e realocações de militares da Polícia Militar de Minas Gerais. O projeto ainda não está em produção, portanto roda localmente. Inicialmente este descritivo objetiva ensinar os membros do grupo a entenderem o projeto e aacessarem ele

## 📋 Sobre o Projeto

O SISIMOV é uma aplicação web que permite o controle de movimentações de militares entre diferentes batalhões de Minas Gerais. O sistema oferece funcionalidades distintas para cidadãos comuns, militares e comandantes, com interface intuitiva e fluxo de aprovação estruturado.
Esta solução é a resolução de um problema descrito no site https://simi.mg.gov.br/hub-mg-gov/ -- Pesquisar por "SISIMOV"

## Funcionalidades

### Cidadão comum
- **Visualização de dashboards**: Permite a qualquer pessoa visualizar a situação do efetivo policial no estado de minas gerais por município, batalhão e grau de criticidade de cada batalhão, além de ver o total de vagas disponível. As demais telas são de uso exclusivo para comandantes e militares, logo estes devem logar no sistema com suas credenciais.
   
### Para Militares
- **Visualização de Batalhões**: Consulta de batalhões com situação de efetivo e vagas disponíveis
- **Registro de Interesse**: Solicitação de realocação entre batalhões
- **Filtros Avançados**: Busca por município e batalhão
- **Logout**: O usuário pode se deslogar de sua sessão

### Para Comandantes
- **Painel de Movimentações**: Visualização de todas as solicitações pendentes
- **Aprovação/Rejeição**: Controle total sobre as movimentações
- **Cadastro de Movimentações**: Registro direto de movimentações
- **Logout**: O usuário pode se deslogar de sua sessão

### Geral
- **Dashboard Executivo**: Estatísticas por cidade e situação de efetivo
- **Sistema de Login**: Autenticação com perfis diferenciados
- **Interface Responsiva**: Compatível com desktop e mobile


## 📂 Estrutura do Projeto

```
SISIMOV_SOLUTION/
├── frontend/
│   └── Eng_SW_SISIMOV/
│       ├── src/
│       │   ├── components/
│       │   │   └── filtro/          # Componente de filtros
│       │   ├── pages/
│       │   │   ├── dashboard/       # Painel principal
│       │   │   ├── militares/       # Tela de militares
│       │   │   ├── movimentacoes/   # Tela de movimentações
│       │   │   └── login/           # Tela de autenticação
│       │   ├── localidades.ts       # Dados de MG (municípios/batalhões)
│       │   └── App.tsx              # Componente principal
│       ├── package.json
│       └── vite.config.ts
└── backend/
    ├── index.js                     # Servidor Express
    ├── sisimov.db                   # Banco SQLite (gerado automaticamente)
    └── package.json
```

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd SISIMOV_SOLUTION
```

### 2. Configuração do Backend
```bash
vá para raiz do projeto com cd .. até chegar em SISIMOV_SOLUTION
cd backend - pasta do backend
node index.js -- roda o back
```
O servidor estará disponível em `http://localhost:3001`

### 3. Configuração do Frontend
```bash
vá para raiz do projeto com cd .. até chegar em SISIMOV_SOLUTION
cd frontend/Eng_SW_SISIMOV
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`


### Fluxo para Militares

1. **Login como militar** → Redirecionamento para tela de Militares
2. **Visualize batalhões** disponíveis com vagas e situação - o sistema também permite pesquisa por municipio e batalhão
3. **Registre interesse** preenchendo:
   - CPF
   - Nome
   - Batalhão de origem
   - Batalhão de destino
4. **Confirme o cadastro** e aguarde aprovação
5. **Fazer logout** 

### Fluxo para Comandantes

1. **Login como comandante** → Redirecionamento para tela de Movimentações
2. **Visualize solicitações** pendentes
3. **Aprove ou rejeite** movimentações
4. **Fazer Logout**

O sistema contempla os seguintes municípios de Minas Gerais:

- **Belo Horizonte**: 1º BPM, 2º BPM, 3º BPM
- **Betim**: 4º BPM, 5º BPM
- **Contagem**: 6º BPM, 7º BPM
- **Ibirité**: 8º BPM
- **Neves**: 9º BPM
- **Dores do Indaiá**: 14º BPM (40 vagas - Situação Crítica)

### Situações de Efetivo
- **Abaixo**: 10 vagas disponíveis
- **Estável**: 5 vagas disponíveis  
- **Excedente**: 0 vagas disponíveis

## 🗄️ Banco de Dados

### Estrutura da Tabela `movimentacoes`
```sql
CREATE TABLE movimentacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cpf TEXT,
  nome TEXT,
  origem TEXT,  -- JSON: {municipioId, batalhaoId}
  destino TEXT, -- JSON: {municipioId, batalhaoId}
  data TEXT,
  status TEXT   -- 'Pendente', 'Aprovada', 'Rejeitada'
);
```

### Componentes
- **Cards**: Bordas arredondadas, sombras suaves
- **Botões**: Estados hover, cores temáticas
- **Tabelas**: Zebrada, responsiva
- **Modais**: Backdrop, animações

## 🔐 Autenticação

O sistema usa localStorage para manter a sessão:
- `auth`: Token de autenticação
- `usuario`: Tipo de usuário (militar/comandante) -- Usuario Default para mostrar funcionalidades de redirecionamento de tela e acesso exclusivo por usuário, de acordo com sua permissão


## Desenvolvimento

### Estrutura de Componentes
- **Reutilizáveis**: Filtros, botões, modais
- **Específicos**: Formulários de cada tela
- **Layout**: Header, navigation, containers

### Padrões de Código
- **TypeScript**: Tipagem forte
- **Hooks**: useState, useEffect
- **Fetch API**: Comunicação com backend
- **CSS Modules**: Estilização modular

## Monitoramento

### Logs Backend
- Requisições HTTP registradas
- Erros de banco capturados
- Status de operações CRUD

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request


## 👨‍💻 Autores

- **Bryan Felipe** - Desenvolvimento Full Stack
- **João Pedro da Silva Alves** - Diagramação UML e definição de pré requisitos + casos de uso
- **Gabriel Jovenal de Paula** - Diagramação UML e definição de pré requisitos + casos de uso

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma issue no repositório
---

**SISIMOV** - Sistema de Movimentação de Militares
