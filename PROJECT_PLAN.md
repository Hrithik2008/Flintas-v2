# Project Plan: Student Social & Habit Tracking App

This document outlines the plan for developing a student-focused social application designed for habit tracking, activity management, and community building.

## I. Core Modules & Features

### A. User Management & Authentication
*   **Authentication:** Utilize Supabase for robust authentication (email/password, with potential for social logins in later phases).
*   **User Profiles:** Develop comprehensive user profiles accessible via `src/pages/Profile.tsx`. Profiles will include:
    *   Display name
    *   Avatar
    *   Personal interests (for personalization and group suggestions)
    *   Summary of tracked habits
    *   **Achievement Timeline:** A visually engaging timeline on the user profile that chronologically displays all earned badges, completed major goals (e.g., finishing a habit track), and significant milestones (e.g., "100 Days of Meditation," "Joined 5 Clubs"). This serves as a dynamic record of their engagement and growth.
*   **Onboarding:** Refine the `src/pages/Onboarding.tsx` flow to capture initial interests and guide users through setting up their first habits.
*   Relevant existing files: `src/pages/SignUp.tsx`.

### B. Habit & Activity Tracking
*   **Categories:** Initial categories include:
    *   Academic (e.g., studying, assignments)
    *   Wellness (e.g., exercise, meditation)
    *   Social Engagement (e.g., attending events, club meetings)
    *   Design to be extensible for future categories.
*   **Habit Management (CRUD):** Allow users to create, view, update, and delete habits and activities.
*   **Progress Logging:** Intuitive methods for users to log progress (e.g., marking completion, entering hours studied, noting meditation duration).
*   **Progress Visualization:** Display progress through charts, streak counters, and completion rates. The existing `src/pages/Insights.tsx` page is a candidate for this.
*   **Reminders & Notifications:** Offer optional reminders for scheduled habits.
*   Relevant existing files: `src/components/HabitForm.tsx`, `src/components/HabitList.tsx`, `src/pages/HabitTracker.tsx`. The `src/pages/Tracks.tsx` page could be used for predefined habit "tracks" or templates.

### C. Social Interaction
*   **Interest-Based Groups:**
    *   Users can create or join groups around academic subjects, hobbies, wellness goals, etc.
    *   Each group to have a dedicated space for discussions/forums and event announcements.
*   **General Forum:**
    *   A central forum for broader discussions, university-wide announcements, and Q&A.
    *   Consider topic categorization.
*   The `src/pages/Community.tsx` page will be the foundation.

### D. Extracurriculars & Events
*   A dedicated section to browse/discover university clubs, workshops, seminars, and social events.
*   RSVP functionality.
*   Integration with relevant interest-based groups.

### E. Personalized Dashboard
*   The main landing page after login (`src/pages/Dashboard.tsx`), providing a snapshot of:
    *   Ongoing habits and today's progress.
    *   Upcoming events or deadlines.
    *   Notifications from groups and the forum.
    *   Personalized Daily Task (see section G).
*   Integrate components like `src/components/dashboard/VisualWorld.tsx` (for gamified visual summary) and `src/components/dashboard/DailyQuote.tsx`.

### F. Gamification, Engagement & Rewards
*   **Core Mechanics:**
    *   **Points System:** For completing habits, group participation, event attendance, streaks.
    *   **Badges & Achievements:** Visually appealing badges for milestones (e.g., "7-Day Study Streak," "Wellness Warrior"). Displayed on Achievement Timeline.
    *   **Streaks:** Visually highlight and reward consistent habit completion.
    *   **Levels & Progression:** Users can "level up" profiles or skill areas.
    *   **Leaderboards (Optional & Contextual):** Opt-in, within specific groups or for friendly challenges.
*   **Visual & Interactive Engagement:**
    *   **Personalized Dashboard & `src/components/dashboard/VisualWorld.tsx`:** Dynamic visual representation of progress. Celebratory animations.
    *   **Customization:** Profile themes, avatars, flair unlocked through achievements.
    *   **Positive Reinforcement:** Encouraging messages, affirmations.
*   **Social & Community Fun:**
    *   **Group Challenges & Collaborative Goals.**
    *   **Peer Recognition & Encouragement (Kudos).**
    *   **Shared Success Stories.**
*   **Discovery & Delight:**
    *   **"Easter Eggs" / Hidden Achievements.**
    *   **Themed Events/Challenges.**
