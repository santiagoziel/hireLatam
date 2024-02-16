# Insurance Policies Management API

This Express TypeScript API provides a system for managing insurance policies, including registration, creation, updating, and deletion of policies. It utilizes Node.js, npm, and a PostgreSQL database.

## Prerequisites
Before you start, ensure you have the following installed:

- Node.js
- npm
- Docker (for running a PostgreSQL database container)

## Setup
### Step 1: Clone the Repository
Clone this repository to your local machine using git clone followed by:

*https://github.com/santiagoziel/hireLatam.git*

### Step 2: Install Dependencies
Navigate to the project directory and run:

```
npm install
```
This command installs all the necessary npm packages required for the project.

### Step 3: Set Up the PostgreSQL Database
Ensure you have Docker installed and running. Then, execute the following command to start a PostgreSQL database container:

```
npm run db:start
```
This command uses Docker to run a PostgreSQL database on port 5432.

### Step 4: Environment Configuration
Create an .env file in the root directory of the project (the same level as package.json) and add the following environment variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_DATABASE=service_db
SECRET_KEY=insecure
```
These variables are necessary for the application to connect to the database and for other configurations.

### Step 5: Running the Server
To start the server, run:
```
npm run dev
```
The server will start on port 5000. 

**If you encounter a ConnectionRefusedError [SequelizeConnectionRefusedError]: connect ECONNREFUSED ::1:5432, it indicates that the database setup is not correct.**

## API Endpoints
The API provides the following endpoints:

1. Register User
- Endpoint: POST /api/register
- Description: Registers a new user and returns a set-cookie header with a valid access token.
- Sample Body:
```json
{
    "username": "santiago"
}
```

2. Create Policy
- Endpoint: POST /api/createPolicy
- Middleware: jwtMiddleware
- Description: Allows registered users to create a new policy.
- Sample Body:
```json
{
    "info": {
        "policyholderName": "Santiago",
        "policyType": "Auto",
        "contactInformation": {
            "email": "mail@domain.extension",
            "phoneNumber": "12345"
        }
    }
}
```

3. Read Policy
- Endpoint: GET /api/readPolicy
- Middleware: jwtMiddleware
- Description: Retrieves policy information for policies created by the logged-in user.
- Sample Body:
```json
{
    "policyId": "84a84ef1-9a3d-4ddb-83f6-01437bdcee17"
}
```

4. Update Policy
- Endpoint: POST /api/updatePolicy
- Middleware: jwtMiddleware
- Description: Allows users to update information for a policy they registered.
- Sample Body:
```json
{
    "policyId": "84a84ef1-9a3d-4ddb-83f6-01437bdcee17",
    "updateData": {
        "policyType": "Home"
    }
}
```

5. Delete Policy
- Endpoint: POST /api/deletePolicy
- Middleware: jwtMiddleware
- Description: Allows users to delete a policy they have registered.
- Sample Body:
```json
{
    "policyId": "84a84ef1-9a3d-4ddb-83f6-01437bdcee17"
}
```
