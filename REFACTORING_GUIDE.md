# CMS Refactoring Guide - Modern Architecture

## Overview

This project has been fully refactored to use modern, type-safe technologies for data fetching, caching, and authentication. The new architecture leverages:

- **Axios** - HTTP client with interceptors
- **React Query (@tanstack/react-query)** - Server state management and caching
- **Auth.js v5 Beta** - Authentication and session management
- **TypeScript** - Full type safety throughout the application

---

## Architecture

### 1. Authentication Layer (Auth.js v5)

**Files:**
- `auth.ts` - Main Auth.js configuration
- `auth.config.ts` - Auth configuration and callbacks
- `src/types/next-auth.d.ts` - TypeScript type extensions
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- `src/middleware.ts` - Route protection middleware

**Features:**
- Credentials provider (phone + password)
- JWT session strategy
- Role-based access control (USER, ADMIN)
- Automatic session management
- Protected routes via middleware

**Usage Example:**
```typescript
// In Server Components
import { getServerSession } from '@/../../auth';

const session = await getServerSession();
if (!session) redirect('/auth/signin');

// In Client Components
import { useSession, signIn, signOut } from 'next-auth/react';

const { data: session, status } = useSession();
```

---

### 2. API Client Layer (Axios)

**File:** `src/lib/api-client.ts`

**Features:**
- Centralized Axios instance with base configuration
- Request interceptor - Automatically adds auth tokens
- Response interceptor - Standardizes errors and responses
- Type-safe wrapper methods (get, post, put, patch, delete)

**Configuration:**
- Base URL: `process.env.NEXT_PUBLIC_API_URL` or `/api`
- Timeout: 30 seconds
- Auto-redirect to login on 401 errors

**Usage Example:**
```typescript
import { api } from '@/lib/api-client';

// GET request
const users = await api.get<UsersListResponse>('/admin/users');

// POST request
const newUser = await api.post<UserResponse>('/admin/users', userData);

// PATCH request
const updated = await api.patch<UserResponse>(`/admin/users/${id}`, updates);
```

---

### 3. Data Layer (React Query)

**Files:**
- `src/providers/react-query-provider.tsx` - React Query setup
- `src/hooks/api/use-*.ts` - Resource-specific hooks

**Configuration:**
- Stale time: 1 minute
- Cache time (gcTime): 5 minutes
- Retry: 1 attempt for queries, 0 for mutations
- React Query Devtools enabled in development

**Available Hooks:**

#### Users (`src/hooks/api/use-users.ts`)
```typescript
// Query hooks
const { data, isLoading, error } = useUsers({ page: 1, limit: 20 });
const { data: user } = useUser(userId);

// Mutation hooks
const createUser = useCreateUser();
const updateUser = useUpdateUser();
const deleteUser = useDeleteUser();

// Usage
createUser.mutate({
  phone: '09123456789',
  password: 'secret',
  firstName: 'John',
  role: 'ADMIN'
});
```

#### Courses (`src/hooks/api/use-courses.ts`)
```typescript
const { data } = useCourses({ published: true, categoryId: 'xxx' });
const { data: course } = useCourse(courseId);
const createCourse = useCreateCourse();
const updateCourse = useUpdateCourse();
const deleteCourse = useDeleteCourse();
```

#### Comments (`src/hooks/api/use-comments.ts`)
```typescript
const { data } = useComments({ courseId: 'xxx', published: true });
const { data: comment } = useComment(commentId);
const createComment = useCreateComment();
const updateComment = useUpdateComment();
const deleteComment = useDeleteComment();
```

#### News (`src/hooks/api/use-news.ts`)
```typescript
const { data } = useNews({ featured: true });
const { data: article } = useNewsArticle(articleId);
const createNews = useCreateNews();
const updateNews = useUpdateNews();
const deleteNews = useDeleteNews();
```

#### Categories (`src/hooks/api/use-categories.ts`)
```typescript
const { data } = useCategories({ published: true });
const { data: category } = useCategory(categoryId);
const createCategory = useCreateCategory();
const updateCategory = useUpdateCategory();
const deleteCategory = useDeleteCategory();
```

#### Orders (`src/hooks/api/use-orders.ts`)
```typescript
const { data } = useOrders({ userId: 'xxx', status: 'PAID' });
const { data: order } = useOrder(orderId);
const updateOrder = useUpdateOrder();
```

