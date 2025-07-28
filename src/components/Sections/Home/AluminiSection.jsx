import React, { useState, useEffect, useRef, useCallback } from 'react';

const IEEEAlumniCarousel = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const carouselRef = useRef(null);
  const autoScrollRef = useRef(null);
  const touchStartRef = useRef({ x: 0, time: 0, isDragging: false });

  // Alumni testimonials data
  const testimonials = [
    {
      id: 1,
      quote: "IEEE has been instrumental in my career, providing a platform to collaborate with peers and stay updated on analog electronics. Being recognized as an IEEE Fellow is an honor, and I'm grateful for the chance to contribute to the IEEE CAS Society. IEEE continues to inspire innovation and excellence in engineering.",
      author: "Prof. Raj Senani",
      title: "IEEE Member"
    },
    {
      id: 2,
      quote: "My association with IEEE has been key to my growth as a computer engineer. The conferences and workshops expanded my knowledge and connected me with industry leaders. Publishing in IEEE journals gave my research global visibility, and I'm proud to be part of this prestigious organization.",
      author: "Dr. Rakesh Kumar",
      title: "IEEE Member"
    },
    {
      id: 3,
      quote: "IEEE has been a fantastic platform for advancing my career and contributing to engineering. The Women in Engineering (WIE) initiatives have been especially inspiring, encouraging more women to pursue STEM careers. The wealth of resources and vibrant community make IEEE an invaluable part of my professional life.",
      author: "Dr. Neeta Pandey",
      title: "IEEE Member"
    },
    {
      id: 4,
      quote: "IEEE has been essential to my growth in computer science and engineering. Its support through conferences, publications, and resources is unmatched, offering countless opportunities to grow, collaborate, and contribute to the field.",
      author: "Prof. Yogesh Singh",
      title: "IEEE Member"
    },
    {
      id: 5,
      quote: "IEEE has been crucial to my growth in power electronics and renewable energy. Through its committees and conferences, I've collaborated with global experts and stayed at the forefront of technology. IEEE's commitment to innovation is commendable.",
      author: "Dr. Sanjeev Jain",
      title: "IEEE Member"
    }
  ];

  const totalCards = testimonials.length;
  const cardsToShow = 3;

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    autoScrollRef.current = setInterval(() => {
      setCurrentPosition(prev => (prev + 1) % totalCards);
    }, 5000);
  }, [totalCards]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  // Navigation functions
  const scrollLeft = () => {
    stopAutoScroll();
    setCurrentPosition(prev => prev === 0 ? totalCards - 1 : prev - 1);
    startAutoScroll();
  };

  const scrollRight = () => {
    stopAutoScroll();
    setCurrentPosition(prev => (prev + 1) % totalCards);
    startAutoScroll();
  };

  const scrollToPosition = (position) => {
    if (position >= 0 && position < totalCards) {
      stopAutoScroll();
      setCurrentPosition(position);
      startAutoScroll();
    }
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      time: Date.now(),
      isDragging: true
    };
    stopAutoScroll();
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current.isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = touchStartRef.current.x - currentX;
    const diffTime = Date.now() - touchStartRef.current.time;
    
    if (Math.abs(diffX) > 50 && diffTime < 300) {
      if (diffX > 0) {
        scrollRight();
      } else {
        scrollLeft();
      }
      touchStartRef.current.isDragging = false;
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current.isDragging = false;
    if (!autoScrollRef.current) {
      startAutoScroll();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollRight();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize auto-scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      startAutoScroll();
    }, 3000);

    return () => {
      clearTimeout(timer);
      stopAutoScroll();
    };
  }, [startAutoScroll, stopAutoScroll]);

  // Update carousel transform
  useEffect(() => {
    if (carouselRef.current) {
      const cardWidth = 100 / cardsToShow;
      let translateX;
      
      if (currentPosition <= totalCards - cardsToShow) {
        translateX = -(currentPosition * cardWidth);
      } else {
        const remainingCards = totalCards - currentPosition;
        if (remainingCards > 0) {
          translateX = -((totalCards - cardsToShow) * cardWidth);
        } else {
          translateX = 0;
        }
      }
      
      carouselRef.current.style.transform = `translateX(${translateX}%)`;
    }
  }, [currentPosition, cardsToShow, totalCards]);

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      background: 'linear-gradient(135deg, #002147 0%, #003865 50%, #006ba6 100%)',
      minHeight: '100vh',
      color: '#ffffff',
      overflowX: 'hidden',
      lineHeight: 1.6
    }}>
      <style>{`
        :root {
          --ieee-blue: #006ba6;
          --ieee-light-blue: #0082ca;
          --ieee-teal: #00629b;
          --ieee-dark-blue: #003865;
          --ieee-navy: #002147;
          --ieee-cyan: #00a8cc;
          --ieee-white: #ffffff;
          --primary-gradient: linear-gradient(135deg, var(--ieee-blue), var(--ieee-light-blue));
          --secondary-gradient: linear-gradient(135deg, var(--ieee-teal), var(--ieee-cyan));
          --card-gradient: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
          --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
          --shadow-xl: 0 16px 48px rgba(0, 107, 166, 0.3);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 1rem;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
          opacity: 0;
          animation: fadeInUp 0.8s ease-out 0.2s forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .header p {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 400;
          max-width: 600px;
          margin: 0 auto;
        }

        .carousel-wrapper {
          position: relative;
          opacity: 0;
          animation: fadeInUp 0.8s ease-out 0.4s forwards;
          padding: 0 5rem;
          overflow: hidden;
        }

        .ieee-logo {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 60px;
          height: 30px;
          background: var(--primary-gradient);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--ieee-white);
          letter-spacing: 1px;
          z-index: 10;
        }

        .cards-container {
          display: flex;
          gap: 1.5rem;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          padding: 2rem 0;
          width: calc(100% + 1.5rem);
        }

        .card {
          flex: 0 0 calc(33.333% - 1rem);
          background: var(--card-gradient);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          min-height: 480px;
          position: relative;
          transform: translateY(0) scale(1);
          box-shadow: var(--shadow-lg);
          will-change: transform, box-shadow, border-color;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 
            var(--shadow-xl),
            0 0 40px rgba(0, 168, 204, 0.2);
          border-color: rgba(0, 168, 204, 0.4);
          z-index: 5;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 107, 166, 0.08), rgba(0, 168, 204, 0.04));
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .card:hover::before {
          opacity: 1;
        }

        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .quote-mark {
          font-size: 3rem;
          color: rgba(0, 168, 204, 0.3);
          font-weight: 700;
          float: right;
          line-height: 1;
          transition: all 0.4s ease;
          transform: scale(1);
          font-family: serif;
        }

        .card:hover .quote-mark {
          color: rgba(0, 168, 204, 0.6);
          transform: scale(1.1) rotate(5deg);
        }

        .quote-text {
          font-size: 1.05rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.9);
          margin: 1.5rem 0 2rem 0;
          transition: color 0.3s ease;
          font-weight: 400;
          flex: 1;
        }

        .card:hover .quote-text {
          color: var(--ieee-white);
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: transform 0.3s ease;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.5rem;
        }

        .card:hover .author-info {
          transform: translateY(-2px);
        }

        .author-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .author-details h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
          transition: color 0.3s ease;
          color: var(--ieee-white);
        }

        .card:hover .author-details h3 {
          color: var(--ieee-cyan);
        }

        .author-details .title {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.2rem;
        }

        .card:hover .author-details .title {
          color: rgba(255, 255, 255, 0.9);
        }

        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 2rem;
          color: var(--ieee-white);
          background: var(--primary-gradient);
          border: none;
          cursor: pointer;
          z-index: 100;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          will-change: transform, background, box-shadow;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          font-weight: bold;
        }

        .arrow:hover {
          background: var(--secondary-gradient);
          transform: translateY(-50%) scale(1.15);
          box-shadow: var(--shadow-xl);
          border-color: rgba(255, 255, 255, 0.6);
        }

        .arrow:active {
          transform: translateY(-50%) scale(0.95);
        }

        .arrow:focus {
          outline: 2px solid var(--ieee-cyan);
          outline-offset: 2px;
        }

        .left-arrow {
          left: -1rem;
        }

        .right-arrow {
          right: -1rem;
        }

        .progress-indicator {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .progress-dot:focus {
          outline: 2px solid var(--ieee-cyan);
          outline-offset: 2px;
        }

        .progress-dot.active {
          background: var(--ieee-cyan);
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .container {
            padding: 2rem 1rem;
          }

          .carousel-wrapper {
            padding: 0 1rem;
          }
          
          .card {
            flex: 0 0 85%;
            min-height: 520px;
            padding: 1.5rem;
          }

          .card:hover {
            transform: translateY(-6px) scale(1.02);
          }

          .arrow {
            display: none;
          }

          .header h1 {
            font-size: 2.5rem;
          }

          .progress-indicator {
            margin-top: 1rem;
          }
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          .card {
            flex: 0 0 calc(50% - 0.75rem);
          }
        }

        @media (min-width: 1400px) {
          .card {
            min-height: 520px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .card:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>Alumni Reflections</h1>
          <p>Celebrating the achievements and contributions of our distinguished IEEE community members</p>
        </div>

        <div className="carousel-wrapper">
          <div className="ieee-logo">IEEE</div>
          
          <button 
            className="arrow left-arrow" 
            onClick={scrollLeft}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
            aria-label="Previous testimonials"
          >
            ‹
          </button>
          
          <div 
            className="cards-container" 
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card">
                <div className="card-content">
                  <div className="quote-mark">"</div>
                  <div className="quote-text">
                    {testimonial.quote}
                  </div>
                </div>
                <div className="author-info">
                  <div className="author-row">
                    <div className="author-details">
                      <h3>{testimonial.author}</h3>
                      <div className="title">{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="arrow right-arrow" 
            onClick={scrollRight}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
            aria-label="Next testimonials"
          >
            ›
          </button>
        </div>

        <div className="progress-indicator">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className={`progress-dot ${currentPosition % 3 === index ? 'active' : ''}`}
              onClick={() => scrollToPosition(index)}
              tabIndex={0}
              role="button"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IEEEAlumniCarousel;
