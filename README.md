# Michael Futol — Chinaimo Project Controls Recovery Assessment

Lean employment-assessment case study anchored to publicly available Chinaimo / Vientiane Capital Water Supply Expansion records. The repository is a technical audit trail; the deployed website is a presentation-only reviewer layer.

## Submission doctrine

The formal submission contains exactly six files:

1. **Master Excel** — BOQ/value-weighted assessment status, monthly reporting structure, recovery control and one sample Interim Payment Certificate.
2. **English reviewer companion** — concise FAQ and control rationale.
3. **Japanese reviewer companion** — reviewer-convenience Japanese version of the same control rationale.
4. **Baseline MPP** — preserved Original Assessment Baseline (Rev 0).
5. **Actual Progress MPP** — status/forecast model at the assessment Data Date.
6. **Recovery MPP** — forward-looking partial recovery test derived from the statused model.

No A/B/C/D scenario MPP set is part of the reviewer-facing submission.

## Public facts vs assessment simulation

**Public anchors used**

- Construction start reported for **October 2025**; `01-Oct-2025` is used only as a modeling convention because an exact contractual NTP date was not found in the public sources used.
- Published implementation period: **30 months**.
- Public Chinaimo-specific progress checkpoint: **4.19% at 05-May-2026**.
- Latest public completion target used in this assessment: **July 2028**.
- Public construction-package value reported: **JPY 6,478,257,873**.

**Assessment data**

- Assessment Data Date: **31-Aug-2026**.
- BOQ/value-weighted assessment progress: **12.095%**. This is a simulation, not a Kubota-reported figure.
- Detailed activity durations, logic, task-level status, BOQ allocations, rates, recovery actions and sample IPC assumptions are assessment-derived.
- Assessment control value: **JPY 6.0 billion**; it is not represented as Kubota's contract BOQ.

No confidential Kubota Construction programme, BOQ, rates, claims, tender data or internal procedures are represented.

## Baseline governance

- **Original Assessment Baseline (Rev 0):** preserved and never overwritten by monthly status or recovery work.
- **Periodic / monthly update:** records actuals, remaining duration and current forecast against the approved reference.
- **Revised baseline:** created only when a formally approved change genuinely requires rebaselining. A variation or pending EOT does not automatically rewrite Rev 0.

## Schedule-control story

The reviewer-facing schedule chain is intentionally limited to:

**Baseline → Actual Progress → Recovery**

Microsoft Project is the CPM authority for dates, float/criticality and forecast completion. Excel is the assessment authority for BOQ/value-weighted progress, measurement and the sample IPC. The website does not independently calculate CPM results.

Forecast variance between assessment schedule states is **not automatically a contractual EOT, compensable delay or responsibility determination**. Those conclusions require the actual Contract Particular Conditions and contemporaneous project records.

## Monthly control and sample IPC

Monthly reporting is used as a transparent assessment convention. The control chain is:

**Measurement → Earned Progress → Current Forecast → Sample Interim Payment Certificate**

The workbook demonstrates one sample IPC at 31-Aug-2026. Retention, previous certified amount and other commercial inputs that are not confirmed from CP-1 Particular Conditions are clearly identified as assessment assumptions.

## Public source basis

- KPL — Kubota agreement / October 2025 construction start / 30-month implementation period
- Vientiane Times — public package value / implementation period
- KPL — groundbreaking / 2028 completion context
- Vientiane Times — 4.19% overall progress at 05-May-2026 / July-2028 target
- JICA standard Works conditions — reference framework for monthly statements / interim payment mechanics; exact CP-1 Particular Conditions remain controlling on the real project

Exact project-source links are kept in `data/assessment.json` and surfaced on the reviewer website.

## Core repository structure

```text
app/
  page.tsx                 # English lean reviewer page
  ja/page.tsx              # Japanese lean reviewer page

data/
  assessment.json          # public anchors + assessment boundary + three-model controls
  schedule.json            # assessment schedule source table

public/downloads/          # native Project delivery location
.github/workflows/ci.yml   # public build verification
```
