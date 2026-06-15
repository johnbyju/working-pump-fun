'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

// Motivational quotes when clicking to "Work for Your Bag"
const MOTIVATIONAL_QUOTES = [
  "ORKIN' hard for our bags! 💼",
  "Hustle never sleeps! ⚡",
  "We work for it, no handouts! 🔥",
  "Accumulating $WORKIN bags! 📈",
  "Bags are getting heavy! 🏋️‍♂️",
  "Community power in progress! 🌐",
  "Keep clicking, keep building! 🛠️",
  "Diamond hands working! 💎",
  "Working hard, working smart! 🚀",
  "Proof of Grind in action! 🦾"
];

const CONTRACT_ADDRESS = "BagsUn1tE4mP8sT9wQ2yZ7cX3vB5nM1kL0jH8gF6d";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [activeQuote, setActiveQuote] = useState("Click the screen to start working!");
  
  const heroCanvasRef = useRef(null);
  const gameCanvasRef = useRef(null);
  const heroParticlesRef = useRef([]);
  const gameParticlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  // Initialize and load saved bag progress from localStorage on client-side
  useEffect(() => {
    const savedBags = localStorage.getItem('bags_worked_count');
    const savedClicks = localStorage.getItem('bags_clicks_count');
    if (savedBags) setBagCount(parseInt(savedBags, 10));
    if (savedClicks) setClicks(parseInt(savedClicks, 10));
  }, []);

  // Scroll-reveal IntersectionObserver
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            // Reset state if scrolled back up past the item
            if (entry.boundingClientRect.top > 0) {
              entry.target.classList.remove('visible');
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    
    reveals.forEach((el) => observer.observe(el));
    return () => {
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Update localStorage when values change
  const saveProgress = (newBags, newClicks) => {
    localStorage.setItem('bags_worked_count', newBags.toString());
    localStorage.setItem('bags_clicks_count', newClicks.toString());
  };

  // Sound effect generator using Web Audio API (Synthesized Retro Coin Sound)
  const playWorkSound = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Classic 8-bit jump/coin chime frequency sweep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (err) {
      // Browser autoplay policy or missing audio device blockages
    }
  };

  // Canvas particle engine animation loop
  useEffect(() => {
    const heroCanvas = heroCanvasRef.current;
    const gameCanvas = gameCanvasRef.current;
    
    const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
    const gameCtx = gameCanvas ? gameCanvas.getContext('2d') : null;
    
    // Resize handler to match parent elements
    const resizeCanvases = () => {
      if (heroCanvas) {
        const rect = heroCanvas.parentElement.getBoundingClientRect();
        heroCanvas.width = rect.width;
        heroCanvas.height = rect.height;
      }
      if (gameCanvas) {
        const rect = gameCanvas.parentElement.getBoundingClientRect();
        gameCanvas.width = rect.width;
        gameCanvas.height = rect.height;
      }
    };
    
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    const animate = () => {
      if (heroCanvas && heroCtx) {
        heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        updateAndDrawParticles(heroCtx, heroParticlesRef.current);
      }
      if (gameCanvas && gameCtx) {
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        updateAndDrawParticles(gameCtx, gameParticlesRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const updateAndDrawParticles = (ctx, particles) => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx += Math.sin(p.life * 0.1) * 0.1; // minor drift
        p.life++;
        p.alpha -= 0.02;
        p.rotation += p.rotSpeed;
        
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        
        if (p.type === 'coin') {
          // Drawing a golden cyber coin
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          
          // Outer Glow
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
          
          // Gold Gradient
          const grad = ctx.createRadialGradient(-2, -2, 2, 0, 0, p.radius);
          grad.addColorStop(0, '#ffe875');
          grad.addColorStop(0.7, '#f59e0b');
          grad.addColorStop(1, '#b45309');
          ctx.fillStyle = grad;
          ctx.fill();

          // Border Ring
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Draw Ticker Sign
          ctx.fillStyle = '#b45309';
          ctx.font = `bold ${p.radius * 1.1}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', 0, 0);
        } else {
          // Small neon sparkle particle
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.fill();
        }
        
        ctx.restore();
      }
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvases);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleWidgetClick = (e, targetType) => {
    const canvas = targetType === 'hero' ? heroCanvasRef.current : gameCanvasRef.current;
    if (!canvas) return;
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Play retro 8-bit sound
    playWorkSound();
    
    // Update stats
    const nextBags = bagCount + 1;
    const nextClicks = clicks + 1;
    setBagCount(nextBags);
    setClicks(nextClicks);
    saveProgress(nextBags, nextClicks);
    
    // Select a random motivational quote
    const randQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setActiveQuote(randQuote);
    
    // Spawn Coins and Sparkles
    const particles = targetType === 'hero' ? heroParticlesRef.current : gameParticlesRef.current;
    
    // Spawn 2 coins
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: clickX,
        y: clickY,
        vx: (Math.random() - 0.5) * 6,
        vy: -5 - Math.random() * 5,
        gravity: 0.25,
        radius: 10 + Math.random() * 5,
        life: 0,
        alpha: 1,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        type: 'coin'
      });
    }
    
    // Spawn 5 neon sparks
    const colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#3b82f6'];
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: clickX,
        y: clickY,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 3,
        gravity: 0.15,
        radius: 2 + Math.random() * 3,
        life: 0,
        alpha: 1.0,
        rotation: 0,
        rotSpeed: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'sparkle'
      });
    }
  };

  const handleCopyCA = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Navigation Bar */}
      <header className={styles.header}>
        <div className={`${styles.nav} container`}>
          <a href="#" className={styles.logo} id="nav_logo_bags">
            $WORKIN COIN
          </a>
          <nav className={styles.navLinks} aria-label="Main Navigation">
            <a href="#about" className={styles.navLink} id="nav_link_about">About</a>
            <a href="#game" className={styles.navLink} id="nav_link_work">Work for $WORKIN</a>
            <a href="#tokenomics" className={styles.navLink} id="nav_link_tokenomics">Tokenomics</a>
            <a href="#buy" className={styles.navLink} id="nav_link_buy">How to Buy</a>
            <a href="#community" className={styles.navLink} id="nav_link_community">Community</a>
          </nav>
          <div>
            <a 
              href="#buy" 
              className="glow-btn" 
              style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
              id="nav_buy_button"
            >
              Buy $WORKIN
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1 }}>
        
        {/* Hero Section */}
        <section className={styles.heroGrid} aria-label="Introduction Section">
          <div className={styles.heroContent}>
            <div className={styles.tagline}>
              <span className={styles.taglineDot} aria-hidden="true" />
              Community Grinders Only
            </div>
            <h1 className={styles.heroTitle} id="hero_title_bags">
              WE WORK FOR <span className="gradient-text">OUR BAGS</span>
            </h1>
            <p className={styles.heroDesc}>
              The ultimate community-powered digital currency. We don&apos;t expect moonshots from thin air. We code, we build, we coordinate, and we hustle. No handouts, just pure community energy.
            </p>
            
            {/* Contract Address Dashboard */}
            <div className={styles.caContainer} id="ca_copyable_container">
              <div className={styles.caHeader}>
                <span className={styles.caLabel}>Official Contract Address</span>
                <span className={styles.caNetwork}>Solana Mainnet</span>
              </div>
              <div className={styles.caValueRow}>
                <span 
                  className={styles.caValue} 
                  title="Click to copy CA"
                  onClick={handleCopyCA}
                  id="ca_string_display"
                >
                  {CONTRACT_ADDRESS}
                </span>
                <button 
                  className={styles.copyBtn} 
                  onClick={handleCopyCA}
                  aria-label="Copy contract address to clipboard"
                  id="ca_copy_button"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              
              {/* Badges status row */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', textTransform: 'uppercase' }}>
                  LP 100% Burned
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(6, 182, 212, 0.2)', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'hsl(var(--accent-cyan))', textTransform: 'uppercase' }}>
                  Tax: 0/0
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(139, 92, 246, 0.2)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'hsl(var(--accent-purple))', textTransform: 'uppercase' }}>
                  Renounced
                </span>
              </div>
              
              {copied && (
                <div className={styles.copySuccessMessage} id="ca_copy_success">
                  Copied!
                </div>
              )}
            </div>

            <div className={styles.heroCtas}>
              <a href="#game" className="glow-btn" id="hero_cta_work">Start Working</a>
              <a href="#tokenomics" className="outline-btn" id="hero_cta_stats">View Stats</a>
            </div>
          </div>

          {/* Interactive Split-Screen Widget */}
          <div className={styles.heroVisual}>
            <div 
              className={styles.splitWidget}
              onClick={(e) => handleWidgetClick(e, 'hero')}
              id="hero_split_widget"
              aria-label="Interactive ORKIN Working split screen graphic"
            >
              <canvas ref={heroCanvasRef} className={styles.splitCanvas} />
              <div className={styles.splitContent}>
                <div className={`${styles.splitSide} ${styles.splitLeft}`}>
                  <span className={styles.splitTextLeft}>ORKIN</span>
                </div>
                <div className={styles.splitDivider} />
                <div className={`${styles.splitSide} ${styles.splitRight}`}>
                  <span className={styles.splitTextRight}>Working</span>
                </div>
              </div>
              <div className={styles.tapIndicator}>Tap to Work</div>
            </div>
          </div>
        </section>

        {/* About / Meme Section */}
        <section id="about" className={`${styles.section} reveal`} aria-label="About the Project">
          <div className={styles.sectionHeader}>
            <span className={styles.tagline} style={{ color: 'hsl(var(--accent-pink))' }}>Our Philosophy</span>
            <h2 className={styles.sectionTitle} id="about_section_title">NO HYPE, JUST WORK</h2>
          </div>
          <div className="glass-card" style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              Memecoins have lost their spirit. The original spirit was built on communities aligning together, sharing a common vision, and working collectively for their bags. 
            </p>
            <p style={{ fontSize: '1.1rem', color: 'rgba(241, 241, 246, 0.65)' }}>
              We created <strong>$WORKIN</strong> to bring that back. We provide an interactive space where you can literally manifest your bags through focus and play. Buy your portion, support the network, tell the world, and grind. The heavier your bag, the stronger the community.
            </p>
          </div>
        </section>

        {/* Interactive Clicker Game Section */}
        <section id="game" className={`${styles.section} reveal`} aria-label="Interactive Game Section">
          <div className={styles.sectionHeader}>
            <span className={styles.tagline}>Proof of Grind</span>
            <h2 className={styles.sectionTitle} id="game_section_title">WORK FOR YOUR BAG</h2>
          </div>
          
          <div className={styles.gameContainer}>
            <div className={styles.gameDashboard}>
              <h3 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>Manifest your stack</h3>
              <p>
                Click inside the interactive split widget on the right. Each tap synthesizes 8-bit digital chimes and launches gold coins into the vault, simulating community work block validation. Your progress is saved locally.
              </p>
              
              <div className={styles.gameControls} id="game_dashboard_panel">
                <div className={styles.scoreRow}>
                  <span className={styles.scoreLabel}>Your Accumulated Bags</span>
                  <span className={styles.scoreValue} id="game_bag_counter">{bagCount.toLocaleString()} $WORKIN</span>
                </div>
                <div className={styles.scoreRow} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <span className={styles.scoreLabel}>Total Sessions Taps</span>
                  <span className={styles.scoreValue} style={{ color: 'hsl(var(--accent-pink))' }} id="game_tap_counter">{clicks}</span>
                </div>
                
                <div className={styles.clickQuote} id="game_motivational_quote">
                  {activeQuote}
                </div>
                
                {/* Community Progress */}
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className={styles.milestoneHeader}>
                    <span>Next Bag Milestone Progress</span>
                    <span id="game_milestone_percent">{Math.min(Math.floor((bagCount % 1000) / 10), 100)}%</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div 
                      className={styles.progressBar} 
                      style={{ width: `${Math.min((bagCount % 1000) / 10, 100)}%` }}
                      id="game_progress_bar"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Click Board Split Widget */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div 
                className={styles.splitWidget} 
                onClick={(e) => handleWidgetClick(e, 'game')}
                id="game_click_target"
                style={{ animationDelay: '-3s' }} 
                aria-label="Interactive click game target"
              >
                <canvas ref={gameCanvasRef} className={styles.splitCanvas} />
                <div className={styles.splitContent}>
                  <div className={`${styles.splitSide} ${styles.splitLeft}`}>
                    <span className={styles.splitTextLeft}>ORKIN</span>
                  </div>
                  <div className={styles.splitDivider} />
                  <div className={`${styles.splitSide} ${styles.splitRight}`}>
                    <span className={styles.splitTextRight}>Working</span>
                  </div>
                </div>
                <div className={styles.tapIndicator}>Tap to Grind</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section id="tokenomics" className={`${styles.section} reveal`} aria-label="Tokenomics details">
          <div className={styles.sectionHeader}>
            <span className={styles.tagline} style={{ color: 'hsl(var(--accent-pink))' }}>Pure Tokenomics</span>
            <h2 className={styles.sectionTitle} id="tokenomics_section_title">BAG DISTRIBUTION</h2>
          </div>
          
          <div className={styles.tokenomicsGrid}>
            <div className={`${styles.tokenomicsCard} glass-card`} id="tokenomics_card_supply">
              <span className={styles.tokenomicsLabel}>Total Supply</span>
              <span className={`${styles.tokenomicsValue} gradient-text`} style={{ background: 'linear-gradient(135deg, #fff 0%, hsl(var(--accent-purple)) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                1,000,000,000
              </span>
              <p style={{ fontSize: '0.875rem' }}>Fixed capped supply. No inflation.</p>
            </div>
            
            <div className={`${styles.tokenomicsCard} glass-card`} id="tokenomics_card_tax">
              <span className={styles.tokenomicsLabel}>Tax Rates</span>
              <span className={styles.tokenomicsValue} style={{ color: 'hsl(var(--accent-cyan))' }}>
                0% BUY / SELL
              </span>
              <p style={{ fontSize: '0.875rem' }}>Zero fees on transaction. Pure speed.</p>
            </div>
            
            <div className={`${styles.tokenomicsCard} glass-card`} id="tokenomics_card_lp">
              <span className={styles.tokenomicsLabel}>Liquidity Pool</span>
              <span className={styles.tokenomicsValue} style={{ color: 'hsl(var(--accent-pink))' }}>
                100% BURNED
              </span>
              <p style={{ fontSize: '0.875rem' }}>Keys thrown away. Completely unrugable.</p>
            </div>

            <div className={`${styles.tokenomicsCard} glass-card`} id="tokenomics_card_ownership">
              <span className={styles.tokenomicsLabel}>Contract Status</span>
              <span className={styles.tokenomicsValue} style={{ color: '#10b981' }}>
                RENOUNCED
              </span>
              <p style={{ fontSize: '0.875rem' }}>Controlled by code, managed by community.</p>
            </div>
          </div>
        </section>

        {/* How to Buy Section */}
        <section id="buy" className={`${styles.section} reveal`} aria-label="Buying guide">
          <div className={styles.sectionHeader}>
            <span className={styles.tagline}>Quickstart</span>
            <h2 className={styles.sectionTitle} id="buy_section_title">HOW TO GET $WORKIN</h2>
          </div>
          
          <div className={styles.buyStepsGrid}>
            <div className={`${styles.stepCard} glass-card`} id="buy_step_1">
              <div className={styles.stepNumber}>01</div>
              <h3 className={styles.stepTitle}>Create Phantom Wallet</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Download Phantom Wallet or your preferred Solana browser extension from the official webstore. Setup your keys securely.
              </p>
            </div>
            
            <div className={`${styles.stepCard} glass-card`} id="buy_step_2">
              <div className={styles.stepNumber}>02</div>
              <h3 className={styles.stepTitle}>Acquire Solana ($SOL)</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Buy SOL on any major exchange or swap site and transfer it to your newly created Phantom Wallet. Keep a small amount for gas fees.
              </p>
            </div>
            
            <div className={`${styles.stepCard} glass-card`} id="buy_step_3">
              <div className={styles.stepNumber}>03</div>
              <h3 className={styles.stepTitle}>Connect to Raydium</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Head over to Raydium.io (or Jupiter Swap), connect your Phantom Wallet, and paste our official Contract Address into the selection token bar.
              </p>
            </div>

            <div className={`${styles.stepCard} glass-card`} id="buy_step_4">
              <div className={styles.stepNumber}>04</div>
              <h3 className={styles.stepTitle}>Swap & Stack</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Swap your SOL for $WORKIN. Hit confirm, let the transaction process, and start loading your heavy digital bag!
              </p>
            </div>
          </div>
        </section>

        {/* Community / Grid */}
        <section id="community" className={`${styles.section} reveal`} aria-label="Social connections">
          <div className={styles.sectionHeader}>
            <span className={styles.tagline} style={{ color: 'hsl(var(--accent-cyan))' }}>Join the Movement</span>
            <h2 className={styles.sectionTitle} id="community_section_title">OUR CHANNELS</h2>
          </div>
          
          <div className={styles.communityGrid}>
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className={`${styles.socialCard} glass-card`} id="social_link_telegram">
              <div className={styles.socialIconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="glow-neon-purple">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </div>
              <span className={styles.socialName}>Telegram</span>
              <span className={styles.socialDesc}>Connect with community loaders.</span>
            </a>
            
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className={`${styles.socialCard} glass-card`} id="social_link_twitter">
              <div className={styles.socialIconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="glow-neon-cyan">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </div>
              <span className={styles.socialName}>Twitter / X</span>
              <span className={styles.socialDesc}>Get official updates and memes.</span>
            </a>
            
            <a href="https://dexscreener.com/" target="_blank" rel="noopener noreferrer" className={`${styles.socialCard} glass-card`} id="social_link_dexscreener">
              <div className={styles.socialIconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="glow-neon-purple">
                  <path d="M3 3v18h18"></path>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                </svg>
              </div>
              <span className={styles.socialName}>DexScreener</span>
              <span className={styles.socialDesc}>Track price and liquidity pool charts.</span>
            </a>

            <a href="https://dextools.io/" target="_blank" rel="noopener noreferrer" className={`${styles.socialCard} glass-card`} id="social_link_dextools">
              <div className={styles.socialIconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="glow-neon-cyan">
                  <path d="M12 2v20M17 5v14M22 9v6M7 8v8M2 10v4"></path>
                </svg>
              </div>
              <span className={styles.socialName}>DexTools</span>
              <span className={styles.socialDesc}>View audit score and safety metrics.</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`${styles.footerContent} container`}>
          <span className={styles.footerText} id="footer_copyright">
            &copy; 2026 $WORKIN. We work for our bags.
          </span>
          <span className={styles.footerCredits} id="footer_dev_link">
            Created in next.js for <a href="https://johnbyju.github.io" target="_blank" rel="noopener noreferrer">John Byju</a>
          </span>
        </div>
      </footer>
    </>
  );
}
