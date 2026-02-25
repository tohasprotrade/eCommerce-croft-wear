"use client";

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import APIImage from '@/components/APIImage/APIImage';
import { getProducts } from '@/services/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaShoppingBag, FaTruck, FaHeadset, FaShieldAlt } from 'react-icons/fa';
import styles from './Home.module.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const recentProducts = products.slice(0, 8);
  const getCategoryProducts = (cat: string) => 
    products.filter((p) => p.category === cat).slice(0, 6);

  return (
    <main className={styles.main}>
      <Navbar />
      <Header />

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FaTruck />
              </div>
              <h3>Free Shipping</h3>
              <p>On all orders over $50</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FaHeadset />
              </div>
              <h3>24/7 Support</h3>
              <p>Dedicated customer service</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FaShieldAlt />
              </div>
              <h3>Secure Payment</h3>
              <p>100% secure transactions</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FaShoppingBag />
              </div>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Products Section */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Recent Products</h2>
              <p className={styles.sectionSubtitle}>
                Discover our latest additions to the collection
              </p>
            </div>
            <button
              onClick={() => router.push('/shop')}
              className={styles.showAllBtn}
            >
              View All Products
            </button>
          </div>

          {isLoading ? (
            <div className={styles.loadingGrid}>
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : recentProducts.length > 0 ? (
            <div className={styles.grid}>
              {recentProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug}`}
                  className={styles.card}
                >
                  <div className={styles.productCard}>
                    <div className={styles.imageWrapper}>
                      <APIImage
                        src={product.image}
                        alt={product.name}
                      />
                      <div className={styles.badgeContainer}>
                        <span className={styles.newBadge}>New</span>
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productPrice}>${product.price}</p>
                      <button className={styles.addToCart} onClick={(e) => {
                        e.preventDefault();
                        router.push(`/product/${product.slug}`);
                      }}>
                        Quick View
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.noProducts}>
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {['Men', 'Women', 'Accessories'].map((category) => {
        const catProducts = getCategoryProducts(category);
        if (catProducts.length === 0) return null;

        return (
          <section key={category} className={styles.categorySection}>
            <div className={styles.container}>
              <div className={styles.categoryHeader}>
                <div>
                  <h2 className={styles.categoryTitle}>{category}</h2>
                  <div className={styles.categoryLine} />
                </div>
                <button
                  onClick={() => router.push(`/shop?category=${category}`)}
                  className={styles.categoryBtn}
                >
                  Shop {category}
                </button>
              </div>

              <div className={styles.grid}>
                {catProducts.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    className={styles.card}
                  >
                    <div className={styles.productCard}>
                      <div className={styles.imageWrapper}>
                        <APIImage
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className={styles.cardContent}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.productPrice}>${product.price}</p>
                        <button className={styles.addToCart} onClick={(e) => {
                          e.preventDefault();
                          router.push(`/product/${product.slug}`);
                        }}>
                          Quick View
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get exclusive offers and updates delivered to your inbox.</p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                required
              />
              <button type="submit">Subscribe Now</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
