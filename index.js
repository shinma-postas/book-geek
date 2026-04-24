const DISCOUNT = 0.2; // 20% off

const billedOptions = document.getElementById('billing-options');
const billedAnnually = document.getElementById('annually');
const billedMonthly = document.getElementById('monthly');
const billedSlider = document.getElementById('billing-slider');
const plans = document.querySelectorAll('.plan');

let isAnnual = true;

// 初回読み込み時
window.onload = () => {
  // トランジションオフ
  billedSlider.style.transition = 'none';

  // 初期値をAnnual(true)に設定
  toggleOptions(isAnnual);

  // トランジションオン
  requestAnimationFrame(() => (billedSlider.style.transition = ''));
};

// トグル実行
const toggleOptions = (isAnnual) => {
  setSelected(isAnnual);
  updatePlans(isAnnual);
  moveSlider(isAnnual ? billedAnnually : billedMonthly);
};

// クラスをトグル
const setSelected = (isAnnual) => {
  billedAnnually.classList.toggle('selected', isAnnual);
  billedMonthly.classList.toggle('selected', !isAnnual);
};

// 金額をUSD表記に整形
const formatUSD = (value) => (value === 0 ? '$0' : `$${value.toFixed(2)}`);

// プランの金額とテキストを切替
const updatePlans = (isAnnual) => {
  plans.forEach((plan) => {
    const monthlyPrice = Number(plan.dataset.monthly || 0);
    const priceEl = plan.querySelector('.price');
    const infoEl = plan.querySelector('.price-info');

    // 金額：Annualなら20%OFFの実質月額、Monthlyなら基準月額
    const display = isAnnual ? monthlyPrice * (1 - DISCOUNT) : monthlyPrice;

    priceEl.textContent = formatUSD(display);

    // テキスト
    infoEl.textContent = isAnnual
      ? 'per user/month, billed annually'
      : 'per user/month, billed monthly';
  });
};

// スライダーの位置・幅を対象要素に合わせてセット
const moveSlider = (targetOption) => {
  // 移動量計算用の数値を取得
  const parentRect = billedOptions.getBoundingClientRect();
  const targetOptionRect = targetOption.getBoundingClientRect();
  const parentPaddingLeft = parseFloat(getComputedStyle(billedOptions).paddingLeft);

  // 移動量を算出
  const offsetX = targetOptionRect.left - parentRect.left - parentPaddingLeft;

  // スライダーに計算後のスタイルをセット
  billedSlider.style.width = `${targetOptionRect.width}px`;
  billedSlider.style.transform = `translateX(${offsetX}px)`;
};

// トグルクリックイベント
billedOptions.addEventListener('click', () => {
  // フラグを反転
  isAnnual = !isAnnual;

  // トグル実行
  toggleOptions(isAnnual);
});
