# TutorFin Project Design

## 1. Vision & Goal
Design a guided interactive exhibition for a kids' museum that teaches financial literacy. The UX must support easy manual resets, as well as automatic resets after a configurable period of inactivity.

## 2. Core Courses of Study
Our initial curriculum will be divided into the following courses. Each syllabus should map to a Schema.org `Course` holding ordered `LearningResource` modules:

### Personal Finance 100
**Focus:** Individual money management, planning, and life choices (pulling from Khan Academy and CS007).
**Proposed Syllabus (Modules):**
1. **Budgeting & Saving:** Income vs. expenses, emergency funds, and the power of compound interest.
   - *Khan Academy Unit:* [Saving and Budgeting](https://www.khanacademy.org/college-careers-more/personal-finance/pf-saving-and-budgeting) or [Financial Literacy - Budgeting and Saving](https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:budgeting-and-saving)
2. **Credit & Debt:** Understanding credit scores, credit cards, and interest rates.
   - *Khan Academy Unit:* [Interest and Debt](https://www.khanacademy.org/college-careers-more/personal-finance/pf-interest-and-debt) or [Financial Literacy - Consumer Credit](https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:consumer-credit)
3. **Paying for College:** Financial aid, student loans, and ROI on education.
   - *Khan Academy Unit:* [Paying for College](https://www.khanacademy.org/college-careers-more/college-admissions/paying-for-college)
4. **Investing Basics:** Risk/reward, stocks, bonds, index funds, and retirement planning.
   - *Khan Academy Unit:* [Investments and Retirement](https://www.khanacademy.org/college-careers-more/personal-finance/pf-investments-and-retirement)
5. **Taxes & Insurance:** Reading a paycheck, basic tax brackets, and mitigating risk.
   - *Khan Academy Unit:* [Taxes](https://www.khanacademy.org/college-careers-more/personal-finance/pf-taxes) and [Financial Literacy - Insurance](https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:insurance)

### Project Accounting 100
**Focus:** Financial management for discrete, temporary endeavors (great for exhibition-based scenario learning).
**Proposed Syllabus (Modules):**
1. **Project Budgeting:** Estimating costs (labor, materials) vs. actuals.
   - *Relevant Resource:* Adapted from [Khan Academy - Budgeting](https://www.khanacademy.org/college-careers-more/personal-finance/pf-saving-and-budgeting) applied to project scope.
2. **Direct vs. Indirect Costs:** Understanding how overhead affects a project.
   - *Relevant Resource:* Foundations in [Khan Academy - Accounting and Financial statements](https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme).
3. **Tracking & Ledger Basics:** Introduction to double-entry accounting (using LedgerText) on a per-project basis.
   - *Relevant Resource:* [Khan Academy - Cash vs Accrual accounting](https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme).
4. **Project Profitability:** Calculating ROI and margin of specific projects.
   - *Relevant Resource:* Conceptual mapping from [CS007: Evaluating Investments](https://cs007.blog/) and basic economics.

### Business Finance 100
**Focus:** The structural financial mechanisms of running a company.
**Proposed Syllabus (Modules):**
1. **The Accounting Equation:** Assets = Liabilities + Equity.
   - *Khan Academy Unit:* [The Balance Sheet and Accounting Equation](https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme)
2. **Financial Statements:** Reading the Balance Sheet, Income Statement, and Cash Flow Statement.
   - *Khan Academy Unit:* [Basic Financial Statements](https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme)
3. **Unit Economics:** Revenue, Cost of Goods Sold (COGS), and Gross Margin.
   - *Khan Academy Unit:* [Income Statement Basics](https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme)
4. **Capital & Funding:** Bootstrapping, debt financing, and equity.
   - *Khan Academy Unit:* [Stocks and Bonds, Raising Capital](https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds)

## 3. Curriculum Data Structure (Schema.org)
Structure our lessons with Schema.org linked data in Markdown. 
We will represent each syllabus as a tree graph using the following types:
- **Root**: `Course` 
- **Branches/Leaves**: Nested `LearningResource` entities.
- **Hierarchy Links**: Use `hasPart` to map parents to children (modules to lessons) and optionally `isPartOf` for backlinking.
- **Ordering**: Use the `position` property to establish chronological order.

For tracking coverage with and crossreferencing to instructional content:
- Maintain a list of relevant Khan Academy lessons for each subject (name, url, topics).
- Maintain a list of Common Core topic codes for each subject.
- Maintain a list of topic labels for each course of study.

## 4. Instructional Design & Tooling

### Jupyter Notebooks
- Develop notebooks to author lessons and financial scenarios using principles of instructional design.
- Include Markdown headings and a Table of Contents.
- Embed **LedgerText** (see below).
- Include test assertions to verify check figures.
- Ensure compatibility with JupyterLite xeus and Google Colab.

### Web Application
- **Stack**: Static SPA (Single-Page Application) using OpenNext (React, NextJS), Wrangler, Zustand (user state), and React-Intl (i18n).
- **Interactive Environment**: Use React Three Fiber, Drei, and React Three A11y for accessible 3D interactive simulations.
- **Features**: 
  - Teach basics via interactive simulations.
  - Provide a UI slider to replay the plaintext double-entry accounting execution synced with 3D animation scenes.
  - Store local scores/scoreboards until the app resets (no global server-side scoreboard).
- **Reset UX**: 
  - Require confirmation for manual resets.
  - Display a prompt requesting confirmation for 30 seconds before executing an auto-reset due to inactivity.

### LedgerText Abstraction
Beancount, Ledger, and hLedger are plaintext syntaxes for double-entry accounting. We want to support all three. We will abstract these as **LedgerText**. 
*(Note for research: investigate which plaintext accounting syntax is already most widely implemented or supported in both Python, for notebooks, and TS/JS, for the webapp).*

## 5. Development & Operations

### Repository Management
- Maintain project artifacts including `README.md` and `AGENTS.md`.
- Host as a Git repo on GitHub.
- Utilize GitHub Actions (YAML workflows) for CI/CD and Pull Requests.
- Include a `devcontainer.json` to support IDEs like GitHub Codespaces.

### Testing Strategy
- Write comprehensive unit, integration, and property tests via mocks, test fixtures, and parameterization.
- Implement E2E tests using Playwright and headless Chromium.
- **Test Artifacts**: Configure the test runner to log to disk under a uniquely dated directory. Output must include compiled test results, coverage reports, and stdout/stderr logs. Intercept and interpret this output to track build stability.

---

## Resources to Review
To develop lessons for financial literacy:
- https://en.wikipedia.org/wiki/Financial_literacy_curriculum
- https://en.wikipedia.org/wiki/Financial_literacy_curriculum#Key_components
- https://en.wikipedia.org/wiki/Personal_finance
- https://en.wikipedia.org/wiki/Financial_literacy
- https://en.wikipedia.org/wiki/Financial_Literacy_Month#In_the_United_States
- https://www.khanacademy.org/college-careers-more
- https://www.khanacademy.org/college-careers-more/financial-literacy
- https://www.khanacademy.org/college-careers-more/personal-finance
- https://www.khanacademy.org/college-careers-more/college-admissions/paying-for-college
- https://cs007.blog/


