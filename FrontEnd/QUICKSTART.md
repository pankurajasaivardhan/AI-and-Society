# Quick Start Guide - PolluTrace AI Frontend

## 30-Second Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev

# 3. Open browser
# http://localhost:3000
```

Done! The app runs with mock data immediately.

## What You Get

✅ **5 Pages** fully functional with sample data
- Dashboard with 4 city cards
- Prediction charts with forecasts
- Source analysis with importance scores
- Anomaly detection timeline
- Model metrics tables

✅ **Interactive Charts** using Recharts
- Area charts with date range filters
- Dual line charts for predictions
- Bar charts for feature importance
- Timeline charts with anomaly markers

✅ **Responsive Design**
- Works on mobile, tablet, desktop
- Hamburger menu on mobile
- Touch-friendly interactions

✅ **Ready for Real API**
- Mock data can be replaced with real API calls
- No code refactoring needed
- See `API_INTEGRATION.md` for instructions

## Project Structure at a Glance

```
📁 app/
  📄 page.tsx → Dashboard
  📁 predictions/ → Forecast page
  📁 sources/ → Source analysis
  📁 anomalies/ → Anomaly detection
  📁 metrics/ → Model performance

📁 components/
  📄 Navigation.tsx → Top bar + city selector
  📄 AQICard.tsx → City cards
  📄 PM25TrendChart.tsx → Area chart
  📄 PredictionChart.tsx → Forecast chart
  📄 SourceAnalysis.tsx → Source cards + bar chart
  📄 AnomalyAnalysis.tsx → Timeline + table
  📄 MetricsDashboard.tsx → Performance tables

📁 lib/
  📄 mockData.ts → Data generators + API service
  📁 utils/
    📄 aqiCalculations.ts → Color mappings
```

## Key Features

### 🎨 Modern UI
- Dark navigation bar with cyan accents
- Gradient backgrounds
- Card shadows and hover effects
- Smooth animations

### 📊 Rich Visualizations
- PM2.5 area charts with date ranges (30d, 90d, 1yr, All)
- Actual vs Predicted dual line charts
- Feature importance bar charts
- Anomaly timeline with red markers
- Seasonal distribution charts
- Circular confidence gauge

### 🚀 Built for Scale
- Type-safe with TypeScript
- Responsive images and components
- Proper error handling
- Loading states for all pages
- Mock data ready for production API

## Common Tasks

### Change Backend URL
Edit `lib/mockData.ts`:
```typescript
const API_BASE_URL = 'http://your-go-backend:8080';

export const apiService = {
  async getPollution(city: string = 'Delhi') {
    return fetch(`${API_BASE_URL}/api/pollution?city=${city}`)
      .then(r => r.json());
  },
  // ... other methods
};
```

### Add a New City
Edit `app/page.tsx` and other pages:
```typescript
const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'NewCity'];
```

### Customize Colors
Edit `lib/mockData.ts` and `lib/utils/aqiCalculations.ts`:
```typescript
export const AQI_COLORS = {
  good: '#00B050',      // Change colors
  satisfactory: '#92D050',
  // ...
};
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `pnpm dev -p 3001` |
| Styles not loading | `pnpm build` then `pnpm start` |
| Charts not showing | Check browser console for errors |
| Memory issues | `pnpm install --no-frozen-lockfile` |

## Testing

```bash
# Production build
pnpm build

# Production server
pnpm start

# Lint code
pnpm lint
```

## Next Steps

1. ✅ Run `pnpm dev`
2. ✅ Explore all 5 pages
3. ✅ Check city selector works
4. ✅ Resize browser (test responsive)
5. ⏭️ Set up Go backend
6. ⏭️ Switch from mock data to real API
7. ⏭️ Deploy to Vercel

## File Sizes (Production)

```
JavaScript: ~180KB (gzipped)
CSS: ~45KB (gzipped)
Total: ~225KB
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome mobile)

## Tech Stack Quick Reference

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.2 | Framework |
| React | 19 | UI |
| Recharts | Latest | Charts |
| Tailwind | Latest | Styling |
| TypeScript | 5 | Type safety |

## Deployment Options

### Vercel (1-click)
```bash
# Push to GitHub, then deploy on Vercel
git push origin main
```

### Docker
```bash
docker build -t pollutrace-frontend .
docker run -p 3000:3000 pollutrace-frontend
```

### Self-hosted
```bash
pnpm build
pnpm start
```

## Getting Help

1. **README.md** - Full documentation
2. **API_INTEGRATION.md** - Backend setup guide
3. **Console logs** - Check browser F12
4. **Network tab** - Monitor API calls

## Important Notes

🔔 **Mock data** is used by default
- Works instantly without backend
- Replace when Go backend is ready
- See `API_INTEGRATION.md`

🔔 **CORS** must be enabled on backend
- Add headers for frontend origin
- Or use proxy in Next.js

🔔 **Type safety**
- All data is TypeScript typed
- Intellisense works everywhere
- Catch errors at build time

---

**Ready to explore? Run `pnpm dev` and open http://localhost:3000**

Questions? Check the full documentation in README.md and API_INTEGRATION.md
