# Contributing to Project Portal

First off, thanks for taking the time to contribute! 🎉

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

## How to Contribute

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/proje-portali.git
    ```
3.  **Create a branch** for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    # or
    git checkout -b fix/annoying-bug
    ```
4.  **Make your changes**.
5.  **Run tests and linting** to ensure no regressions:
    ```bash
    npm run lint
    npm run test
    ```
6.  **Commit your changes** with a descriptive message.
7.  **Push to your fork**:
    ```bash
    git push origin feature/amazing-feature
    ```
8.  **Submit a Pull Request** (PR) to the `main` branch of the original repository.

## Development Standards

- **Code Style:** We use ESLint and Prettier. Please ensure your editor is configured to use them.
- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/).
  - `feat: add new project filter`
  - `fix: resolve mobile menu issue`
  - `docs: update setup guide`
- **Testing:** New features should include unit or e2e tests where applicable.

## CI/CD

All PRs will trigger a CI pipeline that runs:
- Linting
- Unit/E2E tests
- Bundle size check
- Netlify Preview deployment

Please ensure all checks pass before requesting a review.
