import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';
import '../assets/css/about.css'; // Direct import since it's used here

const hiwImages = [
    "/assets/images/ui/site_screen_discover.png",
    "/assets/images/ui/site_screen_post.png",
    "/assets/images/ui/site_screen_saves.png",
    "/assets/images/ui/site_screen_create.png"
];

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hiwSectionRef = useRef(null);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % hiwImages.length);
    }, 4000);
  };

  useEffect(() => {
    const sectionEl = hiwSectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCurrentIndex(0);
          startTimer();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStepClick = (idx) => {
    setCurrentIndex(idx);
    startTimer();
  };

  return (
    <div className="about-page">
      <Header />
      
      <section className="about-hero">
    <div className="about-hero__text">
        <h1 className="about-hero__title"><SplitText text="Curated Stories." stagger={0.25} /><br /><SplitText text="Meaningful Whitespace." stagger={0.25} delayOffset={0.5} /></h1>
        <p className="about-hero__subtitle"><SplitText text="OASIS is a digital sanctuary for high-end photography, editorial reads, and minimalist design." stagger={0.05} delayOffset={0.8} /></p>
    </div>

    <div className="about-hero__carousel-wrapper">
        <div className="about-hero__carousel">
            {/* Card 1 (Far Left) */}
            <div className="about-card about-card--1">
                <img loading="lazy" src="/assets/images/content/about_3.jpg" alt="Dunes" />
            </div>
            {/* Card 2 (Mid Left) */}
            <div className="about-card about-card--2">
                <img loading="lazy" src="/assets/images/content/about_2.jpg" alt="Photography" />
            </div>
            {/* Card 3 (Center) */}
            <div className="about-card about-card--3">
                <img loading="lazy" src="/assets/images/content/about_1.jpg" alt="Villa Architecture" />
            </div>
            {/* Card 4 (Mid Right) */}
            <div className="about-card about-card--4">
                <img loading="lazy" src="/assets/images/content/about_4.jpg" alt="Music Concert" />
            </div>
            {/* Card 5 (Far Right) */}
            <div className="about-card about-card--5">
                <img loading="lazy" src="/assets/images/content/about_5.jpg" alt="Editorial" />
            </div>
        </div>
    </div>
</section>









{/* ============================================= */}
{/* MANIFESTO & NUMBERS SECTION                   */}
{/* ============================================= */}
<section className="about-manifesto-section">
    <div className="container">
        
        <div className="manifesto-grid">
            <div className="manifesto-label">THE MANIFESTO</div>
            <div className="manifesto-text">
                <SplitText text="The modern web is suffocating. Feeds are polluted by algorithmic noise and endless distraction. OASIS is the antidote. We stripped away the chaos to build a digital sanctuary where content actually breathes." />
            </div>
        </div>

        <div className="numbers-grid">
            <div className="number-item">
                <div className="number-value">0%</div>
                <div className="number-label">Algorithmic Clutter</div>
            </div>
            <div className="number-item">
                <div className="number-value">100%</div>
                <div className="number-label">Human-Curated Editorials</div>
            </div>
            <div className="number-item">
                <div className="number-value">1:1.618</div>
                <div className="number-label">Typographic Precision</div>
            </div>
            <div className="number-item">
                <div className="number-value">∞</div>
                <div className="number-label">Unapologetic Whitespace</div>
            </div>
        </div>

    </div>
</section>

{/* ============================================= */}
{/* HOW IT WORKS SECTION                           */}
{/* ============================================= */}
<section className="how-it-works-section" ref={hiwSectionRef}>
    <div className="container">
        <h2 className="section-title" style={{ fontFamily: "'Sora', sans-serif", fontSize: "2.2rem", fontWeight: "600", letterSpacing: "-0.02em", marginBottom: "3rem", color: "#19326F", textTransform: "uppercase" }}>HOW IT WORKS</h2>
        
        <div className="hiw-grid">
            {/* Left: Mockup Image */}
            <div className="hiw-image-container">
                <img loading="lazy" id="hiw-image" className="hiw-fade" key={currentIndex} src={hiwImages[currentIndex]} alt="Platform Interface Mockup" />
            </div>
            
            {/* Right: Timeline */}
            <div className="hiw-timeline-container">
                
                
                
                <div className="timeline-steps">
                    {[
                        { title: "Discover", desc: "Explore human-curated galleries. No algorithms, no noise—just pure, high-end photography and editorial design." },
                        { title: "Immerse / Read", desc: "Experience content as it was meant to be seen. Uninterrupted reading, cinematic layouts, and meaningful whitespace." },
                        { title: "Curate", desc: "Build your personal sanctuary. Save photography and articles to your private collections with zero public metrics or pressure." },
                        { title: "Identity / Create", desc: "Shape your digital identity. A premium creator dashboard designed to put your aesthetic front and center." }
                    ].map((step, idx) => (
                        <div 
                            key={idx}
                            className={`timeline-step ${currentIndex === idx ? 'active' : ''} ${idx < currentIndex ? 'done' : ''}`}
                            tabIndex="0"
                            role="button"
                            onClick={() => handleStepClick(idx)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleStepClick(idx); }}
                        >
                            <div className="step-dot"></div>
                            <div className="step-content">
                                <h3>{step.title}</h3>
                                <div className="step-desc-wrapper">
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
</section>





{/* ============================================= */}
{/* ORBITAL CTA SECTION                           */}
{/* ============================================= */}



{/* ============================================= */}
{/* PHILOSOPHY SECTION                            */}
{/* ============================================= */}
<section className="about-manifesto-section" style={{ paddingTop: "60px", paddingBottom: "60px" }}>
    <div className="container">
        <div className="manifesto-grid" style={{ marginBottom: "0" }}>
            <div className="manifesto-label">OUR PHILOSOPHY</div>
            <div className="manifesto-text">
                We believe digital spaces should elevate, not exhaust. Every pixel, every word, and every interaction on OASIS is intentionally designed to return your focus to what truly matters—the art of the story.
            </div>
        </div>
    </div>
</section>

<section className="orbital-cta-section">
    <div className="orbit-master-scaler">

    
    
    
    
    
    {/* RING-1 */}
    <div className="orbit-container orbit-ring-1">

        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "11.30em", left: "-11.33em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-15.63s" }}>
                <img src="/assets/images/content/wedding-1.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "4.12em", left: "-15.46em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-17.71s" }}>
                <img src="/assets/images/content/beach-1.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "-4.16em", left: "-15.45em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-19.80s" }}>
                <img src="/assets/images/content/swiss-typography.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "-11.33em", left: "-11.30em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-21.88s" }}>
                <img src="/assets/images/content/wedding-2.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "-15.46em", left: "-4.12em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-23.96s" }}>
                <img src="/assets/images/content/q32.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "-15.45em", left: "4.16em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-26.05s" }}>
                <img src="/assets/images/content/q26.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "-11.30em", left: "11.33em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-28.13s" }}>
                <img src="/assets/images/content/q14.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "-4.12em", left: "15.46em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-30.21s" }}>
                <img src="/assets/images/content/q7.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "4.16em", left: "15.45em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-32.30s" }}>
                <img src="/assets/images/content/landing_p7.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "11.33em", left: "11.30em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-34.38s" }}>
                <img src="/assets/images/content/beach-3.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "15.46em", left: "4.12em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-36.46s" }}>
                <img src="/assets/images/content/q27.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-1-wrapper" style={{ top: "15.45em", left: "-4.16em" }}>
            <div className="card-visual" style={{ width: "45px", height: "60px", animationDuration: "25s", animationDelay: "-38.55s" }}>
                <img src="/assets/images/content/resilient-architecture.jpg" alt="" loading="lazy" />
            </div>
        </div>
    </div>

    {/* RING-2 */}
    <div className="orbit-container orbit-ring-2">

        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "-11.17em", left: "-21.24em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-37.22s" }}>
                <img src="/assets/images/content/robot.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "-18.45em", left: "-15.35em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-40.03s" }}>
                <img src="/assets/images/content/city-3.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "-22.92em", left: "-7.13em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-42.84s" }}>
                <img src="/assets/images/content/q16.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "-23.90em", left: "2.19em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-45.65s" }}>
                <img src="/assets/images/content/q11.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "-21.24em", left: "11.17em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-48.47s" }}>
                <img src="/assets/images/content/topic-couple.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "-15.35em", left: "18.45em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-51.28s" }}>
                <img src="/assets/images/content/field-tree.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "-7.13em", left: "22.92em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-54.09s" }}>
                <img src="/assets/images/content/landing_p1.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "2.19em", left: "23.90em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-56.90s" }}>
                <img src="/assets/images/content/select_box.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "11.17em", left: "21.24em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-59.72s" }}>
                <img src="/assets/images/content/q2.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "18.45em", left: "15.35em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-62.53s" }}>
                <img src="/assets/images/content/q8.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "22.92em", left: "7.13em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-65.34s" }}>
                <img src="/assets/images/content/001.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "23.90em", left: "-2.19em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-68.15s" }}>
                <img src="/assets/images/content/q35.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "21.24em", left: "-11.17em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-70.97s" }}>
                <img src="/assets/images/content/natural-light-photography.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "15.35em", left: "-18.45em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-73.78s" }}>
                <img src="/assets/images/content/q15.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "7.13em", left: "-22.92em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-76.59s" }}>
                <img src="/assets/images/content/q28.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-2-wrapper" style={{ top: "-2.19em", left: "-23.90em" }}>
            <div className="card-visual" style={{ width: "54px", height: "72px", animationDuration: "45s", animationDelay: "-79.40s" }}>
                <img src="/assets/images/content/q20.jpg" alt="" loading="lazy" />
            </div>
        </div>
    </div>

    {/* RING-3 */}
    <div className="orbit-container orbit-ring-3">

        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "-6.55em", left: "32.34em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-16.37s" }}>
                <img src="/assets/images/content/q6.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "2.83em", left: "32.88em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-19.78s" }}>
                <img src="/assets/images/content/mainfeed2.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "11.98em", left: "30.75em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-23.18s" }}>
                <img src="/assets/images/content/005.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "20.16em", left: "26.13em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-26.59s" }}>
                <img src="/assets/images/content/mainfeed4.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "26.70em", left: "19.39em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-30.00s" }}>
                <img src="/assets/images/content/modernbuildingfacade.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "31.08em", left: "11.08em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-33.41s" }}>
                <img src="/assets/images/content/abstractcurvedlight.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "32.95em", left: "1.88em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-36.82s" }}>
                <img src="/assets/images/content/q3.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "32.14em", left: "-7.48em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-40.23s" }}>
                <img src="/assets/images/content/q19.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "28.73em", left: "-16.23em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-43.64s" }}>
                <img src="/assets/images/content/city-2.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "22.99em", left: "-23.67em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-47.05s" }}>
                <img src="/assets/images/content/008.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "15.39em", left: "-29.19em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-50.46s" }}>
                <img src="/assets/images/content/about_1.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "6.55em", left: "-32.34em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-53.87s" }}>
                <img src="/assets/images/content/q25.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "-2.83em", left: "-32.88em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-57.28s" }}>
                <img src="/assets/images/content/landing_p3.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "-11.98em", left: "-30.75em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-60.68s" }}>
                <img src="/assets/images/content/q36.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "-20.16em", left: "-26.13em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-64.09s" }}>
                <img src="/assets/images/content/city-1.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "-26.70em", left: "-19.39em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-67.50s" }}>
                <img src="/assets/images/content/q4.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "-31.08em", left: "-11.08em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-70.91s" }}>
                <img src="/assets/images/content/about_2.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "-32.95em", left: "-1.88em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-74.32s" }}>
                <img src="/assets/images/content/004.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "-32.14em", left: "7.48em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-77.73s" }}>
                <img src="/assets/images/content/q18.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "-28.73em", left: "16.23em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-81.14s" }}>
                <img src="/assets/images/content/landing_p5.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "-22.99em", left: "23.67em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-84.55s" }}>
                <img src="/assets/images/content/006.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-3-wrapper" style={{ top: "-15.39em", left: "29.19em" }}>
            <div className="card-visual" style={{ width: "64px", height: "86px", animationDuration: "75s", animationDelay: "-87.96s" }}>
                <img src="/assets/images/content/topic-guitar.jpg" alt="" loading="lazy" />
            </div>
        </div>
    </div>

    {/* RING-4 */}
    <div className="orbit-container orbit-ring-4">

        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-36.24em", left: "23.15em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-10.41s" }}>
                <img src="/assets/images/content/q33.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-30.17em", left: "30.63em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-14.51s" }}>
                <img src="/assets/images/content/lake-mountains.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-22.60em", left: "36.58em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-18.62s" }}>
                <img src="/assets/images/content/sunrise.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-13.89em", left: "40.69em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-22.73s" }}>
                <img src="/assets/images/content/banner.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-4.49em", left: "42.76em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-26.83s" }}>
                <img src="/assets/images/content/q12.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "5.14em", left: "42.69em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-30.94s" }}>
                <img src="/assets/images/content/vr.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "14.51em", left: "40.48em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-35.05s" }}>
                <img src="/assets/images/content/interior.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "23.15em", left: "36.24em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-39.16s" }}>
                <img src="/assets/images/content/landscape-photo.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "30.63em", left: "30.17em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-43.26s" }}>
                <img src="/assets/images/content/discover_main_pc.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "36.58em", left: "22.60em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-47.37s" }}>
                <img src="/assets/images/content/topic-street.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "40.69em", left: "13.89em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-51.48s" }}>
                <img src="/assets/images/content/landing_p2.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "42.76em", left: "4.49em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-55.58s" }}>
                <img src="/assets/images/content/q1.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "42.69em", left: "-5.14em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-59.69s" }}>
                <img src="/assets/images/content/q30.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "40.48em", left: "-14.51em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-63.80s" }}>
                <img src="/assets/images/content/q10.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "36.24em", left: "-23.15em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-67.91s" }}>
                <img src="/assets/images/content/q5.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "30.17em", left: "-30.63em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-72.01s" }}>
                <img src="/assets/images/content/topic-architecture.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "22.60em", left: "-36.58em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-76.12s" }}>
                <img src="/assets/images/content/sony.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "13.89em", left: "-40.69em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-80.23s" }}>
                <img src="/assets/images/content/q31.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "4.49em", left: "-42.76em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-84.33s" }}>
                <img src="/assets/images/content/q24.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-5.14em", left: "-42.69em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-88.44s" }}>
                <img src="/assets/images/content/q23.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-14.51em", left: "-40.48em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-92.55s" }}>
                <img src="/assets/images/content/landing_p4.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-23.15em", left: "-36.24em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-96.66s" }}>
                <img src="/assets/images/content/topic-skyline.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-30.63em", left: "-30.17em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-100.76s" }}>
                <img src="/assets/images/content/about_5.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-36.58em", left: "-22.60em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-104.87s" }}>
                <img src="/assets/images/content/q9.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-40.69em", left: "-13.89em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-108.98s" }}>
                <img src="/assets/images/content/about_4.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-42.76em", left: "-4.49em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-113.08s" }}>
                <img src="/assets/images/content/about_3.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-42.69em", left: "5.14em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-117.19s" }}>
                <img src="/assets/images/content/wedding-3.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-4-wrapper" style={{ top: "-40.48em", left: "14.51em" }}>
            <div className="card-visual" style={{ width: "76px", height: "102px", animationDuration: "115s", animationDelay: "-121.30s" }}>
                <img src="/assets/images/content/mainfeed1.jpg" alt="" loading="lazy" />
            </div>
        </div>
    </div>

    {/* RING-5 */}
    <div className="orbit-container orbit-ring-5">

        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "44.72em", left: "-30.27em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-98.12s" }}>
                <img src="/assets/images/content/q21.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "38.40em", left: "-37.97em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-102.98s" }}>
                <img src="/assets/images/content/q34.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "30.77em", left: "-44.38em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-107.83s" }}>
                <img src="/assets/images/content/mainfeed3.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "22.09em", left: "-49.27em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-112.68s" }}>
                <img src="/assets/images/content/003.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "12.66em", left: "-52.49em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-117.54s" }}>
                <img src="/assets/images/content/q13.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "2.80em", left: "-53.93em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-122.39s" }}>
                <img src="/assets/images/content/009.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-7.16em", left: "-53.52em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-127.24s" }}>
                <img src="/assets/images/content/landing_p6.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-16.87em", left: "-51.30em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-132.09s" }}>
                <img src="/assets/images/content/dunes.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-26.01em", left: "-47.32em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-136.95s" }}>
                <img src="/assets/images/content/007.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-34.26em", left: "-41.74em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-141.80s" }}>
                <img src="/assets/images/content/villa.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-41.35em", left: "-34.73em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-146.65s" }}>
                <img src="/assets/images/content/q22.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-47.03em", left: "-26.54em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-151.51s" }}>
                <img src="/assets/images/content/q17.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-51.10em", left: "-17.45em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-156.36s" }}>
                <img src="/assets/images/content/beach-2.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-53.44em", left: "-7.76em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-161.21s" }}>
                <img src="/assets/images/content/concert_box.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-53.96em", left: "2.19em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-166.06s" }}>
                <img src="/assets/images/content/002.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-52.63em", left: "12.07em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-170.92s" }}>
                <img src="/assets/images/content/wedding-1.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-49.52em", left: "21.53em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-175.77s" }}>
                <img src="/assets/images/content/beach-1.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-44.72em", left: "30.27em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-180.62s" }}>
                <img src="/assets/images/content/swiss-typography.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-38.40em", left: "37.97em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-185.48s" }}>
                <img src="/assets/images/content/wedding-2.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-30.77em", left: "44.38em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-190.33s" }}>
                <img src="/assets/images/content/q32.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-22.09em", left: "49.27em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-195.18s" }}>
                <img src="/assets/images/content/q26.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-12.66em", left: "52.49em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-200.04s" }}>
                <img src="/assets/images/content/q14.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "-2.80em", left: "53.93em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-204.89s" }}>
                <img src="/assets/images/content/q7.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "7.16em", left: "53.52em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-209.74s" }}>
                <img src="/assets/images/content/landing_p7.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "16.87em", left: "51.30em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-214.59s" }}>
                <img src="/assets/images/content/beach-3.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "26.01em", left: "47.32em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-219.45s" }}>
                <img src="/assets/images/content/q27.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "34.26em", left: "41.74em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-224.30s" }}>
                <img src="/assets/images/content/resilient-architecture.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "41.35em", left: "34.73em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-229.15s" }}>
                <img src="/assets/images/content/robot.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "47.03em", left: "26.54em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-234.01s" }}>
                <img src="/assets/images/content/city-3.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "51.10em", left: "17.45em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-238.86s" }}>
                <img src="/assets/images/content/q16.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "53.44em", left: "7.76em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-243.71s" }}>
                <img src="/assets/images/content/q11.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "53.96em", left: "-2.19em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-248.56s" }}>
                <img src="/assets/images/content/topic-couple.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "52.63em", left: "-12.07em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-253.42s" }}>
                <img src="/assets/images/content/field-tree.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-5-wrapper" style={{ top: "49.52em", left: "-21.53em" }}>
            <div className="card-visual" style={{ width: "90px", height: "121px", animationDuration: "165s", animationDelay: "-258.27s" }}>
                <img src="/assets/images/content/landing_p1.jpg" alt="" loading="lazy" />
            </div>
        </div>
    </div>

    {/* RING-6 */}
    <div className="orbit-container orbit-ring-6">

        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "51.72em", left: "42.60em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-89.78s" }}>
                <img src="/assets/images/content/select_box.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "57.49em", left: "34.41em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-95.26s" }}>
                <img src="/assets/images/content/q2.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "61.97em", left: "25.46em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-100.73s" }}>
                <img src="/assets/images/content/q8.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "65.08em", left: "15.94em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-106.21s" }}>
                <img src="/assets/images/content/001.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "66.73em", left: "6.06em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-111.68s" }}>
                <img src="/assets/images/content/q35.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "66.88em", left: "-3.95em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-117.16s" }}>
                <img src="/assets/images/content/natural-light-photography.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "65.55em", left: "-13.88em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-122.64s" }}>
                <img src="/assets/images/content/q15.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "62.75em", left: "-23.49em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-128.11s" }}>
                <img src="/assets/images/content/q28.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "58.55em", left: "-32.58em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-133.59s" }}>
                <img src="/assets/images/content/q20.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "53.04em", left: "-40.94em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-139.06s" }}>
                <img src="/assets/images/content/q6.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "46.34em", left: "-48.39em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-144.54s" }}>
                <img src="/assets/images/content/mainfeed2.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "38.61em", left: "-54.75em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-150.02s" }}>
                <img src="/assets/images/content/005.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "30.02em", left: "-59.90em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-155.49s" }}>
                <img src="/assets/images/content/mainfeed4.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "20.76em", left: "-63.70em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-160.97s" }}>
                <img src="/assets/images/content/modernbuildingfacade.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "11.03em", left: "-66.09em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-166.45s" }}>
                <img src="/assets/images/content/abstractcurvedlight.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "1.06em", left: "-66.99em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-171.92s" }}>
                <img src="/assets/images/content/q3.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-8.94em", left: "-66.40em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-177.40s" }}>
                <img src="/assets/images/content/q19.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-18.73em", left: "-64.33em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-182.87s" }}>
                <img src="/assets/images/content/city-2.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-28.11em", left: "-60.82em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-188.35s" }}>
                <img src="/assets/images/content/008.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-36.86em", left: "-55.95em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-193.83s" }}>
                <img src="/assets/images/content/about_1.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-44.79em", left: "-49.83em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-199.30s" }}>
                <img src="/assets/images/content/q25.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-51.72em", left: "-42.60em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-204.78s" }}>
                <img src="/assets/images/content/landing_p3.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-57.49em", left: "-34.41em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-210.26s" }}>
                <img src="/assets/images/content/q36.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-61.97em", left: "-25.46em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-215.73s" }}>
                <img src="/assets/images/content/city-1.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-65.08em", left: "-15.94em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-221.21s" }}>
                <img src="/assets/images/content/q4.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-66.73em", left: "-6.06em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-226.68s" }}>
                <img src="/assets/images/content/about_2.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-66.88em", left: "3.95em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-232.16s" }}>
                <img src="/assets/images/content/004.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-65.55em", left: "13.88em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-237.64s" }}>
                <img src="/assets/images/content/q18.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-62.75em", left: "23.49em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-243.11s" }}>
                <img src="/assets/images/content/landing_p5.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-58.55em", left: "32.58em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-248.59s" }}>
                <img src="/assets/images/content/006.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-53.04em", left: "40.94em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-254.06s" }}>
                <img src="/assets/images/content/topic-guitar.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-46.34em", left: "48.39em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-259.54s" }}>
                <img src="/assets/images/content/q33.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-38.61em", left: "54.75em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-265.02s" }}>
                <img src="/assets/images/content/lake-mountains.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-30.02em", left: "59.90em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-270.49s" }}>
                <img src="/assets/images/content/sunrise.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-20.76em", left: "63.70em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-275.97s" }}>
                <img src="/assets/images/content/banner.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-11.03em", left: "66.09em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-281.45s" }}>
                <img src="/assets/images/content/q12.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "-1.06em", left: "66.99em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-286.92s" }}>
                <img src="/assets/images/content/vr.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "8.94em", left: "66.40em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-292.40s" }}>
                <img src="/assets/images/content/interior.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "18.73em", left: "64.33em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-297.87s" }}>
                <img src="/assets/images/content/landscape-photo.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "28.11em", left: "60.82em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-303.35s" }}>
                <img src="/assets/images/content/discover_main_pc.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "36.86em", left: "55.95em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-308.83s" }}>
                <img src="/assets/images/content/topic-street.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-6-wrapper" style={{ top: "44.79em", left: "49.83em" }}>
            <div className="card-visual" style={{ width: "106px", height: "143px", animationDuration: "230s", animationDelay: "-314.30s" }}>
                <img src="/assets/images/content/landing_p2.jpg" alt="" loading="lazy" />
            </div>
        </div>
    </div>

    {/* RING-7 */}
    <div className="orbit-container orbit-ring-7">

        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-2.41em", left: "81.96em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-77.27s" }}>
                <img src="/assets/images/content/q1.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "7.88em", left: "81.62em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-83.57s" }}>
                <img src="/assets/images/content/q30.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "18.05em", left: "79.99em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-89.87s" }}>
                <img src="/assets/images/content/q10.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "27.93em", left: "77.10em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-96.17s" }}>
                <img src="/assets/images/content/q5.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "37.37em", left: "72.99em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-102.47s" }}>
                <img src="/assets/images/content/topic-architecture.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "46.23em", left: "67.73em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-108.77s" }}>
                <img src="/assets/images/content/sony.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "54.35em", left: "61.40em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-115.07s" }}>
                <img src="/assets/images/content/q31.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "61.62em", left: "54.10em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-121.37s" }}>
                <img src="/assets/images/content/q24.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "67.91em", left: "45.96em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-127.67s" }}>
                <img src="/assets/images/content/q23.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "73.14em", left: "37.08em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-133.97s" }}>
                <img src="/assets/images/content/landing_p4.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "77.21em", left: "27.62em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-140.27s" }}>
                <img src="/assets/images/content/topic-skyline.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "80.06em", left: "17.73em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-146.57s" }}>
                <img src="/assets/images/content/about_5.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "81.65em", left: "7.55em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-152.87s" }}>
                <img src="/assets/images/content/q9.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "81.95em", left: "-2.74em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-159.17s" }}>
                <img src="/assets/images/content/about_4.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "80.96em", left: "-12.99em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-165.47s" }}>
                <img src="/assets/images/content/about_3.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "78.70em", left: "-23.03em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-171.77s" }}>
                <img src="/assets/images/content/wedding-3.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "75.19em", left: "-32.72em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-178.07s" }}>
                <img src="/assets/images/content/mainfeed1.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "70.50em", left: "-41.88em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-184.37s" }}>
                <img src="/assets/images/content/q21.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "64.69em", left: "-50.39em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-190.67s" }}>
                <img src="/assets/images/content/q34.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "57.87em", left: "-58.10em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-196.97s" }}>
                <img src="/assets/images/content/mainfeed3.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "50.13em", left: "-64.89em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-203.27s" }}>
                <img src="/assets/images/content/003.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "41.60em", left: "-70.66em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-209.57s" }}>
                <img src="/assets/images/content/q13.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "32.42em", left: "-75.32em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-215.87s" }}>
                <img src="/assets/images/content/009.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "22.72em", left: "-78.79em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-222.17s" }}>
                <img src="/assets/images/content/landing_p6.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "12.67em", left: "-81.02em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-228.47s" }}>
                <img src="/assets/images/content/dunes.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "2.41em", left: "-81.96em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-234.77s" }}>
                <img src="/assets/images/content/007.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-7.88em", left: "-81.62em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-241.07s" }}>
                <img src="/assets/images/content/villa.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-18.05em", left: "-79.99em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-247.37s" }}>
                <img src="/assets/images/content/q22.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-27.93em", left: "-77.10em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-253.67s" }}>
                <img src="/assets/images/content/q17.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-37.37em", left: "-72.99em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-259.97s" }}>
                <img src="/assets/images/content/beach-2.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-46.23em", left: "-67.73em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-266.27s" }}>
                <img src="/assets/images/content/concert_box.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-54.35em", left: "-61.40em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-272.57s" }}>
                <img src="/assets/images/content/002.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-61.62em", left: "-54.10em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-278.87s" }}>
                <img src="/assets/images/content/wedding-1.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-67.91em", left: "-45.96em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-285.17s" }}>
                <img src="/assets/images/content/beach-1.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-73.14em", left: "-37.08em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-291.47s" }}>
                <img src="/assets/images/content/swiss-typography.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-77.21em", left: "-27.62em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-297.77s" }}>
                <img src="/assets/images/content/wedding-2.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-80.06em", left: "-17.73em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-304.07s" }}>
                <img src="/assets/images/content/q32.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-81.65em", left: "-7.55em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-310.37s" }}>
                <img src="/assets/images/content/q26.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-81.95em", left: "2.74em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-316.67s" }}>
                <img src="/assets/images/content/q14.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-80.96em", left: "12.99em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-322.97s" }}>
                <img src="/assets/images/content/q7.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-78.70em", left: "23.03em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-329.27s" }}>
                <img src="/assets/images/content/landing_p7.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-75.19em", left: "32.72em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-335.57s" }}>
                <img src="/assets/images/content/beach-3.png" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-70.50em", left: "41.88em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-341.87s" }}>
                <img src="/assets/images/content/q27.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-64.69em", left: "50.39em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-348.17s" }}>
                <img src="/assets/images/content/resilient-architecture.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-57.87em", left: "58.10em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-354.47s" }}>
                <img src="/assets/images/content/robot.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-50.13em", left: "64.89em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-360.77s" }}>
                <img src="/assets/images/content/city-3.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-41.60em", left: "70.66em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-367.07s" }}>
                <img src="/assets/images/content/q16.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-32.42em", left: "75.32em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-373.37s" }}>
                <img src="/assets/images/content/q11.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-22.72em", left: "78.79em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-379.67s" }}>
                <img src="/assets/images/content/topic-couple.jpg" alt="" loading="lazy" />
            </div>
        </div>
        <div className="orbit-wrapper orbit-ring-7-wrapper" style={{ top: "-12.67em", left: "81.02em" }}>
            <div className="card-visual" style={{ width: "125px", height: "168px", animationDuration: "315s", animationDelay: "-385.97s" }}>
                <img src="/assets/images/content/field-tree.jpg" alt="" loading="lazy" />
            </div>
        </div>
    </div>
        </div>
    <div className="cta-foreground">
        <h3 className="cta-subtitle">Curate your world.</h3>
        <Link to="/" className="cta-button">Join OASIS</Link>
        <Link to="/discover" className="cta-secondary-button" style={{ textDecoration: "none", display: "inline-flex", justifyContent: "center", alignItems: "center" }}>Discover</Link>
    </div>
</section>



{/* ============================================= */}
{/* FOOTER                                        */}
{/* ============================================= */}
<footer className="oasis-footer">
    <div className="container footer-container">
        <div className="footer-left">
            <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" />
        </div>
        <div className="footer-center">
            <img loading="lazy" src="/assets/images/brand/favicon-label.png" alt="OASIS Icon" />
        </div>
        <div className="footer-right">
            <p>Escape the noise.<br />Curate your world.</p>
        </div>
    </div>
</footer>


    

      <Footer />
    </div>
  );
}
