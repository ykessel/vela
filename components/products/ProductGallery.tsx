'use client'

import { useState } from 'react'
import Image from 'next/image'

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-2">
        {images[active] ? (
          <Image src={images[active]} alt={name} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-muted/20">📦</div>
        )}
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                i === active ? 'border-text' : 'border-border hover:border-text/30'
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
