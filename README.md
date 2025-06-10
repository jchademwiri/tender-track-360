# Tender Track 360

Tender Track 360 is a comprehensive web application designed to streamline and optimize the government tender management process for businesses. This platform digitizes the entire tender lifecycle, from discovery to award, enabling organizations to efficiently track, respond to, and analyze public procurement opportunities.

## Overview

Built with modern web technologies, Tender Track 360 provides a centralized hub for tender officers and business stakeholders to manage tender documentation, track critical deadlines, collaborate on submissions, and gain insights from historical performance data.

## Key Features

- **Tender Lifecycle Management**: Track tenders from publication through submission to final award decision
- **Document Repository**: Centralized storage for all tender-related files with version control
- **Deadline Tracking**: Automated notifications for approaching deadlines and submission requirements
- **Status Dashboard**: Visual overview of all active, pending, and completed tenders
- **User Collaboration**: Role-based access control for team collaboration on tender responses
- **Basic Analytics**: Track success rates and performance metrics to improve future bids

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Deployment**: Vercel

## Project Goals

The primary goal of Tender Track 360 is to increase tender success rates by:
- Eliminating missed deadlines and submission errors
- Providing better visibility into the tender pipeline
- Creating an institutional memory of past submissions and outcomes
- Enabling data-driven decision-making for tender opportunities
- Streamlining collaboration between team members

## Development Roadmap

This repository contains the MVP version of Tender Track 360, with plans to incrementally enhance functionality based on user feedback and business requirements. Future development phases will introduce advanced analytics, AI-powered recommendations, integration with government tender portals, and a mobile companion app.

## Getting Started - Installation and Setup Instructions


## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or later)
- npm (v9.0.0 or later) or yarn (v1.22.0 or later)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jchademwiri/tender-track-360.git
cd tender-track-360
```

### 2. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

# Optional: Email Service (for notifications)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=user
EMAIL_SERVER_PASSWORD=password
EMAIL_FROM=noreply@tendertrack360.com
```

### 3. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 4. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up authentication providers in the Supabase dashboard
3. Initialize your database with the schema:

```bash
# Using npm
npm run db:push

# Using yarn
yarn db:push
```

### 5. Run Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

### 6. Initial Admin User

After setting up, register a user through the application interface. Then use the Supabase dashboard to update this user's role to 'admin' in the users table.

## Deployment

### Vercel Deployment

1. Fork this repository to your GitHub account
2. Create a new project in Vercel
3. Connect your GitHub repository
4. Configure the environment variables
5. Deploy

### Other Deployment Options

Detailed instructions for other deployment options will be added as they are supported.

## Troubleshooting

- **Database Connection Issues**: Ensure your Supabase URL and keys are correct in the .env file
- **Authentication Problems**: Check that your Supabase authentication settings allow email/password registration
- **Build Errors**: Make sure all dependencies are installed correctly

For additional help, please create an issue in the GitHub repository.


*Note: These setup instructions are for the development environment. Production deployment will require additional security considerations.*

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software as long as you include the original license in any copies or substantial portions of the software. The software is provided "as is", without warranty of any kind, express or implied.
For more information, please refer to the [LICENSE](LICENSE) file in the repository.
Please note that while the software is free to use, any commercial applications or modifications may require additional licensing agreements depending on the use case and distribution method. Always consult with a legal professional if you have questions about compliance or licensing.
## Contributing
We welcome contributions to Tender Track 360! If you would like to contribute, please fork the repository and submit a pull request. Before contributing, please ensure that your code adheres to the project's coding standards and includes appropriate tests.
See [LICENSE](LICENSE) for details.

---

*Tender Track 360 is designed specifically for organizations that regularly participate in procurement processes, helping them transform their tender management from a reactive, document-heavy process into a streamlined, data-driven operation.*