#### Enrollments (`src/hooks/api/use-enrollments.ts`)
```typescript
const { data } = useEnrollments({ userId: 'xxx', completed: false });
const { data: enrollment } = useEnrollment(enrollmentId);
const createEnrollment = useCreateEnrollment();
const updateEnrollment = useUpdateEnrollment();
const deleteEnrollment = useDeleteEnrollment();
```

---

### 4. Type System

**File:** `src/types/api.ts`

**Features:**
- Full TypeScript types for all Prisma models
- Extended types with relations
- API request/response types
- Query parameter types

**Type Categories:**

1. **Base Types** - Re-exported from Prisma
2. **Extended Types** - Models with relations
   ```typescript
   UserWithRelations
   CourseWithRelations
   CategoryWithRelations
   NewsArticleWithRelations
   OrderWithRelations
   ```

3. **Request Types**
   ```typescript
   CreateUserRequest
   UpdateUserRequest
   CreateCourseRequest
   ```

4. **Response Types**
   ```typescript
   UsersListResponse
   UserResponse
   CoursesListResponse
   ```

5. **Query Parameter Types**
   ```typescript
   UsersQueryParams
   CoursesQueryParams
   NewsQueryParams
   ```

---

### 5. Providers Setup

**Files:**
- `src/providers/auth-provider.tsx` - NextAuth SessionProvider
- `src/providers/react-query-provider.tsx` - QueryClientProvider
- `src/providers/index.tsx` - Combined providers

**Usage in Layout:**
```typescript
import Providers from '@/providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

---

## Usage Patterns

### Creating a New Page with Data Fetching

```typescript
'use client';

import { useCourses } from '@/hooks/api';
import { useState } from 'react';

export default function CoursesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useCourses({
    page,
    limit: 20,
    published: true
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;

  return (
    <div>
      {data?.items.map(course => (
        <div key={course.id}>{course.subject}</div>
      ))}

      <button onClick={() => setPage(p => p + 1)}>Next Page</button>
    </div>
  );
}
```

### Creating a Form with Mutations

```typescript
'use client';

import { useCreateCourse } from '@/hooks/api';
import { useState } from 'react';

export default function CreateCourseForm() {
  const [formData, setFormData] = useState({
    subject: '',
    price: 0,
    description: '',
  });

  const createCourse = useCreateCourse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createCourse.mutate(formData, {
      onSuccess: (data) => {
        console.log('Course created:', data);
        // Reset form or redirect
      },
      onError: (error) => {
        console.error('Error creating course:', error);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
      />

      <button
        type="submit"
        disabled={createCourse.isPending}
      >
        {createCourse.isPending ? 'Creating...' : 'Create Course'}
      </button>
    </form>
  );
}
```

### Optimistic Updates

```typescript
const updateCourse = useUpdateCourse();
const queryClient = useQueryClient();

updateCourse.mutate(
  { id: courseId, data: updates },
  {
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: courseKeys.detail(courseId) });

      // Snapshot previous value
      const previousCourse = queryClient.getQueryData(courseKeys.detail(courseId));

      // Optimistically update
      queryClient.setQueryData(courseKeys.detail(courseId), (old) => ({
        ...old,
        ...updates,
      }));

      return { previousCourse };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        courseKeys.detail(courseId),
        context?.previousCourse
      );
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
    },
  }
);
```

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database"

# Auth.js v5
AUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

---

## File Structure

```
pishro-admin/
├── auth.ts                          # Auth.js main config
├── auth.config.ts                   # Auth.js config
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts     # Auth API routes
│   │   ├── layout.tsx               # Root layout with providers
│   │   └── page.tsx                 # Home page
│   ├── components/
│   │   └── Auth/
│   │       └── SigninWithPassword.tsx  # Login form
│   ├── hooks/
│   │   └── api/
│   │       ├── index.ts             # Barrel export
│   │       ├── use-users.ts         # Users hooks
│   │       ├── use-courses.ts       # Courses hooks
│   │       ├── use-comments.ts      # Comments hooks
│   │       ├── use-news.ts          # News hooks
│   │       ├── use-categories.ts    # Categories hooks
│   │       ├── use-orders.ts        # Orders hooks
│   │       └── use-enrollments.ts   # Enrollments hooks
│   ├── lib/
│   │   ├── api-client.ts            # Axios instance
│   │   ├── api-response.ts          # Response helpers
│   │   └── prisma.ts                # Prisma singleton
│   ├── providers/
│   │   ├── auth-provider.tsx        # Auth provider
│   │   ├── react-query-provider.tsx # React Query provider
│   │   └── index.tsx                # Combined providers
│   ├── types/
│   │   ├── api.ts                   # API types
│   │   └── next-auth.d.ts           # Auth type extensions
│   └── middleware.ts                # Route protection
└── prisma/
    └── schema.prisma                # Database schema
