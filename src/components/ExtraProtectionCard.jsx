import ProductImage from './ProductImage.jsx'

const formatMoney = (value) => `$${value.toFixed(2)}`

export default function ExtraProtectionCard({ product, onToggle }) {
  const selected = product.selectedQuantity > 0

  return (
    <article
      className={`extra-protection-card${selected ? ' extra-protection-card--selected' : ''}`}
    >
      <ProductImage product={product} />
      <div className="extra-protection-card__content">
        <h3>{product.name}</h3>
        <p>
          {product.description} <a href={`#${product.id}`}>Learn More</a>
        </p>
      </div>
      <div className="extra-protection-card__action">
        <strong>{formatMoney(product.price)}</strong>
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => onToggle(product.id)}
        >
          {selected ? 'Added ✓' : 'Add'}
        </button>
      </div>
    </article>
  )
}
