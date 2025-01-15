const HOST = `https://webperf-finish.netlify.app`;
// const HOST = `http://localhost:3000`;
document.addEventListener('DOMContentLoaded', async () => {
  const cartIcon = document.getElementById('cartIcon');
  cartIcon.addEventListener('click', () => {
    cartPopup.classList.toggle('show');
  });

  document.addEventListener('click', (event) => {
    if (!cartIcon.contains(event.target) && !cartPopup.contains(event.target)) {
      cartPopup.classList.remove('show');
    }
  });

  async function getCartItems() {
    const response = await fetch(`${HOST}/api/cart/items`);
    const items = await response.json();
    return items;
  }

  async function getWatchData(id) {
    const response = await fetch(`${HOST}/api/products/${id}`);
    const data = await response.json();
    return data;
  }

  document.addEventListener('click', async (event) => {
    const clickedElement = event.target;
    if (clickedElement.matches('button.cta-button')) {
      clickedElement.textContent = 'Purchasing...';
      const watchId = Number(clickedElement.getAttribute('data-id'));
      const watch = await getWatchData(watchId);

      // collectAndSendAnalytics();
      collectAndSendAnalyticsUsingScheduler();

      await addToCart(watch);
      clickedElement.textContent = 'Purchase';
    }
  });

  async function addToCart(watch) {
    const response = await fetch(`${HOST}/api/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(watch),
    });
    if (response.status === 200) {
      updateCartUI();
    }
  }

  async function updateCartUI() {
    const cartPopup = document.getElementById('cartPopup');
    const cartBadge = document.getElementById('cartBadge');

    const cartItems = await getCartItems();
    if (cartItems.length > 0) {
      cartBadge.style.display = 'flex';
      cartBadge.textContent = cartItems.length;
      cartPopup.innerHTML = cartItems
        .map(
          (item) => `
              <div class="cart-item">
                  <p>${item.name} - ${item.price}</p>
              </div>
          `
        )
        .join('');
    } else {
      cartBadge.style.display = 'none';
      cartPopup.innerHTML = '<p>No items available</p>';
    }
  }

  function collectAndSendAnalytics() {
    performance.mark('analytics_start');
    const phantomEl = document.createElement('div');
    for (let i = 0; i <= 4_000_000; i++) {
      let child = document.createElement('div');
      child.textContent = i;
      phantomEl.appendChild(child);
    }
    performance.mark('analytics_end');
    performance.measure('analytics', 'analytics_start', 'analytics_end');
  }

  async function collectAndSendAnalyticsUsingScheduler() {
    performance.mark('analytics_start');

    const phantomEl = document.createElement('div');
    const TOTAL_ELEMENTS = 4_000_000;
    const BATCH_SIZE = 2_000;
    let currentIndex = 0;

    while (currentIndex < TOTAL_ELEMENTS) {
      await scheduler.postTask(
        () => {
          const end = Math.min(currentIndex + BATCH_SIZE, TOTAL_ELEMENTS);
          for (let i = currentIndex; i < end; i++) {
            const child = document.createElement('div');
            child.textContent = i;
            phantomEl.appendChild(child);
          }
          currentIndex += BATCH_SIZE;
        },
        { priority: 'background' }
      );
    }

    performance.mark('analytics_end');
    performance.measure('analytics', 'analytics_start', 'analytics_end');
  }

  updateCartUI();
});