```

---

## Best Practices

### 1. Query Key Management
Always use the predefined query key factories:
```typescript
// ✅ Good
const { data } = useQuery({
  queryKey: userKeys.list(params),
  queryFn: () => fetchUsers(params),
});

// ❌ Bad
const { data } = useQuery({
  queryKey: ['users', params],
  queryFn: () => fetchUsers(params),
});
```

### 2. Type Safety
Always use the provided types:
```typescript
// ✅ Good
const createUser = useCreateUser();
createUser.mutate({
  phone: '09123456789',
  password: 'secret',
  role: 'ADMIN',
} as CreateUserRequest);

// ❌ Bad
createUser.mutate({
  phone: '09123456789',
  password: 'secret',
  role: 'INVALID_ROLE', // Type error!
});
```

### 3. Error Handling
Always handle errors appropriately:
```typescript
const { data, error, isError } = useUsers();

if (isError) {
  return <ErrorMessage error={error} />;
}
```

### 4. Loading States
Show loading indicators:
```typescript
const { data, isLoading, isFetching } = useUsers();

if (isLoading) return <Skeleton />;

return (
  <div>
    {isFetching && <LoadingSpinner />}
    {/* Content */}
  </div>
);
```

### 5. Invalidation After Mutations
Always invalidate related queries:
```typescript
const createUser = useCreateUser();

createUser.mutate(data, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  },
});
```

---

## Testing the Setup

### 1. Test Authentication
```bash
# Create a test user in MongoDB
# Then try logging in at /auth/signin
```

### 2. Test API Client
```typescript
// In a page or component
const { data } = useUsers();
console.log('Users:', data);
```

### 3. Check React Query Devtools
- Open the app in development mode
- Look for the React Query Devtools panel at the bottom
- Inspect queries, mutations, and cache

---

## Migration Checklist

- [x] Install dependencies (Axios, React Query, Auth.js v5)
- [x] Create Axios API client with interceptors
- [x] Configure Auth.js v5 with Prisma adapter
- [x] Set up React Query provider
- [x] Create TypeScript types for all API responses
- [x] Create React Query hooks for all resources
- [x] Update root layout with providers
- [x] Create authentication flow (sign-in page)
- [x] Add middleware for route protection
- [x] Create Prisma client singleton
- [ ] Create API routes for all resources (users, courses, etc.)
- [ ] Update existing components to use new hooks
- [ ] Add loading and error states to all pages
- [ ] Test all CRUD operations
- [ ] Add optimistic updates where appropriate
- [ ] Document all custom hooks
- [ ] Create example pages for each resource

---

## Next Steps

1. **Create API Routes**: Implement the backend API routes in `src/app/api/admin/` for all resources (users, courses, comments, news, categories, tags, FAQs, quizzes, orders, transactions, enrollments, newsletter subscribers)

2. **Build Admin Pages**: Create admin pages for managing each resource using the React Query hooks

3. **Add Validation**: Implement form validation using a library like Zod or Yup

4. **Add Notifications**: Implement toast notifications for success/error messages

5. **Optimize Performance**: Add pagination, infinite scroll, and virtual scrolling where needed

6. **Add Tests**: Write unit tests for hooks and integration tests for API routes

7. **Documentation**: Document all API endpoints and create a Swagger/OpenAPI specification

---

## Troubleshooting

### Issue: "Module not found: Can't resolve '@/providers'"
**Solution**: Make sure TypeScript path mapping is configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: "Session is null"
**Solution**:
1. Check that AUTH_SECRET is set in `.env`
2. Verify database connection
3. Check that user exists in database
4. Verify password hash matches

### Issue: "CORS errors when calling API"
**Solution**: API routes are on the same domain, CORS shouldn't be an issue. If it is, check middleware configuration.

### Issue: "React Query hooks not working"
**Solution**: Ensure providers are correctly set up in layout.tsx

---

## Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Auth.js v5 Documentation](https://authjs.dev/)
- [Axios Documentation](https://axios-http.com/)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Last Updated**: 2025-11-10
**Version**: 1.0.0
