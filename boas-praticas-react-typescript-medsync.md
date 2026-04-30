# Boas Práticas de Código — React + TypeScript para o MedSync

> Guia de padrões técnicos para desenvolvimento do frontend do projeto **MedSync**, uma aplicação administrativa para clínicas médicas, com telas de login, dashboard, pacientes, consultas, calendário, prontuário, histórico clínico e usuários por perfil.

---

## 1. Objetivo deste documento

Este documento define as boas práticas que devem ser seguidas no frontend do projeto usando **React com TypeScript**.

O foco é garantir que o código seja:

- organizado;
- legível;
- fácil de manter;
- fácil de explicar na apresentação;
- coerente com o domínio do sistema;
- preparado para futura integração com backend REST e JWT;
- adequado à primeira entrega, que será apenas frontend estático/visual.
- use tudo mockado rodando local
---

## 2. Contexto do projeto

O MedSync é um sistema administrativo para clínicas pequenas e médias. Ele será usado por funcionários, principalmente:

- recepcionistas;
- médicos;
- administradores.

O sistema precisa representar visualmente as seguintes áreas:

- autenticação;
- dashboard;
- cadastro e busca de pacientes;
- agendamento de consultas;
- calendário semanal de consultas;
- prontuário eletrônico;
- registro de atendimento;
- histórico clínico;
- cadastro e gerenciamento de usuários;
- controle visual de acesso por perfil.

Para a primeira entrega, o frontend deve ser estático, sem conexão real com backend. Mesmo assim, a estrutura deve ser pensada para facilitar uma futura integração com API REST.

---

## 3. Stack recomendada

### 3.1. Base do projeto

Usar:

- **React** para construção da interface;
- **TypeScript** para tipagem estática;
- **Vite** para criação e build do projeto;
- **React Router** para rotas;
- **React Hook Form** para formulários;
- **Zod** para validação de schemas;
- **Tailwind CSS** para estilização, caso a equipe queira produtividade visual;
- **ESLint + Prettier** para padronização;
- **Vitest + React Testing Library**, se a equipe decidir adicionar testes.

### 3.2. Regra principal

Mesmo que o projeto seja estático no início, ele deve ser organizado como se fosse consumir uma API real depois.

Isso evita refatorações grandes quando o backend REST estiver pronto.

---

## 4. Organização de pastas

Uma estrutura simples e escalável para o projeto:

```txt
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
│
├── assets/
│   └── images/
│
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── PageContainer.tsx
│   │
│   └── feedback/
│       ├── LoadingState.tsx
│       └── ErrorMessage.tsx
│
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   │   └── LoginPage.tsx
│   │   ├── components/
│   │   ├── types.ts
│   │   └── mock.ts
│   │
│   ├── dashboard/
│   │   ├── pages/
│   │   │   └── DashboardPage.tsx
│   │   ├── components/
│   │   └── mock.ts
│   │
│   ├── patients/
│   │   ├── pages/
│   │   │   ├── PatientListPage.tsx
│   │   │   └── PatientFormPage.tsx
│   │   ├── components/
│   │   ├── schemas.ts
│   │   ├── types.ts
│   │   └── mock.ts
│   │
│   ├── appointments/
│   │   ├── pages/
│   │   │   ├── AppointmentListPage.tsx
│   │   │   ├── AppointmentFormPage.tsx
│   │   │   └── CalendarPage.tsx
│   │   ├── components/
│   │   ├── schemas.ts
│   │   ├── types.ts
│   │   └── mock.ts
│   │
│   ├── medical-records/
│   │   ├── pages/
│   │   │   ├── MedicalRecordPage.tsx
│   │   │   └── ClinicalHistoryPage.tsx
│   │   ├── components/
│   │   ├── schemas.ts
│   │   ├── types.ts
│   │   └── mock.ts
│   │
│   └── users/
│       ├── pages/
│       │   ├── UserListPage.tsx
│       │   └── UserFormPage.tsx
│       ├── components/
│       ├── schemas.ts
│       ├── types.ts
│       └── mock.ts
│
├── hooks/
│   ├── useDebounce.ts
│   └── useDisclosure.ts
│
├── lib/
│   ├── cn.ts
│   ├── date.ts
│   ├── cpf.ts
│   └── formatters.ts
│
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── patient.service.ts
│   ├── appointment.service.ts
│   └── user.service.ts
│
├── store/
│   └── auth.store.ts
│
├── styles/
│   └── globals.css
│
├── types/
│   ├── role.ts
│   └── shared.ts
│
└── main.tsx
```

