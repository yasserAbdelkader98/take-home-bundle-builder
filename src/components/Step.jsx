import ExtraProtectionCard from './ExtraProtectionCard.jsx'
import PlanCard from './PlanCard.jsx'
import ProductCard from './ProductCard.jsx'

export default function Step({
  step,
  isOpen,
  onToggle,
  onNext,
  onSelectVariant,
  onProductQuantityChange,
  onPlanSelect,
  onExtraProtectionToggle,
}) {
  const selectedCount = step.products.filter((product) => {
    if (product.variants.length) {
      return product.variants.some((variant) => variant.selectedQuantity > 0)
    }
    return product.selectedQuantity > 0
  }).length

  return (
    <section className={`builder-step${isOpen ? ' builder-step--open' : ''}`}>
      <div className="step-eyebrow">Step {step.number} of 4</div>
      <button
        className="step-header"
        type="button"
        aria-expanded={isOpen}
        aria-controls={`step-content-${step.id}`}
        onClick={onToggle}
      >
        <span className="step-title">
          <span className="step-icon" aria-hidden="true">
            <img src={step.icon} alt="" />
          </span>
          {step.title}
        </span>
        <span className="step-state">
          <span className="selected-count">{selectedCount} selected</span>
          <span className="chevron">{isOpen ? '\u25b4' : '\u25be'}</span>
        </span>
      </button>

      {isOpen && (
        <div className="step-content" id={`step-content-${step.id}`}>
          {step.step_type === 'plans' ? (
            <div className="plan-options" role="radiogroup" aria-label={step.title}>
              {step.products.map((product) => (
                <PlanCard key={product.id} product={product} onSelect={onPlanSelect} />
              ))}
            </div>
          ) : step.step_type === 'extra_protection' ? (
            <div className="extra-protection-options">
              {step.products.map((product) => (
                <ExtraProtectionCard
                  key={product.id}
                  product={product}
                  onToggle={onExtraProtectionToggle}
                />
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {step.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectVariant={onSelectVariant}
                  onQuantityChange={(productId, change) =>
                    onProductQuantityChange(step.id, productId, change)
                  }
                />
              ))}
            </div>
          )}
          <button className="next-button" type="button" onClick={onNext}>
            {step.nextLabel}
          </button>
        </div>
      )}
    </section>
  )
}
