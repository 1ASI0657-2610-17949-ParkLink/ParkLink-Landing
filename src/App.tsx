import { useEffect, useRef, useState } from 'react'
import './App.css'

const APP_INTERFACE_IMAGE = '/figma-assets/app-interface.png'

const SCRAMBLE_CHARACTERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '%', '+', '-', 'm'] as const
const SCRAMBLE_DURATION_MS = 1200

interface ScrambledMetricValueProps {
  value: string
  delayMs: number
}

function createScrambledValue(target: string, progress: number) {
  const characters = target.split('')
  const revealedCharacters = Math.floor(characters.length * progress)

  return characters
    .map((character, index) => {
      if (index < revealedCharacters || character === ' ') {
        return character
      }

      const randomIndex = Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)
      return SCRAMBLE_CHARACTERS[randomIndex]
    })
    .join('')
}

function ScrambledMetricValue({ value, delayMs }: ScrambledMetricValueProps) {
  const valueRef = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    const node = valueRef.current

    if (!node) {
      return undefined
    }

    let animationFrameId = 0
    let timeoutId = 0
    let hasStarted = false
    let observer: IntersectionObserver | null = null

    const finish = () => setDisplayValue(value)

    const startScramble = () => {
      if (hasStarted) {
        return
      }

      hasStarted = true

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finish()
        return
      }

      const animate = (startedAt: number) => {
        const tick = (now: number) => {
          const elapsed = now - startedAt
          const progress = Math.min(elapsed / SCRAMBLE_DURATION_MS, 1)
          const easedProgress = 1 - (1 - progress) ** 3

          setDisplayValue(progress < 1 ? createScrambledValue(value, easedProgress) : value)

          if (progress < 1) {
            animationFrameId = requestAnimationFrame(tick)
          }
        }

        animationFrameId = requestAnimationFrame(tick)
      }

      setDisplayValue(createScrambledValue(value, 0))
      timeoutId = window.setTimeout(() => animate(performance.now()), delayMs)
    }

    if (!('IntersectionObserver' in window)) {
      startScramble()
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startScramble()
            observer?.disconnect()
          }
        },
        { threshold: 0.65 },
      )
      observer.observe(node)
    }

    return () => {
      window.clearTimeout(timeoutId)
      cancelAnimationFrame(animationFrameId)
      observer?.disconnect()
    }
  }, [delayMs, value])

  return (
    <>
      <span ref={valueRef} aria-hidden="true">
        {displayValue}
      </span>
      <span className="sr-only">{value}</span>
    </>
  )
}

function TimeLossIcon() {
  return (
    <svg viewBox="0 0 36 42" aria-hidden="true">
      <path d="M18 38c8.3 0 15-6.7 15-15S26.3 8 18 8 3 14.7 3 23s6.7 15 15 15Z" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M18 15v9l6 4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function TrafficIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M12 6h16l5 10v15a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3H14a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3V16l5-10Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M9 17h22M13 26h2m10 0h2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function StressIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 35c7.7 0 14-6.3 14-14S27.7 7 20 7 6 13.3 6 21s6.3 14 14 14Z" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M14 17h.01M26 17h.01M14 27c2-2 10-2 12 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function GarageIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M6 18 20 7l14 11v17H6V18Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M13 35V21h14v14M17 27h6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="m4 7 7-3 10 4 7-3v20l-7 3-10-4-7 3V7Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M11 4v20m10-16v20" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  )
}

function BookingIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 29c7.2 0 13-5.8 13-13S23.2 3 16 3 3 8.8 3 16s5.8 13 13 13Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 8v9h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 8h22M10 16h12M14 24h4" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  )
}

function PaymentIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 9h24v16H4V9Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M4 14h24M10 21h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function OwnerIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 14 16 6l10 8v12H6V14Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M12 26v-8h8v8M22 9v5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function NotificationIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M8 23h16l-2-3v-6a6 6 0 0 0-12 0v6l-2 3Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M13 26a3 3 0 0 0 6 0M9 11 6 8m17 3 3-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M8 12h16l3 6v8H5v-8l3-6Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M8 20h3m10 0h3M10 26v2m12-2v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m9 9 6 6m0-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const NAV_ITEMS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Problema', href: '#problema' },
  { label: 'Solución', href: '#solucion' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Autores', href: '#autores' },
] as const

const HERO_SIGNALS = [
  {
    title: 'Tiempo real',
    copy: 'Espacios disponibles al instante',
    icon: BookingIcon,
  },
  {
    title: 'Pago seguro',
    copy: 'Sin efectivo ni fricción',
    icon: PaymentIcon,
  },
  {
    title: 'Cerca de ti',
    copy: 'Ubicación y distancia claras',
    icon: MapIcon,
  },
] as const

