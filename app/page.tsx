'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    const titles = [
      'Systems Developer',
      'Data Enthusiast',
      'Digital Architect',
      'Code Warrior',
      'Tech Innovator'
    ];
    const type = () => {
      const currentTitle = titles[currentIndex];

      if (!isDeleting && typedText !== currentTitle) {
        setTypedText(currentTitle.substring(0, typedText.length + 1));
      } else if (isDeleting && typedText !== '') {
        setTypedText(currentTitle.substring(0, typedText.length - 1));
      } else if (!isDeleting && typedText === currentTitle) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % titles.length);
      }
    };

    const timer = setTimeout(type, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [typedText, currentIndex, isDeleting]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          {/* Cyber Grid */}
          <div
            className="absolute top-0 left-0 w-full h-full animate-[gridFloat_15s_linear_infinite]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }}
          />

          {/* Floating Particles */}
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 rounded-full animate-[float_linear_infinite]"
                style={{
                  left: `${Math.random() * 100}%`, // eslint-disable-line
                  background: 'var(--color-primary-cyan)',
                  animationDelay: `${Math.random() * 10}s`, // eslint-disable-line
                  animationDuration: `${5 + Math.random() * 10}s`, // eslint-disable-line
                  boxShadow: '0 0 6px var(--color-primary-cyan)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-[1200px] mx-auto px-8 items-center">
          {/* Hero Text */}
          <div className="z-2">
            <h1 className="font-['Orbitron'] text-[4rem] font-black mb-4 glitch"
                style={{
                  color: 'var(--color-primary-cyan)',
                  textShadow: '0 0 20px var(--color-primary-cyan)'
                }}
                data-text="SYS-REDUX">
              SYS-REDUX
            </h1>

            <h2 className="font-['Rajdhani'] text-[2rem] font-semibold mb-8 min-h-10"
                style={{ color: 'var(--color-text-primary)' }}>
              <span
                className="typing-text"
                style={{
                  color: 'var(--color-primary-green)',
                  textShadow: '0 0 10px var(--color-primary-green)'
                }}>
                {typedText}
              </span>
              <span
                className="cursor"
                style={{ color: 'var(--color-primary-cyan)' }}>
                |
              </span>
            </h2>

            <p className="text-[1.2rem] leading-[1.8] mb-12 max-w-[500px]"
               style={{ color: 'var(--color-text-secondary)' }}>
              Welcome to my digital domain. I craft code with cyberpunk precision,
              building the future one line at a time. Enter the matrix of my work.
            </p>

            <div className="flex gap-8 flex-wrap">
              <Link href="/projects" className="cyber-btn">
                View Projects
              </Link>
              <Link href="/contact" className="cyber-btn secondary">
                Get In Touch
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex justify-center items-center">
            <div
              className="rounded-[10px] overflow-hidden w-full max-w-[500px]"
              style={{
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-glow)'
              }}>
              {/* Terminal Header */}
              <div
                className="px-4 py-4 flex justify-between items-center"
                style={{
                  background: 'var(--color-darker-bg)',
                  borderBottom: '1px solid var(--color-border)'
                }}>
                <div className="flex gap-2">
                  <span className="block w-3 h-3 rounded-full"
                        style={{ background: '#ff5f56', boxShadow: '0 0 5px #ff5f56' }} />
                  <span className="block w-3 h-3 rounded-full"
                        style={{ background: '#ffbd2e', boxShadow: '0 0 5px #ffbd2e' }} />
                  <span className="block w-3 h-3 rounded-full"
                        style={{ background: '#27ca3f', boxShadow: '0 0 5px #27ca3f' }} />
                </div>
                <span
                  className="font-['Orbitron'] text-[0.9rem]"
                  style={{ color: 'var(--color-primary-cyan)' }}>
                  sys-redux@cyberpunk:~$
                </span>
              </div>

              {/* Terminal Body */}
              <div className="p-8 font-['Courier_New',monospace] text-base leading-[1.6]">
                <div className="mb-2">
                  <span className="prompt mr-2"
                        style={{ color: 'var(--color-primary-green)' }}>$</span>
                  <span className="command"
                        style={{ color: 'var(--color-primary-cyan)' }}>whoami</span>
                </div>
                <div className="mb-2">
                  <span className="output"
                        style={{ color: 'var(--color-text-secondary)' }}>sys-redux</span>
                </div>
                <div className="mb-2">
                  <span className="prompt mr-2"
                        style={{ color: 'var(--color-primary-green)' }}>$</span>
                  <span className="command"
                        style={{ color: 'var(--color-primary-cyan)' }}>cat skills.txt</span>
                </div>
                <div className="mb-2">
                  <span className="output"
                        style={{ color: 'var(--color-text-secondary)' }}>React.js • Node.js • Python</span>
                </div>
                <div className="mb-2">
                  <span className="output"
                        style={{ color: 'var(--color-text-secondary)' }}>JavaScript • TypeScript • MongoDB</span>
                </div>
                <div className="mb-2">
                  <span className="prompt mr-2"
                        style={{ color: 'var(--color-primary-green)' }}>$</span>
                  <span className="command animate-[blink_1s_infinite]"
                        style={{ color: 'var(--color-primary-cyan)' }}>pnpm build</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Preview Section */}
      <section
        className="py-16"
        style={{ background: 'var(--color-darker-bg)' }}>
        <div className="max-w-[1200px] mx-auto px-8">
          <h2
            className="font-['Orbitron'] text-[3rem] font-black text-center mb-12 relative pb-8"
            style={{ color: 'var(--color-text-primary)' }}
            data-text="CORE SYSTEMS">
            CORE SYSTEMS
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100px] h-[3px] animate-[pulse_2s_infinite]"
              style={{
                background: 'linear-gradient(90deg, var(--color-primary-cyan), var(--color-primary-pink))'
              }}
            />
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[
              { icon: '⚡', title: 'Frontend', desc: 'React • Tailwind • Next • TypeScript', progress: 95 },
              { icon: '⚙️', title: 'Backend', desc: 'Node.js • Python • Express • Django', progress: 90 },
              { icon: '🗄️', title: 'Database', desc: 'MongoDB • PostgreSQL • Redis • MySQL', progress: 85 },
              { icon: '☁️', title: 'Cloud & DevOps', desc: 'AWS • Docker • Kubernetes • CI/CD', progress: 80 },
            ].map((skill, index) => (
              <div
                key={index}
                className="skill-card group rounded-[10px] p-8 text-center transition-all duration-300 hover:-translate-y-2.5 relative overflow-hidden"
                style={{
                  background: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)'
                }}>
                {/* Shimmer effect */}
                <div
                  className="absolute top-0 -left-full w-full h-full transition-all duration-500 group-hover:left-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent)'
                  }}
                />

                {/* Skill Icon */}
                <div className="text-[3rem] mb-4 grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110 relative z-10">
                  {skill.icon}
                </div>

                {/* Title */}
                <h3
                  className="font-['Orbitron'] text-[1.3rem] font-bold mb-4 relative z-10"
                  style={{ color: 'var(--color-text-primary)' }}>
                  {skill.title}
                </h3>

                {/* Description */}
                <p
                  className="mb-6 leading-[1.6] relative z-10"
                  style={{ color: 'var(--color-text-secondary)' }}>
                  {skill.desc}
                </p>

                {/* Skill Bar */}
                <div
                  className="w-full h-1 rounded-sm overflow-hidden relative z-10"
                  style={{ background: 'var(--color-border)' }}>
                  <div
                    className="h-full rounded-sm animate-[skillLoad_2s_ease-in-out]"
                    style={{
                      width: `${skill.progress}%`,
                      background: 'linear-gradient(90deg, var(--color-primary-cyan), var(--color-primary-green))',
                      boxShadow: '0 0 10px var(--color-primary-cyan)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 text-center relative"
        style={{
          background: 'linear-gradient(135deg, var(--color-dark-bg), var(--color-darker-bg))'
        }}>
        {/* Radial gradient overlay */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%)'
          }}
        />

        {/* CTA Content */}
        <div className="relative z-2 max-w-[1200px] mx-auto px-8">
          <h2
            className="font-['Orbitron'] text-[3rem] font-black mb-8"
            style={{ color: 'var(--color-text-primary)' }}>
            Ready to <span className="neon-text">Build Tomorrow</span>?
          </h2>

          <p
            className="text-[1.3rem] leading-[1.8] mb-12 max-w-[600px] mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}>
            Let&apos;s collaborate and build something extraordinary together.
            The digital revolution starts now.
          </p>

          <div className="flex justify-center gap-8 flex-wrap">
            <Link href="/contact" className="cyber-btn success">
              Start Project
            </Link>
            <Link href="/about" className="cyber-btn">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