*   **Making Habit Tracking Less of a Chore:** Quick log, flexible scheduling, focus on "Why," reflective prompts.
*   The `src/pages/Rewards.tsx` page will showcase rewards and achievements.

### G. Personalized Daily Task/Challenge
*   **User Context:** Defined during `src/pages/Onboarding.tsx` and in `src/pages/Profile.tsx` (interests, active goals). Context from `src/pages/HabitTracker.tsx`.
*   **Task Generation (Phased Approach):**
    *   **Phase 2/3 - Basic LLM Integration + Small Fallback Bank:**
        *   **LLM Mechanism (Simplified):** Simplified prompt (key interest/goal), basic LLM API call, minimal validation.
        *   **Small Curated Fallback Bank:** Generic tasks in Supabase if LLM fails/returns unusable response.
    *   **Phase 4+ - Advanced LLM Integration:** Refined prompt engineering, more user context, robust error handling, better filtering, user feedback loop.
*   **User Interaction:** Displayed on `src/pages/Dashboard.tsx`, completion tracking, rewards (points, Daily Task Streak badge, `src/components/dashboard/VisualWorld.tsx` element).

## II. Technical Stack & Considerations
*   **Frontend:** React, TypeScript, Vite, Tailwind CSS (per `package.json`).
*   **Backend & Database:** Supabase (Authentication, PostgreSQL Database, Real-time for forums/groups - optional).
*   **State Management:** Zustand (`src/lib/store.ts`).
*   **Routing:** React Router DOM.
*   **UI Components:** Lucide Icons, Framer Motion.
*   **LLM API:** Integration with a chosen LLM provider (e.g., OpenAI, Google Gemini) for Personalized Daily Tasks.

## III. High-Level Development Phases
1.  **Phase 1: Foundation - User Core & Habit Tracking MVP**
    *   User authentication, profiles (including structure for Achievement Timeline), onboarding.
    *   Full CRUD for habits, core progress tracking.
    *   Initial dashboard.
2.  **Phase 2: Social Core & *Initial* Personalized Tasks**
    *   Interest-based groups (basic functionality).
    *   General forum structure.
    *   Implement Basic LLM-Powered Daily Tasks (with small fallback bank).
3.  **Phase 3: Engagement Boost - Events, Gamification & Refined Tasks**
    *   Extracurriculars and events module.
    *   Initial rewards and gamification (points, badges, Achievement Timeline population).
    *   Refine UI/UX.
    *   Gather feedback on daily tasks and make initial improvements to LLM prompts/fallback bank.
4.  **Phase 4: Enrichment & Polish - Advanced Features & LLM Enhancement**
    *   Enhance group features, notification system.
    *   Detailed insights.
    *   Advanced LLM Integration for Daily Tasks: More sophisticated prompts, better filtering, user feedback loop.

## IV. High-Level Architecture Diagram (Conceptual)

```mermaid
graph TD
    A[User] --> B(React Frontend App);

    subgraph Frontend [Vite + React + TypeScript + Tailwind CSS]
        B --> Router{React Router};
        
    end

    subgraph BackendAsAService [Supabase]
        SB_API_Client --> SB_Auth[Authentication Service];
        SB_API_Client --> SB_DB[PostgreSQL Database Service];
        SB_DB --> T_Users[Users Table (incl. interests, goals)];
        SB_DB --> T_Habits[Habits Table];
        SB_DB --> T_HabitProgress[Habit Progress Table];
        SB_DB --> T_Groups[Groups Table];
        SB_DB --> T_GroupMembers[Group Members Table];
        SB_DB --> T_Posts[Forum/Group Posts Table];
        SB_DB --> T_Events[Events Table];
        SB_DB --> T_EventRSVPs[Event RSVPs Table];
        SB_DB --> T_RewardsUser[User Rewards/Achievements Table (for Timeline)];
        SB_DB --> T_DailyTaskBank[Daily Task Fallback Bank];
    end

    subgraph ExternalServices
        LLM_Client --> LLM_API[LLM Service API];
    end

    P_Auth <--> SB_Auth;
    P_Habit <--> SB_DB;
    P_Social <--> SB_DB;
    P_Events <--> SB_DB;
    P_Rewards <--> SB_DB;
```

This plan aims to create an engaging and supportive platform for students.
