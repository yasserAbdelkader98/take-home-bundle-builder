import ProductImage from './ProductImage.jsx'
import QuantityStepper from './QuantityStepper.jsx'

const formatMoney = (value) => `$${value.toFixed(2)}`

export default function ProductCard({
  product,
  onSelectVariant,
  onQuantityChange,
}) {
  const activeVariant = product.variants.find(
    (variant) => variant.id === product.activeVariantId,
  )
  const quantity = product.variants.length
    ? activeVariant?.selectedQuantity ?? 0
    : product.selectedQuantity
  const selected = product.variants.length
    ? product.variants.some((variant) => variant.selectedQuantity > 0)
    : product.selectedQuantity > 0

  return (
    <article className={`product-card${selected ? ' product-card--selected' : ''}`}>
      {product.badge && <span className="discount-badge">{product.badge}</span>}
      <ProductImage
        key={activeVariant?.id ?? product.id}
        product={product}
        image={activeVariant?.image}
      />
      <div className="product-card__content">
        <h3>{product.name}</h3>
        <p>
          {product.description} <a href={`#${product.id}`}>Learn More</a>
        </p>
        {product.variants.length > 0 && (
          <div className="variants" aria-label={`${product.name} colors`}>
            {product.variants.map((variant) => (
              <button
                className={variant.id === product.activeVariantId ? 'is-active' : ''}
                key={variant.id}
                type="button"
                aria-pressed={variant.id === product.activeVariantId}
                onClick={() => onSelectVariant(product.id, variant.id)}
              >
                <span
                  className="variant-swatch"
                  style={{ backgroundColor: variant.swatch }}
                />
                {variant.name}
              </button>
            ))}
          </div>
        )}
        <div className="product-card__footer">
          <QuantityStepper
            quantity={quantity}
            minimumQuantity={product.minimumQuantity}
            maximumQuantity={
              product.variants.length
                ? activeVariant?.maxQuantity
                : product.maxQuantity
            }
            onDecrease={() => onQuantityChange(product.id, -1)}
            onIncrease={() => onQuantityChange(product.id, 1)}
          />
          <div className="price">
            {product.compareAtPrice && (
              <del>{formatMoney(product.compareAtPrice)}</del>
            )}
            <span>{formatMoney(product.price)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
