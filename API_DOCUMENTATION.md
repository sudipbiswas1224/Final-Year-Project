# Mental Health Chatbot - Frontend API Documentation

**Base URL:** `http://localhost:5000`  
**Version:** 1.0.0  
**Last Updated:** December 2025

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Assessment System](#assessment-system)
3. [Recommendations](#recommendations)
4. [Analytics](#analytics)
5. [Chat System](#chat-system)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)
8. [Frontend Implementation Guide](#frontend-implementation-guide)

---

## 🔐 Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "displayName": "John Doe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65d4f3c8a1b2c3d4e5f6g7h8",
    "displayName": "John Doe",
    "email": "user@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Email already in use"
}
```

**Frontend Implementation:**
```javascript
async function register(email, password, displayName) {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store token in localStorage or secure storage
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } else {
    throw new Error(data.error);
  }
}
```

---

### Login User

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65d4f3c8a1b2c3d4e5f6g7h8",
    "displayName": "John Doe",
    "email": "user@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Frontend Implementation:**
```javascript
async function login(email, password) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } else {
    throw new Error(data.error);
  }
}
```

---

## 📝 Assessment System

### Get All Available Tests

**Endpoint:** `GET /api/assessment/tests`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  "PHQ-9",
  "GAD-7",
  "PSS",
  "WHO-5",
  "ISI"
]
```

**Frontend Implementation:**
```javascript
async function getAvailableTests() {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:5000/api/assessment/tests', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}
```

---

### Get Test Template (Questions)

**Endpoint:** `GET /api/assessment/template/:type`

**Path Parameters:**
- `type`: Test name (e.g., "PHQ-9", "GAD-7", "PSS", "WHO-5", "ISI")

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "_id": "65d4f3c8a1b2c3d4e5f6g7h8",
  "name": "PHQ-9",
  "scoringLogic": "phq9",
  "questions": [
    {
      "text": "Little interest or pleasure in doing things?",
      "choices": [
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
      ],
      "scores": [0, 1, 2, 3]
    },
    {
      "text": "Feeling down, depressed, or hopeless?",
      "choices": [
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
      ],
      "scores": [0, 1, 2, 3]
    }
    // ... 7 more questions
  ]
}
```

**Frontend Implementation:**
```javascript
async function getTestTemplate(testType) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`http://localhost:5000/api/assessment/template/${testType}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}
```

---

### Submit Assessment

**Endpoint:** `POST /api/assessment/submit`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "testType": "PHQ-9",
  "responses": [0, 1, 2, 3, 1, 2, 0, 1, 0],
  "phase": "initial"
}
```

**Field Descriptions:**
- `testType`: Name of the assessment (must match available tests)
- `responses`: Array of numeric scores (one per question)
  - PHQ-9: 9 questions, scores 0-3
  - GAD-7: 7 questions, scores 0-3
  - PSS: 10 questions, scores 0-4
  - WHO-5: 5 questions, scores 0-5
  - ISI: 7 questions, scores 0-4
- `phase`: String indicating assessment phase (e.g., "initial", "followup", "final")

**Success Response (201):**
```json
{
  "totalScore": 13,
  "interpretation": "Moderate depression",
  "feedback": "You're showing signs of moderate depression. Scheduling time for self-care and reaching out to a mental health professional is recommended.",
  "resultId": "65d4f3c8a1b2c3d4e5f6g7h8"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid responses"
}
```

**Frontend Implementation:**
```javascript
async function submitAssessment(testType, responses, phase = 'initial') {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:5000/api/assessment/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ testType, responses, phase })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return await response.json();
}
```

---

### Get Assessment History

**Endpoint:** `GET /api/assessment/history/:userId`

**Path Parameters:**
- `userId`: User ID (get from logged-in user data)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "_id": "65d4f3c8a1b2c3d4e5f6g7h8",
    "userId": "65d4f3c8a1b2c3d4e5f6g7h8",
    "testType": "PHQ-9",
    "responses": [0, 1, 2, 3, 1, 2, 0, 1, 0],
    "totalScore": 13,
    "interpretation": "Moderate depression",
    "phase": "initial",
    "date": "2025-12-01T10:30:00.000Z",
    "feedback": "You're showing signs of moderate depression..."
  },
  {
    "_id": "65d4f3c8a1b2c3d4e5f6g7h9",
    "userId": "65d4f3c8a1b2c3d4e5f6g7h8",
    "testType": "GAD-7",
    "responses": [1, 2, 1, 0, 1, 2, 1],
    "totalScore": 8,
    "interpretation": "Mild anxiety",
    "phase": "initial",
    "date": "2025-12-02T14:20:00.000Z",
    "feedback": "Mild anxiety detected..."
  }
]
```

