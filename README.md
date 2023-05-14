Node version: v18.14.0
================= Installation guide =================
1. Install NodeJs v18.14.0 (v18.16.0 also works, other versions may or may not work)
2. Install npm v9.3.1 (other versions may or may not work)
3. Create a new folder
4. cd to that folder and clone the code to that folder:
> git clone https://github.com/KhueHoangMinh/Akathon.git .
5. Install dependencies:
> cd tradey-frontend

> npm install

> cd ..

> cd tradey-backend

> npm install

> cd ..
6. Open terminal and type "ipconfig" to get your IPv4 address
7. Open file "tradey-frontend/src/index.js", then change "window.baseHost" to "http://[YOUR_IPv4]" (e.g. "http://192.168.1.7")
8. Open file "tradey-frontend/package.json", then change "proxy" to "http://[YOUR_IPv4]:3001" (e.g. "http://192.168.1.7:3001")
9. Open file "tradey-backend/index.js", then change "FRONTEND" to "http://[YOUR_IPv4]" (e.g. "http://192.168.1.7")
10. Open a new terminal and type:
> cd tradey-backend

> npm start
11. Open a new terminal and type:
> cd tradey-frontend

> npm start
