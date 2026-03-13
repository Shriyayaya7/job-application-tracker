# AI-Powered Job Application Tracker

A comprehensive Notion-like dashboard for job seekers with AI assistance, analytics, and browser integration.

## 🚀 Features

### Core Functionality
- **Track Applied Jobs** - Complete job application management with status tracking
- **Resume & Cover Letter Storage** - Upload and manage multiple resumes and cover letters
- **Job Analytics Dashboard** - Visual insights into your job search progress
- **Chrome Extension** - Save jobs directly from any website

### AI-Powered Features
- **AI Resume Improvement** - Get personalized feedback and suggestions
- **AI Interview Question Generator** - Prepare for interviews with AI-generated questions
- **Resume Keyword Analysis** - Extract and optimize keywords for better matching
- **AI Feedback on Resumes** - Detailed analysis with actionable improvements

### Advanced Features
- **Email Reminders** - Automated follow-up reminders for applications
- **Weekly Digest** - Summary of your job search activity
- **Multi-platform Support** - Works with LinkedIn, Indeed, Glassdoor, and more

## 🛠 Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **Nodemailer** for email notifications

### AI Integration
- **OpenAI API** for AI features
- **GPT-3.5-turbo** for text analysis and generation

### Browser Extension
- **Chrome Extension Manifest V3**
- **Content Scripts** for web scraping
- **Popup Interface** for quick job saving

## 📁 Project Structure

```
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.tsx       # Main app component
│   │   └── index.css     # Tailwind CSS
│   └── package.json
├── backend/               # Node.js backend API
│   ├── src/
│   │   ├── controllers/  # API controllers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   └── config/       # Database configuration
│   └── package.json
├── chrome-extension/      # Chrome browser extension
│   ├── manifest.json     # Extension manifest
│   ├── popup.html        # Extension popup UI
│   ├── popup.js          # Extension logic
│   └── content.js        # Content script
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **OpenAI API Key**
- **Gmail Account** (for email reminders)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-application-tracker
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` with your credentials:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=your_gmail_app_password
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

### Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `chrome-extension` folder

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Job Applications
- `GET /api/jobs` - Get all job applications
- `POST /api/jobs` - Create new job application
- `GET /api/jobs/:id` - Get specific job application
- `PUT /api/jobs/:id` - Update job application
- `DELETE /api/jobs/:id` - Delete job application
- `GET /api/jobs/analytics` - Get job analytics

### Resumes & Cover Letters
- `POST /api/resume` - Upload resume
- `GET /api/resumes` - Get all resumes
- `POST /api/cover-letter` - Upload cover letter
- `GET /api/cover-letters` - Get all cover letters

### AI Features
- `POST /api/ai/analyze-resume/:id` - Analyze resume with AI
- `POST /api/ai/generate-interview-questions` - Generate interview questions
- `POST /api/ai/improve-resume` - Get resume improvement suggestions
- `POST /api/ai/extract-keywords` - Extract keywords from text

### Email Reminders
- `POST /api/email/follow-up-reminder` - Send follow-up reminder
- `POST /api/email/schedule-follow-up` - Schedule follow-up
- `GET /api/email/upcoming-reminders` - Get upcoming reminders
- `POST /api/email/weekly-digest` - Send weekly digest

## 🔧 Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:backend` - Start only backend server
- `npm run dev:frontend` - Start only frontend server
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start production server

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
NODE_ENV=development
```

## 🌟 Features in Detail

### Job Application Tracking
- Track application status (Applied, Interviewing, Offered, Rejected, Withdrawn)
- Store job details, salary information, and notes
- Link resumes and cover letters to applications
- Application history and timeline

### AI Resume Analysis
- Overall resume scoring (1-10)
- Strengths and weaknesses identification
- Missing keyword suggestions
- Formatting recommendations
- Actionable improvement items

### Interview Preparation
- Generate behavioral questions
- Technical questions for specific roles
- Situational questions
- Questions to ask interviewers

### Chrome Extension
- Auto-extract job information from major job boards
- Support for LinkedIn, Indeed, Glassdoor
- Generic extraction for any website
- One-click job saving

### Email Reminders
- Follow-up reminders for applications
- Weekly activity digests
- Personalized email templates
- Customizable reminder schedules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Join our community discussions

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced AI matching algorithms
- [ ] Integration with more job boards
- [ ] Team collaboration features
- [ ] Advanced reporting and insights
- [ ] Resume templates and builder
- [ ] Salary comparison tools

---

**Happy job hunting! 🎉**
