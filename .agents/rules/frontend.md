---
trigger: always_on
---

# Frontend Architecture PRD

**Project:** Payroll Management System

## 1. Overview

The Payroll Management System frontend is a Single Page Application (SPA) built using **React** and **Vite**. It communicates with the backend through a RESTful API built with **Express.js**.

The architecture is designed with the following goals:

- Scalability
- Maintainability
- Reusability
- Clear separation of concerns
- Easy onboarding for new developers
- Consistent project structure

---

# 2. Technology Stack

| Category      | Technology       |
| ------------- | ---------------- |
| Framework     | React + Vite     |
| Language      | TypeScript       |
| Styling       | Tailwind CSS     |
| Routing       | React Router DOM |
| Server State  | TanStack Query   |
| HTTP Client   | Axios            |
| Forms         | React Hook Form  |
| Validation    | Zod              |
| UI Components | shadcn/ui        |
| Icons         | Tabler Icon      |
| Date Utility  | date-fns         |
| Notifications | Sonner           |

---

# 3. Project Structure

```
src/
│
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── assets/
│
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
│
├── constants/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── employee/
│   ├── division/
│   ├── job-position/
│   ├── payroll/
│   ├── reimbursement/
│   ├── overtime/
│   └── profile/
│
├── hooks/
│
├── layouts/
│
├── lib/
│
├── providers/
│
├── routes/
│
├── types/
│
├── utils/
│
├── main.tsx
│
└── vite-env.d.ts
```

---

# 4. Feature-Based Architecture

Every feature follows the same structure.

Example:

```
employee/
│
├── api/
├── components/
├── hooks/
├── pages/
├── employee.type.ts
├── employee.validation.ts
└── index.ts
```

## api/

Contains all HTTP requests related to the feature.

Example:

```ts
getEmployees();
getEmployeeById();
createEmployee();
updateEmployee();
deleteEmployee();
```

Business logic should never be placed inside API files.

---

## components/

Contains components that are only used within the feature.

Example:

```
EmployeeTable.tsx
EmployeeForm.tsx
EmployeeCard.tsx
EmployeeFilter.tsx
EmployeeStatusBadge.tsx
```

---

## pages/

Contains route-level pages.

Example:

```
EmployeePage.tsx
EmployeeDetailPage.tsx
CreateEmployeePage.tsx
UpdateEmployeePage.tsx
```

---

## hooks/

Contains custom hooks related to the feature.

Example:

```ts
useEmployeesQuery();
useCreateEmployeeMutation();
useUpdateEmployeeMutation();
```

---

## employee.validation.ts

Contains frontend validation schemas using Zod.

Example:

```ts
employeeSchema;
```

Used together with React Hook Form.

---

## employee.type.ts

Contains interfaces and TypeScript types.

Example:

```ts
Employee;
EmployeeResponse;
EmployeeRequest;
```

---

# 5. Routing

React Router is used for application routing.

```
/
├── login
├── dashboard
├── employees
├── employees/create
├── employees/:id
├── divisions
├── job-positions
├── reimbursements
├── overtimes
├── payrolls
└── profile
```

Private routes should be protected using an authentication guard.

---

# 6. Layout

Two layouts are used:

```
AuthLayout
DashboardLayout
```

DashboardLayout contains:

- Sidebar
- Top Navigation
- Breadcrumb
- Outlet

---

# 7. State Management

## Server State

Server state is managed exclusively by **TanStack Query**.

Examples:

- Employees
- Payrolls
- Divisions
- Job Positions
- Overtimes
- Reimbursements

Server data **must not** be stored in React Context or custom global stores.

---

## UI State

UI state should be managed using React Context.

Examples:

- Theme
- Sidebar collapse
- Dialog visibility
- Global loading indicator

---

# 8. API Layer

All HTTP requests must use a shared Axios instance.

```
src/lib/axios.ts
```

Responsibilities:

- Base URL configuration
- Authorization header
- Timeout
- Request interceptor
- Response interceptor
- Error handling

Components should never call Axios directly.

---

# 9. Authentication

Authentication uses JWT.

Flow:

```
Login
      ↓
Receive Access Token
      ↓
Store Token
      ↓
Axios Interceptor
      ↓
Authorization Header
      ↓
Protected API
```

---

# 10. Forms & Validation

All forms must use:

- React Hook Form
- Zod

Frontend validation is intended to improve user experience only.

Backend validation remains the source of truth.

---

# 11. Shared Components

Reusable UI components belong in:

```
src/components/ui
```

Examples:

```
Button
Input
Textarea
Select
Dialog
Modal
Table
Badge
Pagination
Loading
Skeleton
EmptyState
ErrorState
```

---

# 12. Server State Flow

TanStack Query handles:

```
Query
      ↓
Cache
      ↓
Mutation
      ↓
Invalidate Query
      ↓
Automatic Refetch
```

Example:

```
Create Employee
        ↓
Mutation Success
        ↓
invalidateQueries(["employees"])
        ↓
Employee List Refreshes Automatically
```

---

# 13. Error Handling

All API errors should be centralized through Axios interceptors.

User feedback should use Sonner.

Examples:

| Status | Behavior                          |
| ------ | --------------------------------- |
| 400    | Display validation message        |
| 401    | Logout and redirect to login      |
| 403    | Show access denied page           |
| 404    | Show not found page               |
| 500    | Display server error notification |

---

# 14. Folder Rules

## Components

Reusable components belong in:

```
components/ui
```

Feature-specific components belong inside their respective feature.

✅ Good

```
features/
    employee/
        components/
```

❌ Avoid

```
components/
    EmployeeTable.tsx
```

---

## API

API files should always stay inside the feature.

✅

```
features/
    employee/
        api/
```

❌

```
services/
employee.ts
division.ts
```

---

# 15. Naming Convention

| Item       | Convention                  |
| ---------- | --------------------------- |
| Folder     | kebab-case                  |
| Component  | PascalCase                  |
| Hook       | camelCase with `use` prefix |
| API        | feature.api.ts              |
| Validation | feature.validation.ts       |
| Types      | feature.type.ts             |

Examples:

```
employee/
job-position/

EmployeeTable.tsx

useEmployeesQuery.ts

employee.api.ts

employee.validation.ts

employee.type.ts
```

---

# 16. Development Guidelines

- Use Functional Components only.
- Avoid using `any`.
- Keep components as presentational as possible.
- Separate UI from business logic.
- Never call Axios directly inside components.
- Use TanStack Query for all server-side data.
- Use React Hook Form for all forms.
- Use Zod for validation.
- Reuse components whenever possible.

---

# 17. Future Improvements

The architecture should be ready for future enhancements, including:

- Role-Based Access Control (RBAC)
- Dark Mode
- Internationalization (i18n)
- File Upload
- PDF Export
- Excel Export
- Dashboard Analytics
- Unit Testing (Vitest)
- End-to-End Testing (Playwright)
- CI/CD Pipeline
- Progressive Web App (PWA)

---

# 18. Architecture Principles

The project follows these principles:

- Feature-first architecture
- Separation of concerns
- Reusable UI components
- Scalable folder organization
- Predictable state management
- Type safety
- Clean and maintainable codebase
