# AgentManage

ASP.NET backend, Angular frontend to handle agents(WinAgent, LinuxAgent)

## Contents

- [Backend service](app-backend) - a .NET service with a `/ping` endpoint. Extend with your code.
- [Frontend app](app-frontend) - an Angular app. Extend with your code.
- [E2E test suites](cypress/integration) - a backend and a frontend Cypress test suites. Extend with your tests.
- [Pipeline](.github/workflows/tests.yml) - a test Runner that executes the Cypress tests on push to a branch other than `master`/`main`.

## Tech Stack

### Backend

- .NET7

### Frontend

- Angular 15.0.4
- Typescript 4.2.3

### Misc

- Cypress
- GitHub Actions

## Getting started

1. Make sure npm & node are configured on your local env. You can download those distributions for your platform [here](https://nodejs.org/en/download/)

2. Build your app.

```bash
npm install
npm run build # both backend and frontend
npm run build:backend # only backend
npm run build:frontend # only frontend
```

3. Start your app.

```bash
npm install
npm run start # both backend and frontend
npm run start:backend # only backend
npm run start:frontend # only frontend
```

4. Run the Cypress tests.

```bash
npm run test # run project tests under `cypress/integration`
```

---

Made by [DevSkills](https://devskills.co).

Did you find this repo useful? **Give us a shout on [Twitter](https://twitter.com/DevSkillsHQ) / [LinkedIn](https://www.linkedin.com/company/devskills)**.
