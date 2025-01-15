const HOST = `https://webperf-finish.netlify.app`;
// const HOST = `${HOST}`;
window.addEventListener('DOMContentLoaded', async () => {
  const productList = await fetch(`${HOST}/api/products`);
  const products = await productList.json();
  const promoProduct = products.find((product) => product.isPromo);

  setTimeout(() => {
    const promoBanner = document.querySelector('.promo-banner');
    promoBanner.innerHTML = `<div class="promo-content">
    <img src="${promoProduct.cloudinaryImage}" alt="Promo" class="promo-image" />
        <h2 class="promo-title">Limited Time Offer</h2>
        <p class="promo-text">
          Complimentary Engraving on all
          <span class="promo-highlight">${promoProduct.name}</span> purchases!
        </p>
      </div>`;
    // Add the visible class after setting the content
    promoBanner.classList.add('visible');
  }, 2000);
});
