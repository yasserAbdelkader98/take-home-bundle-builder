const DEFAULT_MAX_QUANTITY = 1

export default function QuantityStepper({
  quantity,
  minimumQuantity = 0,
  maximumQuantity = DEFAULT_MAX_QUANTITY,
  onDecrease,
  onIncrease,
}) {
  const reachedMaximum = quantity >= maximumQuantity

  return (
    <div className="quantity-stepper" aria-label={`Quantity ${quantity}`}>
      <button
        type="button"
        disabled={quantity <= minimumQuantity}
        aria-label="Decrease quantity"
        onClick={onDecrease}
      >
        {'\u2212'}
      </button>
      <span>{quantity}</span>
      <button
        type="button"
        disabled={reachedMaximum}
        title={reachedMaximum ? 'Empty stock' : undefined}
        aria-label="Increase quantity"
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  )
}