const PROBLEMS = [
  {
    title: 'Pérdida de tiempo',
    copy: 'Minutos valiosos desperdiciados dando vueltas por las mismas calles.',
    icon: TimeLossIcon,
  },
  {
    title: 'Más tráfico',
    copy: 'Vehículos buscando parqueo representan hasta un 30% del tráfico urbano.',
    icon: TrafficIcon,
  },
  {
    title: 'Estrés al conducir',
    copy: 'Incertidumbre de no saber si encontrarás un espacio seguro.',
    icon: StressIcon,
  },
  {
    title: 'Espacios desaprovechados',
    copy: 'Cocheras privadas vacías que podrían generar ingresos.',
    icon: GarageIcon,
  },
] as const

const SOLUTION_POINTS = [
  {
    title: 'Visibilidad en tiempo real',
    copy: 'Conoce la disponibilidad exacta antes de llegar.',
  },
  {
    title: 'Reservas anticipadas',
    copy: 'Asegura tu espacio y viaja con tranquilidad.',
  },
  {
    title: 'Gestión simplificada',
    copy: 'Todo desde una sola app, sin efectivo ni complicaciones.',
  },
] as const

const PLATFORM_FEATURES = [
  { title: 'Disponibilidad en tiempo real', icon: MapIcon },
  { title: 'Reserva anticipada', icon: BookingIcon },
  { title: 'Pago seguro', icon: PaymentIcon },
  { title: 'Gestión para propietarios', icon: OwnerIcon },
] as const

const STEPS = [
  {
    title: 'Busca',
    copy: 'Ingresa tu destino y descubre las opciones de estacionamiento disponibles cerca de ti.',
  },
  {
    title: 'Reserva',
    copy: 'Selecciona el espacio que mejor se adapte a tus necesidades y asegúralo al instante.',
  },
  {
    title: 'Estaciona',
    copy: 'Llega directo a tu espacio reservado. Paga de forma automática desde la app.',
  },
] as const

const FEATURES = [
  {
    title: 'Mapa interactivo',
    copy: 'Visualiza fácilmente la disponibilidad, precios y distancias de las cocheras cercanas en un mapa dinámico.',
    icon: MapIcon,
  },
  {
    title: 'Reservas en tiempo real',
    copy: 'Asegura tu espacio al instante. Evita sorpresas y garantiza tu lugar de estacionamiento.',
    icon: BookingIcon,
  },
  {
    title: 'Filtros inteligentes',
    copy: 'Filtra por precio, tipo de vehículo, seguridad, techo y otras características específicas.',
    icon: FilterIcon,
  },
  {
    title: 'Pagos digitales',
    copy: 'Transacciones 100% seguras y sin efectivo. Paga con tarjeta o billeteras digitales directamente en la app.',
    icon: PaymentIcon,
  },
  {
    title: 'Gestión para propietarios',
    copy: 'Panel de control intuitivo para administrar disponibilidad, tarifas y monitorear ingresos.',
    icon: OwnerIcon,
  },
  {
    title: 'Notificaciones',
    copy: 'Alertas sobre el estado de tu reserva, tiempo restante y recordatorios importantes.',
    icon: NotificationIcon,
  },
] as const

const BENEFITS = [
  {
    title: 'Para conductores',
    tone: 'driver',
    icon: CarIcon,
    button: 'Registrarme como conductor',
    items: [
      'Ahorro de tiempo en la búsqueda de estacionamiento.',
      'Seguridad garantizada para tu vehículo.',
      'Precios transparentes y sin sorpresas.',
      'Mayor comodidad con pagos digitales.',
    ],
  },
  {
    title: 'Para propietarios',
    tone: 'owner',
    icon: OwnerIcon,
    button: 'Publicar mi cochera',
    items: [
      'Genera ingresos extra de forma pasiva.',
      'Control total sobre horarios y disponibilidad.',
      'Gestión de pagos segura y automatizada.',
      'Plataforma confiable con verificación de usuarios.',
    ],
  },
] as const

const STATS = [
  { value: '-20m', label: 'Menos tiempo buscando', tone: 'blue', icon: TimeLossIcon },
  { value: '+40%', label: 'Más espacios aprovechados', tone: 'green', icon: GarageIcon },
  { value: '-15%', label: 'Menos tráfico local', tone: 'blue', icon: TrafficIcon },
] as const

