# Frontend Testing & Validation Checklist

## 🧪 Pre-Launch Testing

### Phase 1: Local Development Testing

#### Backend & Environment Setup
- [ ] Backend is running on `http://localhost:5001`
- [ ] Frontend `.env.local` has correct `NEXT_PUBLIC_API_URL`
- [ ] Frontend development server running on `http://localhost:3000`
- [ ] No console errors on page load

#### Home Page (page.tsx)
- [ ] Page loads without errors
- [ ] Hero section displays correctly
- [ ] Feature cards visible and aligned
- [ ] "Recent Products" section shows grid
- [ ] "New Arrivals" badge visible on products
- [ ] Category sections (Men, Women, Accessories) display
- [ ] All cards have hover effects
- [ ] Newsletter section appears at bottom
- [ ] Footer renders correctly

#### Image Loading Tests

**APIImage Component:**
- [ ] Product images load from backend API
- [ ] Placeholder/skeleton shows while loading
- [ ] Images display correctly after loading
- [ ] Error state shows if image fails
- [ ] No console warnings for valid images
- [ ] Console warning shows for failed images

**OptimizedImage Component:**
- [ ] Static images from `/public` load correctly
- [ ] Images are responsive
- [ ] No layout shift during load

#### Responsive Design Testing

**Desktop (1024px+)**
- [ ] All content fits without horizontal scroll
- [ ] Images display at full quality
- [ ] Navbar shows full navigation menu
- [ ] Product grid shows 4 columns
- [ ] Spacing looks balanced

**Tablet (768px - 1023px)**
- [ ] No layout breaking
- [ ] Hamburger menu appears in navbar
- [ ] Product grid shows 2-3 columns
- [ ] Font sizes readable
- [ ] Buttons easily tappable (touch)

**Mobile (480px - 767px)**
- [ ] No horizontal scroll
- [ ] Hamburger menu functional
- [ ] Product grid shows 2 columns
- [ ] Text readable at 100% zoom
- [ ] Touch targets at least 44x44px
- [ ] Newsletter form on single column
- [ ] Footer sections stack vertically

**Small Mobile (<480px)**
- [ ] No overflow
- [ ] All text readable
- [ ] Single column layout
- [ ] Buttons properly sized
- [ ] Images scale appropriately

#### Navigation Testing
- [ ] Logo clickable, goes to home
- [ ] Navigation links work
- [ ] Mobile menu toggle works
- [ ] Mobile menu closes when clicking link
- [ ] All links have proper hover states
- [ ] Active page shows correct styling

#### Component Testing

**Header/Hero Section:**
- [ ] Title displays correctly
- [ ] Subtitle shows under title
- [ ] Slides auto-rotate every 3 seconds
- [ ] Dot indicators work for navigation
- [ ] Manual navigation with dots works
- [ ] Smooth animations between slides

**Footer:**
- [ ] All 4 sections visible
- [ ] Newsletter form has input and button
- [ ] Social media icons clickable
- [ ] Quick links functional
- [ ] Customer service links functional
- [ ] Copyright text visible
- [ ] Responsive on mobile

**Navbar:**
- [ ] Logo appears with gradient
- [ ] Navigation items visible
- [ ] Cart icon shows count badge
- [ ] Hover effects smooth
- [ ] Mobile menu slides down smoothly
- [ ] Menu closes when clicking outside

#### Styling & Animation Testing
- [ ] All colors match design system
- [ ] Box shadows present and correct
- [ ] Hover effects work and are smooth
- [ ] Loading animations (skeleton) smooth
- [ ] Transitions are 0.3s as defined
- [ ] No flickering or jank
- [ ] Animations disabled on slow devices (optional)

#### CSS Variables Usage
- [ ] Colors use variables (not hardcoded)
- [ ] Spacing uses variables
- [ ] Transitions use variables
- [ ] Shadows use variables
- [ ] No hardcoded color values

