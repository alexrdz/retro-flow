# RetroFlow Phase 1 - Product Requirements Document

## Problem Statement
Teams need a clean, simple digital retrospective board that's more professional than sticky notes but less bloated than enterprise tools. Current solutions are either too basic (physical boards) or too complex (Jira, Azure DevOps).

## Success Metrics
- User can create and complete a full retrospective session in under 20 minutes
- Clean, professional UI that showcases advanced CSS skills
- Smooth, intuitive user interactions
- Deployable demo that works reliably

## Core User Story
> **As a** team lead running a retrospective
> **I want** a digital board where my team can add thoughts and organize them
> **So that** we can have structured discussions and create action items

## Functional Requirements

### 1. Session Management
- **Create new retro session** with unique URL/ID
- **Standard 3-column format**: "What Went Well", "What Could Improve", "Action Items"
- **Session persistence** - refresh doesn't lose work
- **No user accounts required** for MVP

### 2. Card Operations
- **Add cards** to any column with simple click/tap
- **Edit card text** inline (double-click or edit icon)
- **Delete cards** (hover reveals delete button)
- **Move cards** between columns via drag-and-drop
- **Card character limit**: 280 characters (tweet-length)

### 3. Basic Interactions
- **Responsive design** - works on desktop and mobile
- **Keyboard shortcuts**: Enter to save card, Escape to cancel
- **Visual feedback** for all interactions (hover states, transitions)
- **Auto-save** - no manual save required

## Technical Requirements

### Frontend (React + TypeScript)
- **Component architecture**: Reusable Card, Column, Board components
- **State management**: React hooks (useState, useReducer)
- **Drag-and-drop**: React DnD or @dnd-kit
- **Styling**: CSS Modules or styled-components (no CSS-in-JS libraries)
- **HTTP client**: Axios or fetch for API calls

### Backend (Express + TypeScript)
- **REST API endpoints**:
  - `POST /api/sessions` - Create new session
  - `GET /api/sessions/:id` - Get session data
  - `POST /api/cards` - Add card
  - `PUT /api/cards/:id` - Update card
  - `DELETE /api/cards/:id` - Delete card
  - `PUT /api/cards/:id/move` - Move card to different column

### Database (Turso/SQLite)
**Sessions Table**
```sql
id TEXT PRIMARY KEY            -- UUID for shareable URLs
name TEXT
created_at TEXT               -- ISO 8601 string
```

**Cards Table**
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
session_id TEXT               -- Foreign key to sessions.id
content TEXT
column_type TEXT              -- 'went_well', 'improve', 'actions'
position INTEGER
created_at TEXT               -- ISO 8601 string
```

### Deployment (Railway)
- **Environment variables** for Turso connection
- **CORS configuration** for frontend-backend communication
- **Error handling and logging**

## User Experience Flow
1. **Landing page** with "Create New Retro" button
2. **Retro board** loads with 3 empty columns
3. **Add cards** by clicking "+" or typing in column
4. **Drag cards** between columns as discussion evolves
5. **Share URL** for others to view (read-only in Phase 1)

## Design Requirements
- **Clean, modern interface** - think Linear/Notion aesthetic
- **Subtle animations** - smooth transitions, no jarring effects
- **Professional color palette** - avoid childish bright colors
- **Typography hierarchy** - clear visual organization
- **Mobile-responsive** - works well on phones/tablets

## Out of Scope (Phase 1)
- ❌ **Multi-user real-time collaboration** (Phase 2)
- ❌ **User authentication** (Phase 2)
- ❌ **AI sentiment analysis** (Phase 3)
- ❌ **Session history** (Phase 4)
- ❌ **Advanced features** like voting, timers, etc.

## Definition of Done
- [ ] All CRUD operations work reliably
- [ ] Drag-and-drop feels smooth and intuitive
- [ ] Responsive design works on mobile/desktop
- [ ] Deployed to Railway with working demo URL
- [ ] Clean, commented code ready for portfolio presentation
- [ ] Basic error handling (network failures, invalid inputs)

## Time Estimate
**14-16 hours total** (7-8 sessions × 2 hours)
- Sessions 1-2: Backend setup + API endpoints
- Sessions 3-4: React components + basic layout
- Sessions 5-6: Drag-and-drop + styling
- Sessions 7-8: Polish + deployment

## Development Phases
### Phase 1: Basic Retro Board (2-3 weeks)
Core MVP functionality with TypeScript full-stack

### Phase 2: Real-time Collaboration (1-2 weeks)
Multi-user real-time updates with Socket.io

### Phase 3: Smart Sentiment Analysis (1-2 weeks)
AI-powered sentiment analysis of cards

### Phase 4: Session History & Patterns (1-2 weeks)
Historical data and pattern recognition

### Phase 5: Action Item Tracking (1 week)
Task management and completion tracking

### Phase 6: Team Analytics (1-2 weeks)
Trend analysis and team health dashboard

---

**Tech Stack Summary:**
- **Frontend**: React + TypeScript + CSS Modules
- **Backend**: Express + TypeScript + Turso
- **Deployment**: Railway
- **Version Control**: Git + GitHub

**Ready to build something awesome! 🚀**
