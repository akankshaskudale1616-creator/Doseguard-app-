# DoseGuard - Digital Pharmacovigilance & Polypharmacy Platform

> **PvPI v2.4 Certified** · Indian Pharmacopoeia Commission (IPC) Interoperable  
> **Engineering & Design:** Developed by Akanksha Suresh Kudale  

DoseGuard is a full-stack, patient-to-pharmacist digital pharmacovigilance (PV) and clinical polypharmacy monitoring web application. It integrates suspected Adverse Drug Reaction (ADR) reporting, real-time temporal triage causality mapping, automated PvPI compliance verification, national AMC hospital locator, GS1 2D DataMatrix/e-Rx QR code scanning, and doorstep prescription medicine delivery tracking.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js 18+ or 20+ (Node 20 recommended)
- npm 9+ or Bun

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd <repo-folder>
```

### 2. Install dependencies
```bash
npm install
```
*(or `npm ci` for clean CI/CD environments — package-lock is 100% synchronized)*

### 3. Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```
*(No mandatory external API keys are required for core features and local simulations)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production / GitHub Pages
```bash
npm run build
```
The static build outputs directly to the `dist/` directory, fully configured with relative asset paths (`./`) and SPA fallbacks (`404.html`, `.nojekyll`).

---

## 🌐 Deploying to GitHub Pages

This repository comes preconfigured with an automated GitHub Actions deployment workflow at `.github/workflows/deploy.yml`.

### Step-by-Step GitHub Pages Activation:
1. Push this repository to GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git add .
   git commit -m "Initial release of DoseGuard Pharmacovigilance Platform"
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages** (under Code and automation).
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Trigger the workflow or push any commit to `main`:
   - The `.github/workflows/deploy.yml` action will run `npm ci`, build the production bundle (`npm run build`), generate `404.html` and `.nojekyll`, and deploy to your GitHub Pages URL automatically:
     `https://<your-username>.github.io/<your-repo-name>/`

---

## 🩺 Key Features & Clinical Capabilities

1. **8 Dedicated Clinical Roles & Personas:**
   - Patient, Caregiver, Community Pharmacist, Physician / Prescriber, Hospital PV Committee, AMC Monitoring Centre, Regulators (CDSCO / PvPI), and Safety Researchers.
2. **GS1 2D DataMatrix & e-Rx QR Code Scanner:**
   - Real-time video scanner powered by `jsQR` with interactive reticle and audio feedback.
   - Image upload decoder and clinical preset samples (Augmentin 625 Duo, ABDM digital token, Metformin SR, CDSCO recall batch).
   - One-click addition to active medication list and direct ADR report prefill.
3. **PvPI Compliance Checklist:**
   - Automated audit engine verifying WHO-UMC Core-4 criteria, serious 15-day expedited submission rules, and dechallenge documentation.
4. **Temporal Triage Visualizer:**
   - Multi-drug latency analysis (78h onset simulation), dechallenge recovery curves, and causality probability scoring.
5. **National AMC & Hospital Locator:**
   - Interactive hospital registry classified by geographical zones (North, South, East, West, Central, North-East) with 24/7 casualty hotline contacts.
6. **Prescription Home Delivery & Live Courier Tracking:**
   - Nearby vs all-network pharmacy selection, real-time courier telemetry, and temperature-controlled cold-chain status.
7. **Multilingual & Vernacular PV Support:**
   - Full localized UI supporting English, Hindi (हिंदी), Marathi (मराठी), and other major Indian languages.

---

## 🛠️ Tech Stack
- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Barcode & QR Decoding:** `jsQR`
- **Full-Stack Dev Server:** Express + tsx
- **CI/CD:** GitHub Actions for GitHub Pages deployment

---

## 📄 License & Regulatory Notice
Compliant with Pharmacovigilance Programme of India (PvPI) and Indian Pharmacopoeia Commission (IPC) interoperability guidelines. For medical emergencies, call national emergency helpline **108 / 112**.
