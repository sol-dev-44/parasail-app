# 🪂 Parasail Bro

> Your ultimate parasailing companion for smart chute selection and bar setup

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2-purple?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 What is Parasail Bro?

Parasail Bro is an intelligent web application designed for parasailing operators to make quick, safe decisions on chute selection and bar configuration. No more flipping through charts or doing mental math—just enter your passenger weights and wind conditions, and get instant recommendations.

### ✨ Key Features

- **🎈 Smart Chute Selection** - Intelligent recommendations based on total passenger weight and wind speed
- **⚖️ Bar Setup Calculator** - Automatic strap position assignments for 4 different bar types
- **🎯 Weight-Based Positioning** - Algorithms that calculate optimal passenger placement
- **🔧 Chute Filtering** - Toggle which chutes you own to see only relevant recommendations
- **📊 Visual Bar Diagrams** - Color-coded strap positions with highlighted assignments
- **🌡️ Unit Conversion** - Seamless switching between Imperial (lbs/mph) and Metric (kg/kph)
- **🎨 Miami Vice Vibes** - Beautiful gradient design with dark mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sol-dev-44/parasail-app.git

# Navigate to project directory
cd parasail-app

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` and start making recommendations! 🎉

## 🎮 How to Use

1. **Enter Passenger Weights** - Add 1-3 passengers with their weights
2. **Set Wind Speed** - Input current wind conditions
3. **Filter Your Chutes** (Optional) - Select only the chutes you own
4. **Select Bar Type** - Choose from Doubleizer, Doubleizer SP, Multiflyer, or Multiflyer ADV
5. **Get Recommendations** - View chute options and bar setup instructions

### Bar Types Supported

| Bar Type | Positions | Passengers | Fulcrum |
|----------|-----------|------------|---------|
| **Doubleizer** | A-F (6) | 2 | No |
| **Doubleizer SP** | A-D (4) | 2 | No |
| **Multiflyer** | A-F (6) | 2-3 | Yes |
| **Multiflyer ADV** | A-F (6) | 2-3 | Yes |

## 🧮 The Algorithm

### Chute Selection

Recommendations are sorted by a scoring algorithm that prioritizes chutes operating in the middle of their safe weight and wind ranges:

- **60% Weight Factor** - How close to the middle of the weight range
- **40% Wind Factor** - How close to the middle of the wind range
- **Bonus** - A/M zipper CLOSED position (safer)

### Bar Setup Logic

**For 2 Passengers:**
- Calculate weight difference
- Look up strap positions in bar-specific tables
- Assign heavy and light passengers to designated straps

**For 3 Passengers:**
- Find the 2 passengers closest in weight → outside positions
- Place the passenger furthest in weight → middle position
- Use "FOR TRIPLES" table for position lookup

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📁 Project Structure

```
parasail-app/
├── app/                    # Next.js app directory
│   ├── chute-selector/    # Main chute selector page
│   ├── page.tsx           # Landing page
│   └── theme-provider.tsx # Dark mode provider
├── components/            # React components
│   ├── BarSetupDisplay.tsx
│   ├── BarTypeSelector.tsx
│   ├── ChuteFilter.tsx
│   ├── ChuteRecommendationCard.tsx
│   └── PassengerInput.tsx
├── lib/                   # Core logic
│   ├── barData.ts        # Bar specifications
│   ├── barSetup.ts       # Bar setup algorithms
│   ├── chuteData.ts      # Chute specifications
│   └── chuteRecommendations.ts
└── store/                # Redux state
    ├── slices/
    │   └── chuteSlice.ts
    └── store.ts
```

## 🎨 Design Philosophy

Parasail Bro combines functionality with aesthetics:

- **Miami Vice Theme** - Vibrant gradients (pink, orange, cyan)
- **Dark Mode First** - Optimized for outdoor use in bright conditions
- **Visual Clarity** - Color-coded strap positions match reference charts
- **Responsive Design** - Works on tablets and phones

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

MIT License - feel free to use this for your parasailing operation!

## 🙏 Acknowledgments

- Built for parasailing operators who need quick, reliable recommendations
- Chute data based on Custom Chutes wind and size charts
- Bar setup logic derived from manufacturer specifications

---

**Made with ☀️ for the parasailing community**

*Stay safe, fly high!* 🪂