#### Error Handling
- [ ] Missing images show fallback
- [ ] Failed API calls show error message
- [ ] Broken links show proper 404
- [ ] Form errors display clearly
- [ ] Network errors handled gracefully

---

### Phase 2: Real Data Testing

#### Product Upload Test
- [ ] Admin can upload product image
- [ ] Image saves to backend `/uploads` directory
- [ ] API returns correct image URL
- [ ] Home page shows uploaded product
- [ ] APIImage displays it correctly
- [ ] Image loads without errors
- [ ] Image quality acceptable

#### Multiple Products Test
- [ ] Upload 5+ products
- [ ] All display in grid correctly
- [ ] Grid layout responsive at all sizes
- [ ] No overlapping or misalignment
- [ ] Pagination works if implemented
- [ ] Search/filter works if implemented

#### Dynamic Content Test
- [ ] Edit product name/price
- [ ] Changes reflect on home page
- [ ] Delete product
- [ ] Product removed from grid
- [ ] Add new category
- [ ] Category shows in section

---

### Phase 3: Cross-Browser Testing

#### Chrome/Edge
- [ ] All features work
- [ ] Styling correct
- [ ] Animations smooth
- [ ] Images load

#### Firefox
- [ ] All features work
- [ ] Styling correct
- [ ] Animations smooth
- [ ] Images load

#### Safari
- [ ] All features work
- [ ] Styling correct
- [ ] Animations smooth
- [ ] Images load

#### Mobile Browsers (Chrome, Safari Mobile)
- [ ] Touch interactions work
- [ ] Menu toggle works
- [ ] Buttons easily tappable
- [ ] Forms work on mobile
- [ ] No horizontal scroll

---

### Phase 4: Performance Testing

#### Load Time
- [ ] Home page loads in < 3 seconds
- [ ] Images lazy-load correctly
- [ ] No major layout shifts
- [ ] Lighthouse score > 80

#### Scrolling Performance
- [ ] Smooth scrolling at 60fps
- [ ] No jank during scroll
- [ ] Animations don't cause stuttering
- [ ] Heavy animations disabled on mobile

#### Browser DevTools Tests

**Lighthouse Audit:**
- [ ] Performance score noted
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90
- [ ] Fix any critical issues

**Network Tab:**
- [ ] Images served correctly
- [ ] No 404 errors
- [ ] API responses proper
- [ ] Bundle size reasonable
- [ ] No failed requests

**Coverage Tab:**
- [ ] CSS usage reasonable
- [ ] JavaScript usage reasonable
- [ ] No unused code issues

---

### Phase 5: Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all elements
- [ ] Buttons work with Enter/Space
- [ ] Menu accessible with keyboard
- [ ] Focus indicators visible
- [ ] Logical tab order

#### Screen Reader Testing
- [ ] Images have alt text
- [ ] Link text descriptive
- [ ] Form labels present
- [ ] Headings hierarchy correct
- [ ] Skip link present (optional)

#### Color Contrast
- [ ] Text vs background has 4.5:1 ratio
- [ ] All text readable
- [ ] Hover states clearly distinguished
- [ ] No color only for meaning

#### Mobile Accessibility
- [ ] Touch targets 44x44px minimum
- [ ] No text too small
- [ ] Zoom works properly
- [ ] Orientation changes handled

---

### Phase 6: Feature Testing

#### Cart Functionality
- [ ] Add to cart button present
- [ ] Cart updates with count
- [ ] Cart items display correctly
- [ ] Remove from cart works
- [ ] Quantity adjustment works

#### User Authentication (if implemented)
- [ ] Login page loads
- [ ] Can create account
- [ ] Can log in
- [ ] Session persists
- [ ] Can log out
- [ ] Protected pages redirect

#### Admin Panel (if implemented)
- [ ] Admin can access panel
- [ ] Upload form visible
- [ ] File selection works
- [ ] Upload button functional
- [ ] Success message appears
- [ ] File saves to server

