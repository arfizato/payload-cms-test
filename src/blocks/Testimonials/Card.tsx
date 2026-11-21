import Image from 'next/image'
import React from 'react'

import type { Testimonial } from './types'

const Star: React.FC = () => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" className="flex-none">
    <path
      d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4L2.8 9.3l6.4-.8z"
      fill="currentColor"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1"
    />
  </svg>
)

/**
 * One testimonial: who said it, the stars, the quote. White on cream, 24px
 * radius and padding, straight from the design.
 *
 * No hooks, so it renders wherever it is imported — inside the client-side
 * carousel today.
 */
export const TestimonialCard: React.FC<{ item: Testimonial }> = ({ item }) => {
  const rating = Math.max(0, Math.min(5, Math.round(item.rating ?? 5)))

  return (
    <figure className="flex h-full flex-col gap-6 rounded-3xl bg-paper p-6">
      <figcaption className="flex items-center gap-4">
        {item.image &&
          (item.image.kind === 'avatar' ? (
            <Image
              className="size-14 flex-none rounded-full bg-ink/10 object-cover"
              src={item.image.src}
              alt=""
              width={56}
              height={56}
            />
          ) : (
            // Logos keep their own proportions inside a 48px-tall slot.
            <Image
              className="h-12 w-auto max-w-[72px] flex-none object-contain"
              src={item.image.src}
              alt={item.image.alt}
              width={item.image.width}
              height={item.image.height}
            />
          ))}

        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="font-serif text-[20px] leading-[1.25] font-semibold text-ink">
            {item.author}
          </span>
          {item.role && (
            <span className="text-[16px] leading-[1.2] font-medium text-ink/60">{item.role}</span>
          )}
        </span>
      </figcaption>

      <span aria-hidden="true" className="block h-px w-full bg-ink/8" />

      <div className="flex flex-col gap-3">
        {rating > 0 && (
          <p className="flex gap-0.5 text-rating" aria-label={`${rating} sur 5`} role="img">
            {Array.from({ length: rating }, (_, i) => (
              <Star key={i} />
            ))}
          </p>
        )}

        <blockquote className="text-[clamp(1rem,1.25vw,1.125rem)] leading-[1.9] font-medium text-ink">
          {item.quote}
        </blockquote>
      </div>
    </figure>
  )
}
