# AI Usage 


Tools used: Antigravity, ChatGPT, Cursor


Where it helped most: 
- Writing backend API handlers, service layer logic, and Mongoose models.
- Generating Docker configuration files (Dockerfile, docker-compose.yml) and drafting README documentation.
- Creating typed React hooks, TypeScript interfaces, and frontend page components.


Where it got things wrong / where I had to correct it: 
- The initial folder structure suggestions did not follow a clean feature-based module pattern, requiring manual redirection.
- API response shapes were sometimes inconsistent and needed manual correction.
- It suggested incompatible package versions (e.g., TypeScript 6 types causing build failures on Render), which required manual diagnostic and fix.
- Early error handling was too generic and had to be refactored into the centralized AppError middleware pattern.


One thing I deliberately did NOT delegate to the agent, and why: 
I did not ask the agent to scaffold the entire application in one shot. When given broad prompts, AI tends to generate monolithic files with all logic in one place and no separation of concerns. I worked incrementally instead, reviewing each generated piece, extracting logic into the appropriate lib/ or hooks/ modules, and ensuring every component had a single, clear responsibility before moving forward.