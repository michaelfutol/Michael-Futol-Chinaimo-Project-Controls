# Michael Futol — Chinaimo Project Controls Case Study

Auditable project-controls case study built around publicly available Chinaimo / Vientiane water-supply project context. The repository is the technical audit trail; the deployed webpage is the reviewer-facing project-controls workspace.

## Primary schedule-control story

The submission is organized around **three controlled schedule states**:

1. **Baseline Programme** — the fixed reference commitment. It preserves the original logic, dates and completion milestone and is never overwritten by later status or recovery work.
2. **Running / Current Schedule** — the live status model at the Data Date, carrying actual progress/status, remaining work, current forecast and variance against the preserved baseline.
3. **Recovery Programme** — a separate forward-looking recovery model used to test practical measures for restoring or protecting the completion target without rewriting the baseline.

The critical, non-critical, concurrent-delay and procurement-watch cases remain supporting CPM analysis evidence. They are not presented as four additional primary programmes and are not represented as actual Chinaimo project delay records.

## Reviewer path

1. **Overview** — project status, Data Date, Planned vs Actual, baseline finish and current claim.
2. **Progress Control** — cumulative S-Curve, monthly production and variance.
3. **BOQ / Measurement** — quantities, rates, previous/current/cumulative measurement and remaining balance.
4. **Planning / CPM** — Baseline → Running / Current → Recovery, supported by 49-activity WBS, dependencies, tracking Gantt, critical path and float/slack health.
5. **Delay Analysis** — supporting critical, non-critical, concurrent and procurement-watch tests explaining why activity delay is not automatically project delay.
6. **Monthly Payment Claim** — Previous, Current, Cumulative and Remaining quantities/amounts with BOQ QA.
7. **Management-System Controls** — document control, source boundary and ISO-compatible project-controls concepts.
8. **Working Files** — native Excel workbook, Microsoft Project schedule evidence and reviewer documents.

## Data authority

| Layer | Authority |
| --- | --- |
| **Excel** | BOQ, quantities, rates, earned progress, S-Curve weighting and payment claim |
| **Microsoft Project** | Start, Finish, Duration, Total Slack, Critical status, CPM path and forecast completion |
| **Web / PDF** | Reconciled reviewer presentation only — no independent authoritative CPM calculation |

Stable `WBS_ID`, `ACTIVITY_ID` and `BOQ_ID` identifiers connect the control model across views.

## Data boundary

Publicly available Chinaimo / Vientiane Capital Water Supply Expansion information is used only to establish realistic project context. **No confidential Kubota Construction programme, BOQ, rates, claims, tender information or internal procedures are represented as source data.** The detailed WBS, quantities, unit rates, durations, logic, progress and claims are assessment control data. Delay cases are treated only as technical-assessment scenario inputs used to demonstrate CPM schedule-impact analysis and are not represented as actual project delay records.

## Public source basis

- Kubota Construction public project announcement
- Kubota corporate public project announcement
- JICA public project information
- Japan Water Research Center / NewTap treatment-process reference

Exact links are preserved in `data/governance.json` and surfaced in the webpage.

## Repository structure

```text
app/
  page.tsx                 # reviewer workspace
  ProgressExplorer.tsx     # S-Curve / variance / monthly progress
  ScheduleExplorer.tsx     # baseline/current/recovery + supporting CPM analysis views
  globals.css              # visual system
  governance.css           # document-control / governance presentation

data/
  assessment.json          # BOQ, progress, claims and scenario evidence
  schedule.json            # 49-activity schedule source table
  governance.json          # source register and control basis

public/downloads/          # native working-file package
.github/workflows/ci.yml   # public build verification
```

