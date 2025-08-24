# Overview

GovGraph is a data visualization web application that displays interactive charts and graphs of **Indian government and public data**. The app provides a Netflix-style interface for browsing different sectors of Indian public data including agriculture, healthcare, education, government budgets, traffic, and utilities. It serves as a dashboard for visualizing complex Indian government datasets through various chart types (line, bar, pie, doughnut) with fullscreen modal capabilities for detailed analysis.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack**: React with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Chart.js for interactive data visualizations

**Design Pattern**: Component-based architecture with a Netflix-inspired dark theme
- Reusable chart components with fullscreen modal capabilities
- Sector-based data organization with horizontal scrolling rows
- Responsive design with mobile-first approach
- Custom hooks for mobile detection and toast notifications

## Backend Architecture

**Framework**: Express.js with TypeScript running in ESM mode
- **API Design**: RESTful endpoints for data proxy services
- **Error Handling**: Global error middleware with structured error responses
- **Logging**: Custom request/response logging middleware
- **Development**: Integrated Vite middleware for hot module replacement

**Data Flow**: Backend acts as a proxy service to Indian government APIs
- Data.gov.in API integration for Indian government datasets
- Indian Ministry-specific data sources (Agriculture, Health, Education, Finance)
- Sample Indian data with authentic structure and values representing real Indian government statistics
- In-memory storage system for user management (currently unused but structured for future expansion)

## External Dependencies

**Third-Party APIs**:
- Data.gov.in: Indian government datasets across all sectors
- Ministry of Agriculture & Farmers Welfare: Crop production, fertilizer data
- Ministry of Health & Family Welfare: Hospital directory, healthcare budget
- Ministry of Education: Literacy rates, school enrollment, education budget
- Ministry of Finance: Union budget, revenue sources, ministry allocations
- Ministry of Road Transport & Highways: Vehicle registration data
- Central Electricity Authority: Power generation and distribution data

**Database Configuration**:
- Drizzle ORM configured for PostgreSQL with Neon Database serverless
- Migration system set up but currently using in-memory storage
- Schema definitions prepared for future database integration

**Key Libraries**:
- Chart.js: Primary charting library for data visualization
- Axios: HTTP client for external API requests
- Radix UI: Accessible component primitives
- TanStack Query: Data fetching and caching
- Zod: Runtime type validation for data schemas

**Development Tools**:
- TypeScript: Type safety across full stack
- Tailwind CSS: Utility-first styling
- ESBuild: Fast bundling for production
- TSX: TypeScript execution for development server

The application is designed to be easily extensible for additional data sources and chart types, with a clean separation between data fetching, processing, and presentation layers.