### 4.1. Por que separar por `features`?

Cada área do sistema fica isolada:

- `patients` cuida apenas de pacientes;
- `appointments` cuida apenas de consultas e calendário;
- `medical-records` cuida apenas de prontuários;
- `users` cuida apenas de usuários.

Isso evita que o projeto vire uma pasta gigante de componentes soltos.

---

## 5. Convenções de nomes

### 5.1. Arquivos de componentes

Usar **PascalCase**:

```txt
PatientForm.tsx
AppointmentCalendar.tsx
MedicalRecordTimeline.tsx
DashboardMetricCard.tsx
```

### 5.2. Arquivos utilitários, hooks e schemas

Usar **camelCase** ou nomes diretos por contexto:

```txt
useDebounce.ts
formatters.ts
schemas.ts
mock.ts
cpf.ts
```

### 5.3. Variáveis e funções

Usar **camelCase**:

```ts
const patientName = "Maria Souza";
const appointmentStatus = "scheduled";

function formatCpf(value: string) {
  return value;
}
```

### 5.4. Tipos, interfaces e enums

Usar **PascalCase**:

```ts
type Patient = {
  id: string;
  fullName: string;
  cpf: string;
};

enum UserRole {
  Admin = "admin",
  Doctor = "doctor",
  Receptionist = "receptionist",
}
```

### 5.5. Evitar nomes genéricos

Evitar:

```txt
Data.tsx
Table.tsx
Form.tsx
Page.tsx
Card.tsx
```

Preferir:

```txt
PatientTable.tsx
AppointmentForm.tsx
DashboardPage.tsx
MetricCard.tsx
MedicalRecordCard.tsx
```

---

## 6. Modelagem de tipos do domínio

Criar tipos que representem claramente as entidades do sistema.

### 6.1. Usuário

```ts
export type UserRole = "admin" | "doctor" | "receptionist";

export type User = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};
```

### 6.2. Paciente

```ts
export type Patient = {
  id: string;
  fullName: string;
  birthDate: string;
  cpf: string;
  phone: string;
  healthInsurance?: string;
  createdAt: string;
  updatedAt: string;
};
```

### 6.3. Médico

```ts
export type Doctor = {
  id: string;
  name: string;
  crm?: string;
  specialty?: string;
  email: string;
};
```

### 6.4. Consulta

```ts
export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
};
```

### 6.5. Prontuário

```ts
export type MedicalRecord = {
  id: string;
  patientId: string;
  appointmentId: string;
  mainComplaint: string;
  diagnosis: string;
  prescription: string;
  observations?: string;
  createdAt: string;
};
```

### 6.6. Regra importante

Não usar `any`.

Se o tipo ainda não estiver claro, usar `unknown` temporariamente e fazer validação/narrowing antes de acessar os dados.

```ts
function handleUnknownError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado.";
}
```

---

## 7. Componentização

### 7.1. Cada componente deve ter uma responsabilidade clara

Um componente deve fazer uma coisa principal.

Bom exemplo:

```tsx
type MetricCardProps = {
  title: string;
  value: string | number;
  description?: string;
};

export function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <section>
      <h3>{title}</h3>
      <strong>{value}</strong>
      {description && <p>{description}</p>}
    </section>
  );
}
```

Ruim:

```tsx
export function Dashboard() {
  // Busca dados, renderiza layout inteiro, contém tabela,
  // contém modal, valida formulário e controla autenticação.
}
```

### 7.2. Separar componentes de tela e componentes reutilizáveis

Componentes de página ficam em:

```txt
features/patients/pages/PatientListPage.tsx
```

Componentes menores ficam em:

```txt
features/patients/components/PatientTable.tsx
features/patients/components/PatientSearchInput.tsx
```

### 7.3. Evitar componentes gigantes

Se um componente passar de aproximadamente 150 a 200 linhas, verificar se ele pode ser quebrado em partes menores.

Exemplo:

```txt
AppointmentForm.tsx
├── PatientSelect.tsx
├── DoctorSelect.tsx
├── DateTimeFields.tsx
└── AppointmentStatusBadge.tsx
```

---

## 8. Props bem tipadas

Sempre criar um tipo para as props.

