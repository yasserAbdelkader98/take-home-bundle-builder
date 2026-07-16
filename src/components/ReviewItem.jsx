import ProductImage from './ProductImage.jsx'
import QuantityStepper from './QuantityStepper.jsx'

const formatMoney = (value) => `$${value.toFixed(2)}`

export default function ReviewItem({ item, onQuantityChange }) {
  return (
    <div className="review-line">
      <ProductImage product={item} compact />
      <span className="review-line__name">{item.name}</span>
      <QuantityStepper
        quantity={item.quantity}
        minimumQuantity={item.minimumQuantity}
        maximumQuantity={item.maxQuantity}
        onDecrease={() => onQuantityChange(item, -1)}
        onIncrease={() => onQuantityChange(item, 1)}
      />
      <div className="review-line__price">
        {item.compareAtPrice && (
          <del>{formatMoney(item.compareAtPrice * item.quantity)}</del>
        )}
        <strong>
          {item.priceLabel ?? formatMoney(item.price * item.quantity)}
        </strong>
      </div>
    </div>
  )
}
