<div align="center">
  <img src="./public/images/og.png" alt="App screenshot">
  <h1>Le QCM</h1>
  <br />

  <a href="https://github.com/Shinyhero36/LeQCM/stargazers">
    <img src="https://img.shields.io/github/stars/Shinyhero36/LeQCM?colorA=363a4f&colorB=b7bdf8&style=for-the-badge" />
  </a>
  <a href="https://github.com/Shinyhero36/LeQCM/issues">
    <img src="https://img.shields.io/github/issues/Shinyhero36/LeQCM?colorA=363a4f&colorB=f5a97f&style=for-the-badge" />
  </a>
  <a href="https://github.com/Shinyhero36/LeQCM/contributors">
    <img src="https://img.shields.io/github/contributors/Shinyhero36/LeQCM?colorA=363a4f&colorB=a6da95&style=for-the-badge" />
  </a>
</div>

## 📦️ Stack

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [Prisma](https://www.prisma.io/)
- [Clerk](https://clerk.dev/)

## Prerequisites

1. Install [Docker Desktop](https://docs.docker.com/get-docker/) for Mac, Windows, or Linux. Docker Desktop includes Docker Compose as part of the installation.

2. Copy the `.env.example` file and rename it to `.env`.
3. Visit the following services to create an account and get the required credentials:
   - [Clerk](https://dashboard.clerk.dev/) to create an account and get `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
   - [Planetscale](https://planetscale.com/) to create an account and get `DATABASE_URL`

## 💻 Development

### 🐋 Using Docker Compose

Run the development server:

```bash
# Install dependencies
npm run dev

# Build dev
docker compose -f docker-compose.dev.yml build

# Up dev
docker compose -f docker-compose.dev.yml up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Using local development

Install the dependencies:

```bash
# Install dependencies
npm install

# Run the development server:
npm run dev
```


## 🚀 Production

### 🐋 Using Docker Compose

Multistage builds are highly recommended in production. Combined with the Next Output Standalone feature, only node_modules files required for production are copied into the final Docker image.

First, run the production server (Final image approximately 226 MB).

```bash
# Build prod
docker compose -f docker-compose.prod.yml build

# Up prod
docker compose -f docker-compose.prod.yml up
```

Alternatively, to run the production server without multistage builds you can have a look at the [with-docker-compose](https://github.com/vercel/next.js/tree/canary/examples/with-docker-compose) example in the Next.js repository.


### 🐋 Using Docker Image

1. Remove the `.env` file from `.dockerignore` if you want to use the `.env` file in development.
2. Build the image and run it as a container:

```bash
# Build the image
docker build -f Dockerfile.prod.image -t leqcm .

# Run the container
docker run -p 3000:3000 leqcm
```

> If your want to save your image in a tar gz archive, you can use the following command:
> ```bash
> docker save leqcm:latest | gzip > leqcm.tar.gz
> ```

### Local

Build for production:

```bash
# Build prod
npm run build

# Run the production server:
npm run start
```

---

<p align="center">
  <a href="https://github.com/Shinyhero36/LeQCM/blob/main/LICENSE">
    <img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=GPL-3.0&logoColor=d9e0ee&colorA=363a4f&colorB=b7bdf8" />
  </a>
</p>