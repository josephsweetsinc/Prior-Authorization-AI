# Prior Authorization AI

A web application that streamlines the prior authorization process for ambulance transportation services. The system uses AI-powered document extraction to pull data from uploaded medical forms (CMS forms), reducing manual data entry and speeding up the approval workflow.

There are two user roles - **Provider** and **Admin**. Providers create and submit authorization requests, while Admins review, approve, or deny them. Each role has its own dashboard with relevant metrics and analytics.

## Tech Stack

- **Next.js 16** (App Router) with React 19 and TypeScript
- **Redux Toolkit** + **RTK Query** for state management and API data fetching with caching
- **Tailwind CSS 4** for styling
- **shadcn/ui** (built on Radix UI primitives) as the component library
- **React Hook Form** for form handling and validation
- **Recharts** for dashboard charts and analytics
- **Lucide React** for icons
- **date-fns** for date formatting
- **react-toastify** for toast notifications
- **js-cookie** for token storage
- **reconnecting-websocket** for real-time notification delivery

## Project Structure

The project follows a feature-based architecture:

```
src/
├── app/                  # Next.js App Router (layouts, routes, providers)
├── features/             # Self-contained feature modules
│   ├── new-request/      # Prior auth request creation (multi-step form)
│   ├── auth/             # Login, signup, password reset
│   ├── authorization-requests/  # Admin request management
│   ├── notifications/    # Real-time notifications
│   ├── reporting/        # Analytics and reports
│   └── ...
├── services/             # API layer (RTK Query endpoints)
│   ├── api/              # Base API config with auth middleware
│   ├── auth/             # Auth endpoints
│   ├── requests/         # Request CRUD endpoints
│   ├── media/            # File upload and AI extraction
│   ├── websocket/        # WebSocket connection management
│   ├── dashboard/        # Dashboard metrics
│   └── ...
├── shared/               # Reusable components, hooks, utilities
└── views/                # Page-level compositions
```

Each feature module contains its own components, hooks, store slices, and types. The `services/` layer handles all communication with the backend API through RTK Query, which gives us automatic caching, cache invalidation on mutations, and request deduplication out of the box.

## Key Features

### AI Document Extraction

When a provider uploads medical documents (CMS forms), the backend AI service extracts patient data, transportation details, diagnosis info, and physician information. The extracted data is returned with a confidence score and pre-fills the request form. Any missing or incomplete fields are flagged so the user can fill them in manually.

### Multi-Step Request Flow

Creating a new authorization request is a three-step process:

1. **Upload** - upload one or more medical documents for extraction
2. **Info** - review and edit the extracted data, fill in missing fields
3. **Review** - final review before submission

Draft state is persisted to session storage so users don't lose progress on page refresh.

### Request Management

Admins can view all submitted requests, filter and search by patient name, and approve or deny requests with notes. Providers can track the status of their submissions. Both roles can download generated PDF summaries of any request.

### Real-Time Notifications

The app maintains a WebSocket connection for instant notification delivery when request statuses change (submitted, approved, denied). If the WebSocket drops, it falls back to polling automatically.

### Dashboard and Reporting

Both roles get a dashboard with relevant metrics — request counts by status, approval rates, average processing time, common denial reasons, etc. The admin side also has a dedicated reporting section with charts.

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
npm run dev
```

The app runs on `localhost:3000` by default.

### Code Quality

- **ESLint** with TypeScript rules and Prettier integration
- **Husky** pre-commit hooks run lint-staged (ESLint + Prettier) on staged files
- Path aliases configured: `@/*`, `@/app/*`, `@/shared/*`, `@/features/*`, `@/services/*`

### Environment Variables

The app expects the following env vars (set in `.env.local`):

- `NEXT_PUBLIC_API_URL` - backend API base URL
- `NEXT_PUBLIC_WEBSOCKET_URL` - WebSocket endpoint for notifications
