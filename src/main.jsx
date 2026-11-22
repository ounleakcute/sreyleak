import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

// ==================== PRODUCT DATA ====================
const products = [
  {
    id: 1,
    name: 'Minimal Ceramic Vase',
    category: 'HOME DECOR',
    price: 18.90,
    emoji: '🏺',
    color: '#f1e5d7',
    desc: 'A timeless accent for any space.',
  },
  {
    id: 2,
    name: 'Everyday Tote Bag',
    category: 'ACCESSORIES',
    price: 24.50,
    emoji: '👜',
    color: '#e7e6d9',
    desc: 'Your daily essentials, carried simply.',
  },
  {
    id: 3,
    name: 'Cozy Knit Sweater',
    category: 'CLOTHING',
    price: 39.90,
    emoji: '🧶',
    color: '#e9d9d5',
    desc: 'Soft comfort for slow mornings.',
  },
  {
    id: 4,
    name: 'Scented Candle',
    category: 'WELLNESS',
    price: 15.00,
    emoji: '🕯️',
    color: '#e4e5ec',
    desc: 'A gentle scent to unwind.',
  },
];

// ==================== HELPER ====================
const money = (amount) => `$${amount.toFixed(2)}`;

// ==================== MAIN APP ====================
function App() {
  // States
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState('shop');
  const [order, setOrder] = useState(null);

  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    method: 'Standard delivery',
    paymentMethod: 'ABA KHQR', // បន្ថែមវិធីទូទាត់ប្រាក់
  });

  // Cart calculations
  const cartCount = cart.reduce(
    (total, item) => total + item.qty,
    0
  );

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const shipping =
    subtotal === 0
      ? 0
      : customer.method === 'Express delivery'
        ? 8
        : 5;

  const grandTotal = subtotal + shipping;

  // ==================== CART FUNCTIONS ====================

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, qty: 1 }];
    });
  };

  const changeQuantity = (id, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty + amount }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  // ==================== CUSTOMER FUNCTIONS ====================

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;

    setCustomer((currentCustomer) => ({
      ...currentCustomer,
      [name]: value,
    }));
  };

  // ==================== CHECKOUT FUNCTION ====================

  const placeOrder = (event) => {
    event.preventDefault();

    if (cart.length === 0) return;

    const newOrder = {
      id: `ORD-${String(Date.now()).slice(-4)}`,
      date: new Date().toLocaleDateString(),
      customer: `${customer.firstName} ${customer.lastName}`,
      total: grandTotal,
      method: customer.method,
      paymentMethod: customer.paymentMethod, // រក្សាទុកវិធីទូទាត់ក្នុង Order
      items: [...cart],
    };

    setOrder(newOrder);
    setCart([]);
    setPage('confirmation');
  };

  // ==================== PAGE NAVIGATION ====================

  const goToShop = () => setPage('shop');
  const goToCart = () => setPage('cart');
  const goToCheckout = () => setPage('checkout');

  // ==================== UI ====================

  return (
    <div className="app">
      {/* Navigation */}
      <Header
        page={page}
        cartCount={cartCount}
        goToShop={goToShop}
        goToCart={goToCart}
      />

      {/* Shop Page */}
      {page === 'shop' && (
        <ShopPage addToCart={addToCart} />
      )}

      {/* Cart Page */}
      {page === 'cart' && (
        <CartPage
          cart={cart}
          subtotal={subtotal}
          shipping={shipping}
          grandTotal={grandTotal}
          changeQuantity={changeQuantity}
          removeItem={removeItem}
          goToShop={goToShop}
          goToCheckout={goToCheckout}
        />
      )}

      {/* Checkout Page */}
      {page === 'checkout' && (
        <CheckoutPage
          cart={cart}
          customer={customer}
          subtotal={subtotal}
          shipping={shipping}
          grandTotal={grandTotal}
          handleCustomerChange={handleCustomerChange}
          placeOrder={placeOrder}
          goToShop={goToShop}
        />
      )}

      {/* Order Confirmation */}
      {page === 'confirmation' && order && (
        <ConfirmationPage
          order={order}
          goToShop={() => {
            setOrder(null);
            setPage('shop');
          }}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ==================== HEADER ====================
function Header({ page, cartCount, goToShop, goToCart }) {
  return (
    <header>
      <div className="nav">
        <button className="brand" onClick={goToShop}>
          <span className="logo">b.</span>
          bloom <span className="muted">store</span>
        </button>

        <nav>
          <button
            className={page === 'shop' ? 'active' : ''}
            onClick={goToShop}
          >
            Shop
          </button>

          <button
            className={page === 'cart' ? 'active' : ''}
            onClick={goToCart}
          >
            Cart
          </button>
        </nav>

        <button className="cart-btn" onClick={goToCart}>
          🛒 <span>Cart</span>
          <b>{cartCount}</b>
        </button>
      </div>
    </header>
  );
}

// ==================== SHOP PAGE ====================
function ShopPage({ addToCart }) {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div>
          <h1>
            Find your everyday
            <br />
            <em>kind of lovely.</em>
          </h1>

          <button
            className="primary"
            onClick={() =>
              document
                .getElementById('products')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Explore collection ↓
          </button>
        </div>

        <div className="hero-art">
          <div className="hero-circle"></div>
          <span className="hero-emoji">🌷</span>

          <span className="floating">
            Made with
            <br />
            care ♡
          </span>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="section">
        <div className="section-head">
          <div>
            <h2>Our favorites</h2>
          </div>
        </div>

        <div className="products">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

// ==================== PRODUCT CARD ====================
function ProductCard({ product, addToCart }) {
  return (
    <article className="product">
      <div
        className="product-art"
        style={{ background: product.color }}
      >
        <span>{product.emoji}</span>
        <div className="tag">BESTSELLER</div>
      </div>

      <div className="product-info">
        <div>
          <span className="category">
            {product.category}
          </span>

          <h3>{product.name}</h3>

          <p className="desc">{product.desc}</p>
        </div>

        <div className="product-bottom">
          <strong>{money(product.price)}</strong>

          <button
            className="add"
            onClick={() => addToCart(product)}
          >
            ＋ Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

// ==================== CART PAGE ====================
function CartPage({
  cart,
  subtotal,
  shipping,
  grandTotal,
  changeQuantity,
  removeItem,
  goToShop,
  goToCheckout,
}) {
  return (
    <main className="section page">
      <div className="page-heading">
        <p className="eyebrow">YOUR SELECTION</p>
        <h1>Shopping cart</h1>

        <p className="muted">
          {cart.reduce((total, item) => total + item.qty, 0)}
          {' '}
          items in your bag
        </p>
      </div>

      {cart.length === 0 ? (
        <EmptyCart goToShop={goToShop} />
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                changeQuantity={changeQuantity}
                removeItem={removeItem}
              />
            ))}
          </div>

          {/* Order Summary */}
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            grandTotal={grandTotal}
            button="Proceed to checkout"
            onClick={goToCheckout}
          />
        </div>
      )}
    </main>
  );
}

// ==================== CART ITEM ====================
function CartItem({ item, changeQuantity, removeItem }) {
  return (
    <div className="cart-item">
      <div
        className="cart-art"
        style={{ background: item.color }}
      >
        {item.emoji}
      </div>

      <div className="item-detail">
        <span className="category">
          {item.category}
        </span>

        <h3>{item.name}</h3>
        <strong>{money(item.price)}</strong>

        {/* Quantity */}
        <div className="qty">
          <button
            onClick={() => changeQuantity(item.id, -1)}
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span>{item.qty}</span>

          <button
            onClick={() => changeQuantity(item.id, 1)}
            aria-label="Increase quantity"
          >
            ＋
          </button>
        </div>
      </div>

      <div className="item-right">
        <strong>{money(item.price * item.qty)}</strong>

        <button
          className="remove"
          onClick={() => removeItem(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// ==================== EMPTY CART ====================
function EmptyCart({ goToShop }) {
  return (
    <div className="empty">
      <div className="empty-icon">🛍️</div>

      <h2>Your cart is looking lovely and empty.</h2>

      <p className="muted">
        Discover something special to bring home.
      </p>

      <button className="primary" onClick={goToShop}>
        Continue shopping
      </button>
    </div>
  );
}

// ==================== CHECKOUT PAGE ====================
function CheckoutPage({
  cart,
  customer,
  subtotal,
  shipping,
  grandTotal,
  handleCustomerChange,
  placeOrder,
  goToShop,
}) {
  return (
    <main className="section page">
      <div className="page-heading">
        <h1>Checkout</h1>

        <p className="muted">
          Enter your details to complete your order.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="empty">
          <h2>Your cart is empty</h2>

          <button className="primary" onClick={goToShop}>
            Go shopping
          </button>
        </div>
      ) : (
        <form
          className="checkout-layout"
          onSubmit={placeOrder}
        >
          {/* Customer Form */}
          <div className="form-card">
            <h2>Customer information</h2>

            <div className="fields">
              <label>
                First name
                <input
                  name="firstName"
                  value={customer.firstName}
                  onChange={handleCustomerChange}
                  required
                  placeholder="First name"
                />
              </label>

              <label>
                Last name
                <input
                  name="lastName"
                  value={customer.lastName}
                  onChange={handleCustomerChange}
                  required
                  placeholder="Last name"
                />
              </label>

              <label className="full">
                Email address
                <input
                  name="email"
                  type="email"
                  value={customer.email}
                  onChange={handleCustomerChange}
                  required
                  placeholder="you@example.com"
                />
              </label>

              <label className="full">
                Phone number
                <input
                  name="phone"
                  type="tel"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  required
                  placeholder="Phone number"
                />
              </label>

              <label className="full">
                Delivery address
                <textarea
                  name="address"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  required
                  placeholder="Street, city, province..."
                  rows="3"
                />
              </label>
            </div>

            {/* Shipping Method */}
            <h2 className="shipping-title">
              Shipping method
            </h2>

            <ShippingMethod
              customer={customer}
              handleCustomerChange={handleCustomerChange}
            />

            {/* Payment Method + QR Code (ផ្នែកដែលបានបន្ថែមថ្មី) */}
            <h2 className="shipping-title">
              Payment method
            </h2>

            <PaymentMethod
              customer={customer}
              grandTotal={grandTotal}
              handleCustomerChange={handleCustomerChange}
            />
          </div>

          {/* Order Summary */}
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            grandTotal={grandTotal}
            button="Place order"
            submit
          />
        </form>
      )}
    </main>
  );
}

// ==================== SHIPPING METHOD ====================
function ShippingMethod({ customer, handleCustomerChange }) {
  const methods = [
    {
      name: 'Standard delivery',
      description: '3–5 business days',
      price: '$5.00',
    },
    {
      name: 'Express delivery',
      description: '1–2 business days',
      price: '$8.00',
    },
  ];

  return (
    <>
      {methods.map((method) => (
        <label className="method" key={method.name}>
          <input
            type="radio"
            name="method"
            value={method.name}
            checked={customer.method === method.name}
            onChange={handleCustomerChange}
          />

          <span>
            <b>{method.name}</b>
            <small>{method.description}</small>
          </span>

          <strong>{method.price}</strong>
        </label>
      ))}
    </>
  );
}

// ==================== PAYMENT METHOD (ថ្មី) ====================
function PaymentMethod({ customer, grandTotal, handleCustomerChange }) {
  return (
    <div className="payment-section">
      <label className="method">
        <input
          type="radio"
          name="paymentMethod"
          value="ABA KHQR"
          checked={customer.paymentMethod === 'ABA KHQR'}
          onChange={handleCustomerChange}
        />
        <span>
          <b>ABA PAY / KHQR</b>
          <small>Scan QR code to pay instantly</small>
        </span>
        <strong>QR</strong>
      </label>

      <label className="method">
        <input
          type="radio"
          name="paymentMethod"
          value="Cash on Delivery"
          checked={customer.paymentMethod === 'Cash on Delivery'}
          onChange={handleCustomerChange}
        />
        <span>
          <b>Cash on Delivery (COD)</b>
          <small>Pay when your package arrives</small>
        </span>
        <strong>COD</strong>
      </label>

      {/* បង្ហាញរូបភាព QR Code នៅពេលជ្រើសរើស ABA KHQR */}
      {customer.paymentMethod === 'ABA KHQR' && (
        <div className="qr-box">
          <p className="qr-instruction">
            Scan to pay <strong>{money(grandTotal)}</strong> to <b>VEN SREYLEAK</b>
          </p>
          <img
            src="/aba-qr.png"
            alt="ABA Pay QR Code - VEN SREYLEAK"
            className="qr-image"
          />
          <small className="muted">
            Please complete the transfer before clicking "Place order"
          </small>
        </div>
      )}
    </div>
  );
}

// ==================== ORDER SUMMARY ====================
function OrderSummary({
  subtotal,
  shipping,
  grandTotal,
  onClick,
  button,
  submit,
}) {
  return (
    <aside className="summary">
      <h2>Order summary</h2>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>

      <div className="summary-row">
        <span>Delivery</span>
        <span>{money(shipping)}</span>
      </div>

      <div className="summary-row grand">
        <span>Grand total</span>
        <strong>{money(grandTotal)}</strong>
      </div>

      {submit ? (
        <button
          className="primary wide"
          type="submit"
        >
          {button} →
        </button>
      ) : (
        <button
          className="primary wide"
          onClick={onClick}
        >
          {button} →
        </button>
      )}

      <p className="secure">
        ♡ Secure & simple checkout
      </p>
    </aside>
  );
}

// ==================== CONFIRMATION PAGE ====================
function ConfirmationPage({ order, goToShop }) {
  return (
    <main className="section page confirmation">
      <div className="success-icon">✓</div>

      <p className="eyebrow">ORDER CONFIRMATION</p>

      <h1>Thank you for your order!</h1>

      <p className="success-copy">
        Order Placed Successfully!
        We can't wait for your goodies to reach you.
      </p>

      {/* Order Information */}
      <div className="receipt">
        <ReceiptRow label="Order ID" value={order.id} />
        <ReceiptRow label="Customer" value={order.customer} />
        <ReceiptRow label="Order date" value={order.date} />
        <ReceiptRow label="Shipping method" value={order.method} />
        <ReceiptRow label="Payment method" value={order.paymentMethod} />
        <ReceiptRow
          label="Order status"
          value={<span className="pending">Pending</span>}
        />

        <hr />

        <h3>Items ordered</h3>

        {order.items.map((item) => (
          <div className="receipt-item" key={item.id}>
            <span>
              {item.emoji} {item.name} × {item.qty}
            </span>

            <strong>
              {money(item.price * item.qty)}
            </strong>
          </div>
        ))}

        <hr />

        <div className="receipt-total">
          <span>Total amount</span>
          <strong>{money(order.total)}</strong>
        </div>
      </div>

      <button className="primary" onClick={goToShop}>
        Continue shopping
      </button>
    </main>
  );
}

// ==================== RECEIPT ROW ====================
function ReceiptRow({ label, value }) {
  return (
    <div className="receipt-top">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

// ==================== FOOTER ====================
function Footer() {
  return (
    <footer>
      <span>© 2026 bloom store</span>
      <span>Small joys, thoughtfully chosen ♡</span>
    </footer>
  );
}

// ==================== RENDER ====================
createRoot(document.getElementById('root')).render(<App />);