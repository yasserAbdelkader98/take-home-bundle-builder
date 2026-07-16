const formatMoney = (value) => `$${value.toFixed(2)}`

export default function PlanCard({ product, onSelect }) {
  const selected = product.selectedQuantity > 0

  return (
    <button
      className={`plan-card${selected ? ' plan-card--selected' : ''}`}
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(product.id)}
    >
      {product.badge && <span className="plan-card__badge">{product.badge}</span>}
      <span className="plan-card__mark">W</span>
      <span className="plan-card__content">
        <strong>{product.name}</strong>
        <span>{product.description}</span>
      </span>
      <span className="plan-card__price">
        {product.compareAtPrice && (
          <del>
            {formatMoney(product.compareAtPrice)}
            {product.billingSuffix}
          </del>
        )}
        <strong>
          {formatMoney(product.price)}
          {product.billingSuffix}
        </strong>
      </span>
      <span className="plan-card__radio" aria-hidden="true" />
    </button>
  )
}