```tsx
type PatientCardProps = {
  patient: Patient;
  onEdit?: (patient: Patient) => void;
};

export function PatientCard({ patient, onEdit }: PatientCardProps) {
  return (
    <article>
      <h3>{patient.fullName}</h3>
      <p>{patient.cpf}</p>
      {onEdit && <button onClick={() => onEdit(patient)}>Editar</button>}
    </article>
  );
}
```

Evitar:

```tsx
export function PatientCard(props: any) {
  return <div>{props.patient.name}</div>;
}
```

---

## 9. Estado local

### 9.1. Usar estado local para UI simples

Exemplos:

- abrir/fechar modal;
- texto de busca;
- aba ativa;
- filtros visuais;
- seleção de data no calendário.

```tsx
const [searchTerm, setSearchTerm] = useState("");
const [isModalOpen, setIsModalOpen] = useState(false);
```

### 9.2. Não colocar tudo em estado global

Evitar estado global para coisas que só uma tela usa.

Exemplo: o termo de busca da listagem de pacientes não precisa ir para store global.

---

## 10. Estado global

Usar estado global apenas para informações realmente compartilhadas, como:

- usuário autenticado;
- perfil atual;
- token JWT no futuro;
- preferências gerais do layout.

Exemplo simples:

```ts
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};
```

Para a primeira entrega estática, pode-se simular o usuário logado.

```ts
export const currentMockUser: User = {
  id: "1",
  name: "Dra. Ana Martins",
  email: "ana@medsync.com",
  cpf: "123.456.789-00",
  role: "doctor",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};
```

---

## 11. Controle de acesso no frontend

O controle visual deve esconder telas e ações conforme o perfil.

### 11.1. Papéis do sistema

```ts
export type UserRole = "admin" | "doctor" | "receptionist";
```

### 11.2. Mapa de permissões

```ts
export const permissions = {
  dashboard: ["admin", "doctor", "receptionist"],
  patientCreate: ["admin", "receptionist"],
  patientList: ["admin", "doctor", "receptionist"],
  appointmentCreate: ["admin", "receptionist"],
  appointmentCalendar: ["admin", "doctor", "receptionist"],
  medicalRecordView: ["admin", "doctor"],
  medicalRecordCreate: ["admin", "doctor"],
  userManagement: ["admin"],
} as const;
```

### 11.3. Função de verificação

```ts
export function canAccess(
  userRole: UserRole,
  allowedRoles: readonly UserRole[],
) {
  return allowedRoles.includes(userRole);
}
```

### 11.4. Uso na sidebar

```tsx
{canAccess(user.role, permissions.userManagement) && (
  <SidebarItem to="/users">Usuários</SidebarItem>
)}
```

### 11.5. Observação importante

O controle no frontend melhora a experiência, mas não substitui a validação do backend.

Na fase com backend, as rotas protegidas devem ser bloqueadas no servidor também.

---

## 12. Rotas

### 12.1. Sugestão de rotas

```txt
/login
/dashboard
/patients
/patients/new
/patients/:patientId/edit
/appointments
/appointments/new
/calendar
/medical-records/:patientId
/medical-records/:patientId/history
/users
/users/new
/users/:userId/edit
```

### 12.2. Separar definição de rotas

Evitar deixar todas as rotas dentro de `App.tsx` se o projeto crescer.

Criar:

```txt
src/app/routes.tsx
```

Exemplo:

```tsx
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientListPage />} />
        <Route path="/appointments" element={<AppointmentListPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/users" element={<UserListPage />} />
      </Route>
    </Routes>
  );
}
```

---

## 13. Layout

### 13.1. Criar um layout administrativo padrão

O sistema deve parecer uma ferramenta interna profissional.

Layout recomendado:

- sidebar lateral;
- header/topbar;
- área principal com título da página;
- cards e tabelas bem espaçados;
- ações principais no canto superior da página.

Exemplo de estrutura:

```tsx
export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="pl-64">
        <Header />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
    </div>
  );
}
```

### 13.2. Consistência visual

Manter padrões para:

- tamanho dos títulos;
- espaçamento entre seções;
- largura de formulários;
- estilo de botões;
- estilo de tabelas;
- cores de status.

---

## 14. Formulários

### 14.1. Usar schemas para validação

Mesmo sem backend, os formulários devem validar dados.

Exemplo para paciente:

