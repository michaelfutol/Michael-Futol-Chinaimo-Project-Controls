CHINAIMO PROJECT CONTROLS - NATIVE MICROSOFT PROJECT PACKAGE

PRIMARY CONTROL STRUCTURE
1. BASELINE PROGRAMME
   - Fixed reference commitment.
   - Preserves original logic, dates and completion milestone.
   - Must not be overwritten by status updates or recovery changes.

2. RUNNING / CURRENT SCHEDULE
   - Live status model at the Data Date.
   - Carries actual progress/status, remaining work, current forecast and variance against Baseline.
   - This is the principal model for explaining where the project stands now.

3. RECOVERY PROGRAMME
   - Separate forward-looking recovery model.
   - Tests practical recovery measures without rewriting Baseline.
   - Used to demonstrate how the completion target can be restored or protected.

SUPPORTING CPM ANALYSIS
Scenario A/B/C/D files are supporting technical-assessment evidence for critical-delay, non-critical-delay, concurrent-delay and procurement-watch analysis. They are not additional primary programmes and are not represented as actual Chinaimo project delay records.

Authority model
- Excel: BOQ, measurement, earned progress, S-Curve and payment claim.
- Microsoft Project: schedule calendar, activity logic, baseline/current dates, Critical Path, Total Slack and forecast completion.

Native Project commercial fields
- Fixed Cost / Cost1 = BOQ-linked Control Value.
- Cost2 = Previous Earned.
- Cost3 = Current Earned.
- Cost4 = Cumulative Earned.
- Cost5 = Remaining Value.
- Number1 = BOQ Control Progress %.
These fields reconcile to the Excel control model by Activity ID. They are not incurred accounting cost or a contractual cost-loaded schedule.

Resource Usage
Resources prefixed 'CTRL -' are normalized schedule-derived control workstreams used to make Work/Resource Usage views meaningful. They are not a manpower histogram, staffing plan or productivity commitment.

Key dates
Baseline Finish: 15-Jan-2029
Data Date: 31-Aug-2027
Scenario A / C Forecast: 26-Jan-2029 (+10 working days)
Scenario B / D: no movement of completion milestone in the test case.
Recovery Programme: restores the 15-Jan-2029 completion target in the assessment model.
