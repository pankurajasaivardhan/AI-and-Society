# PolluTrace AI - Air Quality Dashboard Frontend

A modern, responsive React/Next.js frontend for analyzing and forecasting air pollution levels across Indian cities using AI models.

## 🌟 Features

### 📊 **5 Comprehensive Pages**

1. **Dashboard** - Real-time AQI overview for 4 cities
2. **Predictions** - LSTM model forecasts with accuracy metrics
3. **Source Analysis** - XGBoost feature importance & SHAP explanations
4. **Anomaly Detection** - Autoencoder-based unusual event detection
5. **Model Metrics** - Technical performance benchmarks

### 🎨 **Modern 3D UI Design**

- Gradient backgrounds and card elevations
- Smooth animations and transitions
- Interactive hover effects
- Responsive design (Mobile, Tablet, Desktop)
- Dark navigation bar with city selector
- Color-coded AQI indicators

### 📈 **Interactive Charts**

- **Area Charts** - PM2.5 trend lines with date range filters
- **Dual Line Charts** - Actual vs predicted comparisons
- **Bar Charts** - Feature importance and seasonal distributions
- **Timeline Charts** - Anomaly detection with threshold markers
- **Circular Progress** - Model confidence scores
- All charts built with Recharts library

### 🔄 **Smart Data Management**

- Mock data generators for development
- Easy API endpoint switching
- Type-safe data structures
- Loading states and error handling
- Persistent city selection

### 📱 **Responsive & Accessible**

- Mobile-first design
- Hamburger menu on small screens
- Keyboard navigation support
- ARIA labels and semantic HTML
- Touch-friendly buttons and interactions

## 🛠️ Tech Stack

| Technology       | Purpose                             |
| ---------------- | ----------------------------------- |
| **Next.js 15**   | React framework with App Router     |
| **React 19**     | UI component library                |
| **TypeScript**   | Type safety                         |
| **Tailwind CSS** | Styling & responsive design         |
| **Recharts**     | Interactive charts & visualizations |
| **Lucide Icons** | UI icons                            |

## 📦 Project Structure

```
app/
├── page.tsx                 # Dashboard page
├── predictions/page.tsx     # Predictions page
├── sources/page.tsx         # Source analysis page
├── anomalies/page.tsx       # Anomaly detection page
├── metrics/page.tsx         # Model metrics page
├── layout.tsx               # Root layout with metadata
└── globals.css              # Global styles

components/
├── Navigation.tsx           # Top nav + city selector
├── AQICard.tsx              # AQI summary cards
├── PM25TrendChart.tsx       # PM2.5 area chart
├── PredictionChart.tsx      # Actual vs predicted chart
├── SourceAnalysis.tsx       # Source importance + confidence
├── AnomalyAnalysis.tsx      # Anomaly timeline + table
└── MetricsDashboard.tsx     # Model performance metrics

lib/
├── mockData.ts              # Mock data + API service
└── utils/
    └── aqiCalculations.ts   # AQI utilities & color mappings

public/                       # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository**

```bash
git clone <repo-url>
cd project
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Run development server**

```bash
pnpm dev
```

4. **Open in browser**

```
http://localhost:3000
```

## 🎯 Usage

### Using Mock Data (Development)

The frontend comes with mock data pre-configured:

```typescript
// All API calls use mock data by default
const data = await apiService.getPollution("Delhi");
```

### Switching to Real API

See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed instructions.

Quick setup:

1. Update `apiService` methods in `lib/mockData.ts`
2. Point to your Go backend URL
3. Ensure CORS is enabled on backend
4. Test in browser

### Navigation

- **Top Navigation Bar** - Switch between 5 pages
- **City Selector** - Change city (persists across pages)
- **Mobile Menu** - Hamburger menu on small screens

## 📊 Data Flow

```
User Action
    ↓
Page Component (e.g., page.tsx)
    ↓
useEffect hook (loads data on mount)
    ↓
apiService.getPollution() [or other endpoint]
    ↓
mockApi or real backend
    ↓
setState() → Component re-renders
    ↓
Display charts/cards
```

## 🎨 Design System

### Color Palette