```ts
import { z } from "zod";

export const patientSchema = z.object({
  fullName: z.string().min(3, "Informe o nome completo."),
  birthDate: z.string().min(1, "Informe a data de nascimento."),
  cpf: z.string().min(11, "Informe um CPF válido."),
  phone: z.string().min(10, "Informe um telefone válido."),
  healthInsurance: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
```

### 14.2. Mensagens claras

Evitar mensagens genéricas como:

```txt
Erro no campo.
```

Preferir:

```txt
Informe o CPF do paciente.
Este CPF já está cadastrado.
Selecione um médico para a consulta.
Este médico já possui consulta nesse horário.
```

### 14.3. Separar dados de formulário do tipo da entidade

O tipo do formulário nem sempre é igual ao tipo salvo.

```ts
export type PatientFormData = {
  fullName: string;
  birthDate: string;
  cpf: string;
  phone: string;
  healthInsurance?: string;
};
```

```ts
export type Patient = PatientFormData & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
```

---

## 15. Tabelas e listagens

### 15.1. Listagens devem ter estados claros

Toda listagem deve prever:

- estado com dados;
- estado vazio;
- estado de carregamento futuro;
- estado de erro futuro.

Exemplo:

```tsx
if (patients.length === 0) {
  return (
    <EmptyState
      title="Nenhum paciente encontrado"
      description="Cadastre um novo paciente ou ajuste os filtros de busca."
    />
  );
}
```

### 15.2. Ações devem ser explícitas

Em tabelas, usar ações claras:

- Ver detalhes;
- Editar;
- Agendar consulta;
- Ver prontuário;
- Cancelar consulta.

Evitar botões sem texto quando a equipe ainda não tem padronização forte de ícones.

---

## 16. Mocks e dados estáticos

### 16.1. Mocks devem ficar separados da tela

Evitar criar arrays grandes dentro do componente.

Ruim:

```tsx
export function PatientListPage() {
  const patients = [
    { id: "1", fullName: "Maria Souza" },
    { id: "2", fullName: "João Lima" },
  ];

  return <div>...</div>;
}
```

Bom:

```txt
features/patients/mock.ts
```

```ts
export const patientsMock: Patient[] = [
  {
    id: "1",
    fullName: "Maria Souza",
    birthDate: "1990-04-12",
    cpf: "123.456.789-00",
    phone: "(83) 99999-0000",
    healthInsurance: "Unimed",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
];
```

### 16.2. Mocks devem simular casos reais

Criar dados que permitam demonstrar:

- paciente com convênio;
- paciente sem convênio;
- consulta agendada;
- consulta realizada;
- consulta cancelada;
- médico com agenda cheia;
- paciente com histórico clínico;
- usuário admin;
- usuário médico;
- usuário recepcionista.

---

## 17. Serviços preparados para REST

Mesmo sem backend, a estrutura de serviços pode ser criada.

```txt
services/patient.service.ts
```

```ts
import { patientsMock } from "@/features/patients/mock";

export async function getPatients() {
  return Promise.resolve(patientsMock);
}
```

No futuro, a implementação muda para:

```ts
export async function getPatients() {
  const response = await api.get<Patient[]>("/patients");
  return response.data;
}
```

Assim, as telas não precisam saber se os dados vêm de mock ou API real.

---

## 18. API client futuro

Preparar uma camada central para HTTP.

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

Para a primeira entrega, esse arquivo pode existir sem ser usado, ou ser substituído por mocks.

---

## 19. Datas e horários

### 19.1. Padronizar formato interno

Usar strings ISO internamente:

```ts
const date = "2026-05-20";
const time = "14:30";
```

### 19.2. Criar funções de formatação

```ts
export function formatDateToBr(date: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}
```

### 19.3. Evitar lógica de data espalhada

Não repetir formatações em várias telas.

Centralizar em:

```txt
src/lib/date.ts
```

---

## 20. CPF e telefone

### 20.1. Centralizar formatação

Criar funções em:

```txt
src/lib/cpf.ts
src/lib/formatters.ts
```

Exemplo:

```ts
export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}
```

### 20.2. Não salvar apenas o valor formatado

Para integração futura, pode ser melhor enviar CPF sem máscara para o backend.

Exemplo:

```ts
const cleanCpf = onlyDigits(formData.cpf);
```

---

## 21. Dashboard

### 21.1. Separar cards de métricas

Criar componente reutilizável:

