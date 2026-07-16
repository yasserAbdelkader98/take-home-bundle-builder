import { useEffect, useState } from 'react'

export default function ProductImage({ product, image, compact = false }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageSource = (image ?? product.image)?.replace(/^\/https?:\/\//, (url) =>
    url.slice(1),
  )

  useEffect(() => {
    setImageFailed(false)
  }, [imageSource])

  return (
    <div
      className={`product-image-placeholder${compact ? ' product-image-placeholder--compact' : ''}`}
    >
      {imageSource && !imageFailed ? (
        <img
          src={imageSource}
          alt={product.name}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : null}
      <span hidden={Boolean(imageSource) && !imageFailed}>
        {product.name.split(' ').slice(1, 3).join(' ')}
      </span>
    </div>
  )
}
