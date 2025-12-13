# CSStatLab

https://csstatlab.com

CSStatLab is a Counter-Strike performance analysis platform focused on advanced player statistics, aim evaluation, and anomaly detection.  
The project analyzes match data to provide meaningful insights into player performance beyond traditional stats like K/D.

The goal of CSStatLab is **not** to accuse players of cheating, but to highlight unusual statistical patterns and provide deeper analytical context.

---

##  Features

- **Custom Aim Rating System**
  - Benchmarked and calibrated to closely match professional-level distributions

- **Last 30 Matches Analysis**
  - Average aim rating computed from the most recent matches
  - Trimmed mean to reduce outlier impact
  - Reliability scaling based on sample size

- **Performance Visualizations**
  - Interactive charts (Aim rating, kd, accuracy, pre-aim, reaction time)
  - Match-based X-axis for consistent comparison

- **FairPlay Insight**
  - Composite risk score based on:
    - Aim rating
    - Pre-aim behavior
    - Reaction time
    - K/D ratio
    - Win rate
  - Clear risk labels (Very low / Somewhat risky / Extremely suspicious)

- **Clean UI & Theming**
  - Dark theme
  - Custom-styled tooltips and progress indicators
  - Designed for clarity and readability

---

##  Aim Rating Methodology

CSStatLab uses a **weighted, benchmark-based scoring model**:

1. **Raw metric normalization**
   - Each stat is scored between 0–100 using percentile-based benchmarks
   - Metrics are evaluated based on whether *higher* or *lower* values are better

2. **Weighted aggregation**
   - Core mechanics (pre-aim & reaction time) have higher influence
   - Supporting mechanics (spray, accuracy, counter-strafing) add stability

3. **Calibration**
   - Non-linear calibration aligns results with real-world skill distribution
   - High-end performance (pro / semi-pro level) is preserved

4. **Reliability adjustment (optional)**
   - Scores are softened for players with low shot counts or few matches

>  Aim Rating is **not a cheat detector**.  
> It is a statistical skill estimate meant for analysis and comparison.

---

##  Data Sources

CSStatLab is designed to work with structured match data such as:
- Accuracy metrics
- Reaction times
- Shot distribution
- Round outcomes
- Match timestamps

Leetify data is referenced for validation and comparison purposes.

---

##  Tech Stack

- **Frontend:** Next.js (React), TypeScript
- **Charts:** Recharts
- **Styling:** Tailwind CSS
- **State & Computation:** Custom scoring logic
- **Data Processing:** Client-side aggregation & normalization

---

##  Disclaimer

CSStatLab provides **statistical estimates only**.  
Results are **not definitive proof of cheating** and should always be interpreted with caution and additional context.

This project is intended for:
- Learning
- Analysis
- Visualization
- Skill comparison

---

##  Author

**Daniel Ekeberg**  
Frontend Developer Student
Focus: Data visualization, performance analysis, UI/UX

https://csstatlab.com
https://danielekeberg.com
