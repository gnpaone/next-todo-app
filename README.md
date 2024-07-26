# Next Todo App

## Getting Started

Follow these instructions to get a copy of my todo app up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

### Setting up

1. Clone the repository
   `git clone https://github.com/gnpaone/next-todo-app.git`
2. Navigate to the backend directory
   `cd backend`
3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   DB_URL=<your-mongodb-url>
   COOKIE_TIME=<cookie-expiry-time>
   JWT_SECRET_KEY=<your-jwt-secret-key>
   JWT_EXPIRY=<jwt-expiry-time>
   ```
4. Install the required packages
   `npm install`
5. Start the backend server
   `npm run dev`
6. Navigate to the frontend directory
   `cd frontend`
7. Create a `.env.local` file in the `frontend` directory with the following variables:
   ```
   BE_URL=<your-backend-url>
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
   ```
8. Install the required packages
   `npm install`
9. Start the backend server
   `npm run dev`

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [React](https://reactjs.org/) - Frontend library
- [Next.js](https://nextjs.org/) - React framework for server-side rendering

## Authors

- **Naveen Prashanth** - *[gnpaone.github.io](https://gnpaone.github.io)* - [gnpaone](https://github.com/gnpaone)

## License

This project is licensed under the BSD 3-Clause License - see the [LICENSE.md](LICENSE.md) file for details.