```txt
features/dashboard/components/DashboardMetricCard.tsx
```

```tsx
type DashboardMetricCardProps = {
  title: string;
  value: number | string;
  description?: string;
};

export function DashboardMetricCard({
  title,
  value,
  description,
}: DashboardMetricCardProps) {
  return (
    <section>
      <p>{title}</p>
      <strong>{value}</strong>
      {description && <span>{description}</span>}
    </section>
  );
}
```

### 21.2. Métricas por perfil

Recepcionista:

- consultas agendadas hoje;
- total de pacientes cadastrados;
- próximos horários do dia.

Médico:

- consultas realizadas no mês;
- próximos atendimentos do dia;
- pacientes recentes.

Admin:

- total de usuários;
- total de pacientes;
- total de consultas;
- visão geral do sistema.

---

## 22. Calendário de consultas

### 22.1. Manter o calendário simples na primeira entrega

Para a primeira fase, não é necessário criar um calendário extremamente complexo.

Uma boa solução visual:

- coluna por dia da semana;
- cards de consulta dentro de cada dia;
- horário visível;
- nome do paciente;
- nome do médico;
- status da consulta.

### 22.2. Criar tipo específico para agrupamento

```ts
export type AppointmentsByDate = Record<string, Appointment[]>;
```

### 22.3. Evitar lógica pesada direto no JSX

Ruim:

```tsx
{appointments
  .filter((appointment) => appointment.date === selectedDate)
  .sort((a, b) => a.time.localeCompare(b.time))
  .map((appointment) => ...)}
```

Melhor:

```ts
const selectedDayAppointments = getAppointmentsByDate(
  appointments,
  selectedDate,
);
```

---

## 23. Prontuário eletrônico

### 23.1. Tratar prontuário como área sensível

Mesmo na entrega visual, a interface deve deixar claro que prontuário é informação clínica.

Boas práticas visuais:

- layout limpo;
- histórico em linha do tempo;
- separação entre queixa, diagnóstico, prescrição e observações;
- destaque para data e médico responsável;
- evitar excesso de cores chamativas.

### 23.2. Separar componentes

```txt
MedicalRecordPage.tsx
├── PatientSummaryCard.tsx
├── MedicalRecordForm.tsx
├── ClinicalHistoryTimeline.tsx
└── ClinicalHistoryItem.tsx
```

### 23.3. Evitar misturar formulário e histórico no mesmo componente

O registro atual e o histórico anterior devem ser componentes separados.

---

## 24. Status e badges

### 24.1. Centralizar labels

```ts
export const appointmentStatusLabel = {
  scheduled: "Agendada",
  completed: "Realizada",
  cancelled: "Cancelada",
} as const;
```

### 24.2. Centralizar estilos

```ts
export const appointmentStatusVariant = {
  scheduled: "info",
  completed: "success",
  cancelled: "danger",
} as const;
```

### 24.3. Evitar strings soltas

Ruim:

```tsx
{appointment.status === "scheduled" && <span>Agendada</span>}
```

Bom:

```tsx
<StatusBadge variant={appointmentStatusVariant[appointment.status]}>
  {appointmentStatusLabel[appointment.status]}
</StatusBadge>
```

---

## 25. Hooks

### 25.1. Criar hooks apenas quando houver reutilização real

Não criar hook para tudo.

Bons exemplos:

```txt
useDisclosure.ts
useDebounce.ts
useCurrentUser.ts
usePermissions.ts
```

### 25.2. Hooks devem começar com `use`

```ts
export function useDisclosure(initialValue = false) {
  const [isOpen, setIsOpen] = useState(initialValue);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((value) => !value),
  };
}
```

### 25.3. Não chamar hooks condicionalmente

Ruim:

```tsx
if (user.role === "admin") {
  const [isOpen, setIsOpen] = useState(false);
}
```

Bom:

```tsx
const [isOpen, setIsOpen] = useState(false);

if (user.role !== "admin") {
  return null;
}
```

---

## 26. Renderização condicional

### 26.1. Preferir condições legíveis

```tsx
const canManageUsers = user.role === "admin";

return (
  <>{canManageUsers && <Button>Novo usuário</Button>}</>
);
```

Evitar lógica complexa dentro do JSX:

```tsx
{user && user.role === "admin" && status !== "blocked" && !loading && (...) }
```

Quando a condição crescer, criar uma variável ou função.

---

## 27. Imports

