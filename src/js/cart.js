import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index)
  );

  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  addQuantityListeners();
}

function cartItemTemplate(item, index) {
  const quantity = Number(item.Quantity) || 1;
  const lineTotal = (Number(item.FinalPrice) * quantity).toFixed(2);

  return `<li class="cart-card divider">
    <button
      type="button"
      class="remove-item"
      data-index="${index}"
      data-id="${item.Id}"
      aria-label="Remove ${item.Name} from cart"
      title="Remove item"
    >
      &times;
    </button>

    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>

    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>

    <p class="cart-card__color">${item.Colors[0].ColorName}</p>

    <div class="cart-card__quantity">
      <button
        type="button"
        class="quantity-button"
        data-action="decrease"
        data-index="${index}"
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span>qty: ${quantity}</span>

      <button
        type="button"
        class="quantity-button"
        data-action="increase"
        data-index="${index}"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>

    <p class="cart-card__price">$${lineTotal}</p>
  </li>`;
}

function addQuantityListeners() {
  const quantityButtons = document.querySelectorAll(".quantity-button");

  quantityButtons.forEach((button) => {
    button.addEventListener("click", updateQuantity);
  });
}

function updateQuantity(event) {
  const index = Number(event.currentTarget.dataset.index);
  const action = event.currentTarget.dataset.action;

  const cartItems = getLocalStorage("so-cart") || [];

  if (!cartItems[index]) {
    return;
  }

  const currentQuantity = Number(cartItems[index].Quantity) || 1;

  if (action === "increase") {
    cartItems[index].Quantity = currentQuantity + 1;
  }

  if (action === "decrease" && currentQuantity > 1) {
    cartItems[index].Quantity = currentQuantity - 1;
  }

  setLocalStorage("so-cart", cartItems);

  renderCartContents();
}

function removeFromCart(index) {
  const cartItems = getLocalStorage("so-cart") || [];

  if (index < 0 || index >= cartItems.length) {
    return;
  }

  cartItems.splice(index, 1);

  setLocalStorage("so-cart", cartItems);

  renderCartContents();
}

// One listener handles clicks on the X buttons in the cart.
document.querySelector(".product-list").addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-item");

  if (!removeButton) {
    return;
  }

  const index = Number(removeButton.dataset.index);

  removeFromCart(index);
});

renderCartContents();