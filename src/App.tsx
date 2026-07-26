import { useEffect, useRef, useState } from 'react'
import AnimatedList, {
  type AnimatedListEntry,
} from './components/AnimatedList'
import {
  portfolioData,
  type NavItem,
  type SectionId,
} from './data/portfolio'

function useActiveSection(items: NavItem[]) {
  const [activeSection, setActiveSection] = useState<SectionId>('home')

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null)
    let frame = 0

    const update = () => {
      const marker = window.scrollY + Math.min(window.innerHeight * 0.3, 280)
      let current: SectionId = 'home'

      sections.forEach((section) => {
        if (section.offsetTop <= marker) current = section.id as SectionId
      })

      setActiveSection(current)
    }

    const handleViewportChange = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', handleViewportChange, { passive: true })
    window.addEventListener('resize', handleViewportChange)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', handleViewportChange)
      window.removeEventListener('resize', handleViewportChange)
    }
  }, [items])

  return activeSection
}

function useInitialHashAlignment() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    const target = id ? document.getElementById(id) : null
    if (!target) return

    const timeout = window.setTimeout(() => {
      const headerOffset = window.innerWidth <= 680 ? 68 : 76
      const targetTop = target.getBoundingClientRect().top + window.scrollY
      const root = document.documentElement
      const previousScrollBehavior = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      window.scrollTo({ top: Math.max(0, targetTop - headerOffset) })
      window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousScrollBehavior
      })
    }, 80)

    return () => window.clearTimeout(timeout)
  }, [])
}

function useRevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    )

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    elements.forEach((element) => element.classList.add('reveal-pending'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

function ArrowIcon({ external = false }: { external?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {external ? (
        <>
          <path d="M8 16 16 8M9 8h7v7" />
          <path d="M19 13v6H5V5h6" />
        </>
      ) : (
        <path d="M5 12h13M13 6l6 6-6 6" />
      )}
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg className="github-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8a9.4 9.4 0 0 0-3 18.3c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.3-2.2-.3-4.6-1.1-4.6-4.7 0-1 .4-1.9 1-2.5-.1-.3-.4-1.3.1-2.5 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.2 2.6-1 2.6-1 .5 1.2.2 2.2.1 2.5.7.6 1 1.5 1 2.5 0 3.6-2.4 4.4-4.6 4.7.4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A9.4 9.4 0 0 0 12 2.8Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18v12H3zM3 7l9 7 9-7" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 8h11v11H8zM5 16H4V5h11v1" />
    </svg>
  )
}

function SectionHeading({
  id,
  kicker,
  title,
  description,
}: {
  id: string
  kicker: string
  title: string
  description?: string
}) {
  return (
    <header className="section-heading" data-reveal>
      <p className="section-heading__kicker">{kicker}</p>
      <h2 id={id}>{title}</h2>
      {description ? (
        <p className="section-heading__description">{description}</p>
      ) : null}
    </header>
  )
}

function Header({ activeSection }: { activeSection: SectionId }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  return (
    <header
      className={`site-header${scrolled || menuOpen ? ' site-header--solid' : ''}`}
    >
      <div className="site-header__inner">
        <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
          <strong>{portfolioData.profile.name}</strong>
          <span>求职作品集</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav
          id="site-navigation"
          className={`site-nav${menuOpen ? ' site-nav--open' : ''}`}
          aria-label="主要导航"
        >
          <ul>
            {portfolioData.navigation.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={activeSection === item.id ? 'is-active' : ''}
                  aria-current={activeSection === item.id ? 'location' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="section-shell hero__inner">
        <header className="hero__masthead" data-reveal>
          <p>{portfolioData.profile.direction}</p>
          <h1 id="hero-title">
            把技术讲清楚，
            <br />
            把方案做落地。
          </h1>
        </header>

        <div className="hero__editorial" data-reveal>
          <aside className="hero__index" aria-label="作品概况">
            <strong>07</strong>
            <span>个公开作品</span>
            <p>持续构建，也持续复盘。</p>
          </aside>

          <figure className="hero__media">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/profile-hero.jpg"
              aria-hidden="true"
            >
              <source src="/hero-background.mp4" type="video/mp4" />
            </video>
            <figcaption>
              <span>李鑫洋</span>
              <span>物联网工程 · 2027 届</span>
            </figcaption>
          </figure>

          <aside className="hero__brief">
            <div>
              <p className="hero__label">求职方向</p>
              <h2>售前工程师<br />解决方案工程师</h2>
              <p>
                连接技术、业务与真实场景，把复杂设备和客户需求整理成清晰、可执行的方案。
              </p>
            </div>
            <div className="hero__brief-footer">
              <a href={`mailto:${portfolioData.profile.email}`}>
                发邮件联系
                <ArrowIcon />
              </a>
              <a
                href={portfolioData.profile.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                查看代码作品
                <ArrowIcon external />
              </a>
            </div>
          </aside>
        </div>

        <a className="hero__scroll" href="#profile">
          向下查看个人经历
          <span aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

function Profile() {
  return (
    <section className="section profile" id="profile" aria-labelledby="profile-title">
      <div className="section-shell">
        <SectionHeading
          id="profile-title"
          kicker="个人经历"
          title="在真实场景里理解技术，也用作品留下自己的思考路径。"
          description="从医疗设备到智慧水务，从业务原型到本地工具，每一段经历都在训练我把复杂问题组织清楚。"
        />

        <div className="profile__stage">
          <figure className="portrait" data-reveal>
            <img
              src="/profile-hero.jpg"
              alt="李鑫洋在北京天安门前的个人照片"
              loading="lazy"
            />
            <figcaption>
              <span>{portfolioData.profile.name}</span>
              <span>{portfolioData.profile.direction}</span>
            </figcaption>
          </figure>

          <div className="profile__content" data-reveal>
            <p className="profile__lead">
              一名愿意走近现场、把问题讲清楚，并能动手做出验证的人。
            </p>
            <div className="profile__copy">
              {portfolioData.profile.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="profile__links">
              <a href={`mailto:${portfolioData.profile.email}`}>
                <MailIcon />
                {portfolioData.profile.email}
              </a>
              <a
                href={portfolioData.profile.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon />
                代码作品主页 · {portfolioData.profile.githubHandle}
              </a>
            </div>
          </div>
        </div>

        <div className="profile__stats" aria-label="个人项目数据" data-reveal>
          {portfolioData.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="experience-list" aria-label="经历时间线">
          {portfolioData.experiences.map((experience, index) => (
            <article key={experience.company} data-reveal>
              <span className="experience-list__number">
                经历 {String(index + 1).padStart(2, '0')}
              </span>
              <p className="experience-list__period">{experience.period}</p>
              <div>
                <h3>{experience.company}</h3>
                <p className="experience-list__role">{experience.role}</p>
              </div>
              <p className="experience-list__summary">{experience.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects() {
  const [selectedRepositoryIndex, setSelectedRepositoryIndex] = useState(0)
  const selectedRepository =
    portfolioData.repositories[selectedRepositoryIndex] ??
    portfolioData.repositories[0]
  const repositoryItems: AnimatedListEntry[] = portfolioData.repositories.map(
    (repository) => ({
      id: repository.name,
      label: repository.displayName,
      meta: `${repository.type} · ${repository.language}`,
      secondary: repository.name,
    }),
  )

  return (
    <section
      className="section projects"
      id="projects"
      aria-labelledby="projects-title"
    >
      <div className="section-shell">
        <SectionHeading
          id="projects-title"
          kicker="精选项目"
          title="不是概念清单，而是已经推进到可验证状态的作品。"
          description="每个项目都连接一个真实问题：业务协作、出行规划，或求职者对效率、隐私和控制权的需要。"
        />

        <div className="featured-projects">
          {portfolioData.featuredProjects.map((project, index) => (
            <article className="featured-project" key={project.title} data-reveal>
              <header className="featured-project__head">
                <span>项目 {String(index + 1).padStart(2, '0')}</span>
                <h3>{project.title}</h3>
                <p>{project.categoryLabel}</p>
              </header>

              <div className="featured-project__body">
                <a
                  className="featured-project__visual"
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`查看 ${project.title} 的代码仓库`}
                >
                  <img src={project.image} alt={project.imageAlt} loading="lazy" />
                  <span>
                    查看代码仓库
                    <ArrowIcon external />
                  </span>
                </a>

                <div className="featured-project__content">
                  <div>
                    <p className="featured-project__label">项目说明</p>
                    <p className="featured-project__description">
                      {project.description}
                    </p>
                  </div>
                  <div>
                    <p className="featured-project__label">成果与验证</p>
                    <ul className="featured-project__proof">
                      {project.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="featured-project__label">技术与能力</p>
                    <div className="featured-project__tags">
                      <span>{project.language}</span>
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <a
                    className="text-link"
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    打开项目仓库
                    <ArrowIcon external />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="repository-index" data-reveal>
          <header>
            <div>
              <p>完整作品目录</p>
              <h3>持续更新的代码作品</h3>
            </div>
            <a
              href={portfolioData.profile.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              查看全部代码作品
              <ArrowIcon external />
            </a>
          </header>
          <div className="repository-browser">
            <div className="repository-browser__list">
              <p className="repository-browser__hint">
                滚动浏览，或聚焦后使用上下方向键切换
              </p>
              <AnimatedList
                items={repositoryItems}
                initialSelectedIndex={0}
                showGradients
                enableArrowNavigation
                displayScrollbar
                onItemSelect={(_, index) => setSelectedRepositoryIndex(index)}
              />
            </div>

            <article
              className="repository-browser__detail"
              aria-live="polite"
              aria-atomic="true"
            >
              <div>
                <p className="repository-browser__counter">
                  当前作品{' '}
                  {String(selectedRepositoryIndex + 1).padStart(2, '0')} /{' '}
                  {String(portfolioData.repositories.length).padStart(2, '0')}
                </p>
                <p className="repository-browser__category">
                  {selectedRepository.type} · {selectedRepository.language}
                </p>
                <h4>{selectedRepository.displayName}</h4>
                <p className="repository-browser__description">
                  {selectedRepository.description}
                </p>
              </div>

              <dl className="repository-browser__meta">
                <div>
                  <dt>主要技术</dt>
                  <dd>{selectedRepository.language}</dd>
                </div>
                <div>
                  <dt>仓库标识</dt>
                  <dd>{selectedRepository.name}</dd>
                </div>
              </dl>

              <a
                className="text-link repository-browser__link"
                href={selectedRepository.url}
                target="_blank"
                rel="noreferrer"
              >
                打开当前项目仓库
                <ArrowIcon external />
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

function Strengths() {
  return (
    <section
      className="section strengths"
      id="strengths"
      aria-labelledby="strengths-title"
    >
      <div className="section-shell">
        <SectionHeading
          id="strengths-title"
          kicker="个人优势"
          title="我能带来的，不只是某一种工具的熟练度。"
          description="更重要的是理解问题、组织信息、快速验证，并在便利与边界之间做出清楚判断。"
        />

        <div className="strength-grid">
          {portfolioData.strengths.map((strength, index) => (
            <article key={strength.title} data-reveal>
              <span>能力 {String(index + 1).padStart(2, '0')}</span>
              <h3>{strength.title}</h3>
              <p className="strength-grid__summary">{strength.summary}</p>
              <p className="strength-grid__detail">{strength.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [copyStatus, setCopyStatus] = useState('复制邮箱')
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    },
    [],
  )

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolioData.profile.email)
    } catch {
      const input = document.createElement('textarea')
      input.value = portfolioData.profile.email
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }

    setCopyStatus('已复制')
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setCopyStatus('复制邮箱'), 2200)
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="section-shell contact__inner">
        <p className="contact__eyebrow">期待与你合作</p>
        <h2 id="contact-title">
          想找一个能理解技术，
          <br />
          也愿意走近业务现场的人？
        </h2>
        <p className="contact__lead">欢迎通过邮件或代码作品主页联系我。</p>

        <a className="contact__email" href={`mailto:${portfolioData.profile.email}`}>
          {portfolioData.profile.email}
          <ArrowIcon />
        </a>

        <div className="contact__actions">
          <a className="button button--amber" href={`mailto:${portfolioData.profile.email}`}>
            <MailIcon />
            发送邮件
          </a>
          <button className="button button--outline" type="button" onClick={copyEmail}>
            <CopyIcon />
            {copyStatus}
          </button>
          <a
            className="button button--outline"
            href={portfolioData.profile.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon />
            查看代码作品
          </a>
        </div>
        <p className="sr-only" aria-live="polite">
          {copyStatus === '已复制' ? '邮箱地址已复制到剪贴板' : ''}
        </p>

        <footer className="site-footer">
          <p>李鑫洋 · 售前与解决方案工程师求职作品集</p>
          <p>持续精进中 · 更新于 {portfolioData.updatedAt}</p>
        </footer>
      </div>
    </section>
  )
}

export default function App() {
  const activeSection = useActiveSection(portfolioData.navigation)
  useRevealOnScroll()
  useInitialHashAlignment()

  return (
    <>
      <a className="skip-link" href="#profile">
        跳到主要内容
      </a>
      <Header activeSection={activeSection} />
      <main>
        <Hero />
        <Profile />
        <Projects />
        <Strengths />
        <Contact />
      </main>
    </>
  )
}
