# github-finder
This repository is a monorepo which consist of frontend & backend packages

## Application tech stacks
- Frontend: React
- Backend: Node.js with Express, Mongoose for object modeling
- Database: MongoDB
----
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

Note: It is possible to run frontend and backend separately. Go to frontend/backend folders and execute `yarn start`.

----
        
## Screenshots
![screenshot][screenshot]

[screenshot]: ./docs/images/github-finder.gif "Screenshot of app"

----
## Compromises/Shortcut
- No users login page and backend endpoints. 
  - For simplicity, all the users are shown in the left sidebar of the application.
  - Security: I created the JWT for each users on the frontend and is using `HS256` algorithm instead of `RS256`. This should be avoided as the tokens should be created at the backend endpoints upon login.
- Search repositories endpoint: 
  - The endpoint should return much lesser attributes. Should have whitelist the attributes to return to frontend.
- Backend endpoints (authentication & authorization): 
  - The authentication middleware on the endpoints are only decoding the JWT and not verifying the token. Ideally, it need to use better algorithm like `RS256` and would require public key to verify the token validity along with its expiry.