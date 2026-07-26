import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './BounceCards.css'

export interface BounceCardImage {
  src: string
  alt: string
}

interface BounceCardsProps {
  className?: string
  images?: BounceCardImage[]
  containerWidth?: number
  containerHeight?: number
  animationDelay?: number
  animationStagger?: number
  easeType?: string
  transformStyles?: string[]
  enableHover?: boolean
}

const defaultTransforms = [
  'translate(-150px) rotate(-7deg)',
  'rotate(1deg)',
  'translate(150px) rotate(7deg)',
]

function withoutRotation(transform: string) {
  if (/rotate\([\s\S]*?\)/.test(transform)) {
    return transform.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)')
  }

  return transform === 'none'
    ? 'rotate(0deg)'
    : `${transform} rotate(0deg)`
}

function withHorizontalOffset(transform: string, offset: number) {
  const translatePattern = /translate\(([-0-9.]+)px\)/
  const match = transform.match(translatePattern)

  if (match) {
    const translatedX = Number.parseFloat(match[1]) + offset
    return transform.replace(
      translatePattern,
      `translate(${translatedX}px)`,
    )
  }

  return transform === 'none'
    ? `translate(${offset}px)`
    : `${transform} translate(${offset}px)`
}

export default function BounceCards({
  className = '',
  images = [],
  containerWidth = 760,
  containerHeight = 620,
  animationDelay = 0.2,
  animationStagger = 0.1,
  easeType = 'elastic.out(1, 0.65)',
  transformStyles = defaultTransforms,
  enableHover = true,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce), (max-width: 680px)',
    ).matches
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.bounce-card')
      if (reduceMotion) {
        gsap.set(cards, { scale: 1, opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        cards,
        { scale: 0.35, opacity: 0, y: 42 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
          duration: 0.8,
        },
      )
    }, container)

    return () => context.revert()
  }, [
    animationDelay,
    animationStagger,
    easeType,
    images.length,
    transformStyles,
  ])

  const canAnimateHover = () =>
    enableHover &&
    !window.matchMedia(
      '(prefers-reduced-motion: reduce), (hover: none), (max-width: 680px)',
    ).matches

  const pushSiblings = (hoveredIndex: number) => {
    if (!canAnimateHover() || !containerRef.current) return

    const select = gsap.utils.selector(containerRef)
    images.forEach((_, index) => {
      const card = select(`.bounce-card-${index}`)
      const baseTransform = transformStyles[index] ?? 'none'
      gsap.killTweensOf(card)

      if (index === hoveredIndex) {
        gsap.to(card, {
          transform: withoutRotation(baseTransform),
          zIndex: images.length + 2,
          duration: 0.38,
          ease: 'back.out(1.25)',
          overwrite: 'auto',
        })
        return
      }

      const offset = index < hoveredIndex ? -105 : 105
      gsap.to(card, {
        transform: withHorizontalOffset(baseTransform, offset),
        zIndex: index + 1,
        duration: 0.38,
        ease: 'back.out(1.25)',
        delay: Math.abs(hoveredIndex - index) * 0.035,
        overwrite: 'auto',
      })
    })
  }

  const resetSiblings = () => {
    if (!canAnimateHover() || !containerRef.current) return

    const select = gsap.utils.selector(containerRef)
    images.forEach((_, index) => {
      const card = select(`.bounce-card-${index}`)
      gsap.killTweensOf(card)
      gsap.to(card, {
        transform: transformStyles[index] ?? 'none',
        zIndex: index + 1,
        duration: 0.38,
        ease: 'back.out(1.25)',
        overwrite: 'auto',
      })
    })
  }

  return (
    <div
      className={`bounce-cards${className ? ` ${className}` : ''}`}
      ref={containerRef}
      style={{
        width: `min(${containerWidth}px, 100%)`,
        height: containerHeight,
      }}
      aria-label="个人生活影像"
    >
      {images.map((image, index) => (
        <div
          className={`bounce-card bounce-card-${index}`}
          key={image.src}
          style={{
            transform: transformStyles[index] ?? 'none',
            zIndex: index + 1,
          }}
          onMouseEnter={() => pushSiblings(index)}
          onMouseLeave={resetSiblings}
        >
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
          />
          <span aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
  )
}
