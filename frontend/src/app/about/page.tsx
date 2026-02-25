import Navbar from '@/components/Navbar/Navbar';

export default function About() {
    return (
        <main>
            <Navbar />
            <section style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>About CraftWear</h1>
                <p style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                    CraftWear was founded with a simple mission: to provide high-quality, sustainable fashion that stands the test of time.
                    We believe in clothing that empowers you to express your unique identity without compromising on comfort or ethics.
                </p>
                <p style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                    Our journey began in a small studio, obsessed with fabrics and fit. Today, we are proud to serve customers worldwide who share our passion
                    for detail and design.
                </p>
                <div style={{ marginTop: '3rem', backgroundColor: '#f9f9f9', padding: '2rem', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Our Values</h3>
                    <ul style={{ listStylePosition: 'inside', color: 'var(--secondary)' }}>
                        <li>Quality Craftsmanship</li>
                        <li>Sustainable Sourcing</li>
                        <li>Customer-First Approach</li>
                    </ul>
                </div>
            </section>
        </main>
    );
}
