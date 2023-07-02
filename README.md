<div align="center">
  <img src="./public/images/og.png" alt="App screenshot">
  <h1>Le QCM</h1>
  <p align="center">
  Un kahoot-like
  <br />
  <a href="#"></a>

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


## 📦️ Technologies utilisées

- [React](https://reactjs.org/) Une librairie JavaScript pour créer des interfaces utilisateurs
- [Next.js](https://nextjs.org/) Un framework React pour créer des applications web
- [TypeScript](https://www.typescriptlang.org/) Une surcouche de JavaScript qui permet d'ajouter du typage à JavaScript
- [Tailwind CSS](https://tailwindcss.com/) Un framework CSS qui permet de styliser rapidement une application web.
- [Vercel](https://vercel.com/) Une plateforme de déploiement d'applications web
- [Prisma](https://www.prisma.io/) Un ORM pour Node.js et TypeScript
- [Clerk](https://clerk.dev/) Une plateforme d'authentification et de gestion des utilisateurs

## :computer: Comment lancer le projet en local ?

### Installer git

S vous utiliser Windows, vous pouvez télécharger git [ici](https://git-scm.com/download/win).

Si vous utilisez Linux, vous pouvez installer git avec votre gestionnaire de paquets.

```bash
# Debian/Ubuntu
sudo apt install git

# Arch Linux
sudo pacman -S git
```

### Installer nodejs et pnpm

Si vous utiliser Windows, vous pouvez télécharger nodejs [ici](https://nodejs.org/en/download/).

Si vous utilisez Linux, vous pouvez installer nodejs avec votre gestionnaire de paquets.

```bash
# Debian/Ubuntu
sudo apt install nodejs

# Arch Linux
sudo pacman -S nodejs-lts-hydrogen
```

Une fois nodejs installé, vous pouvez installer pnpm avec la commande suivante :

```bash
npm install -g pnpm
```

### Cloner le projet

```bash
git clone https://github.com/Shinyhero36/LeQCM.git
```

### Installer les dépendances

```bash
cd LeQCM
pnpm install
```

### Configurer les variables d'environnement

Vous pouvez copier le fichier `.env.example` et le renommer en `.env`.

```bash
cp .env.example .env
```

Rendez-vous sur:

- [Clerk](https://dashboard.clerk.dev/) pour créer un compte et récupérer `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` et `CLERK_SECRET_KEY`
- [Planetscale](https://planetscale.com/) pour créer un compte et récupérer `DATABASE_URL`
> Libre à vous d'utiliser une autre base de données que Planetscale.

### Synchroniser `prisma/schema.prisma` avec le schéma de la base de données

Cela permet de créer les tables de la base de données à partir de [prisma/schema.prisma](prisma/schema.prisma)

```bash
npx prisma db push
```

### Lancer le serveur de développement

```bash
pnpm dev
```

Vous pouvez maintenant accéder au projet sur [localhost:3000](http://localhost:3000)

---

<p align="center">
  <a href="https://github.com/Shinyhero36/LeQCM/blob/main/LICENSE">
    <img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=GPL-3.0&logoColor=d9e0ee&colorA=363a4f&colorB=b7bdf8" />
  </a>
</p>