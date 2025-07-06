# Purple Currency Converter

A web-based currency converter application built with TypeScript, Express, and Nunjucks templating engine. Uses the CurrencyLayer API for real-time currency conversion rates.

## Features

- Real-time currency conversion using CurrencyLayer API
- Server-side rendering with Nunjucks templates
- TypeScript for type-safe development
- Express.js backend
- Modern async/await API handling
- SQLite3 storage

## Prerequisites

- Node.js and npm
- CurrencyLayer API key

## Environment Setup

Configure environment variables:

```bash
export CURRENCYLAYER_API_KEY=your_api_key_here
export DATABASE_PATH=path_to_sqlite3_file_here
```

> Note: application will use `:memory:` SQLite3 instance if not specified.

## Getting Started

### 1. Install Dependencies

```shell
npm install
```

### 2. Initialize Database

```shell
./scripts/create_db.sh $DATABASE_PATH
```

### 3. Build the Project

```shell
npm run build
```

### 4. Development

Start the development server:

```shell
npm start
```

The application will be available at `http://localhost:3000`

## License

WTFPL
