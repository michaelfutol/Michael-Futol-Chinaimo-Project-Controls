# FutolTech Project Controls Doctrine

This assessment follows a practical project-controls doctrine intended to make information easy to trust, easy to explain and easy to act on.

## 1. One controlled model, several views
- Excel is the quantity/commercial/progress authority.
- Microsoft Project is the schedule/CPM authority.
- Web and PDF are management presentation layers.
- Stable `WBS_ID`, `ACTIVITY_ID` and `BOQ_ID` fields connect the views.
- A figure must not be independently re-invented in each output; it must reconcile to its authoritative source.

## 2. Preserve the baseline
The approved/intended baseline is never casually overwritten. Routine updates record actuals and current forecast against the preserved baseline. Formal re-baselining is a separate, controlled management action.

## 3. Data date discipline
Every progress statement is tied to a visible Data Date. Actual progress ends at the Data Date; anything beyond it is forecast, not actual.

## 4. Measurement before opinion
Measured quantities drive earned progress and the payment claim. Previous + Current = Cumulative, and Contract/Approved Quantity - Cumulative = Remaining, subject to approved variation or remeasurement rules.

## 5. Schedule logic before appearance
The programme must contain usable WBS, durations, dependencies, working calendar, float and critical-path logic before presentation styling. Microsoft Project's calculated Start, Finish, Total Slack and Critical status are authoritative for schedule conclusions.

## 6. Delay analysis is impact analysis, not arithmetic
Reported delay-days are not automatically project-delay days. The controlling-path impact determines the forecast completion effect. Non-critical delay may consume float without moving completion. Concurrent delays are not simply added together.

## 7. Reporting doctrine: Fact -> Implication -> Action
Every management commentary should answer four questions quickly:
1. What happened / what is the status?
2. What does it affect?
3. Why does it matter?
4. What should management/site teams do next?

The preferred delivery is calm, concise and visual. Charts support the explanation; they do not replace it.

## 8. Result First, Evidence Underneath
The controlling result and current decision point are presented first. Supporting CPM, float and detailed logic remain available as auditable technical evidence.

## 9. Controlled scenario presentation
Each scenario should show:
- Condition / event
- Baseline state
- Unmitigated forecast impact where applicable
- Planning response / recommended control action
- Result after response where a recovery case is tested
- Residual risk / watch item
- Native schedule evidence

## 10. Visual control conventions
- Overall S-Curve: Baseline Planned + Actual to Data Date + Current Forecast.
- Scenario S-Curve: Baseline + Unmitigated Forecast + Mitigated/Recovery Forecast when relevant.
- Tracking Gantt: baseline bars superimposed with current/forecast bars and Data Date.
- Critical path/network evidence remains available as supporting technical detail when needed.

## 11. Management-system compatibility
The workflow is designed to be compatible with an ISO-style integrated management system without claiming certification or reproducing Kubota Construction's internal procedures.

### Quality-management intent (ISO 9001 context)
- document identification, revision and status
- traceable measurement and verification
- controlled baseline/change history
- review/approval fields
- reconciliation and QA checks
- evidence retained for audit

### Environmental-management intent (ISO 14001 context)
- environmental/permit constraints can be registered as activity interfaces or hold points
- changes affecting environmental controls are traceable
- environmental obligations can be linked to WBS/activity ownership and evidence

### Occupational-health-and-safety intent (ISO 45001 context)
- safety permits, method statements and prerequisite controls can be represented as schedule gates/hold points
- high-risk work can carry visible readiness/approval status
- delay/resequence decisions should not bypass required safety controls

Kubota Construction publicly lists ISO 14001, ISO 9001 and ISO 45001 certifications. The assessment therefore uses management-system-compatible control ideas while remaining explicitly illustrative and independent from Kubota's confidential project procedures.

## 12. Public-source / confidentiality boundary
Public project facts are cited to exact public URLs. The independently prepared WBS, durations, logic, BOQ quantities/rates, progress, claims and delay scenarios are clearly labelled illustrative. No confidential Kubota programme, BOQ, rate, claim or internal procedure is represented as source material.

## 13. Management Objective
The control system presents the project story in a concise decision sequence: status, variance, cause, schedule consequence, commercial consequence, recommended action and remaining exposure.