const TEAM = [
  {
    initials: 'JN',
    name: 'Javier Masaru Nikaido Vargas',
    role: 'Desarrollador Software',
    contribution: 'Contribución en el análisis y arquitectura del sistema de reservas.',
    image: 'https://github.com/user-attachments/assets/5c822b03-b836-4b76-aa38-f2920ab5ae96',
  },
  {
    initials: 'FO',
    name: 'Fabian Alejandro Oliva Lopez',
    role: 'Desarrollador Software',
    contribution: 'Desarrollo de las interfaces principales y experiencia de usuario.',
    image: 'https://github.com/user-attachments/assets/27855fbd-50e4-4f2f-a1a4-55f9f6f6e174',
  },
  {
    initials: 'PO',
    name: 'Pietro Osores Marchese',
    role: 'Desarrollador Software',
    contribution: 'Implementación de servicios en tiempo real y geolocalización.',
    image: 'https://github.com/user-attachments/assets/3299f6b1-3924-4222-af63-bf12555d01b0',
  },
  {
    initials: 'PM',
    name: 'Percy Alonso Muñiz Huayanca',
    role: 'Desarrollador Software',
    contribution: 'Diseño de bases de datos y seguridad en pasarela de pagos.',
    image: 'https://github.com/user-attachments/assets/8a3e21d8-4e93-46ce-9695-addf14f7b89c',
  },
  {
    initials: 'MS',
    name: 'Matias Rodolfo Salcedo Champi',
    role: 'Desarrollador Software',
    contribution: 'Gestión de infraestructura en la nube y optimización de rendimiento.',
    image: 'https://github.com/user-attachments/assets/bd1cd1ed-4754-4abc-95f0-10e3bcea3027',
  },
] as const

const COMPARISON = [
  { feature: 'Disponibilidad en tiempo real', parkLink: 'yes', traditional: 'no' },
  { feature: 'Reservas anticipadas', parkLink: 'yes', traditional: 'partial' },
  { feature: 'Integración de cocheras privadas', parkLink: 'yes', traditional: 'no' },
  { feature: 'Pagos 100% digitales', parkLink: 'yes', traditional: 'partial' },
] as const

