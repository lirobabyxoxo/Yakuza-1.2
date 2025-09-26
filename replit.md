# Yakuza Discord Bot

## Overview

This is a hybrid Discord bot project with a dark/demonic theme built using JavaScript and discord.js. The bot supports both prefix commands (.) and slash commands (/), featuring black embeds with red neon accents. The project includes a web dashboard built with React and Express, providing administrative commands (ban, kick, mute), roleplay commands (kiss, hug, kill), utility commands (help, ping, avatar), and DISCLOUD integration commands for bot management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and ES modules
- **Styling**: Tailwind CSS with a comprehensive dark theme design system
- **Component Library**: Radix UI components with custom theming for Japanese Yakuza aesthetic
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with hot module replacement and runtime error overlay
- **Development**: Custom Vite middleware integration with Express server

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules configuration
- **API Design**: RESTful API structure with `/api` prefix routing
- **Development**: Hot reload with Vite middleware integration for seamless development
- **Storage Interface**: Abstract storage pattern with in-memory implementation for development
- **Error Handling**: Centralized error middleware with status code management

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL via Neon serverless (configured but not actively used)
- **Schema**: User management with username/password authentication structure
- **Migrations**: Drizzle Kit for schema management and database versioning
- **Development Storage**: In-memory storage implementation for rapid development

### Design System
- **Theme**: Dark mode with Japanese Yakuza aesthetic and demonic elements
- **Color Palette**: Deep black backgrounds (0 0% 8%) with neon red accents (0 85% 55%)
- **Typography**: Inter for primary UI text, JetBrains Mono for code blocks and commands
- **Component Patterns**: Card-based layouts with subtle red borders and shadow effects
- **Spacing System**: Consistent Tailwind units (2, 4, 8, 16) for micro to large spacing
- **Interactive Elements**: Hover elevation effects and red accent highlighting

### Discord Bot Integration
- **Library**: discord.js v14 for Discord API interaction
- **Command System**: Hybrid architecture supporting both prefix (.) and slash (/) commands
- **Theming**: Dark embeds with red accents matching the web interface aesthetic
- **Deployment**: DISCLOUD integration for cloud hosting and bot management
- **Command Categories**: Administrative, roleplay, utility, and cloud management commands

## External Dependencies

### Discord Services
- **Discord.js**: Version 14.22.1 for Discord bot functionality
- **DISCLOUD**: Cloud hosting platform for Discord bot deployment and management

### Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and schema management
- **Connect PG Simple**: PostgreSQL session store for Express sessions

### Frontend Libraries
- **Radix UI**: Comprehensive component library for accessible UI components
- **Tailwind CSS**: Utility-first CSS framework with custom dark theme configuration
- **React Query**: Server state management and caching
- **Wouter**: Lightweight routing library for React applications
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment plugins and runtime error handling

### Utility Libraries
- **Axios**: HTTP client for API requests
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Type-safe component variant management
- **CLSX/Tailwind Merge**: Conditional CSS class utilities