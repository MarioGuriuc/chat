# Conspiracy Theory Forum - Backend API

A GraphQL-based backend API for a Conspiracy Theory Forum built with Spring Boot.

## Technology Stack

- **Java 17** with **Spring Boot 3.2.5**
- **GraphQL** (Spring GraphQL)
- **PostgreSQL** database (H2 for testing)
- **JWT Authentication** (using jjwt library)
- **Spring Security** for authorization
- **Spring Data JPA** with Hibernate
- **Lombok** for reduced boilerplate

## Features

### Authentication
- User registration with optional "secret code" validation
- JWT-based login returning a token for authenticated requests
- Stateless session management

### Entities
- **User**: username, email, password, role, anonymous mode
- **Theory**: title, content, status (UNVERIFIED/DEBUNKED/CONFIRMED), evidence URLs, author, comments
- **Comment**: content, author, theory reference

### GraphQL API

#### Queries
- `theories(filter, page)` - List theories with pagination, filter by status or keyword
- `theoriesPaginated(filter, page)` - Paginated theories with metadata
- `theory(id)` - Get single theory with nested comments
- `theoriesByUser(userId)` - List theories by a specific user
- `hotTheories(page)` - Theories sorted by comment count
- `commentsByTheory(theoryId, page)` - Comments for a theory
- `comment(id)` - Get single comment
- `user(id)` - Get user by ID
- `me` - Get current authenticated user

#### Mutations
- `register(input)` - Register new user
- `login(input)` - Authenticate and get JWT token
- `createTheory(input)` - Create new theory (requires auth)
- `updateTheory(id, input)` - Update own theory (requires auth)
- `deleteTheory(id)` - Delete own theory (requires auth)
- `createComment(input)` - Add comment to theory (requires auth)
- `updateComment(id, content)` - Update own comment (requires auth)
- `deleteComment(id)` - Delete own comment (requires auth)
- `setAnonymousMode(anonymous)` - Toggle anonymous posting (requires auth)

### Validation
- Theory title: minimum 5 characters
- Theory content: minimum 20 characters
- Comment content: minimum 10 characters
- Error messages returned for validation failures

### Anonymous Posting
- Users can post theories and comments anonymously
- Author names shown as "Anonymous Truth Seeker" for anonymous posts

## Configuration

### Environment Variables
- `DB_USERNAME` - PostgreSQL username (default: postgres)
- `DB_PASSWORD` - PostgreSQL password (default: postgres)
- `JWT_SECRET` - Base64 encoded JWT secret key
- `FORUM_SECRET_CODE` - Optional secret code for registration (default: TINFOIL2024)

### Application Properties
See `src/main/resources/application.yml` for all configuration options.

## Running the Application

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL database

### Build and Run
```bash
# Build the project
mvn clean package

# Run the application
mvn spring-boot:run

# Run tests
mvn test
```

### GraphiQL Interface (Interactive API Testing)
When running, access the GraphQL playground at: `http://localhost:8080/graphiql`

GraphiQL provides:
- **Interactive query builder** - Write and execute GraphQL queries/mutations
- **Auto-completion** - Schema-aware suggestions as you type
- **Documentation explorer** - Browse available queries, mutations, and types
- **Query history** - Access previously executed queries
- **Response viewer** - See formatted JSON responses

**Note:** For GraphQL APIs, GraphiQL serves as the equivalent of Swagger for REST APIs. It provides full interactive documentation and testing capabilities.

## API Usage Examples

### Register
```graphql
mutation {
  register(input: {
    username: "truthseeker"
    email: "truth@example.com"
    password: "secret123"
    secretCode: "TINFOIL2024"
  }) {
    token
    username
    userId
    message
  }
}
```

### Login
```graphql
mutation {
  login(input: {
    username: "truthseeker"
    password: "secret123"
  }) {
    token
    username
    message
  }
}
```

### Create Theory (requires Authorization header with JWT)
```graphql
mutation {
  createTheory(input: {
    title: "The Moon Landing Truth"
    content: "Here is my detailed theory about what really happened..."
    status: UNVERIFIED
    evidenceUrls: ["https://example.com/evidence1"]
    anonymousPost: false
  }) {
    id
    title
    status
    authorName
  }
}
```

### Query Theories
```graphql
query {
  theories(filter: { status: UNVERIFIED, keyword: "moon" }, page: { page: 1, size: 10 }) {
    id
    title
    content
    status
    authorName
    commentCount
  }
}
```

## Security

- JWT tokens expire after 24 hours
- Passwords are hashed using BCrypt
- CSRF protection is disabled for stateless API (JWT-based auth)
- Users can only modify/delete their own content

## License

This project is for educational purposes.