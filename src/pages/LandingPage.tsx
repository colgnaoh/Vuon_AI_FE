import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const proof = [
  { value: '50+', label: 'builders in the room' },
  { value: '12+', label: 'projects with real momentum' },
  { value: '30+', label: 'shared pieces of equipment' },
  { value: '06', label: 'spaces to test and make' },
];

const stories = [
  { number: '01', title: 'See what teams are building', copy: 'Find live problems, real momentum and a clear place to contribute.', path: '/projects' },
  { number: '02', title: 'Put a question on the table', copy: 'Write an idea clearly enough to get feedback, find collaborators and become a prototype.', path: '/ideas' },
  { number: '03', title: 'Borrow what you need', copy: 'Equipment, bookings and workspace move in one simple rhythm.', path: '/equipment' },
  { number: '04', title: 'Follow a project', copy: 'See which teams are recruiting, what is running and where you can help.', path: '/projects' },
];

const zones = [
  { number: '01', name: 'Community Space', copy: 'Meet, share and find the right people.' },
  { number: '02', name: 'AI Lab', copy: 'GPU, edge AI and demos that actually run.' },
  { number: '03', name: 'Robotics Lab', copy: 'ROS2, robot arms and motion in the real world.' },
  { number: '04', name: 'IoT & Embedded', copy: 'ESP32, STM32, LoRaWAN and sensors.' },
  { number: '05', name: 'Maker Space', copy: '3D printing, laser cutting and soldering.' },
  { number: '06', name: 'Project Space', copy: 'Build nights, workshops and demo days.' },
];

const topics = ['Computer Vision', 'ROS2', 'Edge AI', 'ESP32', 'Digital Twin', 'TinyML', '3D Printing', 'LoRaWAN'];

export const LandingPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    const initializeMotion = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        gsap.from('.hero-title, .hero-lede, .hero-actions, .hero-index', {
          y: 20,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
        });
        gsap.from('.hero-visual', { opacity: 0, x: 24, duration: 0.85, ease: 'power2.out' });
        gsap.utils.toArray<HTMLElement>('.reveal-item').forEach((element) => {
          gsap.fromTo(element, { opacity: 0, y: 22 }, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 88%', toggleActions: 'play none none reverse' },
          });
        });
      }, pageRef);
      revert = () => context.revert();
    };

    void initializeMotion();
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <div ref={pageRef}>
      <section className="landing-hero">
        <div className="page-shell landing-hero-inner">
          <div className="hero-overline"><span>01 / open studio</span><span>ho chi minh city</span></div>

          <div className="hero-grid">
            <div>
              <h1 className="display-title hero-title">A place to turn <em>ideas</em> into things you can touch.</h1>
              <p className="hero-lede">VUON is an open studio for AI, Robotics, IoT and people who like to start with a sketch, then make it work.</p>
              <div className="hero-actions">
                <Link to="/ideas" className="btn-primary">Explore ideas to build together</Link>
                <Link to="/projects" className="btn-secondary">See active projects</Link>
              </div>
              <div className="hero-index"><span>open for builders</span><span>learn · connect · build</span></div>
            </div>

            <div className="hero-notes">
              <div className="hero-visual">
                <img src="/hero-workbench.svg" alt="A workbench with electronics, notes and making tools" />
                <div className="visual-caption"><span>workbench / 01</span><span>make it tangible</span></div>
              </div>
              <aside className="hero-note">
                <span>field note / 01</span>
                <p>Do not wait for a perfect roadmap.</p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Quick snapshot">
        <div className="page-shell !py-0">
          <div className="proof-heading">
            <p className="eyebrow">snapshot</p>
            <span>Quick snapshot</span>
          </div>
          <div className="proof-grid">
            {proof.map((item, index) => <div key={item.label} className="proof-item reveal-item"><span className="proof-index">0{index + 1}</span><div className="proof-value">{item.value}</div><div className="proof-label">{item.label}</div></div>)}
          </div>
        </div>
      </section>

      <main>
        <section className="page-shell landing-section">
          <div className="story-grid">
            <div className="reveal-item">
              <p className="eyebrow">02 / how it works</p>
              <h2 className="story-title">Start small. Make it real.</h2>
              <p className="story-copy">You do not need to know everything from the start. Bring a clear question, someone willing to try and a place to keep going.</p>
            </div>
            <div className="story-list">
              {stories.map((story) => <Link to={story.path} key={story.number} className="story-row reveal-item"><span className="story-number">{story.number}</span><div><h3>{story.title}</h3><p>{story.copy}</p></div></Link>)}
            </div>
          </div>
        </section>

        <section className="page-shell landing-section">
          <div className="zones-heading reveal-item">
            <div><p className="eyebrow">03 / spaces open now</p><h2 className="story-title">Pick a corner. Start making.</h2></div>
            <Link to="/equipment" className="btn-quiet">Browse equipment</Link>
          </div>
          <div className="zone-list">
            {zones.map((zone) => <Link to="/equipment" key={zone.number} className="zone-row reveal-item"><span className="zone-index">{zone.number}</span><div><h3>{zone.name}</h3><p>{zone.copy}</p></div></Link>)}
          </div>
        </section>

        <section className="word-strip" aria-label="Technology fields">
          <div className="word-strip-track">{topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
        </section>

        <section className="page-shell closing-note">
          <div className="reveal-item"><p className="eyebrow">04 / meet in person</p><h2>Meet beyond the screen.</h2></div>
          <aside className="reveal-item closing-location"><p className="field-label">meeting point</p><address>Front courtyard, Student Cultural House of Ho Chi Minh City,<br />01 Luu Huu Phuoc Street, Dong Hoa Ward, Ho Chi Minh City</address></aside>
        </section>
      </main>
    </div>
  );
};