### 27.1. Organizar imports

Ordem recomendada:

```ts
// Bibliotecas externas
import { useState } from "react";
import { Link } from "react-router-dom";

// Componentes internos
import { Button } from "@/components/common/Button";

// Tipos e utilitários
import type { Patient } from "../types";
import { formatCpf } from "@/lib/cpf";
```

### 27.2. Usar `import type`

Quando importar apenas tipos:

```ts
import type { Patient } from "./types";
```

Isso deixa mais claro o que é usado em runtime e o que é apenas tipagem.

---

## 28. Alias de importação

Configurar alias para evitar imports longos.

Exemplo:

```ts
import { Button } from "@/components/common/Button";
```

Em vez de:

```ts
import { Button } from "../../../components/common/Button";
```

---

## 29. Estilização

### 29.1. Manter consistência

Definir padrões para:

- cores principais;
- cores de erro/sucesso/alerta;
- espaçamento;
- bordas;
- sombras;
- tamanho de fonte;
- largura máxima de conteúdo.

### 29.2. Evitar CSS duplicado

Se um padrão aparece em várias telas, criar componente.

Exemplo:

```tsx
<PageHeader
  title="Pacientes"
  description="Cadastre, edite e encontre pacientes rapidamente."
  action={<Button>Novo paciente</Button>}
/>
```

### 29.3. Cuidado com classes gigantes

Se um elemento tiver muitas classes, considerar criar um componente reutilizável ou uma função de variantes.

---

## 30. Acessibilidade

### 30.1. Usar HTML semântico

Preferir:

```tsx
<main>
  <section>
    <h1>Dashboard</h1>
  </section>
</main>
```

Evitar usar `div` para tudo.

### 30.2. Labels em formulários

Todo input deve ter label.

```tsx
<label htmlFor="cpf">CPF</label>
<input id="cpf" name="cpf" />
```

### 30.3. Botões com texto claro

Evitar botão só com ícone sem label acessível.

```tsx
<button aria-label="Editar paciente">
  <PencilIcon />
</button>
```

### 30.4. Estados de erro acessíveis

```tsx
<input aria-invalid={!!errors.cpf} aria-describedby="cpf-error" />
{errors.cpf && <p id="cpf-error">{errors.cpf.message}</p>}
```

---

## 31. Tratamento de erros

Mesmo no frontend estático, preparar mensagens para erros futuros.

Exemplos:

- CPF duplicado;
- consulta em horário conflitante;
- usuário sem permissão;
- paciente não encontrado;
- falha ao carregar agenda;
- formulário inválido.

Criar componente:

```txt
components/feedback/ErrorMessage.tsx
```

```tsx
type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <p role="alert">{message}</p>;
}
```

---

## 32. Loading e empty states

### 32.1. Preparar estados mesmo com mock

Exemplo:

```tsx
if (isLoading) {
  return <LoadingState message="Carregando pacientes..." />;
}

if (patients.length === 0) {
  return (
    <EmptyState
      title="Nenhum paciente cadastrado"
      description="Cadastre o primeiro paciente para começar."
    />
  );
}
```

Isso facilita integração futura.

---

## 33. Segurança no frontend

### 33.1. Não confiar apenas no frontend

O frontend pode esconder telas, mas o backend deve validar permissões de verdade.

### 33.2. Não deixar dados sensíveis em mocks públicos demais

Como o projeto é acadêmico, os dados podem ser fictícios. Não usar dados reais de pacientes.

### 33.3. JWT no futuro

Quando houver backend:

- armazenar token com cuidado;
- limpar token no logout;
- redirecionar para login em caso de expiração;
- não exibir telas protegidas sem autenticação;
- não colocar segredos no frontend.

### 33.4. Variáveis de ambiente

Usar prefixo do Vite:

```env
VITE_API_URL=http://localhost:8080
```

Nunca colocar senhas, chaves privadas ou segredos reais em variáveis expostas ao frontend.

---

## 34. Performance

### 34.1. Evitar renderizações desnecessárias

Não criar objetos ou arrays complexos dentro do JSX sem necessidade.

### 34.2. Usar `useMemo` apenas quando necessário

Não usar `useMemo` em tudo.

Usar quando houver cálculo derivado relevante, como agrupamento do calendário.

```tsx
const appointmentsByDate = useMemo(() => {
  return groupAppointmentsByDate(appointments);
}, [appointments]);
```

