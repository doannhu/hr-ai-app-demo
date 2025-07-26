# HR AI App - AI-Powered Candidate Evaluation System

A modern web application that combines AI-powered candidate evaluation with a clean, responsive user interface. This system helps employers assess job candidates through automated evaluation of their responses to interview questions.

## 🚀 Features

### For Candidates
- **Modern Application Form** - Clean, responsive interface for job applications
- **Multiple Question Types** - Support for both multiple choice and text-based questions
- **Real-time Validation** - Immediate feedback on form inputs
- **AI Evaluation** - Automated scoring and feedback on responses

### For Employers
- **Secure Dashboard** - Protected access to candidate submissions
- **AI-Generated Insights** - Automated evaluation scores and detailed feedback
- **Modern UI** - Clean, professional interface for reviewing candidates
- **Comprehensive View** - See all candidate responses with AI analysis

### Technical Features
- **FastAPI Backend** - High-performance Python API with automatic documentation
- **React Frontend** - Modern, responsive single-page application
- **SQLite Database** - Lightweight, file-based database for data persistence
- **OpenAI Integration** - AI-powered candidate evaluation using GPT models
- **CORS Support** - Cross-origin resource sharing for frontend-backend communication

## 📁 Project Structure

```
hr-ai-app/
├── .gitignore                    # Excludes node_modules, build files, etc.
├── ai_app_backend/              # FastAPI backend
│   ├── .gitignore
│   ├── README.md
│   ├── requirements.txt         # Python dependencies
│   ├── main.py                 # FastAPI app with CORS
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── database.py             # Database configuration
│   └── evaluation.py           # AI evaluation logic
└── ai_app_frontend/            # React frontend
    ├── package.json            # Node.js dependencies
    ├── package-lock.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js              # Main React app
        ├── api.js              # API functions
        ├── index.css           # Modern styling
        ├── index.js
        └── components/
            ├── CandidateForm.js    # Modern form UI
            ├── EmployerLogin.js    # Clean login UI
            └── EmployerDashboard.js # Modern dashboard UI
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
1. Visit `http://localhost:3000`
2. Fill out the application form with your name and phone number
3. Answer the multiple choice questions (20 questions)
4. Provide detailed responses to text-based questions (15 questions)
5. Submit your application

### For Employers
1. Visit `http://localhost:3000/employer`
2. Login with credentials (default: admin/password)
3. View the dashboard at `http://localhost:3000/dashboard`
4. Review candidate submissions with AI-generated scores and feedback

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

- `POST /candidates` - Submit candidate application
- `POST /employer/login` - Employer authentication
- `GET /candidates` - Retrieve all candidate submissions (requires auth)

## 🎨 UI Features

### Modern Design
- **Card-based Layout** - Clean, organized presentation
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Subtle transitions and hover effects
- **Professional Color Scheme** - Blue-based theme with proper contrast

### User Experience
- **Intuitive Navigation** - Clear paths for candidates and employers
- **Real-time Feedback** - Immediate validation and error messages
- **Loading States** - Visual feedback during API calls
- **Accessibility** - Proper labels, focus states, and keyboard navigation

## 🤖 AI Evaluation

The system uses OpenAI's GPT models to evaluate candidate responses:

- **Multiple Choice Questions** - Automatic scoring based on correct answers
- **Text Responses** - AI-generated scores (0-2 scale) with detailed feedback
- **Vietnamese Language Support** - Optimized for Vietnamese responses
- **Professional Assessment** - Evaluates relevance, completeness, and professionalism

## 🛡️ Security

- **Authentication** - Protected employer dashboard
- **Input Validation** - Server-side validation of all inputs
- **CORS Configuration** - Proper cross-origin request handling
- **Environment Variables** - Secure API key management

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

**Built with ❤️ using FastAPI, React, and OpenAI** 