import Link from 'next/link';

export const metadata = {
  title: 'About | SYS-REDUX',
  description: 'Learn more about Trevor Edge',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-24 px-8">
      <div className="max-w-[900px] mx-auto">
        <h1
          className="font-['Orbitron'] text-5xl font-black text-center mb-12 glitch text-primary-cyan"
          data-text="ABOUT ME"
        >
          ABOUT ME
        </h1>

        <div className="cyber-card mb-8">
          <h2 className="font-['Orbitron'] text-2xl font-bold mb-4" style={{ color: 'var(--color-primary-cyan)' }}>
            WHO AM I?
          </h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            I&apos;m Trevor Edge, a systems developer and digital architect passionate about building
            innovative solutions that push the boundaries of technology. I&apos;m an outgoing, AI driven
            engineer with a strong foundation in JavaScript and Python. But more than that, I LOVE
            developing! I am interested in all the tools devs that came before me made, the jargon that
            mystifies the internet, and the feeling you get when you push code to GitHub at 3AM, the tests
            pass, and you are the proud contributor to something that could make a difference to someone.
          </p>
        </div>

        <div className="cyber-card mb-8">
          <h2 className="font-['Orbitron'] text-2xl font-bold mb-4" style={{ color: 'var(--color-primary-cyan)' }}>
            MY JOURNEY
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            My journey is rooted in curiosity and a relentless drive to solve complex problems. From
            experimenting with Python scripts in my bootcamp days, I discovered an unyielding passion
            for the <span className='text-primary-green text-xl p-0.5 rounded-lg font-bold shadow-glow-green'>
                DevLife
            </span>. This passion propelled me to master modern frameworks like React Next.js, and TypeScript
            to ensure that I&apos;m type-safe, and modern developer workflows.
          </p>
          <p className='text-lg leading-relaxed' style={{ color: 'var(--color-text-secondary)' }}>
            I admire opensource culture and the collaborative spirit of the developer community. I actively contribute
            to open-source projects and stay engaged with the latest industry trends. I also like to go old school
            and self host projects on my server, because I love the control and customization it offers.
          </p>
          <p className='text-lg leading-relaxed' style={{ color: 'var(--color-text-secondary)' }}>
            Beyond the code, I believe in maintainability, purpose, and structure. Meaning that
            every line of code I write serves a sole purpose, built on a solid foundation, adn could
            be read as a as a reminder to my future self.
          </p>
        </div>

        <div className="cyber-card mb-8">
          <h2 className="font-['Orbitron'] text-2xl font-bold mb-4" style={{ color: 'var(--color-primary-cyan)' }}>
            CORE EXPERTISE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { category: 'Frontend',
                skills: 'React, Next.js, TypeScript, Tailwind CSS, Vue.js, HTML/CSS' },
              { category: 'Backend',
                skills: 'Node.js, Python, Express, Flask, Django, RESTful APIs' },
              { category: 'Database',
                skills: 'Firebase, MongoDB, PostgreSQL, MySQL, Redis' },
              { category: 'Cloud & DevOps',
                skills: 'AWS, Google Cloud, Docker, Kubernetes, CI/CD, GitHub Actions, SupaBase, Cloudflare' },
              { category: 'Principles',
                skills: 'Agile Methods, Clean Typed Code, Single Responsibility Principle, DRY, KISS\
                 Test-Driven Development (TDD), Version Control (Git)'
              },
              { category: 'Product Building',
                skills: 'E-Commerce Storefronts, Portfolios, Booking Systems, API Integrations, AI Integrations,\
                 Analytics Platforms'
              },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded border" style={{ borderColor: 'var(--color-border)' }}>
                <h3 className="font-['Orbitron'] font-bold mb-2" style={{ color: 'var(--color-primary-green)' }}>
                  {item.category}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{item.skills}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cyber-card">
          <h2 className="font-['Orbitron'] text-2xl font-bold mb-4" style={{ color: 'var(--color-primary-cyan)' }}>
            LET&apos;S CONNECT
          </h2>
          <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to
            be part of your vision. Feel free to reach out!
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/contact" className="cyber-btn">
              Contact Me
            </Link>
            <Link href="/projects" className="cyber-btn secondary">
              View My Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}