- **Primary Blue**: `#1F4E79` (Headers, navigation)
- **Secondary Blue**: `#2E75B6` (Headings, borders)
- **Success Green**: `#00B050` (Good AQI)
- **Warning Orange**: `#FF6600` (Moderate AQI)
- **Danger Red**: `#FF0000` (Severe AQI)
- **Purple**: `#7030A0` (Very severe AQI)

### AQI Color Scale

```typescript
0-50:      🟢 Good (#00B050)
51-100:    🟢 Satisfactory (#92D050)
101-200:   🟡 Moderate (#FFFF00)
201-300:   🟠 Poor (#FF6600)
301-400:   🔴 Very Poor (#FF0000)
401+:      🟣 Severe (#7030A0)
```

### Typography

- **Headings**: Geist Sans, Bold
- **Body**: Geist Sans, Regular
- **Numbers**: Bold, 32-36px

## 📈 API Endpoints

Expected endpoints from Go backend:

| Endpoint                    | Method | Purpose                   |
| --------------------------- | ------ | ------------------------- |
| `/api/pollution?city=Delhi` | GET    | Pollution data for city   |
| `/api/predict?city=Delhi`   | GET    | LSTM predictions          |
| `/api/anomalies?city=Delhi` | GET    | Detected anomalies        |
| `/api/sources?city=Delhi`   | GET    | Pollution sources         |
| `/api/metrics`              | GET    | Model performance metrics |

See [API_INTEGRATION.md](./API_INTEGRATION.md) for response formats.

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Tailwind Config

Custom colors and utilities in `tailwind.config.ts`

### TypeScript

Strict mode enabled in `tsconfig.json`

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (Single column layout)
- **Tablet**: 640px - 1024px (2-column grid)
- **Desktop**: > 1024px (4-column grid)

## 🐛 Debugging

### Console Logging

```typescript
// Add debug logs to trace data flow
console.log("City selected:", selectedCity);
console.log("Data loaded:", data);
```

### Browser DevTools

1. **F12** - Open developer console
2. **Network tab** - Check API calls (when integrated)
3. **React DevTools** - Inspect component state
4. **Console** - View error messages

### Common Issues

| Issue              | Solution                        |
| ------------------ | ------------------------------- |
| Data not loading   | Check mock data is enabled      |
| Charts not showing | Verify data array has > 0 items |
| Styling issues     | Clear cache: Ctrl+Shift+R       |
| CORS errors        | Ensure backend has CORS headers |

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Deploy on Vercel dashboard
# or use Vercel CLI
vercel deploy
```

### Environment Setup for Production

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

## 📚 Component API

### AQICard

```tsx
<AQICard
  city="Delhi"
  pm25={187.4}
  trend="up" // 'up' | 'down' | 'same'
  isSelected={true}
/>
```

### PM25TrendChart

```tsx
<PM25TrendChart data={pollutionData} city="Delhi" />
```

### PredictionChart

```tsx
<PredictionChart data={predictionData} city="Delhi" />
```

## 🎓 Learning Resources

### Built With

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Recharts](https://recharts.org)
- [Tailwind CSS](https://tailwindcss.com)

### AQI Information

- [CPCB AQI Scale](https://www.cpcb.gov.in)
- [WHO Air Quality Guidelines](https://www.who.int)

## 📝 Development Notes

### Adding a New Page

1. Create file in `app/pages/page.tsx`
2. Import Navigation component
3. Add page link in Navigation.tsx
4. Load data with useEffect + apiService
5. Create custom components as needed

### Adding a New Component

1. Create file in `components/`
2. Use functional component with 'use client' directive
3. Export as default
4. Add TypeScript props interface

### Mock Data Structure

Update `lib/mockData.ts`:

1. Add type definition
2. Create mock generator function
3. Add to apiService object
4. Update component to use new data

## 🤝 Contributing

1. Clone repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is created for educational purposes.

## 🆘 Support

For issues:

1. Check [API_INTEGRATION.md](./API_INTEGRATION.md)
2. Review component props
3. Check browser console for errors
4. Verify mock data is enabled

---

**Built with ❤️ for clean air in Indian cities**
