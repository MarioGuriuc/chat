# 🛸 Conspiracy Theory Forum - Features & Technical Details 👁️

## Overview
A full-stack mystery discussion board for sharing and analyzing conspiracy theories with a Matrix-inspired, terminal-style UI.

## 🎯 Core Features

### 1. User Authentication & Authorization
- **User Registration**: Create account with username and secret code (minimum 6 characters)
- **User Login**: Secure authentication with token-based system
- **Anonymous Mode**: Option to post theories and comments anonymously
- **Session Management**: JWT-like token storage in localStorage
- **GraphQL Context**: Authenticated user context passed to all mutations

### 2. Theory Management
- **Create Theory**: 
  - Title (min 5 characters)
  - Content (min 10 characters)
  - Status selection (UNVERIFIED, CONFIRMED, DEBUNKED)
  - Multiple evidence URLs support
  - Input validation with error messages
  
- **View Theories**:
  - Paginated list view (10 per page)
  - Card-based layout showing title, content preview, author, status, and comment count
  - Responsive design for all screen sizes
  
- **Update Theory**: 
  - Edit existing theories (own theories only)
  - Update title, content, status, and evidence
  
- **Delete Theory**: 
  - Remove theories (own theories only)
  - Cascading delete of associated comments

### 3. Comment System
- **Add Comments**: 
  - Comment on any theory
  - Minimum 3 characters
  - Real-time updates on submission
  
- **View Comments**: 
  - Chronological display
  - Shows author and timestamp
  - Supports anonymous comments
  
- **Update/Delete Comments**:
  - Modify own comments
  - Delete own comments

### 4. Advanced Filtering & Search
- **Status Filters**: 
  - Filter by UNVERIFIED, CONFIRMED, or DEBUNKED
  - View all theories
  - Visual indicators with color coding
  
- **Keyword Search**: 
  - Search in theory titles and content
  - Case-insensitive matching
  - Real-time search results
  
- **Hot Theories**: 
  - Sort by comment count
  - Shows most discussed theories
  - Animated "🔥 HOT" indicator

### 5. Pagination
- **Frontend Pagination**: 
  - Configurable page size (default 10)
  - Page navigation controls
  - Shows current page and total pages
  
- **Backend Pagination**: 
  - Spring Data JPA Page support
  - Efficient database queries
  - Total elements count

## 🎨 User Interface Features

### Visual Design
- **Color Scheme**:
  - Dark theme (`#0a0a0a`, `#050505`)
  - Matrix green (`#00ff41`) for text and borders
  - Amber (`#ff9900`) for unverified status
  - Red (`#ff0033`) for errors and debunked theories
  
- **Typography**:
  - Monospace font (Courier New) for terminal feel
  - Consistent font sizes across components
  - Animated pulse effects on key elements
  
- **Responsive Layout**:
  - Mobile-first design
  - Breakpoints for tablets and desktops
  - Hidden elements on smaller screens

### UI Components
1. **Header**:
   - Site logo with animated pulse
   - User info display
   - Logout button
   - "TOP SECRET" classification label

2. **Login Screen**:
   - Centered modal design
   - Toggle between login and registration
   - Anonymous mode checkbox
   - Error message display
   - Terminal-style input fields

3. **Theory List**:
   - Search bar with instant filtering
   - Status filter buttons
   - Hot theories toggle
   - Grid layout for theory cards
   - Pagination controls

4. **Theory Detail**:
   - Full theory content display
   - Evidence URLs as clickable links
   - Status badge
   - Author information
   - Comment section with form
   - Back navigation

5. **Create Theory Form**:
   - Multi-field form layout
   - Dynamic evidence URL inputs
   - Status dropdown
   - Real-time validation
   - Cancel and submit actions

## 🏗️ Technical Architecture

### Backend (Spring Boot + GraphQL)

#### Technology Stack
- **Framework**: Spring Boot 3.4.1 (latest stable)
- **Java Version**: 17
- **GraphQL**: Spring GraphQL
- **Database**: PostgreSQL 15
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven

#### Project Structure
```
backend/
├── src/main/java/com/conspiracy/forum/
│   ├── ConspiracyForumApplication.java (Main class)
│   ├── model/
│   │   ├── User.java (Entity)
│   │   ├── Theory.java (Entity)
│   │   ├── Comment.java (Entity)
│   │   └── TheoryStatus.java (Enum)
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── TheoryRepository.java
│   │   └── CommentRepository.java
│   ├── service/
│   │   ├── UserService.java
│   │   ├── TheoryService.java
│   │   └── CommentService.java
│   ├── resolver/
│   │   ├── QueryResolver.java (GraphQL queries)
│   │   └── MutationResolver.java (GraphQL mutations)
│   ├── dto/
│   │   ├── TheoryInput.java
│   │   ├── CommentInput.java
│   │   ├── AuthPayload.java
│   │   └── TheoryPage.java
│   └── config/
│       ├── WebConfig.java (CORS)
│       └── GraphQLInterceptor.java (Auth context)
└── src/main/resources/
    ├── application.properties
    └── graphql/
        └── schema.graphqls
```

#### Database Schema
**Users Table**:
- id (BIGINT, PRIMARY KEY)
- username (VARCHAR, UNIQUE)
- secret_code (VARCHAR)
- is_anonymous (BOOLEAN)
- created_at (TIMESTAMP)

