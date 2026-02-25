# Frontend Setup & Usage Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend API running on `http://localhost:5001`

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create `.env.local` in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5001

# App Settings
NEXT_PUBLIC_DEBUG=false
```

### Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 📦 Project Structure

```
frontend/
├── public/                      # Static assets
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   ├── Home.module.css     # Home page styles
│   │   ├── about/
│   │   ├── admin/              # Admin panel
│   │   ├── auth/               # Authentication pages
│   │   ├── cart/               # Shopping cart
│   │   ├── collections/        # Collections page
│   │   ├── product/            # Product details
│   │   ├── shop/               # Shop page
│   │   └── api/                # API routes
│   ├── components/             # Reusable components
│   │   ├── APIImage/           # API image handler
│   │   ├── OptimizedImage/     # Next.js image optimizer
│   │   ├── Header/             # Hero header
│   │   ├── Navbar/             # Navigation bar
│   │   ├── Footer/             # Footer
│   │   ├── AuthProvider.tsx
│   │   ├── CategorySelector/
│   │   └── MeasurementForm/
│   ├── services/               # API services
│   │   ├── api.ts             # API integration
│   │   └── cart.ts            # Cart management
│   └── types/                  # TypeScript types
│       └── next-auth.d.ts
├── tsconfig.json              # TypeScript config
├── next.config.ts             # Next.js config
├── eslint.config.mjs          # ESLint config
└── package.json               # Dependencies
```

---

## 🎨 Using the New Components

### APIImage Component (For Backend Images)

Use this for images coming from your backend API:

```tsx
import APIImage from '@/components/APIImage/APIImage';

export default function Product({ product }) {
  return (
    <div>
      <APIImage 
        src={product.image}
        alt={product.name}
      />
    </div>
  );
}
```

**Props:**
- `src` (string, required) - Image URL from API
- `alt` (string, required) - Alt text for accessibility
- `className` (string, optional) - CSS class for styling
- `onError` (function, optional) - Error callback

---

### OptimizedImage Component (For Static Images)

Use this for static images in your public folder:

```tsx
import OptimizedImage from '@/components/OptimizedImage/OptimizedImage';

export default function Hero() {
  return (
    <OptimizedImage 
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority  // Load immediately instead of lazy
    />
  );
}
```

**Props:**
- `src` (string, required) - Image path
- `alt` (string, required) - Alt text
- `width` (number, optional) - Image width (default: 400)
- `height` (number, optional) - Image height (default: 400)
- `className` (string, optional) - CSS class
- `objectFit` (string, optional) - CSS object-fit (default: 'cover')
- `priority` (boolean, optional) - Load immediately
- `onError` (function, optional) - Error callback

---

## 🎨 Using CSS Variables

All colors and spacing use CSS variables defined in `globals.css`:

### Colors
```css
/* In your CSS module or component styles */
color: var(--primary-color);
background: var(--accent-color);
border: 1px solid var(--border-color);
```

### Spacing
```css
padding: var(--spacing-md);
margin: var(--spacing-lg);
gap: var(--spacing-xl);
```

### Transitions
```css
transition: all var(--transition-base);
```

### Shadows
```css
box-shadow: var(--shadow-md);
```

---

## 🎯 Responsive Design

### CSS Media Queries

Use the defined breakpoints:

```css
/* Mobile First - 480px and below (default) */
.component { ... }

/* Tablet - 768px and up */
@media (min-width: 768px) {
  .component { ... }
}

/* Desktop - 1024px and up */
@media (min-width: 1024px) {
  .component { ... }
}
```

### Responsive Typography

Typography automatically scales:
- Desktop: Larger fonts (h1: 3.5rem)
- Tablet: Medium fonts (h1: 2.5rem)
- Mobile: Smaller fonts (h1: 2rem)

---

## 🔄 Component Integration Example

### Complete Product Card

```tsx
import Link from 'next/link';
import APIImage from '@/components/APIImage/APIImage';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <APIImage
          src={product.image}
          alt={product.name}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.price}>${product.price}</p>
        <button className={styles.btn}>Quick View</button>
      </div>
    </Link>
  );
}
```

### ProductCard.module.css

```css
.card {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform var(--transition-base);
}

.card:hover {
  transform: translateY(-4px);
}

.imageWrapper {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.imageWrapper > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.content {
  padding: var(--spacing-lg);
}

.title {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.price {
  font-size: 1.25rem;
  color: var(--accent-color);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
}

.btn {
  width: 100%;
  padding: var(--spacing-md);
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-base);
}

.btn:hover {
  background-color: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

/* Responsive */
@media (max-width: 768px) {
  .content {
    padding: var(--spacing-md);
  }

  .title {
    font-size: 1rem;
  }
}
```

---

## 🔗 API Integration

### Fetching Products

```tsx
import { getProducts } from '@/services/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchData();
  }, []);

  return (
    /* Component JSX */
  );
}
```

### Uploading Images

```tsx
import { uploadImage } from '@/services/api';

async function handleImageUpload(file: File) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await uploadImage(formData);
    console.log('Image uploaded:', response.image);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

---

## 🎭 Creating New Pages

### Template: Simple Page

Create `src/app/newpage/page.tsx`:

```tsx
'use client';

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './NewPage.module.css';

export default function NewPage() {
  return (
    <main className={styles.main}>
      <Navbar />
      
      {/* Page Content */}
      <section className={styles.container}>
        <h1>Page Title</h1>
        <p>Page content goes here</p>
      </section>
      
      <Footer />
    </main>
  );
}
```

### Template: NewPage.module.css

```css
.main {
  width: 100%;
  min-height: 100vh;
  background-color: var(--background-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 2rem 1rem;
  }
}
```

---

## 🐛 Debugging

### Enable Debug Mode

Set in `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

### Check Console

Open browser DevTools (F12) and check:
- Network tab for API requests
- Console for error messages
- Elements for CSS inspection

### Common Issues

**Images Not Loading?**
- Check API URL in environment variables
- Verify image URL format
- Check CORS settings on backend
- Look for console errors

**Styles Not Working?**
- Verify CSS module import
- Check class name spelling
- Clear `.next` cache: `rm -rf .next`
- Rebuild: `npm run dev`

**Components Not Appearing?**
- Check component file exists
- Verify import path
- Check for syntax errors
- View console for errors

---

## 📈 Performance Tips

### Image Optimization
- Use `APIImage` for API images
- Use `OptimizedImage` for static images
- Compress images before upload
- Use responsive image sizes

### Code Splitting
- Next.js does automatic code splitting
- Keep components small and focused
- Use dynamic imports for large components

### CSS Optimization
- Use CSS modules to prevent conflicts
- Leverage CSS variables for consistency
- Minimize animations on mobile
- Avoid inline styles

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy your frontend.

### Environment Variables for Production

In Vercel Dashboard:
1. Go to Settings > Environment Variables
2. Add `NEXT_PUBLIC_API_URL` pointing to your production API
3. Redeploy

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Responsive Design](https://web.dev/responsive-web-design-basics/)

---

## ✅ Checklist for New Features

When adding new features:
- [ ] Create component in `src/components/`
- [ ] Create CSS module for styling
- [ ] Use CSS variables for colors/spacing
- [ ] Make responsive with media queries
- [ ] Add TypeScript types
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Test on mobile
- [ ] Add to navigation if needed
- [ ] Document in README

---

*This guide provides everything needed to work with the new professional frontend design.*
