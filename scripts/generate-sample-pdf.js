const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

// Create a new PDF document
const doc = new jsPDF();

// Title page
doc.setFontSize(24);
doc.setFont('helvetica', 'bold');
doc.text('Clinical Trial Report', 105, 40, { align: 'center' });

doc.setFontSize(18);
doc.text('Immunexis', 105, 55, { align: 'center' });

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
doc.text('A Novel Immunotherapy Agent', 105, 65, { align: 'center' });

doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('Makana Pharma', 105, 90, { align: 'center' });

doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('Protocol Number: MKP-IMX-2024-001', 105, 105, { align: 'center' });
doc.text('Study Phase: Phase III', 105, 112, { align: 'center' });
doc.text('Date: January 15, 2024', 105, 119, { align: 'center' });

// Page 2 - Executive Summary
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('Executive Summary', 20, 20);

doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
const summaryText = `This report presents the results of a Phase III clinical trial evaluating the safety and efficacy of Immunexis, a novel immunotherapy agent developed by Makana Pharma for the treatment of advanced melanoma.

Study Design: Randomized, double-blind, placebo-controlled trial with 450 patients across 25 sites in North America and Europe.

Primary Endpoint: Overall survival (OS) at 24 months.

Key Findings:
• Immunexis demonstrated a statistically significant improvement in overall survival compared to placebo (HR 0.68, 95% CI: 0.55-0.84, p<0.001)
• The median OS was 18.2 months in the Immunexis group vs 12.1 months in the placebo group
• Treatment-related adverse events were consistent with the known safety profile`;

doc.text(summaryText, 20, 30, { maxWidth: 170, lineHeightFactor: 1.5 });

// Page 3 - Study Objectives
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('1. Study Objectives', 20, 20);

doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
const objectivesText = `Primary Objective:
To evaluate the efficacy of Immunexis compared to placebo in prolonging overall survival in patients with advanced melanoma who have progressed on or after prior therapy.

Secondary Objectives:
• To assess progression-free survival (PFS)
• To evaluate objective response rate (ORR)
• To characterize the safety and tolerability profile
• To assess quality of life using standardized instruments
• To evaluate pharmacokinetics and pharmacodynamics

The study was designed with 90% power to detect a hazard ratio of 0.70 for overall survival, assuming a two-sided alpha of 0.05.`;

doc.text(objectivesText, 20, 30, { maxWidth: 170, lineHeightFactor: 1.5 });

// Page 4 - Patient Population
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('2. Patient Population', 20, 20);

doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
const populationText = `Inclusion Criteria:
• Histologically confirmed advanced melanoma (unresectable Stage III or Stage IV)
• Disease progression on or after at least one prior systemic therapy
• ECOG performance status 0-1
• Adequate organ function
• Age ≥18 years

Exclusion Criteria:
• Active brain metastases or leptomeningeal disease
• Active autoimmune disease requiring systemic treatment
• Prior therapy with anti-PD-1, anti-PD-L1, or anti-CTLA-4 antibodies
• Significant cardiovascular disease

A total of 450 patients were randomized in a 2:1 ratio to receive either Immunexis 240mg IV every 2 weeks (n=300) or placebo (n=150). Baseline characteristics were well balanced between treatment arms.`;

doc.text(populationText, 20, 30, { maxWidth: 170, lineHeightFactor: 1.5 });

// Page 5 - Efficacy Results
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('3. Efficacy Results', 20, 20);

doc.setFontSize(13);
doc.setFont('helvetica', 'bold');
doc.text('3.1 Overall Survival', 20, 35);

doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
const efficacyText = `The primary endpoint of overall survival was met with statistical significance. At the pre-specified interim analysis, the independent data monitoring committee recommended early termination of the trial due to clear demonstration of efficacy.

Results at 24 months:
• Immunexis arm: 42% (95% CI: 37-47%)
• Placebo arm: 28% (95% CI: 21-35%)
• Hazard ratio: 0.68 (95% CI: 0.55-0.84, p<0.001)

The benefit of Immunexis was observed across all pre-specified subgroups, including age, gender, baseline disease burden, and prior therapy.

3.2 Progression-Free Survival
Secondary endpoint analysis showed:
• Median PFS: 8.4 months (Immunexis) vs 4.2 months (placebo)
• HR: 0.58 (95% CI: 0.48-0.70, p<0.001)`;

doc.text(efficacyText, 20, 45, { maxWidth: 170, lineHeightFactor: 1.5 });

// Page 6 - Safety Results
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('4. Safety and Tolerability', 20, 20);

doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
const safetyText = `Treatment-Emergent Adverse Events (TEAEs):
The safety profile of Immunexis was consistent with the known class effects of immunotherapy agents. The most common TEAEs (≥20%) in the Immunexis arm were:

• Fatigue: 45%
• Nausea: 28%
• Diarrhea: 24%
• Rash: 22%
• Pruritus: 21%

Immune-Related Adverse Events (irAEs):
Grade 3-4 irAEs occurred in 18% of patients in the Immunexis arm vs 3% in placebo:
• Colitis: 4%
• Hepatitis: 3%
• Pneumonitis: 2%
• Hypophysitis: 1%

All irAEs were managed with established protocols including corticosteroids and temporary treatment interruption. There were 2 treatment-related deaths in the Immunexis arm (pneumonitis and myocarditis).

Treatment discontinuation due to adverse events occurred in 12% of Immunexis patients vs 5% of placebo patients.`;

doc.text(safetyText, 20, 30, { maxWidth: 170, lineHeightFactor: 1.5 });

// Page 7 - Conclusions
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('5. Conclusions', 20, 20);

doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
const conclusionsText = `This Phase III clinical trial demonstrates that Immunexis significantly improves overall survival and progression-free survival in patients with advanced melanoma who have progressed on prior therapy. The magnitude of benefit (32% reduction in risk of death) represents a clinically meaningful improvement.

The safety profile is manageable and consistent with other immunotherapy agents in this class. The incidence of immune-related adverse events can be effectively managed with established protocols.

Key Strengths:
• Robust study design with appropriate statistical power
• Well-balanced baseline characteristics
• Comprehensive safety monitoring
• Consistent benefit across subgroups

These results support the use of Immunexis as a new treatment option for patients with advanced melanoma and form the basis for regulatory submission to the FDA and EMA.

Next Steps:
• Prepare regulatory submission package
• Continue long-term follow-up for durability of response
• Explore combination strategies in earlier disease stages`;

doc.text(conclusionsText, 20, 30, { maxWidth: 170, lineHeightFactor: 1.5 });

// Save the PDF
const outputPath = path.join(__dirname, '../public/documents/immunexis-clinical-trial.pdf');
fs.writeFileSync(outputPath, doc.output());

console.log(`PDF generated successfully: ${outputPath}`);
