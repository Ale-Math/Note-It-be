# Note-It-be

A simple, TypeScript-based backend for a note-taking and todo application. This project uses Node.js, Express, MongoDB (with Mongoose), JWT authentication, Bycrpt for password hashing and Zod for input validation. Deployed app available at https://noteit.alexandermathew.co.in

---

## Features

- User authentication (signup/signin) with hashed passwords and JWT tokens
- Create, view, and delete todo items linked to user accounts
- Input validation using Zod schemas
- RESTful API structure
- Written in TypeScript for better reliability and maintainability

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/Ale-Math/Note-It-be.git
   cd Note-It-be
   ```

2. **Install dependencies**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory based on the following template:

   ```env
   DATABASE_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Build the project**

   ```sh
   npm run build
   ```

5. **Start the server**
   ```sh
   npm run start
   ```
   The server will start on `http://localhost:3000`.

---

## API Endpoints

Base URL: `/api/v1`

### Authentication

- `POST /signup` — Register a new user  
  **Body:** `{ name, email, password }`

- `POST /signin` — Authenticate and receive a JWT  
  **Body:** `{ email, password }`

### Todos

- `POST /todo` — Create a new todo (requires JWT in Authorization header)  
  **Body:** `{ todo, description, done? }`
- `DELETE /todo/:todo` — Delete a specific todo (requires JWT)
- `GET /userdetails` — Get user details (requires JWT)

---

## Project Structure

```
src/
  ├── authentication.ts    # JWT middleware
  ├── db.ts                # Mongoose models
  ├── index.ts             # App entry point
  ├── routes.ts            # API routes
  └── types/
        ├── express/       # Express type extensions
        └── types.ts       # Zod schemas
```

---

## Scripts

- `npm run build` — Compile TypeScript
- `npm run start` — Run compiled code
- `npm run dev` — Build and start

---

## Contributing

Issues and pull requests are welcome!  
Please open an issue to discuss your ideas or bugs.

---

## License

This project is licensed under the ISC License.

---

## Notes

- Remember to keep your JWT secret and MongoDB credentials safe.
- For improvements, see the [issues](https://github.com/Ale-Math/Note-It-be/issues) or open a new one!
