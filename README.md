# sonarqube-bot

This is a bot for Sonarqube GitHub decoration.

## Usage

```bash
nvm use
npm install
npm run build
npm run start
```

## Configuration

The bot is configured by dotenv. The following environment variables are required:

- `APP_ID`
- `PRIVATE_KEY_PATH`
- `WEBHOOK_SECRET`
- `BOT_NAME`
- `SONAR_USERNAME`
- `SONAR_PASSWORD`
- `SONAR_URL`

## Required GitHub Permissions

The bot requires the following permissions:

- `Checks` (Read & Write)
- `Pull Requests` (Read & Write)

## Development

To run the bot in development mode, use the following command:

```bash
npm run dev
```
