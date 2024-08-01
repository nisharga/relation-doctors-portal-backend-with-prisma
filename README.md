### 0.Prerequisites:

Download the stater pack from here 🙂 install and work on existing project 🙂
Add supabase DB URL.. finally

Package.json script

```
"scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "lint:check": "eslint --ignore-path .eslintignore --ext .js,.ts .",
    "lint:fix": "eslint . --fix",
    "prettier:check": "prettier --ignore-path .gitignore --write \"**/*.+(js|ts|json)\"",
    "prettier:fix": "prettier --write .",
    "lint-prettier": "yarn lint:check && yarn prettier:check",
    "test": "echo \"Error: no test specified\" && exit 1",
    "postinstall": "prisma generate"
  },
```

Post-install must need for deploy because after deploy if prisma generate not work then nothing will work for you..

You will get already two tables of data and two modules for it which you can use.

Remove Everything From route.ts...

Then Install Prisma Client: `npm i @prisma/client`