**Theories Table**:
- id (BIGINT, PRIMARY KEY)
- title (VARCHAR)
- content (TEXT)
- status (VARCHAR/ENUM)
- author_id (BIGINT, FOREIGN KEY)
- posted_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Comments Table**:
- id (BIGINT, PRIMARY KEY)
- content (TEXT)
- theory_id (BIGINT, FOREIGN KEY)
- author_id (BIGINT, FOREIGN KEY)
- posted_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Theory_Evidence Table**:
- theory_id (BIGINT, FOREIGN KEY)
- evidence_url (VARCHAR)

#### GraphQL Schema
**Scalars**: DateTime

**Types**: User, Theory, Comment, TheoryStatus (enum), TheoryPage, AuthPayload

**Queries**:
- theories(page, size, status, keyword, hot): TheoryPage
- theory(id): Theory
- user(id): User
- userTheories(userId): [Theory]
- me: User

**Mutations**:
- login(username, secretCode, anonymous): AuthPayload
- register(username, secretCode, anonymous): AuthPayload
- createTheory(input): Theory
- updateTheory(id, input): Theory
- deleteTheory(id): Boolean
- createComment(input): Comment
- updateComment(id, content): Comment
- deleteComment(id): Boolean

#### Key Features
- **Custom Queries**: Advanced filtering with JPA @Query annotations
- **Pagination**: Spring Data Page support
- **Validation**: Bean Validation (@NotBlank, @Size)
- **Error Handling**: Comprehensive exception handling
- **Transaction Management**: @Transactional service methods
- **CORS Configuration**: Configured for development (localhost:3000)

### Frontend (React + TypeScript + Tailwind)

#### Technology Stack
- **Framework**: React 19.2.3 (latest)
- **Language**: TypeScript 4.9
- **Styling**: Tailwind CSS 3.4.0
- **GraphQL Client**: Apollo Client 4.0.11 (latest)
- **GraphQL**: graphql 16.12.0 (latest)
- **Build Tool**: Create React App with react-scripts

#### Project Structure
```
frontend/
├── src/
│   ├── App.tsx (Main app component)
│   ├── apollo-imports.ts (Centralized Apollo imports)
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Login.tsx
│   │   ├── TheoryList.tsx
│   │   ├── TheoryCard.tsx
│   │   ├── TheoryDetail.tsx
│   │   └── CreateTheory.tsx
│   ├── graphql/
│   │   ├── client.ts (Apollo Client config)
│   │   └── operations.ts (GraphQL queries & mutations)
│   ├── types/
│   │   └── index.ts (TypeScript interfaces)
│   ├── utils/
│   │   └── auth.ts (Auth utilities)
│   ├── index.tsx
│   └── index.css (Tailwind + custom styles)
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

#### Apollo Client Configuration
- **HTTP Link**: Connection to GraphQL endpoint
- **Auth Link**: JWT token injection in headers
- **Cache**: InMemoryCache for query results
- **Context**: User ID extraction from token

#### State Management
- **Local State**: React useState for component state
- **Apollo Cache**: Automatic cache updates on mutations
- **Refetch Queries**: Explicit refetching for data consistency

#### TypeScript Types
- Strongly typed GraphQL operations
- Interface definitions for all data models
- Type-safe props for all components
- Generic typing for Apollo hooks

## 🔒 Security Features

### Backend Security
- **Input Validation**: All inputs validated with constraints
- **Authorization**: User-based access control for updates/deletes
- **SQL Injection Protection**: JPA parameterized queries
- **CORS**: Configured allowed origins

### Frontend Security
- **XSS Prevention**: React's built-in escaping
- **Token Storage**: localStorage (suitable for demo)
- **HTTPS**: Should be used in production
- **Input Sanitization**: Client-side validation

## 🚀 Performance Optimizations

### Backend
- **Lazy Loading**: JPA lazy fetching for associations
- **Pagination**: Prevents large data loads
- **Indexed Columns**: Primary and foreign keys
- **Query Optimization**: Custom JPQL queries

### Frontend
- **Code Splitting**: React lazy loading (potential)
- **Memoization**: Component optimization opportunities
- **Apollo Cache**: Reduces redundant network requests
- **Production Build**: Minified and optimized

## 📦 Deployment Considerations

### Backend Deployment
- **Docker**: Containerize Spring Boot application
- **Environment Variables**: Externalize configuration
- **Database**: PostgreSQL with connection pooling
- **Health Checks**: Spring Boot Actuator

### Frontend Deployment
- **Static Hosting**: Serve build folder
- **CDN**: Assets can be served via CDN
- **Environment Config**: API endpoint configuration
- **SSL/TLS**: Required for production

### Database
- **PostgreSQL 15**: Runs in Docker container
- **Volume Mounting**: Data persistence
- **Backup Strategy**: Regular database backups
- **Migration**: Consider Flyway/Liquibase for production

## 🧪 Testing Capabilities

### Backend Testing
- Spring Boot Test framework available
- JUnit 5 for unit tests
- MockMvc for integration tests
- GraphQL test support included

### Frontend Testing
- React Testing Library configured
- Jest test runner
- Component testing capability
- Integration test potential

## 📱 Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Future Enhancement Ideas
1. Real-time updates with GraphQL Subscriptions
2. File upload for evidence (images, documents)
3. User profiles with theory history
4. Voting system for theories
5. Theory categories/tags
6. Email notifications
7. Admin panel
8. Social sharing features
9. Theory relationships (connected theories)
10. Advanced search with Elasticsearch

## 📄 License
Educational/Demo Project

---

**🔺 REMEMBER: QUESTION EVERYTHING 🔺**
**💀 "THE TRUTH IS OUT THERE" 💀**
