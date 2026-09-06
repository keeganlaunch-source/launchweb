# Launch Lifestyle Fitness Application

## Overview
Launch Lifestyle is a comprehensive fitness coaching application designed to provide evidence-based guidance and automate marketing workflows. It features an AI-powered chat system, email marketing automation, analytics dashboard, user engagement tracking, and an e-commerce system for digital products. The application aims to offer personalized fitness advice, streamline lead generation, and provide valuable insights into user behavior and campaign performance.

## User Preferences
Preferred communication style: Simple, everyday language.
Preferred Launch AI placement: Single consolidated prompt instead of multiple scattered prompts across pages.
Primary email contact: keegan.launch@gmail.com (used throughout all systems and communications).

## System Architecture
The application is built with a React frontend, Express.js backend, and PostgreSQL database.

### Frontend Architecture
- **Technology Stack**: React with TypeScript, Vite for fast development, Tailwind CSS and Shadcn/UI for styling.
- **Design**: Responsive, mobile-first approach with PWA capabilities.
- **State Management**: TanStack Query for server state management and caching.

### Backend Architecture
- **Technology Stack**: Express.js with TypeScript, Drizzle ORM for type-safe database queries, and Node.js ESM.
- **Database**: PostgreSQL is the primary database.

### AI Integration
- **Core AI**: OpenAI GPT for intelligent fitness coaching, leveraging a custom knowledge base of evidence-based fitness and nutrition information.
- **Functionality**: Smart response generation, conversation memory, and safety handlers for injury screening and email capture.

### Key Components
- **Launch AI Chat System**: Provides personalized fitness advice, workout plans, and nutrition guidance. Integrates with email capture for lead generation and includes safety protocols.
- **Email Marketing Automation**: Utilizes SendGrid for automated weekly newsletters with evidence-based content and lead nurturing sequences.
- **Analytics Dashboard**: Offers real-time user metrics, engagement tracking, social media traffic monitoring, and email campaign performance insights.
- **User Management System**: Handles newsletter subscriptions, contact form submissions, and manages user preferences.
- **PDF Products & E-commerce System**: Supports digital product sales (e.g., recipe books, lifestyle frameworks) with dual payment processing (Paystack for ZAR, Stripe for USD), IP-based currency detection, and secure token-based download delivery.

### Data Flow
- **User Interaction**: From landing page visits and AI chat engagement to email capture and newsletter subscriptions, all interactions are tracked for analytics.
- **Email Marketing**: Leads captured via AI chat trigger immediate content delivery and automated weekly campaigns.
- **Analytics**: Event tracking, geolocation, UTM parameter processing, and social media monitoring feed into real-time dashboards.
- **PDF Purchase**: Secure payment processing leads to automated email delivery of download links with expiration tracking.

### Deployment Strategy
- **Development**: Replit development environment with environment variables, Drizzle for database migrations, and Vite for HMR.
- **Production**: Autoscale hosting with build pipelines, health checks, and comprehensive error handling.
- **Database**: PostgreSQL with connection pooling, schema migrations, and automated backups.

## External Dependencies
- **Email Services**: SendGrid (primary), Gmail API (additional analytics).
- **Analytics Platforms**: Google Analytics 4, Firebase Analytics, Meta Pixel, YouTube Analytics.
- **AI Services**: OpenAI API.
- **Database Hosting**: Neon Database (PostgreSQL).
- **Payment Gateways**: Stripe (international), Paystack (South Africa).
- **Deployment**: Replit.