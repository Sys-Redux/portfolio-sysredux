# SYS-REDUX Portfolio

A modern, cyberpunk-themed portfolio application built with Next.js 16, showcasing full-stack development capabilities with Firebase integration, authentication, and real-time data management.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.6.0-FFCA28?style=for-the-badge&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)

## 🎯 Project Overview

This portfolio application demonstrates modern web development practices with a focus on user experience, accessibility, and scalability. Built as a personal project to showcase technical skills and creative design abilities.

### Architecture

![SYS-REDUX Architecture](/public/images/architecture.png)

**Live Demo:** [Your Vercel URL]
**Admin Panel:** `/adminPanel` (requires authentication)

## ✨ Key Features

### 🎨 **Modern UI/UX Design**

- Cyberpunk-inspired theme with neon color palette (cyan, green, pink)
- Fully responsive design for mobile, tablet, and desktop
- Animated hero section with typing effect and particle system
- Custom glassmorphism effects and hover animations
- Accessible navigation with hamburger menu (all screen sizes)

### 🔐 **Authentication & Authorization**

- Firebase Authentication (email/password)
- Role-based access control (admin/user permissions)
- Protected routes for admin functionality
- Secure user profile management
- Account settings with data deletion capabilities

### 📁 **Project Management System**

- Full CRUD operations for projects
- Multi-image upload with Firebase Storage
- Primary image selection for thumbnails
- Image gallery with navigation controls
- Individual project detail pages with lightbox
- Upload progress tracking
- Admin-only edit/delete functionality

### 📧 **Contact Form**

- Form validation with real-time feedback
- Firebase Firestore integration
- Automated email notifications via Firebase Extension
- Custom HTML email templates with cyberpunk styling
- Success/error message handling

### 🧪 **Testing & CI/CD**

- Comprehensive test suite with Jest
- Unit tests for components (ProjectCard, NavBar)
- Integration tests for user flows
- GitHub Actions CI/CD pipeline
- Automated testing on pull requests
- Continuous deployment to Vercel

### ⚡ **Performance Optimizations**

- Next.js Image optimization for Firebase Storage
- React Query for efficient data fetching and caching
- Code splitting and lazy loading
- Server-side rendering (SSR) for SEO
- Optimized build pipeline

## 🛠️ Tech Stack

### **Frontend**

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **State Management:** React Query (TanStack Query)
- **Icons:** Lucide React
- **Type Safety:** TypeScript 5

### **Backend & Database**

- **Authentication:** Firebase Auth
- **Database:** Cloud Firestore
- **Storage:** Firebase Storage
- **Email:** Firebase Extensions (Trigger Email)

### **Testing**

- **Framework:** Jest 30
- **Testing Library:** React Testing Library
- **Environment:** jsdom

### **DevOps**

- **CI/CD:** GitHub Actions
- **Deployment:** Vercel
- **Version Control:** Git/GitHub

## 📂 Project Structure

```json
portfolio-sysredux/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page with hero & skills
│   ├── about/                    # About page
│   ├── projects/                 # Projects list & detail pages
│   │   └── [id]/                 # Dynamic project detail routes
│   ├── contact/                  # Contact form
│   ├── login/                    # Authentication pages
│   ├── register/
│   ├── settings/                 # User account settings
│   └── adminPanel/               # Admin dashboard
│
├── components/                   # React components
│   ├── auth/                     # Login/register forms
│   ├── contact/                  # Contact form component
│   ├── layout/                   # NavBar, Footer, ClientLayout
│   └── projects/                 # ProjectCard, ProjectForm
│
├── lib/                          # Core application logic
│   ├── context/                  # React Context (Auth)
│   ├── firebase/                 # Firebase configuration
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API services (projects, contact)
│   └── types/                    # TypeScript type definitions
│
├── __tests__/                    # Test files
│   ├── components/               # Component tests
│   └── integration/              # Integration tests
│
└── _rules/                       # Firebase security rules
    └── firestore.rules
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Firebase account with project set up

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sys-Redux/portfolio-sysredux.git
   cd portfolio-sysredux
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Deploy Firebase rules**

   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

### Test Coverage

- **Unit Tests:** ProjectCard, NavBar components
- **Integration Tests:** Contact form submission, project navigation
- **Authentication Tests:** Login/logout flows, admin access control

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push to `main`

### CI/CD Pipeline

GitHub Actions automatically:

- Runs ESLint for code quality
- Executes test suite
- Builds the application
- Deploys to Vercel (on successful build)

## 🔒 Security

### Firestore Security Rules

The application implements comprehensive security rules:

- Public read access for projects
- Authenticated users can manage their own profiles
- Admin-only access for project management
- Anyone can submit contact forms
- Email collection protected from direct access

### Authentication

- Passwords hashed via Firebase Auth
- Protected routes with server-side verification
- Role-based access control for admin features
- Secure session management

## 📧 Email Notifications

Contact form submissions trigger automated email notifications using:

- Firebase Extension: "Trigger Email from Firestore"
- SMTP via Gmail App Password
- Custom HTML email templates with cyberpunk styling

## 🎨 Design Philosophy

The cyberpunk aesthetic was chosen to demonstrate:

- Advanced CSS skills (gradients, animations, glassmorphism)
- Creative design implementation
- Attention to detail in UI/UX
- Brand consistency across all pages

Color palette:

- **Primary Cyan:** `#00ffff` (accents, headings)
- **Primary Green:** `#39ff14` (success states, highlights)
- **Primary Pink:** `#ff006e` (calls-to-action, errors)
- **Dark Background:** `#0a0a0a` (main background)

## 🤝 Contributing

While this is a personal portfolio project, I'm open to feedback and suggestions. Feel free to:

- Report bugs via GitHub Issues
- Suggest features or improvements
- Fork the project for your own use (with attribution)

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Trevor Edge** - *Full-Stack Developer*

- Email: [edge.t.xyz@gmail.com](edge.t.xyz@gmail.com)
- GitHub: [@Sys-Redux](https://github.com/Sys-Redux)
- Portfolio: [Your Portfolio URL]

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for the backend infrastructure
- Vercel for seamless deployment
- The open-source community for inspiration

---

\
*Built with ❤️ and a lot of ☕ by Trevor Edge*
