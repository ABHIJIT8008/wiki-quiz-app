# WikiQuiz AI - Full Stack GenAI Application

A full-stack application that scrapes Wikipedia articles and uses Google Gemini AI to generate interactive quizzes. Built with React, FastAPI, PostgreSQL, and Docker.

## 🚀 Features
- **URL Scraping:** Extracts clean text from any Wikipedia article.
- **AI-Powered Generation:** Uses LangChain + Gemini Flash to generate relevant multiple-choice questions.
- **Interactive Gameplay:** Play quizzes with instant feedback and score tracking.
- **History Dashboard:** PostgreSQL database stores all generated quizzes for later replay.
- **Responsive UI:** Built with Tailwind CSS and React.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** FastAPI, Python 3.11, SQLAlchemy
- **Database:** PostgreSQL 15
- **AI Engine:** LangChain, Google Gemini (gemini-flash-latest)
- **Infrastructure:** Docker & Docker Compose

## 📦 Setup & Installation

### Prerequisites
- Docker Desktop installed and running.
- A Google Gemini API Key.

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/ABHIJIT8008/wiki-quiz-app.git
   cd wiki-quiz-app