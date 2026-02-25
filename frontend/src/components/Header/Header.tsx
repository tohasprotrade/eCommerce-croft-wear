"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { getHeaderSlides } from '@/services/api';
import styles from './Header.module.css';

const defaultSlides = [
    {
        _id: '1',
        title: 'Elevate Your Style',
        subtitle: 'Visit Our Collections',
        image: 'https://placehold.co/1920x1080/1a1a2e/ffffff?text=Premium+Collection'
    },
    {
        _id: '2',
        title: 'Summer Vibes',
        subtitle: 'Shop Now',
        image: 'https://placehold.co/1920x1080/16213e/ffffff?text=Summer+Vibes'
    },
    {
        _id: '3',
        title: 'New Arrivals',
        subtitle: 'Discover More',
        image: 'https://placehold.co/1920x1080/0f3460/ffffff?text=New+Arrivals'
    }
];

interface Slide {
    _id: string;
    title: string;
    subtitle: string;
    image: string;
}

const Header = () => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
    
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const isAnimating = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const data = await getHeaderSlides();
                if (data.length > 0) {
                    setSlides(data);
                } else {
                    setSlides(defaultSlides);
                }
            } catch (error) {
                console.error('Error fetching slides:', error);
                setSlides(defaultSlides);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        if (loading || slides.length === 0 || !sliderRef.current) return;

        const runAnimation = () => {
            if (slideRefs.current.length === 0) return;

            gsap.set(slideRefs.current, { x: '100%', opacity: 0 });
            gsap.set(slideRefs.current[0], { x: '0%', opacity: 1 });
            
            if (contentRef.current) {
                gsap.set(contentRef.current, { opacity: 0, y: 30 });
                gsap.to(contentRef.current, { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    delay: 0.3,
                    ease: 'power3.out'
                });
            }

            dotRefs.current.forEach((dot, i) => {
                if (dot) {
                    gsap.to(dot, {
                        backgroundColor: i === 0 ? '#ff6b35' : 'rgba(255, 255, 255, 0.4)',
                        duration: 0.3
                    });
                }
            });
        };

        runAnimation();

        intervalRef.current = setInterval(() => {
            if (isAnimating.current) return;
            isAnimating.current = true;

            const nextIndex = (currentSlide + 1) % slides.length;
            const slideWidth = sliderRef.current?.offsetWidth || 0;

            gsap.to(slideRefs.current[currentSlide], {
                x: '-100%',
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut'
            });

            gsap.fromTo(slideRefs.current[nextIndex],
                { x: '100%', opacity: 0 },
                { x: '0%', opacity: 1, duration: 1, ease: 'power2.inOut' }
            );

            if (contentRef.current) {
                gsap.to(contentRef.current, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    onComplete: () => {
                        setCurrentSlide(nextIndex);
                        dotRefs.current.forEach((dot, i) => {
                            if (dot) {
                                gsap.to(dot, {
                                    backgroundColor: i === nextIndex ? '#ff6b35' : 'rgba(255, 255, 255, 0.4)',
                                    duration: 0.3
                                });
                            }
                        });
                        gsap.fromTo(contentRef.current,
                            { y: 20, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
                        );
                        isAnimating.current = false;
                    }
                });
            } else {
                setCurrentSlide(nextIndex);
                isAnimating.current = false;
            }
        }, 3000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [loading, slides, currentSlide]);

    const goToSlide = (index: number) => {
        if (isAnimating.current || index === currentSlide || !sliderRef.current) return;
        
        isAnimating.current = true;
        const slideWidth = sliderRef.current.offsetWidth;

        gsap.to(slideRefs.current[currentSlide], {
            x: '-100%',
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut'
        });

        gsap.fromTo(slideRefs.current[index],
            { x: '100%', opacity: 0 },
            { x: '0%', opacity: 1, duration: 0.8, ease: 'power2.inOut' }
        );

        setCurrentSlide(index);
        
        setTimeout(() => {
            isAnimating.current = false;
        }, 800);
    };

    if (loading) {
        return (
            <header className={styles.header}>
                <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#0a0a0a'
                }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '3px solid rgba(255,255,255,0.2)',
                        borderTopColor: '#ff6b35',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                </div>
            </header>
        );
    }

    const currentContent = slides[currentSlide] || slides[0];

    return (
        <header className={styles.header}>
            <style jsx global>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
            
            <div className={styles.sliderWrapper} ref={sliderRef}>
                {slides.map((slide, index) => (
                    <div
                        key={slide._id || index}
                        ref={(el) => { if (el) slideRefs.current[index] = el; }}
                        className={styles.slide}
                        style={{ 
                            backgroundImage: `url(${slide.image})`,
                            transform: index === 0 ? 'translateX(0%)' : 'translateX(100%)'
                        }}
                    />
                ))}
            </div>

            <div className={styles.overlay} />

            <div className={styles.content} ref={contentRef}>
                <h1 className={styles.title}>{currentContent.title}</h1>
                <p className={styles.subtitle}>{currentContent.subtitle}</p>
                <Link href="/collections" className={styles.ctaButton}>
                    Shop Now
                </Link>
            </div>

            <div className={styles.dotsContainer}>
                {slides.map((_, index) => (
                    <span
                        key={index}
                        ref={(el) => { if (el) dotRefs.current[index] = el; }}
                        className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </header>
    );
};

export default Header;