**Frontend Implementation:**
```javascript
async function getAssessmentHistory(userId) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`http://localhost:5000/api/assessment/history/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}
```

---

### Get Progress for Specific Test

**Endpoint:** `GET /api/assessment/:userId/:testType`

**Path Parameters:**
- `userId`: User ID
- `testType`: Test name (e.g., "PHQ-9")

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "_id": "65d4f3c8a1b2c3d4e5f6g7h8",
    "userId": "65d4f3c8a1b2c3d4e5f6g7h8",
    "testType": "PHQ-9",
    "totalScore": 13,
    "interpretation": "Moderate depression",
    "date": "2025-11-01T10:30:00.000Z"
  },
  {
    "_id": "65d4f3c8a1b2c3d4e5f6g7h9",
    "userId": "65d4f3c8a1b2c3d4e5f6g7h8",
    "testType": "PHQ-9",
    "totalScore": 9,
    "interpretation": "Mild depression",
    "date": "2025-12-01T10:30:00.000Z"
  }
]
```

**Frontend Implementation:**
```javascript
async function getTestProgress(userId, testType) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`http://localhost:5000/api/assessment/${userId}/${testType}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}
```

---

## 🎯 Recommendations

### Get Personalized Recommendations

**Endpoint:** `GET /api/recommendations/personalized`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "_id": "1",
        "type": "activity",
        "title": "5-4-3-2-1 Grounding",
        "description": "Identify 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste."
      }
    ],
    "videos": [],
    "articles": [],
    "music": []
  }
}
```

**Frontend Implementation:**
```javascript
async function getRecommendations() {
  const token = localStorage.getItem('authToken');

  const response = await fetch('http://localhost:5000/api/recommendations/personalized', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
}
```

---

## 📊 Analytics

### Get Available Tests (Dashboard/Analytics)

**Endpoint:** `GET /api/analytics/tests/list`