function Header() {
  return (
    <header className="site-header">
      <div className="nav-shell">
        <a className="brand" href="#inicio" aria-label="ParkLink inicio">
          ParkLink
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions" aria-label="Acciones principales">
          <a className="button button-ghost button-small" href="#beneficios">
            Publicar cochera
          </a>
          <a className="button button-primary button-small" href="#cta">
            Descargar app
          </a>
        </div>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="hero-section" id="inicio" aria-labelledby="hero-title">
      <div className="section-container hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title">Encuentra y reserva estacionamiento en tiempo real</h1>
          <p>
            ParkLink te ayuda a encontrar espacios disponibles cerca de tu destino,
            reservarlos antes de llegar y pagar de forma segura desde una sola plataforma.
          </p>
          <ul className="hero-signals" aria-label="Beneficios destacados de ParkLink">
            {HERO_SIGNALS.map((signal) => {
              const Icon = signal.icon

              return (
                <li key={signal.title}>
                  <span className="hero-signal-icon"><Icon /></span>
                  <span>
                    <strong>{signal.title}</strong>
                    <small>{signal.copy}</small>
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="hero-actions">
            <a className="button button-primary" href="#cta">
              Buscar estacionamiento
            </a>
            <a className="button button-secondary" href="#beneficios">
              Gana dinero con tu cochera
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Vista previa de la aplicación ParkLink">
          <div className="phone-frame">
            <img src={APP_INTERFACE_IMAGE} alt="Interfaz móvil de ParkLink con mapa de estacionamientos" />
            <div className="floating-card floating-card-top">
              <span className="floating-icon floating-icon-blue">
                <GarageIcon />
              </span>
              <span>
                <strong>Espacio disponible</strong>
                <small>S/ 6.00/h · A 250 m</small>
              </span>
            </div>
            <div className="floating-card floating-card-bottom">
              <span className="floating-icon floating-icon-green">
                <CheckIcon />
              </span>
              <span>
                <strong>Reserva confirmada</strong>
                <small>Av. Javier Prado 123</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  return (
    <section className="section section-muted" id="problema" aria-labelledby="problem-title">
      <div className="section-container centered-stack">
        <div className="section-heading section-heading-wide">
          <h2 id="problem-title">Buscar estacionamiento no debería quitarte tiempo</h2>
          <p>
            En promedio, los conductores urbanos pierden entre 15 y 20 minutos buscando
            dónde dejar su vehículo. Esto genera frustración, contaminación y congestión
            vehicular innecesaria.
          </p>
        </div>
        <div className="problem-grid">
          {PROBLEMS.map((problem) => {
            const Icon = problem.icon

            return (
              <article className="problem-card" key={problem.title}>
                <span className="problem-icon"><Icon /></span>
                <h3>{problem.title}</h3>
                <p>{problem.copy}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SolutionSection() {
  return (
    <section className="section solution-section" id="solucion" aria-labelledby="solution-title">
      <div className="section-container two-column-grid solution-grid">
        <div className="solution-visual">
          <img src={APP_INTERFACE_IMAGE} alt="Mapa de ParkLink mostrando cocheras disponibles" loading="lazy" />
        </div>
        <div className="text-stack">
          <div className="section-heading align-start">
            <h2 id="solution-title">
              ParkLink centraliza la búsqueda, reserva y gestión de estacionamientos
            </h2>
            <p>
              Nuestra plataforma conecta conductores con espacios disponibles en tiempo
              real, simplificando la experiencia de estacionar en la ciudad.
            </p>
          </div>
          <ul className="check-list solution-list">
            {SOLUTION_POINTS.map((point) => (
              <li key={point.title}>
                <span className="check-mark"><CheckIcon /></span>
                <span>
                  <strong>{point.title}</strong>
                  <small>{point.copy}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="section section-dark" id="about" aria-labelledby="about-title">
      <div className="section-container two-column-grid about-grid">
        <div className="about-copy">
          <h2 id="about-title">About ParkLink</h2>
          <h3>Una solución de smart parking para ciudades más eficientes</h3>
          <p>
            ParkLink nació con la misión de optimizar el espacio urbano y mejorar la
            movilidad en nuestras ciudades. A través de tecnología avanzada, conectamos a
            conductores en búsqueda de estacionamiento con propietarios de espacios
            disponibles, creando un ecosistema que ahorra tiempo, reduce el estrés y
            disminuye el impacto ambiental del tráfico.
          </p>
        </div>
        <div className="about-panel">
          <div className="about-panel-heading">
            <span className="about-symbol"><MapIcon /></span>
            <h3>Smart parking, real-time booking &amp; urban mobility</h3>
          </div>
          <div className="platform-grid">
            {PLATFORM_FEATURES.map((feature) => {
              const Icon = feature.icon

              return (
                <div className="platform-feature" key={feature.title}>
                  <Icon />
                  <span>{feature.title}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section className="section section-soft" id="como-funciona" aria-labelledby="steps-title">
      <div className="section-container centered-stack">
        <div className="section-heading">
          <h2 id="steps-title">Cómo funciona ParkLink</h2>
          <p>Tres simples pasos para una experiencia de estacionamiento sin estrés.</p>
        </div>
        <div className="steps-grid">
          <div className="steps-line" aria-hidden="true" />
          {STEPS.map((step, index) => (
            <article className="step-card" key={step.title}>
              <span className="step-number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
        <aside className="owner-callout" aria-labelledby="owner-callout-title">
          <span>
            <h3 id="owner-callout-title">¿Tienes una cochera disponible?</h3>
            <p>Conviértela en una fuente de ingresos extra publicándola en ParkLink.</p>
          </span>
          <a className="button button-soft" href="#beneficios">
            Saber más para propietarios
          </a>
        </aside>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section className="section" id="funcionalidades" aria-labelledby="features-title">
      <div className="section-container centered-stack">
        <div className="section-heading">
          <h2 id="features-title">Todo lo que necesitas en una sola app</h2>
        </div>
        <div className="features-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon

            return (
              <article className="feature-card" key={feature.title}>
                <span className="feature-icon"><Icon /></span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  return (
    <section className="section section-muted" id="beneficios" aria-labelledby="benefits-title">
      <div className="section-container benefits-grid">
        <h2 id="benefits-title" className="sr-only">
          Beneficios por tipo de usuario
        </h2>
        {BENEFITS.map((benefit) => {
          const Icon = benefit.icon

          return (
            <article className="benefit-card" data-tone={benefit.tone} key={benefit.title}>
              <div className="benefit-title-row">
                <span className="benefit-icon"><Icon /></span>
                <h3>{benefit.title}</h3>
              </div>
              <ul className="check-list benefit-list">
                {benefit.items.map((item) => (
                  <li key={item}>
                    <span className="check-mark"><CheckIcon /></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                className={benefit.tone === 'driver' ? 'button button-primary full-width' : 'button button-outline full-width'}
                href="#cta"
              >
                {benefit.button}
              </a>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function ImpactSection() {
  return (
    <section className="section impact-section" aria-labelledby="impact-title">
      <div className="section-container centered-stack compact-stack">
        <div className="section-heading section-heading-wide">
          <h2 id="impact-title">Movilidad más inteligente para la ciudad</h2>
          <p>
            ParkLink no solo ayuda a individuos, sino que contribuye a crear ciudades más
            eficientes y sostenibles.
          </p>
        </div>
        <div className="stats-grid">
          {STATS.map((stat, index) => {
            const Icon = stat.icon

            return (
              <article className="stat-card" data-tone={stat.tone} key={stat.label}>
                <span className="stat-icon"><Icon /></span>
                <strong>
                  <ScrambledMetricValue value={stat.value} delayMs={index * 140} />
                </strong>
                <span className="stat-label">{stat.label}</span>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  return (
    <section className="section section-very-soft" id="autores" aria-labelledby="team-title">
      <div className="section-container centered-stack">
        <div className="section-heading section-heading-wide">
          <h2 id="team-title">Autores del proyecto</h2>
          <p>
            Equipo ParkTeam — estudiantes de Ingeniería de Software responsables del diseño
            y desarrollo conceptual de ParkLink.
          </p>
        </div>
        <div className="team-grid">
          {TEAM.map((member) => (
            <article className="member-card" key={member.initials}>
              <div className="avatar-wrapper">
                <img
                  className="avatar-image"
                  src={member.image}
                  alt={member.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'grid';
                  }}
                />
                <span className="avatar" style={{ display: 'none' }}>{member.initials}</span>
              </div>
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-copy">{member.contribution}</p>
              <span className="team-pill">ParkTeam</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

type ComparisonStatus = (typeof COMPARISON)[number]['parkLink' | 'traditional']

function StatusCell({ status }: { status: ComparisonStatus }) {
  if (status === 'yes') {
    return (
      <span className="status status-yes" aria-label="Disponible">
        <CheckIcon />
      </span>
    )
  }

  if (status === 'no') {
    return (
      <span className="status status-no" aria-label="No disponible">
        <CrossIcon />
      </span>
    )
  }

  return (
    <span className="status status-partial" aria-label="Limitado">
      —
    </span>
  )
}

function ComparisonSection() {
  return (
    <section className="section section-muted" aria-labelledby="comparison-title">
      <div className="section-container centered-stack">
        <div className="section-heading">
          <h2 id="comparison-title">¿Por qué elegir ParkLink?</h2>
        </div>
        <div className="comparison-scroll" role="region" aria-label="Comparación entre ParkLink y apps tradicionales" tabIndex={0}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Característica</th>
                <th scope="col">ParkLink</th>
                <th scope="col">Apps Tradicionales</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{row.feature}</th>
                  <td><StatusCell status={row.parkLink} /></td>
                  <td><StatusCell status={row.traditional} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="section cta-section" id="cta" aria-labelledby="cta-title">
      <div className="section-container cta-container">
        <h2 id="cta-title">Empieza a moverte mejor con ParkLink</h2>
        <p>
          Únete a miles de conductores y propietarios que ya están transformando la
          movilidad en la ciudad.
        </p>
        <p className="cta-note">
          <CheckIcon /> Reserva segura · disponibilidad en tiempo real · pagos digitales
        </p>
        <div className="cta-actions">
          <a className="button button-primary button-large" href="#inicio">
            Buscar estacionamiento
          </a>
          <a className="button button-dark-outline button-large" href="#beneficios">
            Publicar mi cochera
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-container footer-grid">
        <div className="footer-brand">
          <strong>ParkLink</strong>
          <p>© 2026 ParkTeam. Infraestructura inteligente para ciudades modernas.</p>
          <p className="footer-note">
            Proyecto académico desarrollado por ParkTeam para el curso Fundamentos de
            Arquitectura de Software.
          </p>
          <p className="footer-product">Producto: ParkLink</p>
        </div>
        <nav aria-label="Enlaces legales">
          <h2>Legal</h2>
          <a href="#inicio">Aviso de Privacidad</a>
          <a href="#inicio">Términos de Servicio</a>
        </nav>
        <nav aria-label="Soporte">
          <h2>Soporte</h2>
          <a href="#inicio">Soporte Técnico</a>
          <a href="#inicio">Preguntas Frecuentes</a>
        </nav>
      </div>
    </footer>
  )
}

function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <AboutSection />
        <HowItWorksSection />
        <FeaturesSection />
        <BenefitsSection />
        <ImpactSection />
        <TeamSection />
        <ComparisonSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}

export default App
