# github-finder
This repository is a monorepo which consist of frontend & backend packages

## Application tech stacks
- Frontend: React
- Backend: Node.js with Express, Mongoose for object modeling
- Database: MongoDB

## Setting up the workspace
### Pre-requisites
1. Requires Node 12 to be installed.
2. Requires Docker to be installed and running

### Starting the web application (from root folder)
1. Install all the packages:

        yarn build

2. Start the running the MongoDB in docker:

        yarn start-mongodb

3. Start both backend and frontend:

        yarn start
        
## Screenshots
![screenshot][screenshot]

[screenshot]: ./docs/images/github-finder.gif "Screenshot of app"