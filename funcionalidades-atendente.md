# Funcionalidades do Atendente (Recepcionista)

## Visão Geral

O atendente é a primeira visão do sistema a ser desenvolvida. Esta seção detalha todas as funcionalidades que o recepcionista poderá acessar no MedSync.

**Esta fase contempla apenas o frontend estático com dados mockados.** O sistema será desenvolvido para posteriormente ser integrado a um backend REST.

---

## 1. Autenticação e Login

### 1.1 Tela de Login (Frontend Apenas) X
- Campo para e-mail
- Campo para senha
- Botão de acesso ao sistema
- Tratamento de erros (credenciais incorretas, campos vazios)
- Redirecionamento para Dashboard após login bem-sucedido

### 1.2 Simulação de Autenticação X
- Simulação de token JWT (armazenado em localStorage/sessionStorage)
- Mock de perfil do usuário (recepcionista)
- Simulação de controle de acesso via código frontend
- Elementos visíveis controlados pelo perfil simulado

### 1.3 Dados Mockados para Login X
```
Usuário recepcionista:
- Email: recepcionista@medsync.com
- Senha:123456
```

---

## 2. Dashboard do Atendente [x]

### 2.1 Métricas do Dia (Dados Mockados) [x]
- Quantidade de consultas agendadas para hoje: 5
- Número de pacientes cadastrados no sistema: 12

### 2.2 Visualização [x]
- Cartões com números claros e objetivos
- Dados estáticos/mockados

---

## 3. Cadastro de Pacientes

### 3.1 Formulário de Cadastro
- Nome completo (obrigatório)
- Data de nascimento (obrigatório)
- CPF (obrigatório, único no sistema)
- Telefone (obrigatório)
- Convênio (opcional)

### 3.2 Validações (Frontend)
- Validação de CPF duplicado (via array mock local)
- Validação de formato de CPF
- Validação de data de nascimento

### 3.3 Funcionalidades
- Cadastro de novo paciente (armazenado em estado local)
- Edição de dados de paciente existente
- Exclusão de paciente

### 3.4 Dados Mockados - Pacientes Iniciais
```
1. João Silva - 123.456.789-00 - (11) 99999-9999 - Particular
2. Maria Santos - 987.654.321-00 - (11) 88888-8888 - Unimed
3. Pedro Oliveira - 456.789.123-00 - (11) 77777-7777 - Bradesco Saúde
4. Ana Costa - 321.654.987-00 - (11) 66666-6666 - SulAmérica
5. Lucas Rodrigues - 654.321.789-00 - (11) 55555-5555 - Particular
```

---

## 4. Busca e Listagem de Pacientes

### 4.1 Busca (Frontend)
- Busca por nome (filtro no array mock)
- Busca por CPF (filtro no array mock)
- Resultados instantâneos via filtragem local

### 4.2 Listagem
- Tabela com todos os pacientes mockados
- Ordenação por nome
- Ações: editar, visualizar detalhes

---

## 5. Agendamento de Consultas

### 5.1 Formulário de Agendamento
- Seleção de paciente (busca por nome/CPF no dropdown)
- Seleção de médico
- Seleção de data
- Seleção de horário
- Status inicial: "agendada"

### 5.2 Validações (Frontend)
- Verificação de conflito de horário (via array mock local)
- Impedimento de agendamento no mesmo horário com o mesmo médico
- Mensagem de erro em caso de conflito

### 5.3 Dados Mockados - Médicos
```
1. Dr. Carlos Pereira - CRM 12345 - Cardiologia
2. Dra. Fernanda Lima - CRM 54321 - Dermatologia
3. Dr. Roberto Alves - CRM 98765 - Clínico Geral
```

### 5.4 Dados Mockados - Consultas Agendadas
```
1. João Silva - Dr. Carlos Pereira - 29/04/2026 - 09:00
2. Maria Santos - Dra. Fernanda Lima - 29/04/2026 - 10:00
3. Pedro Oliveira - Dr. Roberto Alves - 29/04/2026 - 14:00
4. Ana Costa - Dr. Carlos Pereira - 29/04/2026 - 15:00
5. Lucas Rodrigues - Dra. Fernanda Lima - 30/04/2026 - 09:00
```

---

## 6. Calendário de Consultas

### 6.1 Visualização Semanal
- Exibição em formato de calendário semanal
- Visualização por dia ou por semana
- Mostrar consultas dos dados mockados

### 6.2 Informações Exibidas
- Nome do paciente
- Nome do médico
- Horário da consulta
- Status da consulta

### 6.3 Funcionalidades
- Navegação entre dias/semanas
- Atualização visual após novos agendamentos (estado local)
- Cores ou indicadores para diferentes status

### 6.4 Status de Consultas (Mockados)
- Agendada: cor azul
- Realizada: cor verde
- Cancelada: cor vermelha

---

## 7. Estrutura de Dados Mockados

### 7.1 Arquivo de Mocks (mockData.ts)
```typescript
export const mockUsers = [...];

export const mockPatients = [...];

export const mockDoctors = [...];

export const mockAppointments = [...];
```

### 7.2 Estado Global
- Utilizar Context API ou Zustand para gerenciar estado local
- Persistência via localStorage para simulação de banco

---

## 8. Funcionalidades Não Acessíveis ao Atendente

O atendente NÃO tem acesso a:
- Prontuário do paciente
- Registro de atendimento
- Histórico clínico
- Cadastro de usuários
- Gerenciamento de médicos

**Controle implementado via verificação de perfil no código frontend.**

---

## 9. Resumo de Telas para Atendente

| Tela | Acesso | Dados |
| :--- | :---: | :---: |
| Login | ✓ | Mock |
| Dashboard | ✓ | Mock |
| Cadastro de pacientes | ✓ | Mock + Local |
| Busca/listagem de pacientes | ✓ | Mock |
| Agendamento de consultas | ✓ | Mock + Local |
| Calendário de consultas | ✓ | Mock |
| Prontuário do paciente | ✗ | - |
| Registro de atendimento | ✗ | - |
| Histórico clínico | ✗ | - |
| Cadastro de usuários | ✗ | - |
| Gerenciamento de médicos | ✗ | - |

---

## 10. Prioridade de Desenvolvimento

1. **Tela de Login** - Primeira interação do sistema (mockada)
2. **Dashboard** - Visão geral com dados estáticos
3. **Cadastro de Pacientes** - Funcionalidade com estado local
4. **Busca/Listagem de Pacientes** - Filtros em dados mock
5. **Agendamento de Consultas** - Com validação local de conflitos
6. **Calendário de Consultas** - Visualização semanal

---

## 11. Regras para Esta Fase

- **Sem chamadas reais à API** - todas as requisições serão simuladas
- **Dados mockados** - arquivos TypeScript/JavaScript com dados de exemplo
- **Estado local** - uso de Context API ou Zustand para gerenciar dados
- **Persistência temporária** - localStorage para simular banco de dados
- **Validações no frontend** - toda validação será feita localmente
- **Interface responsiva** - mesma experiência de usuário esperada

---

## 12. Observações

- Todas as funcionalidades devem ter tratamento de erros adequado
- A interface deve ser intuitiva e responsiva
- O sistema deve seguir as boas práticas de programação conforme documento de boas práticas
- O frontend deve verificar o perfil do usuário e ocultar elementos não permitidos
- O sistema deve estar preparado para integração futura com backend REST (mesma estrutura de chamadas, apenas redirecionando para mocks)