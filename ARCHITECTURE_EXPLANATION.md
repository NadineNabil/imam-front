# Clean Architecture: Repository Pattern vs Infrastructure Services

## 🎯 Key Difference

### Repository Pattern (Core → Data)
**Purpose**: Business data access operations

```
┌─────────────────┐
│   CORE LAYER    │  Interface (WHAT we need)
│  repositories/  │  
│                 │  interface IAuthRepository {
│  auth.repository│    login(credentials): Observable<User>
│  .ts            │    logout(): Observable<void>
│                 │  }
└────────┬────────┘
         │ implements
         ▼
┌─────────────────┐
│   DATA LAYER    │  Implementation (HOW we do it)
│  repositories/  │  
│                 │  class AuthRepositoryImpl 
│  auth.repository│    implements IAuthRepository {
│  .impl.ts       │    login() { calls API }
│                 │  }
└─────────────────┘
```

**Example**:
- Interface: `IAuthRepository.login()` - defines WHAT: "I need to login users"
- Implementation: `AuthRepositoryImpl.login()` - defines HOW: "I call FastAPI `/auth/login` endpoint"

---

### Infrastructure Services
**Purpose**: Technical utilities (NOT business data access)

```
┌─────────────────────────┐
│ INFRASTRUCTURE LAYER    │
│   services/             │
│                         │
│  ┌──────────────────┐   │
│  │ StorageService   │   │  Wraps localStorage API
│  │  - get(key)      │   │  Platform abstraction
│  │  - set(key, val) │   │
│  └──────────────────┘   │
│                         │
│  ┌──────────────────┐   │
│  │ LanguageService  │   │  Manages translations
│  │  - setLanguage() │   │  Angular/i18n wrapper
│  └──────────────────┘   │
│                         │
│  ┌──────────────────┐   │
│  │ EventService     │   │  Pub/sub event bus
│  │  - broadcast()   │   │  Cross-component communication
│  └──────────────────┘   │
└─────────────────────────┘
```

**These are used BY repositories and other layers!**

---

## 📊 Complete Picture

```
┌─────────────────────────────────────────────┐
│          REPOSITORY IMPLEMENTATION          │
│          (uses infrastructure services)     │
└─────────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
    ▼               ▼               ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│   API    │  │ Storage  │  │ Language │
│ Service  │  │ Service  │  │ Service  │
│ (data/)  │  │ (infra/) │  │ (infra/) │
└──────────┘  └──────────┘  └──────────┘
```

**Real Example from your code**:

```typescript
// data/repositories/auth.repository.impl.ts
export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private readonly authApi: AuthApiService,      // ← Data layer (API calls)
    private readonly storage: StorageService       // ← Infrastructure (localStorage wrapper)
  ) {}

  login(credentials: AuthCredentials): Observable<User> {
    return this.authApi.login(credentials).pipe(
      map(response => UserMapper.fromLoginResponse(response)),
      tap(user => {
        // Uses infrastructure service!
        this.storage.set('currentUser', user);     // ← Infrastructure service
      })
    );
  }
}
```

---

## 🔑 Why Infrastructure Services Don't Follow Repository Pattern?

### 1. **No Business Logic**
- StorageService: Just wraps `localStorage` - pure technical utility
- LanguageService: Just manages translations - Angular framework concern
- EventService: Just pub/sub - communication mechanism

### 2. **No Interface Needed**
- These are **direct utilities**, not abstracted business operations
- We don't need to swap implementations (unlike repositories - we might swap from FastAPI to REST API)
- They're **concrete services**, not abstractions

### 3. **Used BY Other Layers**
- Repositories use StorageService (to save tokens)
- Components use LanguageService (to change language)
- Components use EventService (to communicate)

---

## ✅ Summary Table

| Aspect | Repository Pattern | Infrastructure Services |
|--------|-------------------|------------------------|
| **Layer** | Core (interface) + Data (implementation) | Infrastructure only |
| **Purpose** | Business data operations | Technical utilities |
| **Has Interface?** | ✅ Yes (in core) | ❌ No (direct use) |
| **Example** | `IAuthRepository` → `AuthRepositoryImpl` | `StorageService`, `LanguageService` |
| **Used By** | Use cases, components | Repositories, components, use cases |
| **Swappable?** | ✅ Yes (swap API implementation) | ❌ No (direct utility) |

---

## 💡 When to Create What?

### Create Repository Interface + Implementation when:
- ✅ You need to fetch/save business data (users, orders, products)
- ✅ You might swap data sources (FastAPI → GraphQL → Firebase)
- ✅ It's domain logic

### Create Infrastructure Service when:
- ✅ You need to wrap platform/browser APIs (localStorage, cookies, DOM)
- ✅ You need Angular framework utilities (translation, rendering)
- ✅ You need cross-cutting concerns (logging, events, storage)
- ✅ It's technical/framework code, NOT business logic

