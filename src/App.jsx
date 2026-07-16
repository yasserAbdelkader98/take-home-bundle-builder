import { useState } from 'react'
import ReviewPanel from './components/ReviewPanel.jsx'
import Step from './components/Step.jsx'
import data from './data.json'

const STORAGE_KEY = 'wyze-bundle-builder-configuration'
const DEFAULT_MAX_QUANTITY = 1
const INITIAL_VARIANT_QUANTITIES = {
  'wyze-cam-v4:white': 1,
  'wyze-cam-pan-v3:white': 2,
}
const INITIAL_PRODUCT_QUANTITIES = {
  'cam-unlimited': 1,
  'wyze-sense-motion-sensor': 2,
  'wyze-sense-hub': 1,
  'wyze-microsd-card-256gb': 2,
}

const clampQuantity = (quantity, maximumQuantity = DEFAULT_MAX_QUANTITY) =>
  Math.min(maximumQuantity, Math.max(0, quantity))

export default function App() {
  const [initialConfiguration] = useState(() => {
    try {
      const savedConfiguration = localStorage.getItem(STORAGE_KEY)
      return savedConfiguration ? JSON.parse(savedConfiguration) : null
    } catch {
      return null
    }
  })
  const [steps, setSteps] = useState(() => {
    const freshSteps = structuredClone(data.steps).map((step) => ({
      ...step,
      products: step.products.map((product) => ({
        ...product,
        selectedQuantity: clampQuantity(
          INITIAL_PRODUCT_QUANTITIES[product.id] ?? 0,
          product.maxQuantity,
        ),
        variants: product.variants.map((variant) => ({
          ...variant,
          selectedQuantity: clampQuantity(
            INITIAL_VARIANT_QUANTITIES[`${product.id}:${variant.id}`] ?? 0,
            variant.maxQuantity,
          ),
        })),
      })),
    }))
    if (!initialConfiguration?.steps) return freshSteps

    return freshSteps.map((step) => {
      const savedStep = initialConfiguration.steps.find(
        (candidate) => candidate.id === step.id,
      )
      if (!savedStep) return step

      return {
        ...step,
        products: step.products.map((product) => {
          const savedProduct = savedStep.products.find(
            (candidate) => candidate.id === product.id,
          )
          if (!savedProduct) return product

          return {
            ...product,
            selectedQuantity: clampQuantity(
              savedProduct.selectedQuantity ??
                savedProduct.quantity ??
                product.selectedQuantity,
              product.maxQuantity,
            ),
            activeVariantId:
              savedProduct.activeVariantId ?? product.activeVariantId,
            variants: product.variants.map((variant) => {
              const savedVariant = savedProduct.variants?.find(
                (candidate) => candidate.id === variant.id,
              )
              return {
                ...variant,
                selectedQuantity: clampQuantity(
                  savedVariant?.selectedQuantity ??
                    savedVariant?.quantity ??
                    variant.selectedQuantity,
                  variant.maxQuantity,
                ),
              }
            }),
          }
        }),
      }
    })
  })
  const [seededReviewItems, setSeededReviewItems] = useState(() => {
    const freshItems = structuredClone(data.seededReviewItems)
    if (!initialConfiguration?.seededReviewItems) return freshItems

    return freshItems.map((item) => {
      const savedItem = initialConfiguration.seededReviewItems.find(
        (candidate) => candidate.id === item.id,
      )
      return {
        ...item,
        quantity: clampQuantity(
          savedItem?.quantity ?? item.quantity,
          item.maxQuantity,
        ),
      }
    })
  })
  const [openStepId, setOpenStepId] = useState(
    () => initialConfiguration?.openStepId ?? 'cameras',
  )
  const [saveStatus, setSaveStatus] = useState(
    initialConfiguration ? 'Saved system restored.' : '',
  )

  const updateStepProduct = (stepId, productId, updateProduct) => {
    setSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.id !== stepId
          ? step
          : {
              ...step,
              products: step.products.map((product) =>
                product.id === productId ? updateProduct(product) : product,
              ),
            },
      ),
    )
  }

  const handleSelectVariant = (productId, variantId) => {
    updateStepProduct('cameras', productId, (product) => ({
      ...product,
      activeVariantId: variantId,
    }))
  }

  const handleProductQuantityChange = (stepId, productId, change) => {
    updateStepProduct(stepId, productId, (product) => {
      if (!product.variants.length) {
        const minimumQuantity = product.minimumQuantity ?? 0
        const maximumQuantity = product.maxQuantity ?? DEFAULT_MAX_QUANTITY
        return {
          ...product,
          selectedQuantity: Math.min(
            maximumQuantity,
            Math.max(minimumQuantity, product.selectedQuantity + change),
          ),
        }
      }

      return {
        ...product,
        variants: product.variants.map((variant) =>
          variant.id === product.activeVariantId
            ? {
                ...variant,
                selectedQuantity: Math.min(
                  variant.maxQuantity ?? DEFAULT_MAX_QUANTITY,
                  Math.max(0, variant.selectedQuantity + change),
                ),
              }
            : variant,
        ),
      }
    })

    if (stepId !== 'cameras') {
      setSeededReviewItems((currentItems) =>
        currentItems.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.min(
                  item.maxQuantity ?? DEFAULT_MAX_QUANTITY,
                  Math.max(0, item.quantity + change),
                ),
              }
            : item,
        ),
      )
    }
  }

  const handleCameraReviewQuantityChange = (item, change) => {
    updateStepProduct('cameras', item.productId, (product) => {
      if (!product.variants.length) {
        return {
          ...product,
          selectedQuantity: clampQuantity(
            product.selectedQuantity + change,
            product.maxQuantity,
          ),
        }
      }

      return {
        ...product,
        variants: product.variants.map((variant) =>
          variant.id === item.variantId
            ? {
                ...variant,
                selectedQuantity: Math.min(
                  variant.maxQuantity ?? DEFAULT_MAX_QUANTITY,
                  Math.max(0, variant.selectedQuantity + change),
                ),
              }
            : variant,
        ),
      }
    })
  }

  const handleSeededItemQuantityChange = (item, change) => {
    const nextQuantity = Math.min(
      item.maxQuantity ?? DEFAULT_MAX_QUANTITY,
      Math.max(0, item.quantity + change),
    )

    setSeededReviewItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.id === item.id
          ? { ...currentItem, quantity: nextQuantity }
          : currentItem,
      ),
    )

    const stepId = item.category === 'Sensors' ? 'sensors' : 'accessories'
    updateStepProduct(stepId, item.id, (product) => ({
      ...product,
      selectedQuantity: nextQuantity,
    }))
  }

  const handlePlanSelect = (productId) => {
    setSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.step_type !== 'plans'
          ? step
          : {
              ...step,
              products: step.products.map((product) => ({
                ...product,
                selectedQuantity: product.id === productId ? 1 : 0,
              })),
            },
      ),
    )
  }

  const handleExtraProtectionToggle = (productId) => {
    const product = steps
      .find((step) => step.step_type === 'extra_protection')
      ?.products.find((candidate) => candidate.id === productId)
    const nextQuantity = product?.selectedQuantity > 0 ? 0 : 1

    updateStepProduct('accessories', productId, (currentProduct) => ({
      ...currentProduct,
      selectedQuantity: nextQuantity,
    }))
    setSeededReviewItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: nextQuantity } : item,
      ),
    )
  }

  const handleToggleStep = (stepId) => {
    setOpenStepId((currentStepId) =>
      currentStepId === stepId ? null : stepId,
    )
  }

  const handleNextStep = (stepNumber) => {
    const nextStep = steps.find((step) => step.number === stepNumber + 1)
    setOpenStepId(nextStep?.id ?? null)
  }

  const handleSave = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ steps, seededReviewItems, openStepId }),
      )
      setSaveStatus('Your system has been saved.')
    } catch {
      setSaveStatus('Your system could not be saved in this browser.')
    }
  }

  const handleCheckout = () => {
    window.alert(
      'Checkout is a prototype placeholder. Your configured system is ready!',
    )
  }

  return (
    <main className="bundle-builder">
      <div className="builder">
        {steps.map((step) => (
          <Step
            key={step.id}
            step={step}
            isOpen={step.id === openStepId}
            onToggle={() => handleToggleStep(step.id)}
            onNext={() => handleNextStep(step.number)}
            onSelectVariant={handleSelectVariant}
            onProductQuantityChange={handleProductQuantityChange}
            onPlanSelect={handlePlanSelect}
            onExtraProtectionToggle={handleExtraProtectionToggle}
          />
        ))}
      </div>
      <ReviewPanel
        steps={steps}
        seededReviewItems={seededReviewItems}
        onCameraQuantityChange={handleCameraReviewQuantityChange}
        onSeededItemQuantityChange={handleSeededItemQuantityChange}
        onCheckout={handleCheckout}
        onSave={handleSave}
        saveStatus={saveStatus}
      />
    </main>
  )
}