### 34.3. Paginar ou limitar tabelas grandes no futuro

Para muitos pacientes, não carregar tudo em uma tabela infinita.

Na primeira entrega, pode-se simular paginação visual.

---

## 35. Código limpo

### 35.1. Funções pequenas

Preferir funções pequenas e específicas.

```ts
function isAppointmentConflict(
  appointments: Appointment[],
  doctorId: string,
  date: string,
  time: string,
) {
  return appointments.some(
    (appointment) =>
      appointment.doctorId === doctorId &&
      appointment.date === date &&
      appointment.time === time &&
      appointment.status !== "cancelled",
  );
}
```

### 35.2. Evitar comentários óbvios

Ruim:

```ts
// incrementa contador
setCount(count + 1);
```

Bom comentário:

```ts
// Consultas canceladas não bloqueiam o horário para novo agendamento.
```

### 35.3. Evitar código morto

Remover:

- `console.log` esquecidos;
- componentes não usados;
- imports não usados;
- arquivos duplicados;
- comentários antigos.

---

## 36. Validações específicas do projeto

### 36.1. Pacientes

Validar:

- nome obrigatório;
- data de nascimento obrigatória;
- CPF obrigatório;
- CPF não duplicado;
- telefone obrigatório;
- convênio opcional.

### 36.2. Consultas

Validar:

- paciente selecionado;
- médico selecionado;
- data selecionada;
- horário selecionado;
- conflito de horário para o mesmo médico;
- status válido.

### 36.3. Prontuário

Validar:

- queixa principal obrigatória;
- diagnóstico obrigatório;
- prescrição obrigatória ou explicitamente “sem prescrição”; 
- observações opcionais.

### 36.4. Usuários

Validar:

- nome obrigatório;
- e-mail válido;
- CPF obrigatório;
- senha obrigatória no cadastro;
- papel obrigatório;
- admin como único perfil com acesso ao CRUD de usuários.

---

## 37. Separação entre regra de negócio e interface

A tela não deve conter toda a regra de negócio.

Ruim:

```tsx
export function AppointmentFormPage() {
  function handleSubmit() {
    const hasConflict = appointments.some(...);
    // várias regras aqui dentro
  }
}
```

Melhor:

```txt
features/appointments/utils/appointmentRules.ts
```

```ts
export function hasDoctorScheduleConflict(params: {
  appointments: Appointment[];
  doctorId: string;
  date: string;
  time: string;
}) {
  return params.appointments.some(
    (appointment) =>
      appointment.doctorId === params.doctorId &&
      appointment.date === params.date &&
      appointment.time === params.time &&
      appointment.status !== "cancelled",
  );
}
```

---

## 38. Checklist por tela

### 38.1. Login

- [ ] Campos de e-mail e senha.
- [ ] Validação visual dos campos.
- [ ] Botão de entrar.
- [ ] Simulação de login por perfil.
- [ ] Redirecionamento visual para dashboard.

### 38.2. Dashboard

- [ ] Cards de métricas.
- [ ] Métricas diferentes por perfil.
- [ ] Próximas consultas do dia.
- [ ] Layout limpo e administrativo.

### 38.3. Pacientes

- [ ] Listagem de pacientes.
- [ ] Busca por nome ou CPF.
- [ ] Formulário de cadastro.
- [ ] Formulário de edição.
- [ ] Estado vazio.
- [ ] Validação de CPF duplicado simulada.

### 38.4. Consultas

- [ ] Listagem de consultas.
- [ ] Cadastro de consulta.
- [ ] Seleção de paciente.
- [ ] Seleção de médico.
- [ ] Data e horário.
- [ ] Status da consulta.
- [ ] Simulação de conflito de horário.

### 38.5. Calendário

- [ ] Visualização semanal.
- [ ] Consultas agrupadas por dia.
- [ ] Horário visível.
- [ ] Paciente e médico visíveis.
- [ ] Badge de status.

### 38.6. Prontuário

- [ ] Resumo do paciente.
- [ ] Registro de atendimento.
- [ ] Queixa principal.
- [ ] Diagnóstico.
- [ ] Prescrição.
- [ ] Observações.
- [ ] Histórico clínico em timeline.

### 38.7. Usuários

- [ ] Listagem de usuários.
- [ ] Cadastro de usuário.
- [ ] Edição de usuário.
- [ ] Remoção visual ou simulação.
- [ ] Acesso apenas para admin.

