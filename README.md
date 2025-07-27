# HR AI App - AI-Powered Candidate Evaluation System

A modern web application that combines AI-powered candidate evaluation with a clean, responsive user interface. This system helps employers assess job candidates through automated evaluation of their responses to interview questions using advanced AI technology and ideal answer comparison.

## 🚀 Features

### For Candidates
- **Welcome Page** - Beautiful landing page with clear paths for candidates and employers
- **Modern Application Form** - Clean, iOS-style interface for job applications
- **Multiple Question Types** - Support for both multiple choice and text-based questions
- **Real-time Validation** - Immediate feedback on form inputs
- **Instant Submission** - Immediate response with background AI evaluation
- **Progress Tracking** - Real-time status updates during evaluation
- **Beautiful Thank You Page** - Professional completion experience with blur background

### For Employers
- **Secure Dashboard** - Protected access to candidate submissions
- **AI-Generated Insights** - Automated evaluation scores and detailed feedback
- **Modern UI** - Clean, professional interface for reviewing candidates
- **Comprehensive View** - See all candidate responses with AI analysis
- **Total Score Ranking** - Candidates sorted by total score (high to low)
- **Detailed Evaluations** - Individual question scores and feedback

### Technical Features
- **FastAPI Backend** - High-performance Python API with automatic documentation
- **React Frontend** - Modern, responsive single-page application
- **SQLite Database** - Lightweight, file-based database for data persistence
- **OpenAI Integration** - AI-powered candidate evaluation using GPT-4
- **Async Background Processing** - Non-blocking evaluation for better UX
- **Ideal Answer Comparison** - Structured evaluation with predefined ideal answers
- **CORS Support** - Cross-origin resource sharing for frontend-backend communication

## 📁 Project Structure

```
hr-ai-app/
├── .gitignore                    # Excludes node_modules, build files, etc.
├── ai_app_backend/              # FastAPI backend
│   ├── .gitignore
│   ├── README.md
│   ├── requirements.txt         # Python dependencies
│   ├── main.py                 # FastAPI app with CORS and async endpoints
│   ├── models.py               # SQLAlchemy models with evaluation status
│   ├── schemas.py              # Pydantic schemas with new response models
│   ├── database.py             # Database configuration
│   ├── evaluation.py           # AI evaluation logic with structured output
│   ├── background_tasks.py     # Async background processing
│   └── ideal_answers.py        # Predefined ideal answers for evaluation
└── ai_app_frontend/            # React frontend
    ├── package.json            # Node.js dependencies
    ├── package-lock.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js              # Main React app with routing
        ├── api.js              # API functions with status checking
        ├── index.css           # Modern iOS-style styling
        ├── index.js
        ├── questionBank.js     # Centralized question management
        └── components/
            ├── Welcome.js          # Landing page with two cards
            ├── CandidateForm.js    # Modern form with async submission
            ├── EmployerLogin.js    # Clean login UI
            └── EmployerDashboard.js # Modern dashboard with sorting
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+ 
- Node.js 14+
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd ai_app_backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file:**
   ```bash
   # Create .env file with your OpenAI API key
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

5. **Run the backend:**
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ai_app_frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`

## 📖 Usage

### For Candidates
1. Visit `http://localhost:3000` - Welcome page with two options
2. Click "Bắt đầu ứng tuyển" to start application
3. Fill out the application form with your name and phone number
4. Answer the multiple choice questions (10 questions)
5. Provide detailed responses to text-based questions (6 questions)
6. Submit your application - **Get immediate confirmation!**
7. View real-time evaluation progress (optional)
8. See beautiful thank you page with completion message

