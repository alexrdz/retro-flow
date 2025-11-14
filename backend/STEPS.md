# RetroFlow Implementation Steps - Phase 1

## Session 1: Backend Foundation (2 hours)

### Step 1: Set Up Turso Database (30 mins)
- Sign up for Turso account at turso.tech
- Install Turso CLI and authenticate
- Create database called `retro-flow`
- Get your database URL and auth token
- Create the two tables: `sessions` and `cards` (refer to PRD for schema)

### Step 2: Database Connection (30 mins)
- Install `@libsql/client` and `nanoid` packages
- Create `src/database.ts` file to export Turso client
- Set up environment variables for connection

### Step 3: Type Definitions (30 mins)
- Create `src/types/index.ts`
- Define interfaces for Session, Card, and request types
- Include proper TypeScript types for column types

### Step 4: Test Database Connection (30 mins)
- Add a simple test endpoint that queries the database
- Make sure your server can connect to Turso successfully

---

## Session 2: Core API Endpoints (2 hours)

### Step 1: Session CRUD (60 mins)
- Implement POST `/api/sessions` to create new session (use nanoid for ID)
- Implement GET `/api/sessions/:id` to fetch session + all its cards
- Implement GET `/api/sessions` to fetch all sessions
- Test with Postman/Thunder Client

### Step 2: Card CRUD (60 mins)
- Implement POST `/api/cards` to create new card
- Implement PUT `/api/cards/:id` to update card content/position/column
- Implement DELETE `/api/cards/:id` to remove card
- Test all endpoints thoroughly

---

## Session 3: Frontend Setup (2 hours)

### Step 1: React App Setup (30 mins)
- Create React app with TypeScript template
- Install dependencies: axios (or fetch), @dnd-kit/core, @dnd-kit/sortable
- Set up basic folder structure: components, types, services

### Step 2: API Service Layer (30 mins)
- Create API service functions to call your Express endpoints
- Set up proper TypeScript types matching your backend

### Step 3: Basic Components (60 mins)
- Create Card component (just display for now)
- Create Column component (holds multiple cards)
- Create Board component (holds 3 columns)
- Basic layout and styling

---

## Session 4: React State & Interactions (2 hours)

### Step 1: State Management (60 mins)
- Set up React state to hold session data and cards
- Connect API calls to load/save data
- Handle loading states and errors

### Step 2: Card Operations (60 mins)
- Add new card functionality
- Edit card inline functionality
- Delete card functionality
- Make sure all changes persist to backend

---

## Session 5: Drag & Drop (2 hours)

### Step 1: DnD Kit Setup (60 mins)
- Set up @dnd-kit providers and context
- Make cards draggable
- Make columns droppable

### Step 2: Position Logic (60 mins)
- Handle card position updates when moved
- Update backend when cards change columns/positions
- Ensure smooth visual feedback

---

## Session 6: Styling & Polish (2 hours)

### Step 1: Professional Styling (90 mins)
- Create clean, modern CSS (CSS Modules recommended)
- Responsive design for mobile/desktop
- Hover states, transitions, visual feedback

### Step 2: Error Handling (30 mins)
- Add proper error boundaries
- Handle network failures gracefully
- User-friendly error messages

---

## Session 7: Deployment (2 hours)

### Step 1: Railway Setup (60 mins)
- Create Railway account and connect GitHub
- Deploy backend with environment variables
- Test deployed API endpoints

### Step 2: Frontend Deployment (60 mins)
- Update API URLs to point to deployed backend
- Deploy frontend to Railway (or Netlify)
- Test full flow on live site

---

## Quick Reference

### Key Commands
```bash
# Start dev server
npm run dev

# Test database connection
turso db shell retro-flow

# Test API endpoint
curl http://localhost:3001/api/health
```

### Important Files to Create
- `src/database.ts` - Turso client setup
- `src/types/index.ts` - TypeScript interfaces
- `src/routes/sessions.ts` - Session endpoints
- `src/routes/cards.ts` - Card endpoints

---

**Next Steps After Phase 1:**
- Phase 2: Add Socket.io for real-time collaboration
- Phase 3: Integrate OpenAI for sentiment analysis
- Phase 4: Add session history and analytics

**Remember: Focus on building, not perfection. Get it working first, then make it pretty!**
