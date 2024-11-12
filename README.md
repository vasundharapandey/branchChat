


A Message Management System built to enable agents to view, respond to, and manage customer messages efficiently.

## Features

- **View Messages**: Easily browse through customer messages.
- **Reply to Messages**: Send personalized responses to customer inquiries.
- **Message Management**: Organize, filter, and manage messages seamlessly.

## Prerequisites

Ensure the following tools are installed on your system:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **Prisma** (v4.0.0 or higher)

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository


### 2. Navigate to Project Directory



### 3. Install Dependencies

```bash
npm install
```

### 4. Configure the Database

- **Install Prisma CLI** (if not already installed globally):
  ```bash
  npm install -g prisma
  ```
- **Initialize Prisma**:
  ```bash
  prisma init
  ```
- **Define Database Models**: Update the `schema.prisma` file with your data models.
- **Apply Migrations**:
  ```bash
  prisma migrate dev
  ```

### 5. Run the Development Server

```bash
npm run dev
```
Also to run backend
```bash
npm run server
```

## API Endpoints

### Message Management

- **Fetch Messages**: `GET /api/messages` - Retrieves a paginated list of messages.
- **Create Message**: `POST /api/messages` - Submits a new message to the system.
- **Reply to Message**: `POST /api/messages/:id/reply` - Sends a reply to a specified message.

## Usage Guide

1. Open a browser and go to `http://localhost:3000`.
2. View and select messages to read their contents.
3. Use the reply feature to respond to messages directly.
4. Utilize filters and quick reply options for efficient management.



- **Reporting Issues**: Identify and report any bugs or feature requests.
- **Code Contributions**: Submit pull requests with improvements or new features.

## License

Distributed under the [MIT License](LICENSE).