#### Collections/Categories (if implemented)
- [ ] Categories show products
- [ ] Filtering works
- [ ] Sorting works
- [ ] Pagination works

---

### Phase 7: Integration Testing

#### API Integration
- [ ] All endpoints respond
- [ ] Data format correct
- [ ] Error responses handled
- [ ] Timeouts handled
- [ ] Retry logic works (if implemented)

#### Image Pipeline
- [ ] Upload works end-to-end
- [ ] Database stores path
- [ ] API returns URL
- [ ] Frontend displays image
- [ ] No broken links

#### State Management
- [ ] Cart persists on refresh
- [ ] User session maintained
- [ ] Filters preserved (if applicable)
- [ ] No state conflicts

---

### Phase 8: Testing Edge Cases

#### Network Issues
- [ ] Slow network (3G) handled
- [ ] No network shows error
- [ ] Timeouts show message
- [ ] Retry works
- [ ] Partial load recovers

#### User Errors
- [ ] Invalid form data rejected
- [ ] Too large file rejected
- [ ] Wrong file type rejected
- [ ] Missing required fields flagged
- [ ] Error messages clear

#### Browser Quirks
- [ ] Works without JavaScript (graceful degradation)
- [ ] Works with cookies disabled
- [ ] Works with localStorage disabled
- [ ] Works offline (if PWA)

---

## 📋 Testing Commands

### Run Development Server
```bash
cd frontend
npm run dev
```

### Run Lint Check
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

### Test Build Locally
```bash
npm run build
npm start
```

### Check Performance
Open DevTools (F12) → Lighthouse → Analyze page load

### Clear Cache
```bash
rm -rf .next node_modules
npm install
npm run dev
```

---

## 🐛 Common Issues & Solutions

### Issue: Images not loading
**Solution:**
1. Check `NEXT_PUBLIC_API_URL` in `.env.local`
2. Verify backend is running on 5001
3. Check browser console for CORS errors
4. Verify image file exists in `/uploads` directory
5. Check APIImage component has proper error handling

### Issue: Styles not applying
**Solution:**
1. Clear `.next` cache: `rm -rf .next`
2. Restart dev server
3. Check CSS module import names
4. Verify class names match CSS file
5. Check variables in globals.css

### Issue: Animations stuttering
**Solution:**
1. Check for heavy calculations in renders
2. Use will-change CSS property sparingly
3. Reduce animation complexity on mobile
4. Close other browser tabs/apps
5. Check browser performance monitor

### Issue: Layout shifting
**Solution:**
1. Set explicit sizes for images
2. Reserve space for dynamic content
3. Avoid inserting content mid-page
4. Check for horizontal scroll
5. Use aspect-ratio CSS property

### Issue: Mobile menu not working
**Solution:**
1. Check hamburger button click handler
2. Verify z-index for mobile menu
3. Clear mobile menu state on link click
4. Test on actual mobile device
5. Check touch event handling

### Issue: API calls failing
**Solution:**
1. Verify backend endpoint URLs
2. Check backend CORS configuration
3. Verify request headers (especially JWT)
4. Check API response format
5. Test with curl: `curl http://localhost:5001/api/products`

---

## ✅ Sign-Off Checklist

Before considering frontend complete:
- [ ] All tests in Phase 1-3 passed
- [ ] No console errors
- [ ] No console warnings (except intentional)
- [ ] Lighthouse scores > 80
- [ ] Works on mobile, tablet, desktop
- [ ] Images load correctly from API
- [ ] All animations smooth
- [ ] Forms work properly
- [ ] Navigation intuitive
- [ ] Responsive at all breakpoints
- [ ] Accessibility requirements met
- [ ] Cross-browser compatibility verified

---

## 📞 Support

If testing finds issues:
1. Note the exact error/behavior
2. Check browser console for messages
3. Test in different browser
4. Check `.env.local` configuration
5. Review error in FRONTEND_USAGE_GUIDE.md
6. Check backend logs for API errors

---

*This checklist ensures comprehensive testing before production deployment.*
