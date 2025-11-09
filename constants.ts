import React from 'react';
import { Post, Recommendation, RecommendationType, PostStatus, Category } from './types';

/**
 * IMPORTANT: These constants are used for:
 * 1. Initial data migration to Firebase (one-time operation via /admin/migrate)
 * 2. Fallback data when Firebase is not configured (localStorage mode)
 * 
 * Once Firebase is configured and data is migrated, all content management
 * happens through the admin dashboard and is stored in Firebase Firestore.
 * 
 * To add new content after Firebase setup, use the admin dashboard at /admin
 * instead of modifying this file.
 */

export const POSTS: Post[] = [
  {
    id: 'my-first-semester-at-uni',
    title: 'Navigating My First Semester at University',
    date: 'October 26, 2023',
    category: 'Life',
    tags: ['university', 'student life', 'growth'],
    excerpt: 'A reflection on the challenges and triumphs of my first few months in higher education. From late-night study sessions to making new friends...',
    status: PostStatus.PUBLISHED,
    coverImage: `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80`,
    content: `The transition from high school to university is often painted as a monumental leap, and my experience was no different. The first semester was a whirlwind of new faces, challenging coursework, and a newfound sense of independence. This post is a candid look back at the highs, the lows, and the invaluable lessons learned.

### Embracing the Academic Challenge

The academic rigor was the first thing that struck me. The sheer volume of reading and the depth of analysis required were on another level. I quickly learned that procrastination was not an option. My biggest ally became my calendar, where I meticulously planned my study sessions, deadlines, and even breaks.

> "Time management is not just about getting things done; it's about creating the space to learn and grow without burning out."

### Finding My Community

Beyond the classroom, university is about people. I made it a point to join a couple of clubs that aligned with my interests: the coding club and the hiking society. These communities became my support system. It was comforting to know that I wasn't alone in my struggles and successes.

Sharing a late-night pizza while debugging code or reaching a summit with my hiking friends are some of the memories I'll cherish the most. It taught me that while grades are important, the connections you make are what truly enrich the university experience.
`
  },
  {
    id: 'introduction-to-react-hooks',
    title: 'A Beginner\'s Guide to React Hooks',
    date: 'November 15, 2023',
    category: 'Technology',
    tags: ['react', 'javascript', 'web development'],
    excerpt: 'Diving into the world of React? Hooks are a fundamental concept you need to grasp. Let\'s break down useState and useEffect in simple terms.',
    status: PostStatus.PUBLISHED,
    coverImage: `https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80`,
    content: `When I first started learning React, class components were the norm. Then came Hooks, and they completely changed the way we write components. If you're new to React, understanding Hooks is essential. In this post, we'll cover the two most fundamental hooks: \`useState\` and \`useEffect\`.

### The Power of State: \`useState\`
Every interactive component needs to remember things. The \`useState\` hook lets you add state to functional components. It's a way of declaring a "state variable" that can hold any kind of data.

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked {count} times
    </button>
  );
}
\`\`\`
Here, \`useState(0)\` initializes our state with \`0\`. It returns an array with two elements: the current state value (\`count\`) and a function to update it (\`setCount\`).

### Handling Side Effects: \`useEffect\`
What if you need to perform an action after the component renders, like fetching data from an API or setting up a subscription? This is where \`useEffect\` comes in. It lets you perform "side effects" in your components.

\`\`\`javascript
import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // Cleanup function
    return () => clearInterval(interval);
  }, []); // Empty array means run only once on mount

  return <div>Timer: {seconds}s</div>;
}
\`\`\`
The function inside \`useEffect\` runs after every render. The dependency array (\`[]\`) at the end is crucial. An empty array tells React to run the effect only once when the component mounts, and the cleanup function when it unmounts. This prevents memory leaks and unwanted behavior.
`
  },
  {
    id: 'the-art-of-reflection',
    title: 'The Art of Reflection: A Student\'s Perspective',
    date: 'December 05, 2023',
    category: 'Reflections',
    tags: ['mindfulness', 'productivity', 'self-improvement'],
    excerpt: 'In the hustle of academic and personal life, taking time to reflect is a superpower. Here\'s how I incorporate weekly reflections into my routine.',
    status: PostStatus.PUBLISHED,
    coverImage: `https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80`,
    content: `With deadlines looming and a social life to maintain, it's easy to get caught up in a cycle of just "doing". I found myself moving from one task to the next without ever pausing to consider what I was learning or how I was feeling. That's when I discovered the simple but profound practice of weekly reflection.

### My Simple Framework
Every Sunday evening, I set aside 30 minutes. No distractions. I ask myself three simple questions:
*   What went well this week? (A win, big or small)
*   What was a challenge this week? (A struggle or a lesson learned)
*   What will I focus on next week? (Setting a clear intention)

> "Reflection turns experience into insight."

This practice has been transformative. It helps me celebrate my progress, acknowledge my struggles without judgment, and approach the upcoming week with clarity and purpose. It's my personal system for continuous improvement, and it has had a greater impact on my well-being and productivity than any other "hack" I've tried.
`
  },
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'refactoring-ui',
    title: 'Refactoring UI',
    url: 'https://www.refactoringui.com/',
    description: 'A book and resource set by Adam Wathan and Steve Schoger that teaches you how to design beautiful user interfaces, from a developer\'s perspective. Invaluable for anyone building web apps.',
    type: RecommendationType.BOOK,
    isInitial: true,
  },
  {
    id: 'f-f-friday',
    title: 'Fireship - 100 Seconds of Code',
    url: 'https://www.youtube.com/c/Fireship',
    description: 'High-intensity, quick-fire videos that cover a wide range of web development topics. Perfect for getting up to speed on new technologies in a fun and engaging way.',
    type: RecommendationType.VIDEO,
    isInitial: true,
  },
  {
    id: 'excalidraw',
    title: 'Excalidraw',
    url: 'https://excalidraw.com/',
    description: 'A virtual whiteboard tool that lets you easily sketch diagrams with a hand-drawn feel. Great for brainstorming, planning, and explaining complex ideas visually.',
    type: RecommendationType.TOOL,
    isInitial: true,
  },
  {
    id: '3-2-1-thursday',
    title: 'James Clear\'s 3-2-1 Thursday Newsletter',
    url: 'https://jamesclear.com/3-2-1',
    description: 'A weekly newsletter with 3 short ideas from James, 2 quotes from others, and 1 question to ponder. Consistently insightful and thought-provoking content on habits and self-improvement.',
    type: RecommendationType.ARTICLE,
    isInitial: true,
  },
  {
    id: 'epic-react',
    title: 'Epic React by Kent C. Dodds',
    url: 'https://epicreact.dev/',
    description: 'An incredibly comprehensive and deep course on React. It goes far beyond the basics to teach you how to build professional, high-quality React applications.',
    type: RecommendationType.COURSE,
    isInitial: true,
  },
  {
    id: 'clean-architecture',
    title: 'A Clean Architecture Guide',
    url: 'https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html',
    description: 'The original blog post by Robert C. Martin (Uncle Bob) that outlines the principles of Clean Architecture. A must-read for any developer serious about building scalable and maintainable software.',
    type: RecommendationType.ARTICLE,
    isInitial: true,
  },
];