---

## 39. Qualidade com ESLint e Prettier

### 39.1. Instalar ferramentas de padronização

Recomendado usar:

```bash
npm install -D eslint prettier eslint-config-prettier
```

### 39.2. Regras recomendadas

- não permitir variáveis não usadas;
- não permitir imports não usados;
- preferir `const` quando possível;
- evitar `any`;
- manter formatação automática;
- ordenar imports, se a equipe configurar plugin para isso.

### 39.3. Scripts úteis

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

---

## 40. Commits e organização em equipe

### 40.1. Commits claros

Exemplos:

```txt
feat: add patient list page
feat: create appointment calendar layout
feat: add role-based sidebar visibility
fix: adjust patient form validation
refactor: extract dashboard metric card
style: improve login page spacing
```

### 40.2. Evitar commits gigantes

Separar por funcionalidade:

- uma tela;
- um componente;
- uma correção;
- uma refatoração.

### 40.3. Divisão sugerida de tarefas

Pessoa 1:

- layout base;
- sidebar;
- rotas;
- login.

Pessoa 2:

- pacientes;
- busca;
- formulário.

Pessoa 3:

- consultas;
- calendário;
- conflito de horário simulado.

Pessoa 4:

- prontuário;
- histórico;
- dashboard.

Pessoa 5, se houver:

- usuários;
- permissões;
- refinamento visual;
- revisão geral.

---

## 41. Padrões para apresentação do projeto

Durante a apresentação, a equipe deve conseguir explicar:

- onde ficam as rotas;
- onde ficam os componentes reutilizáveis;
- onde ficam os mocks;
- como os perfis escondem/mostram telas;
- como seria feita a integração futura com backend;
- como a validação de conflito de horário seria feita no backend;
- como o prontuário está vinculado a paciente e consulta;
- por que o projeto foi separado por features.

---

## 42. Coisas que devem ser evitadas

Evitar:

- colocar todas as telas dentro de `App.tsx`;
- usar `any` em tudo;
- criar um único arquivo gigante de mocks;
- repetir o mesmo card em várias páginas sem componente;
- misturar regra de negócio com JSX;
- usar nomes genéricos;
- deixar imports quebrados;
- usar dados reais de pacientes;
- criar tela de paciente final, pois o sistema é administrativo;
- deixar botões que não parecem clicáveis;
- esconder telas só visualmente sem planejar proteção no backend;
- deixar código sem padrão de formatação;
- fazer a sidebar diferente em cada tela;
- criar componentes sem tipar props.

---

## 43. Checklist final antes da entrega

- [ ] O projeto roda com `npm run dev`.
- [ ] O projeto faz build com `npm run build`.
- [ ] Não há imports quebrados.
- [ ] Não há erros de TypeScript.
- [ ] As rotas principais funcionam.
- [ ] A sidebar respeita o perfil simulado.
- [ ] As telas exigidas existem.
- [ ] O layout está consistente.
- [ ] Os formulários têm validação visual.
- [ ] Os mocks estão separados das telas.
- [ ] Os componentes possuem props tipadas.
- [ ] O código está formatado.
- [ ] O repositório tem README explicando como rodar.
- [ ] O README informa os perfis simulados.
- [ ] O link do GitHub está pronto para envio no Canvas.

---

## 44. README mínimo recomendado

O repositório deve ter um `README.md` com:

```md
# MedSync Frontend

Sistema administrativo para clínicas médicas, desenvolvido em React + TypeScript.

## Tecnologias

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS

## Como rodar

npm install
npm run dev

## Perfis simulados

- Admin: acesso total
- Médico: pacientes, consultas, calendário, prontuário e histórico clínico
- Recepcionista: dashboard, pacientes, agendamento e calendário

## Funcionalidades da primeira entrega

- Login visual
- Dashboard
- Cadastro e busca de pacientes
- Agendamento de consultas
- Calendário semanal
- Prontuário eletrônico
- Histórico clínico
- Gerenciamento de usuários para admin
```

---

## 45. Conclusão

O objetivo é construir um frontend simples, bem organizado e fácil de apresentar, mas com estrutura profissional o suficiente para evoluir para uma aplicação real integrada com backend REST.

A prioridade não deve ser criar complexidade desnecessária, e sim entregar uma interface clara, consistente, bem componentizada e fiel às regras do projeto MedSync.

