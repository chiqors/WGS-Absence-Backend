# Backend App for WGS Absence

Please note that the frontend is on a separate repository. You can find it [here](https://github.com/chiqors/WGS-Absence-Frontend).

---

## Table of Contents

- [About](#about)
- [Getting started](#getting-started)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Configure the environment](#2-configure-the-environment)
  - [3. Install dependencies](#3-install-dependencies)
  - [4. Generate Prisma Client](#4-generate-prisma-client)
  - [5. Run the project](#5-run-the-project)
- [Credits](#credits)

---

### About

![banner](https://raw.githubusercontent.com/chiqors/WGS-Absence-Frontend/master/docs/preview.png)

This is the backend express server for frontend service of WGS Absence. This project is part of the [WGS Absence](https://github.com/chiqors/WGS-Absence-Frontend) project.

Technologies used:

- Express (Node.js)
- Prisma (ORM)
- Auth0 (JWT Authentication and Authorization)
- Multer (File Upload)
- Archiver (Zip File Creator)
- Express Validator (Request Validation)
- Nodemailer (Email Sender)

---

### Getting started
I only tested this project on Windows 7+. I don't know if it works on other OS.

#### 1. Clone the repository

```bash
git clone https://github.com/chiqors/wgs-absence-backend.git
```

#### 2. Configure the environment

`.env.example` is the example of the environment file. Copy it to `.env` and configure it.
`ngrok/ngrok.example.yml` is the example of the ngrok configuration file. Copy it to `ngrok/ngrok_config.yml` and configure it.

#### 3. Download ngrok executable from [here](https://ngrok.com/download) and put it in `ngrok` folder.

#### 3. Install dependencies

```bash
pnpm install
```

#### 4. Do Prisma Migration

```bash
pnpm prisma:prisma:migrate-dev
```

#### 5. Generate Prisma Client

```bash
pnpm prisma:generate
```

#### 6. Create the morgan log file at `logs/morgan.log`

#### 7. Run the project

```bash
pnpm dev
```

#### 8. (Optional) Run NGROK for internal testing

```bash
pnpm start:ngrok
```

---

### Credits

- Thanks to [Mailgun](https://www.mailgun.com) for providing email service.
- Thanks to [.tech](https://get.tech) for providing domain name.
- Thanks to [Vercel](https://vercel.com) for providing hosting service for both frontend and backend.
- Thanks to [Twilio](https://www.twilio.com) for providing SMS service. (Not implemented yet)