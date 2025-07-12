# Motionboard App

## Overview
Motionboard is a web application designed to manage user accounts and related operations. It utilizes TypeORM for database interactions and follows a clean architecture pattern to ensure maintainability and scalability.

## Project Structure
The project is organized into several directories, each serving a specific purpose:

- **src/**: Contains the source code for the application.
  - **app.ts**: Entry point of the application, initializes the Express app and sets up middleware and routes.
  - **config/**: Configuration files, including database connection settings.
  - **controllers/**: Contains controller files that handle HTTP requests and responses.
  - **entities/**: Defines the database entities, including a base entity for common fields.
  - **repositories/**: Contains repository classes for database operations.
  - **routes/**: Defines the application routes and maps them to controller functions.
  - **usecases/**: Contains business logic for user operations, such as registration and login.
  - **types/**: Defines TypeScript types and interfaces used throughout the application.

## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd motionboard-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure the database**:
   Update the database connection settings in `src/config/db.ts` to match your local database configuration.

4. **Run the application**:
   ```bash
   npm start
   ```

5. **Access the API**:
   The application will be running on `http://localhost:3000` (or the port specified in your configuration).

## Usage Guidelines
- **User Operations**: The application supports various user operations, including registration, login, and profile updates.
- **API Endpoints**: Refer to the routes defined in `src/routes/user.route.ts` for available API endpoints and their usage.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.