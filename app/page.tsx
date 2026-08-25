"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const donateHref = "https://www.justgiving.com/page/tom-daniel-1?utm_medium=FA&utm_source=WA";

type Particle = {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  colour: string;
};

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let value = 0;
    const interval = window.setInterval(() => {
      value += value < 72 ? 9 : 4;
      if (value >= 100) {
        value = 100;
        window.clearInterval(interval);
        window.setTimeout(() => setLoaded(true), 220);
      }
      setProgress(value);
    }, 55);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let particles: Particle[] = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = ["rgba(3,36,84,.28)", "rgba(245,217,76,.5)", "rgba(255,254,253,.42)"];

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(20, Math.min(46, Math.round(width / 34)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.5 + Math.random() * 4.5,
        speedX: (Math.random() - 0.5) * 0.22,
        speedY: -0.08 - Math.random() * 0.28,
        colour: palette[index % palette.length],
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        context.beginPath();
        context.fillStyle = particle.colour;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();

        if (!reduceMotion) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          if (particle.y < -particle.radius) particle.y = height + particle.radius;
          if (particle.x < -particle.radius) particle.x = width + particle.radius;
          if (particle.x > width + particle.radius) particle.x = -particle.radius;
        }
      });

      if (!reduceMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <div className={`opening-loader ${loaded ? "is-finished" : ""}`} aria-hidden={loaded}>
        <div className="loader-panels" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="loader-wordmark"><span>TOM</span><span>RUNS</span></div>
        <p>London Marathon · 2027</p>
        <div className="loader-progress">
          <span>{String(progress).padStart(2, "0")}</span><small>%</small>
          <i style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>

      <a className="skip-link" href="#main">Skip to content</a>

      <div className="announcement">
        <span>London Marathon 2027 · 26.2 miles · £2,500 target</span>
        <a href={donateHref} target="_blank" rel="noreferrer">Donate through JustGiving</a>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Tom Runs home"><span>TR</span><b>27</b></a>
        <nav aria-label="Main navigation">
          <a href="#why">Why Phab</a>
          <a href="#goal">The goal</a>
          <a href="#journey">The journey</a>
        </nav>
        <a className="button button-small" href={donateHref} target="_blank" rel="noreferrer">Donate</a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <canvas ref={particleCanvasRef} className="particle-field" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow hero-kicker">One bloke · One marathon · One brilliant cause</p>
            <h1 aria-label="Tom runs London for Phab">
              <span>Tom runs</span>
              <span className="outline">London.</span>
            </h1>
            <div className="hero-intro">
              <p>I&apos;m taking on 26.2 miles to raise <strong>£2,500</strong> for Phab and help create more places where everyone belongs.</p>
              <div className="hero-actions">
                <a className="button" href={donateHref} target="_blank" rel="noreferrer">Donate now <span aria-hidden="true">↗</span></a>
                <a className="text-link" href="#why">Why I&apos;m running <span aria-hidden="true">↓</span></a>
              </div>
            </div>
          </div>

          <figure className="hero-runner">
            <Image src="/images/tom-running.png" alt="Tom running and smiling" width={1024} height={1536} priority />
          </figure>

          <div className="race-stamp" aria-hidden="true"><span>26.2</span><small>MILES</small></div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div>
            <span>RUN FOR INCLUSION</span><i /><span>RUN FOR PHAB</span><i /><span>RUN FOR £2,500</span><i />
            <span>RUN FOR INCLUSION</span><i /><span>RUN FOR PHAB</span><i /><span>RUN FOR £2,500</span><i />
          </div>
        </div>

        <section className="why section-pad" id="why">
          <div className="section-index" data-reveal>01 / WHY PHAB</div>
          <div className="why-heading" data-reveal>
            <p className="eyebrow">A cause close to home</p>
            <h2>Inclusion isn&apos;t an extra.<br /><span>It&apos;s everything.</span></h2>
          </div>
          <div className="why-copy" data-reveal>
            <Image src="/images/phab-logo.jpg" alt="Phab" width={159} height={73} />
            <p className="lead">Phab&apos;s values closely reflect both my personal beliefs and my professional life.</p>
            <p>I work at Eaglewood School, an alternative provision supporting young people with a wide range of additional needs, including social, emotional and mental health needs, autism, ADHD and learning difficulties.</p>
            <p>Every day I see the difference it makes when young people feel accepted, included and able to build positive relationships. Phab&apos;s belief in bringing disabled and non-disabled people together as equals—and promoting opportunity rather than pity—is something I strongly believe in.</p>
            <a className="text-link" href="https://phab.org.uk/" target="_blank" rel="noreferrer">Meet Phab <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="origin" aria-labelledby="origin-title">
          <div className="origin-image" data-reveal>
            <Image src="/images/phab-marathon.jpg" alt="Phab runners celebrating together at the London Marathon" width={1200} height={901} />
            <span>Image courtesy of Phab</span>
          </div>
          <div className="origin-copy section-pad" data-reveal>
            <p className="eyebrow">Born in the New Forest · 1957</p>
            <h2 id="origin-title">“Opportunity,<br />not pity.”</h2>
            <p>Phab began at Avon Tyrrell—just a few miles from where I live in Sway—after a young disabled man called Terry Rolfe asked for the chance to take part in exciting activities on equal terms.</p>
            <p>I know first-hand how important that setting has been in providing inclusive outdoor experiences for young people. Supporting a charity with such strong roots in my local community makes this challenge even more personal.</p>
            <a className="text-link" href="https://phab.org.uk/about-us/" target="_blank" rel="noreferrer">Read Phab&apos;s story <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="impact section-pad" aria-labelledby="impact-title">
          <div className="section-topline" data-reveal><span>02 / THE IMPACT</span><span>Inclusion in action</span></div>
          <h2 id="impact-title" data-reveal>What every mile<br /><span>moves forward.</span></h2>
          <p className="impact-intro" data-reveal>As both a parent and an educator, I understand how important inclusive opportunities are for children and families—and the lifelong impact they can have on confidence, wellbeing and independence.</p>
          <div className="impact-list">
            <article data-reveal>
              <span>01</span>
              <div><h3>Belonging</h3><p>Local Phab Clubs where disabled and non-disabled people can meet, socialise and build lasting friendships without barriers.</p></div>
            </article>
            <article data-reveal>
              <span>02</span>
              <div><h3>Confidence</h3><p>Inclusive residential experiences and adventures that challenge expectations, grow independence and create lasting memories.</p></div>
            </article>
            <article data-reveal>
              <span>03</span>
              <div><h3>Opportunity</h3><p>Accessible holidays and practical support that help more children, adults and families take part and enjoy life together.</p></div>
            </article>
          </div>
        </section>

        <section className="goal section-pad" id="goal" aria-labelledby="goal-title">
          <div className="goal-copy" data-reveal>
            <p className="section-index">03 / THE GOAL</p>
            <h2 id="goal-title">£2,500.<br /><span>Let&apos;s get there.</span></h2>
            <p>One marathon, one fundraising target and a lot of training miles between now and the start line.</p>
          </div>
          <div className="fundraising" data-reveal>
            <div className="fundraising-top"><span>Fundraising target</span><strong>£2,500</strong></div>
            <div className="target-line" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            <p>Visit my JustGiving page to see the live total and make a secure donation directly to Phab.</p>
            <a className="button" href={donateHref} target="_blank" rel="noreferrer">Open JustGiving <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="journey section-pad" id="journey" aria-labelledby="journey-title">
          <div className="journey-heading" data-reveal>
            <p className="section-index">04 / THE JOURNEY</p>
            <h2 id="journey-title">The miles<br />before <span>the mile.</span></h2>
          </div>
          <div className="journey-log">
            <article data-reveal>
              <time>NOW</time>
              <div><p className="eyebrow">The starting line</p><h3>Building the base</h3><p>The site is ready. Training stories, events and honest updates are next.</p></div>
            </article>
            <article data-reveal>
              <time>SOON</time>
              <div><p className="eyebrow">Training updates</p><h3>Long runs &amp; lessons</h3><p>Come back for the good runs, the tough ones and everything learned in between.</p></div>
            </article>
            <article data-reveal>
              <time>2027</time>
              <div><p className="eyebrow">London Marathon</p><h3>26.2 for Phab</h3><p>The finish line is the destination. A more inclusive future is the point.</p></div>
            </article>
          </div>
        </section>

        <section className="donate" id="donate" aria-labelledby="donate-title">
          <div className="donate-shape donate-shape-one" aria-hidden="true" />
          <div className="donate-shape donate-shape-two" aria-hidden="true" />
          <p className="eyebrow" data-reveal>Back Tom · Back Phab</p>
          <h2 id="donate-title" data-reveal>Help turn<br />26.2 miles<br /><span>into opportunity.</span></h2>
          <p data-reveal>Every mile I run will help create more opportunities for disabled and non-disabled people to connect, thrive and enjoy life together.</p>
          <a className="button button-light" href={donateHref} target="_blank" rel="noreferrer" data-reveal>Donate through JustGiving <span aria-hidden="true">↗</span></a>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top" aria-label="Tom Runs home"><span>TR</span><b>27</b></a>
        <p>Tom runs London for Phab · Raising £2,500</p>
        <p>Phab is a registered charity in England and Wales (No. 283931).</p>
      </footer>
    </>
  );
}
