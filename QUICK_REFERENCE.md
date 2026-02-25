# Developer Quick Reference Card

## 🚀 Quick Commands

### Starting Development

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Access points
Frontend: http://localhost:3000
API:      http://localhost:5001/api
Admin:    http://localhost:3000/admin
```

---

## 🎨 CSS Variables Quick Reference

### Colors
```css
/* Primary Brand */
--primary-color: #121212       /* Black */
--accent-color: #ff6b35        /* Orange */
--accent-light: #f7931e        /* Light Orange */

/* Neutral */
--background-color: #ffffff    /* White */
--surface-color: #f9f9f9       /* Light Gray */
--border-color: #e0e0e0        /* Border Gray */

/* Text */
--text-primary: #1a1a1a        /* Dark text */
--text-secondary: #666666      /* Medium text */
--text-light: #999999          /* Light text */

/* Feedback */
--success-color: #4caf50       /* Green */
--error-color: #f44336         /* Red */
--warning-color: #ff9800       /* Orange *)
```

### Spacing
```css
--spacing-xs: 0.25rem   (4px)
--spacing-sm: 0.5rem    (8px)
--spacing-md: 1rem      (16px)
--spacing-lg: 1.5rem    (24px)
--spacing-xl: 2rem      (32px)
--spacing-2xl: 3rem     (48px)
```

### Other Variables
```css
--radius-sm: 0.25rem
--radius-md: 0.5rem
--radius-lg: 1rem

--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px rgba(0,0,0,0.1)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.15)

--transition-base: 0.3s ease
```

---

## 📐 Responsive Breakpoints

```css
/* Mobile First (default) - 480px and below */

/* Tablet - 768px and up */
@media (min-width: 768px) { ... }

/* Desktop - 1024px and up */
@media (min-width: 1024px) { ... }

/* Large Desktop - 1280px and up */
@media (min-width: 1280px) { ... }
```

---

## 🖼️ Image Components

### APIImage (Backend API Images)
```tsx
import APIImage from '@/components/APIImage/APIImage';

<APIImage 
  src={product.image}
  alt={product.name}
/>
```

### OptimizedImage (Static Images)
```tsx
import OptimizedImage from '@/components/OptimizedImage/OptimizedImage';

<OptimizedImage 
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>
```

---

## 🔌 API Integration

### Fetch Products
```tsx
import { getProducts } from '@/services/api';

const data = await getProducts();
```

### Upload Image
```tsx
const formData = new FormData();
formData.append('image', file);
const response = await uploadImage(formData);
```

### Make Custom Request
```tsx
import axios from 'axios';

const response = await axios.get('/api/products');
const data = response.data;
```

---

## 📝 Create New Page Template

```tsx
// src/app/newpage/page.tsx
'use client';

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './NewPage.module.css';

export default function NewPage() {
  return (
    <main className={styles.main}>
      <Navbar />
      <section className={styles.container}>
        {/* Content here */}
      </section>
      <Footer />
    </main>
  );
}
```

```css
/* src/app/newpage/NewPage.module.css */
.main {
  width: 100%;
  background: var(--background-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem;
}

@media (max-width: 768px) {
  .container { padding: 2rem 1rem; }
}
```

---

## 🔍 Debugging Checklist

```
[ ] Check browser console (F12)
[ ] Check backend logs
[ ] Verify API URL in .env.local
[ ] Check network requests (DevTools)
[ ] Verify database connection
[ ] Clear .next cache and rebuild
[ ] Check for typos in imports
[ ] Verify file paths
[ ] Check component props
[ ] Validate TypeScript types
```

---

## 🧪 Testing Steps

1. **Local:** npm run dev
2. **Build:** npm run build
3. **Production:** npm start
4. **Lint:** npm run lint
5. **Lighthouse:** DevTools → Lighthouse

---

## 📚 File Locations

| Purpose | Location |
|---------|----------|
| Global Styles | `src/app/globals.css` |
| Home Page | `src/app/page.tsx` |
| Components | `src/components/` |
| API Client | `src/services/api.ts` |
| Styles Module | `src/app/page.module.css` |
| Backend Routes | `backend/routes/` |
| Database Models | `backend/models/` |

---

## 🚨 Common Errors & Fixes

| Error | Solution |
|-------|----------|
| Images not loading | Check API URL in .env.local |
| Styles not working | Clear .next folder, rebuild |
| Port already in use | Kill process: `lsof -i :5001` then `kill -9 PID` |
| Module not found | Check import path, verify file exists |
| TypeScript error | Check type definitions, run tsc --noEmit |

---

## 📦 Install Package

```bash
# Frontend
cd frontend
npm install package-name

# Backend
cd backend
npm install package-name
```

---

## 🔐 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5001
```

### Backend (.env)
```
PORT=5001
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
NODE_ENV=development
```

---

## 💾 Git Commands

```bash
git status              # Check changes
git add .              # Stage all
git commit -m "msg"    # Commit
git push origin main   # Push
git pull origin main   # Pull
```

---

## 📖 Key Files Reference

**Frontend:**
- [Home Page](./frontend/src/app/page.tsx) - Main landing page
- [Global Styles](./frontend/src/app/globals.css) - Design system
- [API Service](./frontend/src/services/api.ts) - Backend integration
- [APIImage](./frontend/src/components/APIImage/APIImage.tsx) - Image handler

**Backend:**
- [Server](./backend/server.js) - Express app setup
- [Error Handler](./backend/config/errorHandler.js) - Error middleware
- [Upload Route](./backend/routes/uploadRoutes.js) - File upload

**Documentation:**
- [Setup Guide](./SETUP_GUIDE.md) - Initial setup
- [Usage Guide](./FRONTEND_USAGE_GUIDE.md) - How to use components
- [Testing Checklist](./TESTING_CHECKLIST.md) - Testing plan
- [Next Actions](./NEXT_ACTIONS.md) - Next steps

---

## 🎯 Before Making Changes

1. ✅ Understand current code
2. ✅ Check related files
3. ✅ Make change in one place
4. ✅ Test locally (npm run dev)
5. ✅ Check for errors (npm run lint)
6. ✅ Commit to git
7. ✅ Push to repo

---

## 📊 Performance Checklist

- [ ] Lighthouse score 85+
- [ ] Load time < 3 seconds
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Images optimized
- [ ] CSS compressed
- [ ] Unused code removed

---

## 🚀 Deployment Checklist

- [ ] npm run build (no errors)
- [ ] npm start (works locally)
- [ ] All env vars set
- [ ] Database connected
- [ ] API endpoints working
- [ ] Images upload working
- [ ] Lighthouse 85+
- [ ] Cross-browser tested
- [ ] Mobile tested

---

## 📞 Quick Help

**Need to clear cache?**
```bash
rm -rf .next && npm run dev
```

**Need to reset database?**
```bash
# Delete MongoDB database and restart
```

**Need to restart server?**
```bash
# Kill existing process and run npm run dev again
```

**Need to check logs?**
```bash
tail -f backend/logs/combined.log
```

**Need to debug TypeScript?**
```bash
npx tsc --noEmit  # Check types without building
```

---

**Print this card and keep it on your desk! 📌**

*Last Updated: Today | Version: 1.0*
