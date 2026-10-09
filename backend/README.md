# University Research Opportunity Portal

## Project Overview

The University Research Opportunity Portal is a web application that allows users to manage university research opportunities. Users can view available projects, add new opportunities, update existing information, close opportunities, and delete records.

The application uses a Node.js and Express backend, a MySQL database, and an HTML, CSS, JavaScript, and Bootstrap frontend.

## Technologies Used

- Frontend: HTML, CSS, JavaScript, Bootstrap
- Backend: Node.js, Express.js
- Database: MySQL
- API Testing: Postman
- Development Environment: Ubuntu Linux and Visual Studio Code
- Version Control: Git and GitHub

## Main Features

- View all research opportunities
- View an individual opportunity through the REST API
- Add new research opportunities
- Update existing opportunities
- Change an opportunity's status from Open to Closed
- Delete research opportunities
- Validate required fields
- Display success and error messages
- Store and retrieve data using MySQL

## Project Structure

```text
research-opportunity-portal/
├── backend/
│   ├── routes/
│   │   └── opportunities.js
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── database/
│   └── schema.sql
├── postman/
│   └── Research Opportunity Portal API.json
├── .gitignore
└── README.md
```

Note: The `.env` file contains private database credentials and must not be uploaded to GitHub.

## Requirements

Install the following software before running the project:

- Node.js and npm
- MySQL Server
- Git (optional, for cloning and version control)

## Database Setup

1. Open a terminal in the project directory.
2. Run the following command to create the database and table:

```bash
sudo mysql < database/schema.sql
```

3. Create a MySQL user and grant it access to the `research_portal` database if you have not already done so.

## Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory with your own database credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=research_user
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=research_portal
DB_PORT=3306
```

Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password. Never publish the real password.

Start the backend:

```bash
npm run dev
```

The backend will run at:

http://localhost:5000

The frontend will be available at:

http://localhost:5000/portal/

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/opportunities` | Create a research opportunity |
| GET | `/api/opportunities` | Retrieve all opportunities |
| GET | `/api/opportunities/:id` | Retrieve one opportunity |
| PUT | `/api/opportunities/:id` | Update an opportunity |
| DELETE | `/api/opportunities/:id` | Delete an opportunity |

## HTTP Status Codes

- `200 OK`: Request completed successfully.
- `201 Created`: Research opportunity created successfully.
- `400 Bad Request`: Invalid or missing input.
- `404 Not Found`: Research opportunity does not exist.
- `500 Internal Server Error`: Unexpected server error.

## API Testing

The API was tested using Postman. Tests include creating opportunities, retrieving all opportunities, retrieving one opportunity, updating records, closing opportunities, deleting records, checking deleted records, and submitting invalid data.

The exported Postman collection is included in the `postman` directory.

## GitHub Repository

GitHub repository: Add your repository link here.

## Demo Video

Demo video: Add your video link here.