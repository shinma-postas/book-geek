const DISCOUNT = 0.2; // 20% off

const billedOptions = document.getElementById('billing-options');
const billedAnnually = document.getElementById('annually');
const billedMonthly = document.getElementById('monthly');
const plans = document.querySelectorAll('.plan');

// 金額をUSD表記に整形
const formatUSD = (value) => (value === 0 ? '$0' : `$${value.toFixed(2)}`);

// cssクラスをトグル
const setSelected = (isAnnual) => {
  billedAnnually.classList.toggle('selected', isAnnual);
  billedMonthly.classList.toggle('selected', !isAnnual);
};

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

// クリックされた要素から、どちらを選んだか判定して切替
billedOptions.addEventListener('click', (e) => {
  const annualClicked = e.target.closest('#annually');
  const monthlyClicked = e.target.closest('#monthly');
  if (!annualClicked && !monthlyClicked) return;

  // Annualフラグ
  const isAnnual = Boolean(annualClicked);

  // cssクラスの切替と、プランの金額・テキストの切替
  setSelected(isAnnual);
  updatePlans(isAnnual);
});

// 初期状態に合わせて同期
updatePlans(billedAnnually.classList.contains('selected'));
