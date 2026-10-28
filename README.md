Louisiana Interpreters Hub

Live site: https://wbp318.github.io/LA-Interpreter-Hub-Website-fork/

A professional educational resource center for interpreters, featuring multilingual terminology resources, training materials, industry news, and professional ethics guidelines.

This website is currently under development.

## Pages and sections

- **Study library** (`index.html`) – searchable, filterable resource categories
- **Quick glossary** – English / Spanish / Vietnamese / French starter terms, filterable by setting, with CSV download
- **Ethics & standards** (`ethics.html`) – core principles plus Mermaid decision and role charts
- **Assignment guide** (`workflow.html`) – lifecycle and turn-taking charts, printable pre-assignment checklist
- **French immersion brief** (`french-immersion.html`) – sourced research brief on Louisiana public-school French immersion, with Mermaid charts and per-figure confidence badges
- **Parish proposals** (`parishes.html`) – status table for all 64 parishes and a proposal generator (per parish or all 64 as Markdown); unverified items are marked `[TO VERIFY]`
- **Community** – discussion board preview (sample content only)
- **News & events** – placeholder layout (nothing scheduled or published yet)
- **Contact form** – not connected to an inbox yet; set `contactEmail` in `assets/js/data.js` to enable it
- **Hub Assistant** – built-in helper (`assets/js/assistant.js`) for glossary lookups, navigation, and quick translations

## Site map

```mermaid
flowchart TD
H["index.html<br/>Home"] --> L["Study library"]
H --> G["Quick glossary<br/>CSV download"]
H --> C["Community preview"]
H --> E["News & events preview"]
H --> F["Contact form"]
H --> ET["ethics.html<br/>Ethics & standards"]
H --> W["workflow.html<br/>Assignment guide"]
H --> FI["french-immersion.html<br/>Research brief"]
FI --> PP["parishes.html<br/>64-parish proposal toolkit"]
ET --> M1["Decision flowchart<br/>Role diagram"]
W --> M2["Lifecycle chart<br/>Turn-taking diagram<br/>Printable checklist"]
A["assistant.js<br/>Hub Assistant"] -.-> H
A -.-> ET
A -.-> W
A -.-> FI
```

## Repo layout

```
index.html, ethics.html, workflow.html,
french-immersion.html, parishes.html    pages
assets/css/styles.css                    shared styles
assets/js/                               data, app, assistant, translator, charts
assets/img/                              banner image
scripts/check.mjs                        site checks run by CI
.github/workflows/ci.yml                 GitHub Actions
```

## How the code fits together

```mermaid
flowchart LR
D["assets/js/data.js<br/>glossary + settings"] --> APP["app.js<br/>menu, filters, glossary, forms"]
D --> AS["assistant.js<br/>lookups + chat UI"]
AS --> TR["translator.js<br/>client-side router"]
CH["charts.js<br/>Mermaid via CDN"] --> P["ethics.html<br/>workflow.html<br/>french-immersion.html<br/>parishes.html"]
ST["assets/css/styles.css"] --> ALL["All pages"]
```

## Translation router

`translator.js` tries each engine in order and tells the user which one answered.

```mermaid
flowchart TD
Q["translate text"] --> C{"Chrome on-device<br/>translator ready?"}
C -- Yes --> R1["Translate on device<br/>nothing downloaded or sent"]
C -- No --> O{"Offline translator<br/>enabled by user?"}
O -- Yes --> R2["OPUS-MT in browser<br/>~75 MB per pair, cached<br/>nothing sent"]
O -- No --> M["MyMemory free web API<br/>text is sent to a third party"]
R2 -- "fails" --> M
```

OPUS-MT covers English with Spanish, French, and Vietnamese (both directions) through Transformers.js. Users opt in from the assistant ("enable offline translator").

## Checks

`node scripts/check.mjs` validates JavaScript syntax, local links and anchors, duplicate ids, and the glossary data. GitHub Actions runs it on every push to `main` and on pull requests (`.github/workflows/ci.yml`).

## Notes

- Static site: serve the folder (for example `python -m http.server`) and open `index.html`.
- Glossary data lives in `assets/js/data.js`. Please have fluent speakers verify terms before relying on them.
- Mermaid charts load from the jsDelivr CDN (`assets/js/charts.js`); each has a text alternative.
- The assistant is rule-based, not an LLM. Translations go through the router above: Chrome's on-device translator first, then opt-in OPUS-MT, then the free MyMemory service (text is sent to it). Machine translation is a quick aid, not a certified translation. Do not enter confidential information.