### For Employers
1. Visit `http://localhost:3000` - Welcome page
2. Click "Đăng nhập" for employer access
3. Login with credentials (default: admin/password)
4. View the dashboard with all candidate submissions
5. See candidates ranked by total score (highest first)
6. Review detailed AI-generated scores and feedback for each answer

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `ai_app_backend` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
EMPLOYER_USERNAME=admin
EMPLOYER_PASSWORD=password
EMPLOYER_TOKEN=your_custom_token_here
```

### API Endpoints

- `POST /candidates` - Submit candidate application (immediate response)
- `GET /candidates/{id}/status` - Check evaluation status
- `POST /employer/login` - Employer authentication
- `GET /candidates` - Retrieve all candidate submissions (requires auth)

## 🎨 UI Features

### Modern iOS-Style Design
- **Welcome Page** - Beautiful gradient background with two interactive cards
- **Card-based Layout** - Clean, organized presentation with subtle shadows
- **iOS-style Form Elements** - Custom radio buttons, rounded corners, smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Slide-in effects, hover animations, and transitions
- **Professional Color Scheme** - Blue-based theme with proper contrast
- **Blur Background Effects** - Modern glassmorphism design elements

### Enhanced User Experience
- **Immediate Response** - No more waiting 30 seconds for submission
- **Real-time Status Updates** - Background processing with progress tracking
- **Intuitive Navigation** - Clear paths for candidates and employers
- **Real-time Feedback** - Immediate validation and error messages
- **Loading States** - Visual feedback during API calls
- **Accessibility** - Proper labels, focus states, and keyboard navigation
- **Thank You Page** - Beautiful completion experience with blur overlay

## 🤖 AI Evaluation System

### Advanced Evaluation Features
- **Structured Output** - Consistent JSON responses with scores and feedback
- **Ideal Answer Comparison** - Predefined ideal answers for accurate evaluation
- **GPT-4 Integration** - Latest AI model for superior evaluation quality
- **0-2 Scoring Scale** - Detailed scoring for text responses
- **Vietnamese Language Support** - Optimized for Vietnamese responses
- **Professional Assessment** - Evaluates relevance, completeness, and professionalism

### Evaluation Process
1. **Immediate Submission** - Candidate gets instant confirmation
2. **Background Processing** - AI evaluation runs in separate thread
3. **Status Tracking** - Real-time updates on evaluation progress
4. **Quality Results** - Structured feedback with scores and detailed comments

### Question Types
- **Multiple Choice (10 questions)** - Automatic scoring based on correct answers
- **Text Responses (6 questions)** - AI-generated scores with ideal answer comparison
- **Comprehensive Coverage** - Sales, customer service, and professional scenarios

## ⚡ Performance & Scalability

### Async Background Processing
- **Non-blocking Submissions** - Immediate response to users
- **Background Evaluation** - AI processing doesn't block the main thread
- **Scalable Architecture** - Can handle multiple simultaneous submissions
- **Status Tracking** - Real-time progress monitoring
- **Error Handling** - Robust error management and recovery

### Database Features
- **Evaluation Status Tracking** - Monitor processing state
- **Ideal Answer Storage** - Predefined answers for comparison
- **Comprehensive Data Model** - Complete candidate and answer tracking
- **Efficient Queries** - Optimized for dashboard performance

## 🛡️ Security

- **Authentication** - Protected employer dashboard
- **Input Validation** - Server-side validation of all inputs
- **CORS Configuration** - Proper cross-origin request handling
- **Environment Variables** - Secure API key management
- **Background Processing** - Secure thread management

## 🚀 Deployment

### Backend Deployment
The FastAPI backend can be deployed to:
- **Heroku** - Easy deployment with Procfile
- **Railway** - Simple container deployment
- **DigitalOcean** - VPS deployment
- **AWS/GCP** - Cloud platform deployment

### Frontend Deployment
The React frontend can be deployed to:
- **Vercel** - Optimized for React apps
- **Netlify** - Easy static site deployment
- **GitHub Pages** - Free hosting for public repos
- **AWS S3** - Static website hosting

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

---

**Built with ❤️ using FastAPI, React, OpenAI GPT-4, and modern async processing** 