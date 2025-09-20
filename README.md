# Contributors
[Luu Tuan Hoang](https://github.com/hwanginhanoi)

[Le Tran Bao Kien](https://github.com/kinley1609)
# Tradey installation guide (Leave a star plz :>)

Node version: v18.14.0

This project uses my DATASTAX account and databse. It may be hibernated after a few days of inactive. To use your DATASTAX account, change the values at "tradey-backend/index.js" according to DATASTAX's connecting guide

1. Install NodeJs v18.14.0 (v18.16.0 also works, other versions may or may not work)
2. Install npm v9.3.1 (other versions may or may not work)
3. Create a new folder
4. cd to that folder and clone the code to that folder:
> git clone https://github.com/KhueHoangMinh/Tradey_Social.git .
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
10. The table structures are in the "tables.txt" file. To use your DATASTAX account, change the values at "tradey-backend/index.js" according to DATASTAX's connecting guide
11. Open a new terminal and type:
> cd tradey-backend

> npm start
12. Open a new terminal and type:
> cd tradey-frontend

> npm start
