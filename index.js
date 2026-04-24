const DISCOUNT = 0.2; // 20% off

// DOM要素
const billedOptions = document.getElementById('billing-options');
const billedAnnually = document.getElementById('annually');
const billedMonthly = document.getElementById('monthly');
const billedSlider = document.getElementById('billing-slider');
const plans = document.querySelectorAll('.plan');

let isAnnual = true;

// 初回読み込み時
document.addEventListener('DOMContentLoaded', () => {
  // アニメーションなしで初期値をセット
  withoutTransition(() => toggleOptions(isAnnual, false));
});

// スライダーのtransitionを無効にしてコールバックを実行
const withoutTransition = (callback) => {
  billedSlider.style.transition = 'none';
  callback();
  requestAnimationFrame(() => (billedSlider.style.transition = ''));
};

// トグル実行
const toggleOptions = (isAnnual, animate = true) => {
  setSelected(isAnnual);
  updatePlans(isAnnual, animate);
  moveSlider(isAnnual ? billedAnnually : billedMonthly);
};

// 選択状態のクラスをセット
const setSelected = (isAnnual) => {
  billedAnnually.classList.toggle('selected', isAnnual);
  billedMonthly.classList.toggle('selected', !isAnnual);
};

// 金額をUSD表記に整形
const formatUSD = (value) => (value === 0 ? '$0' : `$${value.toFixed(2)}`);

// プランの金額とテキストを切替
const updatePlans = (isAnnual, animate = true) => {
  plans.forEach((plan) => {
    const monthlyPrice = Number(plan.dataset.monthly || 0);
    const priceEl = plan.querySelector('.price');
    const infoEl = plan.querySelector('.info-span');

    // 金額：Annualなら20%OFFの実質月額、Monthlyなら基準月額
    const display = isAnnual ? monthlyPrice * (1 - DISCOUNT) : monthlyPrice;
    const priceInfo = isAnnual ? 'annually' : 'monthly';

    // テキスト更新
    changeTextWithFade(priceEl, formatUSD(display), animate);
    changeTextWithFade(infoEl, priceInfo, animate);
  });
};

// スライダーの位置・幅を対象要素に合わせてセット
const moveSlider = (targetOption) => {
  const parentRect = billedOptions.getBoundingClientRect();
  const targetRect = targetOption.getBoundingClientRect();
  const paddingLeft = parseFloat(getComputedStyle(billedOptions).paddingLeft);

  // 移動量を算出
  const offsetX = targetRect.left - parentRect.left - paddingLeft;

  billedSlider.style.width = `${targetRect.width}px`;
  billedSlider.style.transform = `translateX(${offsetX}px)`;
};

// テキストの変更時にフェードトランジション
const changeTextWithFade = (el, newText, animate = true) => {
  // 初回はアニメーションなし
  if (!animate) {
    el.textContent = newText;
    return;
  }

  el.style.transition = 'opacity 0.3s ease';
  el.style.opacity = '0';

  setTimeout(() => {
    el.textContent = newText;
    el.style.opacity = '1';
  }, 300);
};

// トグルクリックイベント
billedOptions.addEventListener('click', () => {
  isAnnual = !isAnnual;
  toggleOptions(isAnnual);
});
