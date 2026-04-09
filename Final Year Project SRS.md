# **Full Project Specification Document (With Descriptions Added for All Pages, Components & Endpoints)**
### *AI-Based Mental Well-Being & Emotional Support Platform*
### *For Team Members, Developers & AI Code Assistants*

---
# **1. INTRODUCTION**
This document defines the **complete, detailed, end-to-end specification** for the AI-Based Mental Well-Being & Emotional Support Platform. It includes descriptions for **every page, component, endpoint, and module** so developers know exactly what each part does.

---
# **2. VALIDATED ASSESSMENT TOOLS USED IN THE PROJECT**
(Standard medical tools used worldwide)
- **PHQ-9** – Measures depression severity.
- **GAD-7** – Measures anxiety severity.
- **PSS** – Measures perceived stress.
- **WHO-5** – Measures overall well-being.
- **ISI** – Measures insomnia severity.

---
# **3. PROJECT OVERVIEW**
Platform features:
- Journaling
- NLP emotion + stress analysis
- Validated mental health assessments
- AI chatbot for emotional support
- Recommendations
- SOS/Crisis detection

---
# **4. CORE MODULES / FEATURES**

## **4.1 USER MANAGEMENT**
(Handles all authentication and user profile operations)
- Register / Login
- Manage profile
- Change password
- Delete account

---
## **4.2 JOURNALING MODULE**
(Allows users to write and store private journal entries)
- Create journal entry
- Edit/Delete entries
- Auto-save
- AES-256 encryption
- NLP analysis on each entry

**Analysis includes:** emotion, sentiment, stress, keywords, distortions, crisis detection.

---
## **4.3 NLP ANALYSIS MODULE**
(Processes journal/chat text using ML models)
- Extract emotions
- Detect stress level
- Identify self-harm risk
- Return insights to backend

---
## **4.4 MENTAL HEALTH ASSESSMENTS**
(Users take clinically validated psychological tests)
- Each test on separate page
- Backend computes scores
- Generates personalized recommendations

---
## **4.5 AI CHATBOT MODULE**
(Chat-based emotional support & assessment guidance)
- Provide empathetic responses
- Optional conversational assessment
- Crisis detection
- Suggest recommendations

---
## **4.6 RECOMMENDATION ENGINE**
(Provides personalized well-being actions)
- Based on journals, mood trends, tests
- Suggests music, exercises, sleep tips

---
## **4.7 CRISIS / SOS SYSTEM**
(Detects suicide risk or emotional crisis)
- High-risk text triggers SOS
- Show helplines & grounding techniques
- Log crisis event

---
## **4.8 DOCTOR DIRECTORY**
(Helps users find mental health professionals)
- City-based filtering
- Displays name, phone, specialization

---
## **4.9 MENTAL HEALTH DASHBOARD**
(Visualizes mood and assessment history)
- Graphs for trends
- Keywords cloud
- Emotion timelines

---
# **5. FRONTEND SYSTEM (React/Next.js + Tailwind)**

# **Frontend Pages With Descriptions**

### `/login` – User login page.
### `/register` – New user registration page.
### `/dashboard` – Shows mood trends, recommendations, and recent activity.
### `/journal` – Page listing all journal entries.
### `/journal/new` – Page to create a new journal entry.
### `/journal/:id` – View or edit a specific journal.
### `/assessments` – Overview of all psychological tests.
### `/assessments/phq9` – Depression test page.
### `/assessments/gad7` – Anxiety test page.
### `/assessments/pss` – Stress test page.
### `/assessments/who5` – Well-being test page.
### `/assessments/isi` – Insomnia test page.
### `/chatbot` – AI chat interface for emotional support.
### `/profile` – User profile information.
### `/settings` – Privacy & account settings.
### `/sos` – Emergency support & helpline page.

---
# **Frontend Components With Descriptions**

