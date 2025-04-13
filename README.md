# Project Allocation Process and Evaluation System

A full-stack web application designed to streamline the allocation of mentors to student teams and manage project evaluations efficiently. The system provides interfaces for students, mentors, admins, and sub-admins to facilitate a smooth project workflow in academic or organizational environments.

## 🔧 Features

- **User Roles**: Supports Admin, Sub-Admin, Mentor, and Student roles.
- **Team Management**: Create, view, and manage teams of students.
- **Mentor Allocation**: Manual and automated mentor assignment to student teams.
- **Evaluation Module**: Evaluators can score projects based on defined criteria.
- **Authentication & Authorization**: Secure role-based access.
- **Clean UI**: Responsive frontend built with React.

## 🧠 Tech Stack

### Frontend
- **React.js** (with Vite)
- **Tailwind CSS**
- **Axios** for API requests

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **Firebase** (if integrated for authentication or real-time features)

### Others
- **JWT** for user authentication
- **Role-based access control**
- **Git** and **GitHub** for version control

## 🗂️ Project Structure

project-allocation-process-and-evaluation/ ├── backend/ │ ├── models/ # MongoDB schemas │ ├── routes/ # API endpoints │ ├── controllers/ # Request handlers │ ├── middlewares/ # Auth and role checks │ └── app.js # Main backend entry ├── frontend/ │ ├── src/ │ │ ├── components/ # UI components │ │ ├── pages/ # Page views │ │ ├── services/ # API services │ │ └── App.jsx # Main frontend entry └── README.md

bash
Copy
Edit

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB
- npm or yarn

### Clone the repository
git clone https://github.com/bhavyajain-prog/project-allocation-process-and-evaluation
cd project-allocation-process-and-evaluation
Backend Setup
bash
Copy
Edit
cd backend
npm install
# Create a `.env` file with required environment variables (e.g., DB_URI, JWT_SECRET)
npm start
Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
🧪 API Routes Overview
Team Allocation
GET /left-over-teams - Fetch unassigned teams

POST /allocate/:teamCode/:mentorId - Manually assign a mentor

Users & Auth (Sample)
POST /register

POST /login

GET /profile

🔐 Roles & Permissions
Role	Permissions
Admin	Full access: manage users, teams, mentors, evals
Sub-Admin	Limited admin actions
Mentor	View teams, give evaluations
Student	Join team, view project info
📌 Future Enhancements
Automated allocation logic

Notification system (email/real-time)

Enhanced dashboard analytics

Evaluation reporting/exporting

🤝 Contributing
Contributions are welcome! Please fork the repo and submit a pull request for any improvements or bug fixes.

📄 License
MIT License

Built with ❤️ by Bhavya Jain and team
