import data from '../data.json'
import ReviewItem from './ReviewItem.jsx'

const formatMoney = (value) => `$${value.toFixed(2)}`

export default function ReviewPanel({
  steps,
  seededReviewItems,
  onCameraQuantityChange,
  onSeededItemQuantityChange,
  onCheckout,
  onSave,
  saveStatus,
}) {
  const cameraItems = steps[0].products.flatMap((product) => {
    if (product.variants.length) {
      return product.variants
        .filter((variant) => variant.selectedQuantity > 0)
        .map((variant) => ({
          id: `${product.id}-${variant.id}`,
          category: 'Cameras',
          name: `${product.name} — ${variant.name}`,
          image: variant.image ?? product.image,
          quantity: variant.selectedQuantity,
          maxQuantity: variant.maxQuantity,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          productId: product.id,
          variantId: variant.id,
          source: 'product',
        }))
    }

    return product.selectedQuantity > 0
      ? [{
          ...product,
          quantity: product.selectedQuantity,
          category: 'Cameras',
          productId: product.id,
          source: 'product',
        }]
      : []
  })

  const items = [
    ...cameraItems,
    ...seededReviewItems
      .filter((item) => item.quantity > 0)
      .map((item) => ({ ...item, source: 'seeded' })),
  ]
  const categories = ['Cameras', 'Sensors', 'Accessories']
  const selectedPlan =
    steps
      .find((step) => step.step_type === 'plans')
      ?.products.find((product) => product.selectedQuantity > 0) ?? data.plan
  const merchandiseTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
  const merchandiseCompareAtTotal = items.reduce(
    (total, item) =>
      total + (item.compareAtPrice ?? item.price) * item.quantity,
    0,
  )
  const total = merchandiseTotal + selectedPlan.price + data.shipping.price
  const compareAtTotal =
    merchandiseCompareAtTotal +
    (selectedPlan.compareAtPrice ?? selectedPlan.price) +
    data.shipping.compareAtPrice
  const savings = Math.max(0, compareAtTotal - total)
  const installmentPrice = total / data.financing.installments

  return (
    <aside className="review-panel">
      <div className="review-main">
        <div className="review-eyebrow">{data.review.eyebrow}</div>
        <h1>{data.review.title}</h1>
        <p className="review-description">{data.review.description}</p>

        <div className="review-groups">
          {categories.map((category) => (
            <section className="review-group" key={category}>
              <h2>{category}</h2>
              {items
                .filter((item) => item.category === category)
                .map((item) => (
                  <ReviewItem
                    item={item}
                    key={item.id}
                    onQuantityChange={
                      item.source === 'product'
                        ? onCameraQuantityChange
                        : onSeededItemQuantityChange
                    }
                  />
                ))}
            </section>
          ))}

          <section className="review-group plan-group">
            <h2>{data.plan.category}</h2>
            <div className="plan-line">
              <span className="plan-mark">W</span>
              <strong>{selectedPlan.name}</strong>
              <div className="review-line__price">
                {selectedPlan.compareAtPrice && (
                  <del>
                    {formatMoney(selectedPlan.compareAtPrice)}
                    {selectedPlan.billingSuffix}
                  </del>
                )}
                <span>
                  {formatMoney(selectedPlan.price)}
                  {selectedPlan.billingSuffix}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="shipping-line">
          <span className="shipping-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img">
              <path d="M3 5.5h11v11H3z" />
              <path d="M14 9h3.5L21 12.5v4H14z" />
              <circle cx="7" cy="18" r="2" />
              <circle cx="18" cy="18" r="2" />
              <path d="M3 14h18" />
            </svg>
          </span>
          <span>{data.shipping.name}</span>
          <div className="review-line__price">
            <del>{formatMoney(data.shipping.compareAtPrice)}</del>
            <strong>{data.shipping.priceLabel}</strong>
          </div>
        </div>
      </div>

      <div className="review-checkout">
        <div className="summary-area">
          <div className="guarantee-badge">
            <strong>100%</strong>
            <span>Wyze satisfaction guarantee</span>
          </div>
          <p className="returns-copy">
            <strong>30-day hassle-free returns</strong>
            If you’re not totally in love with the product, we will refund you 100%.
          </p>
          <div className="summary-price">
            <span className="finance-label">
              as low as {formatMoney(installmentPrice)}/mo
            </span>
            <div>
              {savings > 0 && <del>{formatMoney(compareAtTotal)}</del>}
              <strong>{formatMoney(total)}</strong>
            </div>
          </div>
        </div>
        <p className="savings-message">
          Congrats! You’re saving {formatMoney(savings)} on your security bundle!
        </p>
        <button className="checkout-button" type="button" onClick={onCheckout}>
          {data.review.checkoutLabel}
        </button>
        <button className="save-link" type="button" onClick={onSave}>
          {data.review.saveLabel}
        </button>
        <span className="save-status" role="status" aria-live="polite">
          {saveStatus}
        </span>
      </div>
    </aside>
  )
}