### **JournalCard** – Displays preview of a journal (title, date, emotion).
### **JournalEditor** – Text editor for writing journal entries.
### **EmotionInsightCard** – Shows emotional analysis results of a journal.
### **AssessmentQuestion** – Component for displaying one question of a test.
### **ScoreSummary** – Shows score, severity, and explanation.
### **TrendGraph** – Graphs for emotion and score trends.
### **ChatBubble** – Displays chat messages from user or bot.
### **ChatInput** – Input field to send messages to chatbot.
### **SOSModal** – Popup when crisis detected.
### **RecommendationCard** – Shows suggested activities.
### **DoctorCard** – Displays information about a doctor.

---
# **6. BACKEND SYSTEM (Node.js + Express)**

# **Backend Endpoints With Descriptions**

---
## **AUTH ENDPOINTS**

### **POST `/auth/register`** – Register a new user.
### **POST `/auth/login`** – Authenticate user & return JWT token.

---
## **JOURNAL ENDPOINTS**

### **POST `/journal/create`** – Create a new journal entry.
### **PUT `/journal/update/:id`** – Update an existing journal.
### **DELETE `/journal/delete/:id`** – Delete a journal entry.
### **GET `/journal/all`** – Fetch all journals of the logged-in user.

---
## **ASSESSMENT ENDPOINTS**

### **POST `/assessment/phq9/submit`** – Submit PHQ-9 answers & compute depression score.
### **POST `/assessment/gad7/submit`** – Submit GAD-7 answers & compute anxiety score.
### **POST `/assessment/pss/submit`** – Submit PSS answers & compute stress score.
### **POST `/assessment/who5/submit`** – Submit WHO-5 answers & compute well-being score.
### **POST `/assessment/isi/submit`** – Submit ISI answers & compute insomnia severity.
### **GET `/assessment/history`** – Fetch history of all assessments taken.

---
## **NLP ANALYSIS ENDPOINTS**

### **POST `/analysis/journal`** – Analyze journal text for emotion & crisis.
### **POST `/analysis/chat`** – Analyze chat message & detect emotional state.
### **POST `/analysis/sos`** – Detect crisis-related words or patterns.

---
## **RECOMMENDATIONS ENDPOINT**

### **GET `/recommendations/personalized`** – Fetch personalized suggestions based on user’s emotional data.

---
## **DOCTOR LIST ENDPOINT**

### **GET `/doctors/list`** – Fetch available mental health professionals.

---
## **CRISIS LOGGING ENDPOINT**

### **POST `/crisis/log`** – Store crisis-triggered events for safety monitoring.

---
# **7. NLP MICROSERVICE (FastAPI)**

# **NLP Endpoints With Descriptions**

### **POST `/analyze-text`** – Returns emotion, sentiment, stress score, keywords, distortions, crisis probability.
### **POST `/detect-crisis`** – Checks text for suicidal/self-harm likelihood.
### **POST `/recommend`** – Generates personalized well-being recommendations.
### **POST `/chat-response`** – Generates chatbot’s empathetic reply.

---
# **8. DATABASE STRUCTURE (MongoDB)**

### **users** – Stores user profile & credentials.
### **journals** – Stores encrypted journals + analysis.
### **assessments** – Stores results of psychological tests.
### **chat_logs** – (Optional) Stores chatbot conversation history.
### **crisis_events** – Stores logs of detected crisis moments.

---
# **9. SECURITY REQUIREMENTS**
- AES encryption for journals
- JWT authentication
- Rate limiting
- Secure API key

---
# **10. DEPLOYMENT REQUIREMENTS**
- Frontend → Vercel
- Backend → Render/Railway
- NLP service → Railway/Docker
- Database → MongoDB Atlas

---
# **11. COMPLETE SYSTEM WORKFLOW**

### **Journal Workflow:**
- User writes → encrypted → NLP → dashboard → crisis check.

### **Assessment Workflow:**
- User selects test → answers → backend calculates → recommendations → SOS if severe.

### **Chatbot Workflow:**
- User chats → NLP → chatbot responds → crisis detection.

---
# **12. IMPLEMENTATION CHECKLIST**
(Tasks for frontend, backend, NLP & security modules)

---
# **13. FUTURE SCOPE**
- Voice emotion AI
- Meditation generator
- Offline journaling
- Sleep tracking

---
# **14. SUMMARY**
This document now contains **complete descriptions for every endpoint, component, and page**, making it fully ready for development and teamwork.

