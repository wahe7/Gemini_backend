# Gemini Backend

A Node.js backend service that integrates with Google's Gemini AI for generating responses, along with chatroom and subscription management features.

## Features

- Integration with Google's Gemini AI for text generation
- Chatroom management
- Subscription handling with Stripe
- Background job processing

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API Key
- Stripe Account (for payment processing)
- Redis (for job queue)
- PostgreSQL (for database)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/geminidb"

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gemini-backend.git
   cd gemini-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run start` - Start the production server
- `npm run build` - Build the application
- `npx prisma studio` - Open Prisma Studio for database management

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── jobs/          # Background jobs
├── middlewares/   # Express middlewares
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
└── utils/         # Utility functions
```

## API Documentation

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

### Authentication & User
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /user/me` - Get current user (Requires authentication)
- `GET /user/subscription` - Get subscription details (Requires authentication)

### Chatrooms
- `GET /chatroom` - Get all chatrooms (Requires authentication)
- `POST /chatroom` - Create a new chatroom (Requires authentication)
- `GET /chatroom/:id` - Get a specific chatroom by ID (Requires authentication)
- `POST /chatroom/:id/message` - Send a message to a chatroom (Requires authentication)

### Subscriptions
- `POST /subscribe/pro` - Create a checkout session for Pro subscription (Requires authentication)
- `POST /webhook/stripe` - Stripe webhook for payment events (Used internally by Stripe)

## Deployment

1. Set up your production environment variables
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue or contact the maintainers.
