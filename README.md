Good Card Auth

## Local host endpoint
- http://localhost:3002
Method: GET
Body: N.A.
Purpose: Health check

- http://localhost:3002/auth/login
Method: POST
Body: `username`, `password`,`role`, `provider`
Purpose: Allow login

- http://localhost:3002/auth/check
Method: POST
Body: `accessToken`
Purpose: Check access token

- http://localhost:3002/auth/refresh
Method: POST
Body: `accessToken`
Purpose: Refresh refresh token