*Note: This operates similarly to the assessment tests endpoint, allowing analytics services to dynamically query available tests.*

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  "PHQ-9",
  "GAD-7",
  "PSS",
  "WHO-5",
  "ISI"
]
```

---

### Get Test Template (Analytics context)

**Endpoint:** `GET /api/analytics/tests/:type`

**Path Parameters:**
- `type`: Test name (e.g., "PHQ-9")

**Headers:**
```
Authorization: Bearer <token>
```

---

## � Chat System

*Note: The Chat & Analysis backend services are currently under development. Endpoints will be available in future releases (e.g., `POST /api/analysis/chat`).*

---

## �📦 Data Models

### User Object
```typescript
interface User {
  id: string;
  email: string;
  profile: {
    displayName: string;
    avatar?: string;
    timezone: string;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
  stats: {
    totalMessages: number;
    totalSessions: number;
    lastActive: Date;
    joinDate: Date;
  };
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
}
```

### Assessment Result
```typescript
interface AssessmentResult {
  _id: string;
  userId: string;
  testType: string;
  responses: number[];
  totalScore: number;
  interpretation: string;
  phase: string;
  date: Date;
  feedback: string;
}
```



### Validation Errors (400)
```json
{
  "success": false,
  "error": "Validation error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Authentication Errors (401)
```json
{
  "success": false,
  "error": "Access token missing"
}
```

### Authorization Errors (403)
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### Not Found Errors (404)
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### Server Errors (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 🎨 Frontend Implementation Guide

### 1. Authentication Flow

```javascript
// Store auth token and user data
class AuthService {
  login(email, password) {
    // Call login API
    // Store token in localStorage or secure storage
  }
  
  register(email, password, displayName) {
    // Call register API
    // Store token
  }
  
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
  
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
  
  getToken() {
    return localStorage.getItem('authToken');
  }
  
  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}
```

### 2. Assessment Flow

**Recommended UI Flow:**

1. **Test Selection Screen**
   - Fetch available tests: `GET /api/assessment/tests`
   - Display cards/list of available assessments

2. **Test Taking Screen**
   - Fetch test template: `GET /api/assessment/template/:type`
   - Display questions one-by-one or all at once
   - Collect user responses (array of numbers)
   - Submit: `POST /api/assessment/submit`

3. **Results Screen**
   - Display `totalScore`, `interpretation`, and `feedback`
   - Show severity level (color-coded)
   - Offer to save or share results

4. **Progress/History Screen**
   - Fetch history: `GET /api/assessment/history/:userId`
   - Display timeline or chart of past assessments
   - Show progress for specific test: `GET /api/assessment/:userId/:testType`

**Example React Component:**

```jsx
function AssessmentTaker({ testType }) {
  const [template, setTemplate] = useState(null);
  const [responses, setResponses] = useState([]);
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    async function loadTest() {
      const data = await getTestTemplate(testType);
      setTemplate(data);
      setResponses(new Array(data.questions.length).fill(null));
    }
    loadTest();
  }, [testType]);
  
  async function handleSubmit() {
    const result = await submitAssessment(testType, responses);
    setResult(result);
  }
  
  if (result) {
    return (
      <div>
        <h2>Your Results</h2>
        <p>Score: {result.totalScore}</p>
        <p>Interpretation: {result.interpretation}</p>
        <p>{result.feedback}</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2>{template?.name} Assessment</h2>
      {template?.questions.map((q, idx) => (
        <div key={idx}>
          <p>{q.text}</p>
          {q.choices.map((choice, cIdx) => (
            <label key={cIdx}>
              <input
                type="radio"
                name={`q${idx}`}
                value={q.scores[cIdx]}
                onChange={() => {
                  const newResponses = [...responses];
                  newResponses[idx] = q.scores[cIdx];
                  setResponses(newResponses);
                }}
              />
              {choice}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```



**Recommended UI Flow:**

1. **Chat Interface**
   - Text input for user message
   - Display messages in scrollable container
   - Show typing indicator during API call

2. **Message Handling**
   - Store `conversationId` in component state
   - Send message: `POST /chat/send`
   - Append user message and bot response to UI
   - Pass `conversationId` for continuity

3. **Crisis Detection**
   - Monitor `crisisLevel` in response
   - If "high" or "medium", show warning banner
   - Provide crisis resources/hotline numbers

**Example React Component:**

```jsx
function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleSend() {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await sendChatMessage(input, conversationId);
      
      if (!conversationId) {
        setConversationId(response.conversationId);
      }
      
      const botMessage = {
        role: 'assistant',
        content: response.message,
        metadata: response.metadata
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Handle crisis detection
      if (response.crisisLevel !== 'none') {
        showCrisisAlert(response.crisisLevel);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && <div className="typing-indicator">...</div>}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

### 4. Error Handling

```javascript
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 401) {
        // Token expired, redirect to login
        window.location.href = '/login';
      } else if (response.status === 403) {
        throw new Error('You do not have permission');
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

---

## 🔒 Security Best Practices

1. **Token Storage**
   - Store JWT securely (consider HttpOnly cookies for production)
   - Never expose tokens in URLs
   - Clear tokens on logout

2. **Input Validation**
   - Validate all user inputs on frontend before sending
   - Sanitize text inputs to prevent XSS

3. **HTTPS**
   - Use HTTPS in production
   - Never send credentials over HTTP

4. **Rate Limiting**
   - Be aware of rate limits on chat endpoints
   - Implement request throttling on frontend

5. **Error Messages**
   - Don't expose sensitive info in error messages to users
   - Log errors for debugging but show user-friendly messages

---

## 📱 Recommended UI Screens

### 1. Auth Screens
- Login page
- Registration page
- Password reset (if implemented)

### 2. Dashboard
- Overview of recent assessments
- Quick links to chat and new assessment
- User stats

### 3. Assessment Section
- Test selection
- Test taking interface
- Results display
- History/progress charts

### 4. Chat Section
- Chat interface
- Conversation history list
- Crisis resources banner (if detected)

### 5. Profile Section
- User info display
- Preferences (theme, language)
- Account settings

---

## 🧪 Testing Endpoints

Use these curl commands or Postman collections:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","displayName":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'

# Get tests (replace TOKEN)
curl -X GET http://localhost:5000/api/assessment/tests \
  -H "Authorization: Bearer TOKEN"

# Submit assessment
curl -X POST http://localhost:5000/api/assessment/submit \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"testType":"PHQ-9","responses":[0,1,2,1,0,1,2,1,0],"phase":"initial"}'


**End of Documentation**
