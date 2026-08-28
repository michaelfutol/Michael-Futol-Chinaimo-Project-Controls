# Michael Futol — Chinaimo Project Controls Assessment

Auditable employer-facing project-controls assessment built around a **Chinaimo Water Treatment Plant–style mock project**. The repository is the technical audit trail; the deployed webpage is the reviewer-facing evidence room.

## Reviewer path

1. **Start Here** — project status, data date, planned vs actual, baseline finish and current claim.
2. **Requirement Map** — every requested assessment item mapped to its submitted solution and evidence.
3. **BOQ / Measurement / Progress** — weighted quantities, monthly progress, Planned vs Actual, S-Curve and variance.
4. **Planning / CPM** — 49-activity schedule, WBS coding, durations, dependencies, Gantt, CPM network and float/slack health.
5. **Delay Scenarios** — critical, non-critical, concurrent and procurement-watch cases with baseline vs forecast results.
6. **Monthly Payment Claim** — Previous, Current, Cumulative and Remaining quantities/amounts with BOQ QA.
7. **Native Deliverables** — Excel workbook and Microsoft Project schedule files.

## Requested assessment coverage

### 1. BOQ, Measurement & Progress
- Simple BOQ / measurement sheet in Excel
- Monthly progress from completed quantities
- Planned vs Actual comparison
- Gantt chart
- Planned and Actual S-Curve

### 2. Planning & Scheduling
- WBS
- Activity durations
- Activity relationships / dependencies
- Critical Path and critical activities
- Delay update
- Forecast project completion

### 3. Monthly Progress / Payment Claim
- Previous work completed
- Current-month work completed
- Cumulative progress
- Remaining balance
- BOQ / site-progress consistency checks

## Data authority

| Layer | Authority |
| --- | --- |
| **Excel** | BOQ, quantities, rates, earned progress, S-Curve weighting and payment claim |
| **Microsoft Project** | Start, Finish, Duration, Total Slack, Critical status, CPM path and forecast completion |
| **Web presentation** | Reconciled presentation only — no independent authoritative CPM calculation |

Stable `WBS_ID`, `ACTIVITY_ID` and `BOQ_ID` identifiers are used across the model so figures can be traced between native files and the web presentation.

## Data boundary

Publicly available Chinaimo / Vientiane Capital Water Supply Expansion information is used only to shape a realistic mock work breakdown and project context. **The assessment does not reproduce Kubota Construction's confidential contract WBS, BOQ, rates or approved programme.** Quantities, unit rates, durations, logic, progress, claims and delay scenarios are illustrative assessment data.

## Public source basis

- Kubota corporate public project announcement
- JICA public project information
- Japan Water Research Center / NewTap treatment-process reference

Exact links are preserved in `data/assessment.json` and surfaced in the webpage.

## Repository structure

```text
app/
  page.tsx                 # reviewer evidence room
  ProgressExplorer.tsx     # S-Curve / variance / monthly progress
  ScheduleExplorer.tsx     # baseline + scenario Gantt / CPM views
  globals.css              # visual system

data/
  assessment.json          # BOQ, progress, claims, scenarios, sources
  schedule.json            # 49-activity schedule source table

.github/workflows/ci.yml   # public build verification
```

The private cloud-to-Windows automation bridge is intentionally maintained in a **separate private repository** and is not part of this public assessment source tree.
