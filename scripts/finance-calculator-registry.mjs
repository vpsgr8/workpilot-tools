/** @typedef {{ slug: string, title: string, type: string, desc: string, formula?: string, featured?: boolean, config?: object, related?: string[] }} ToolDef */
/** @typedef {{ id: string, icon: string, title: string, tools: ToolDef[] }} CategoryDef */

/** @type {CategoryDef[]} */
export const CATEGORIES = [
  {
    id: "investment",
    icon: "💰",
    title: "Investment & Wealth Calculators",
    tools: [
      { slug: "sip-calculator", title: "SIP Calculator", type: "sip", desc: "Estimate mutual fund SIP returns with monthly investments and expected CAGR.", formula: "FV = P × [((1+r)^n − 1) / r] × (1+r)", featured: true, related: ["lumpsum-investment-calculator", "swp-calculator", "cagr-calculator"] },
      { slug: "lumpsum-investment-calculator", title: "Lumpsum Investment Calculator", type: "compound", desc: "Project wealth from a one-time investment at a fixed rate of return.", formula: "FV = PV × (1 + r)^n", config: { label: "Lumpsum amount (₹)", defaultPv: 500000 }, related: ["sip-calculator", "compound-interest-calculator", "mutual-fund-return-calculator"] },
      { slug: "mutual-fund-return-calculator", title: "Mutual Fund Return Calculator", type: "sip", desc: "Calculate mutual fund returns for SIP or lumpsum with CAGR output.", config: { mode: "mf" }, related: ["sip-calculator", "cagr-calculator", "investment-growth-calculator"] },
      { slug: "cagr-calculator", title: "CAGR Calculator", type: "cagr", desc: "Find compound annual growth rate between starting and ending investment values.", formula: "CAGR = (FV/PV)^(1/n) − 1", featured: true, related: ["compound-interest-calculator", "sip-calculator", "stock-return-calculator"] },
      { slug: "compound-interest-calculator", title: "Compound Interest Calculator", type: "compound", desc: "See how principal grows with compounding interest over time.", formula: "FV = PV × (1 + r)^n", featured: true, related: ["simple-interest-calculator", "future-value-calculator", "cagr-calculator"] },
      { slug: "simple-interest-calculator", title: "Simple Interest Calculator", type: "simple", desc: "Calculate simple interest on loans or deposits without compounding.", formula: "SI = P × R × T / 100", related: ["compound-interest-calculator", "bank-interest-calculator", "savings-interest-calculator"] },
      { slug: "future-value-calculator", title: "Future Value Calculator", type: "compound", desc: "Compute future value of money invested today at a given rate.", formula: "FV = PV(1+r)^n", config: { title: "Future value" }, related: ["present-value-calculator", "compound-interest-calculator", "inflation-calculator"] },
      { slug: "present-value-calculator", title: "Present Value Calculator", type: "pv", desc: "Discount a future amount to today's value using a discount rate.", formula: "PV = FV / (1+r)^n", related: ["future-value-calculator", "investment-growth-calculator", "financial-goal-calculator"] },
      { slug: "investment-growth-calculator", title: "Investment Growth Calculator", type: "growth", desc: "Track investment growth with initial amount plus monthly contributions.", related: ["sip-calculator", "compound-interest-calculator", "retirement-corpus-calculator"] },
      { slug: "swp-calculator", title: "SWP Calculator", type: "swp", desc: "Plan systematic withdrawals from a corpus while estimating remaining balance.", related: ["sip-calculator", "retirement-corpus-calculator", "fire-calculator"] },
      { slug: "xirr-calculator", title: "XIRR Calculator", type: "xirr", desc: "Approximate extended internal rate of return for irregular cash flows.", related: ["irr-calculator", "sip-calculator", "mutual-fund-return-calculator"] },
      { slug: "irr-calculator", title: "IRR Calculator", type: "irr", desc: "Estimate internal rate of return for periodic investment cash flows.", related: ["xirr-calculator", "cagr-calculator", "roi-calculator"] },
      { slug: "rule-of-72-calculator", title: "Rule of 72 Calculator", type: "rule72", desc: "Quickly estimate years to double your money at a given interest rate.", formula: "Years ≈ 72 / rate", related: ["compound-interest-calculator", "cagr-calculator", "fd-calculator"] },
      { slug: "retirement-corpus-calculator", title: "Retirement Corpus Calculator", type: "retirement", desc: "Plan how much you need to save for retirement and monthly SIP required.", featured: true, related: ["fire-calculator", "swp-calculator", "retirement-planning-calculator"] },
      { slug: "fire-calculator", title: "FIRE Calculator", type: "fire", desc: "Financial Independence Retire Early — corpus target and years to FIRE.", related: ["retirement-corpus-calculator", "swp-calculator", "investment-growth-calculator"] },
    ],
  },
  {
    id: "loan",
    icon: "🏠",
    title: "Loan & EMI Calculators",
    tools: [
      { slug: "emi-calculator", title: "EMI Calculator", type: "emi", desc: "Calculate loan EMI, total interest, and full repayment schedule.", featured: true, related: ["home-loan-emi-calculator", "personal-loan-emi-calculator", "loan-prepayment-calculator"] },
      { slug: "home-loan-emi-calculator", title: "Home Loan EMI Calculator", type: "emi", desc: "India home loan EMI with tenure and interest cost breakdown.", config: { defaultAmount: 5000000, defaultRate: 8.5, defaultYears: 20 }, related: ["mortgage-calculator", "loan-eligibility-calculator", "loan-prepayment-calculator"] },
      { slug: "car-loan-emi-calculator", title: "Car Loan EMI Calculator", type: "emi", desc: "Auto loan EMI with optional down payment for vehicle finance.", config: { defaultAmount: 1200000, defaultRate: 9.5, defaultYears: 5, downPayment: true, defaultDown: 200000 }, related: ["personal-loan-emi-calculator", "loan-affordability-calculator", "emi-calculator"] },
      { slug: "personal-loan-emi-calculator", title: "Personal Loan EMI Calculator", type: "emi", desc: "Personal loan monthly EMI and total interest payable.", config: { defaultAmount: 500000, defaultRate: 14, defaultYears: 3 }, related: ["emi-calculator", "loan-eligibility-calculator", "credit-card-emi-calculator"] },
      { slug: "education-loan-calculator", title: "Education Loan Calculator", type: "emi", desc: "Plan education loan EMI for domestic or overseas study.", config: { defaultAmount: 2000000, defaultRate: 10, defaultYears: 7 }, related: ["emi-calculator", "loan-eligibility-calculator", "child-education-planning-calculator"] },
      { slug: "loan-eligibility-calculator", title: "Loan Eligibility Calculator", type: "eligibility", desc: "Estimate max loan amount based on income and existing EMIs.", featured: true, related: ["loan-affordability-calculator", "home-loan-emi-calculator", "in-hand-salary-calculator"] },
      { slug: "loan-affordability-calculator", title: "Loan Affordability Calculator", type: "affordability", desc: "Find affordable loan amount from your monthly EMI budget.", related: ["loan-eligibility-calculator", "emi-calculator", "home-loan-emi-calculator"] },
      { slug: "loan-comparison-calculator", title: "Loan Comparison Calculator", type: "compare", desc: "Compare two loan offers side by side — EMI and total cost.", related: ["emi-calculator", "loan-prepayment-calculator", "home-loan-emi-calculator"] },
      { slug: "loan-prepayment-calculator", title: "Loan Prepayment Calculator", type: "prepay", desc: "See interest saved from partial or full loan prepayment.", related: ["emi-calculator", "loan-balance-calculator", "home-loan-emi-calculator"] },
      { slug: "loan-balance-calculator", title: "Loan Balance Calculator", type: "balance", desc: "Outstanding loan balance after a number of EMIs paid.", related: ["loan-prepayment-calculator", "emi-calculator", "home-loan-emi-calculator"] },
      { slug: "mortgage-calculator", title: "Mortgage Calculator", type: "emi", desc: "Mortgage EMI with down payment for property purchase planning.", config: { defaultAmount: 6000000, defaultRate: 7.5, defaultYears: 20, downPayment: true, defaultDown: 600000 }, related: ["home-loan-emi-calculator", "reverse-mortgage-calculator", "home-equity-calculator"] },
      { slug: "reverse-mortgage-calculator", title: "Reverse Mortgage Calculator", type: "reverse", desc: "Estimate reverse mortgage payout for senior homeowners.", related: ["home-equity-calculator", "retirement-corpus-calculator", "mortgage-calculator"] },
    ],
  },
  {
    id: "stock",
    icon: "📈",
    title: "Stock Market Calculators",
    tools: [
      { slug: "stock-average-price-calculator", title: "Stock Average Price Calculator", type: "stock-avg", desc: "Average buy price after multiple trades at different prices.", related: ["profit-loss-calculator", "position-size-calculator", "delivery-trade-calculator"] },
      { slug: "position-size-calculator", title: "Position Size Calculator", type: "position", desc: "Size positions based on account risk and stop-loss distance.", related: ["risk-reward-ratio-calculator", "risk-management-calculator", "nifty-position-size-calculator"] },
      { slug: "risk-reward-ratio-calculator", title: "Risk Reward Ratio Calculator", type: "risk-reward", desc: "Compare potential profit vs loss before entering a trade.", featured: true, related: ["position-size-calculator", "break-even-calculator", "profit-loss-calculator"] },
      { slug: "profit-loss-calculator", title: "Profit & Loss Calculator", type: "pnl", desc: "Stock trade profit or loss with brokerage and taxes estimate.", featured: true, related: ["brokerage-calculator", "stock-return-calculator", "intraday-calculator"] },
      { slug: "brokerage-calculator", title: "Brokerage Calculator", type: "brokerage", desc: "Estimate Indian stock brokerage, STT, GST, and net P&L.", featured: true, related: ["profit-loss-calculator", "intraday-calculator", "delivery-trade-calculator"] },
      { slug: "margin-calculator", title: "Margin Calculator", type: "margin", desc: "Calculate margin required for leveraged stock or F&O trades.", related: ["futures-profit-calculator", "options-profit-calculator", "position-size-calculator"] },
      { slug: "futures-profit-calculator", title: "Futures Profit Calculator", type: "futures", desc: "Profit or loss on index or stock futures contracts.", related: ["options-profit-calculator", "margin-calculator", "nifty-position-size-calculator"] },
      { slug: "options-profit-calculator", title: "Options Profit Calculator", type: "options", desc: "Payoff for call and put options at expiry or spot price.", related: ["bank-nifty-option-calculator", "futures-profit-calculator", "break-even-calculator"] },
      { slug: "break-even-calculator", title: "Break-even Calculator", type: "breakeven-trade", desc: "Break-even price for a stock trade after brokerage and charges.", related: ["profit-loss-calculator", "brokerage-calculator", "risk-reward-ratio-calculator"] },
      { slug: "dividend-yield-calculator", title: "Dividend Yield Calculator", type: "div-yield", desc: "Annual dividend yield based on price and dividend per share.", related: ["dividend-reinvestment-calculator", "stock-return-calculator", "portfolio-allocation-calculator"] },
      { slug: "dividend-reinvestment-calculator", title: "Dividend Reinvestment Calculator", type: "drip", desc: "Project returns with dividends reinvested over time.", related: ["dividend-yield-calculator", "compound-interest-calculator", "sip-calculator"] },
      { slug: "portfolio-allocation-calculator", title: "Portfolio Allocation Calculator", type: "allocation", desc: "Split capital across assets by target allocation percentages.", related: ["portfolio-rebalancing-calculator", "stock-return-calculator", "net-worth-calculator"] },
      { slug: "stock-return-calculator", title: "Stock Return Calculator", type: "stock-return", desc: "Absolute and percentage return on a stock investment.", related: ["cagr-calculator", "profit-loss-calculator", "dividend-yield-calculator"] },
      { slug: "intraday-calculator", title: "Intraday Calculator", type: "intraday", desc: "Intraday trade P&L with leverage and square-off charges.", related: ["brokerage-calculator", "delivery-trade-calculator", "profit-loss-calculator"] },
      { slug: "delivery-trade-calculator", title: "Delivery Trade Calculator", type: "delivery", desc: "Delivery-based equity trade profit after all charges.", related: ["brokerage-calculator", "intraday-calculator", "profit-loss-calculator"] },
    ],
  },
  {
    id: "tax",
    icon: "💵",
    title: "Tax Calculators",
    tools: [
      { slug: "income-tax-calculator", title: "Income Tax Calculator", type: "income-tax", desc: "Estimate India income tax for FY with deductions (simplified slabs).", featured: true, related: ["new-vs-old-tax-regime-calculator", "salary-tax-calculator", "hra-exemption-calculator"] },
      { slug: "new-vs-old-tax-regime-calculator", title: "New vs Old Tax Regime Calculator", type: "tax-regime", desc: "Compare tax under new vs old regime to pick the better option.", related: ["income-tax-calculator", "in-hand-salary-calculator", "hra-exemption-calculator"] },
      { slug: "capital-gains-tax-calculator", title: "Capital Gains Tax Calculator", type: "capital-gains", desc: "LTCG and STCG tax on equity and other assets (simplified).", related: ["income-tax-calculator", "profit-loss-calculator", "stock-return-calculator"] },
      { slug: "gst-calculator", title: "GST Calculator", type: "gst", desc: "Add or remove GST from an amount at 5%, 12%, 18%, or 28%.", featured: true, related: ["income-tax-calculator", "tds-calculator", "pricing-calculator"] },
      { slug: "tds-calculator", title: "TDS Calculator", type: "tds", desc: "Calculate tax deducted at source on salary, interest, or rent.", related: ["income-tax-calculator", "advance-tax-calculator", "salary-tax-calculator"] },
      { slug: "hra-exemption-calculator", title: "HRA Exemption Calculator", type: "hra", desc: "HRA tax exemption under Section 10(13A) for salaried employees.", related: ["in-hand-salary-calculator", "income-tax-calculator", "new-vs-old-tax-regime-calculator"] },
      { slug: "salary-tax-calculator", title: "Salary Tax Calculator", type: "income-tax", desc: "Tax on annual salary with standard deduction estimate.", config: { mode: "salary" }, related: ["in-hand-salary-calculator", "income-tax-calculator", "tds-calculator"] },
      { slug: "professional-tax-calculator", title: "Professional Tax Calculator", type: "prof-tax", desc: "Monthly professional tax by state (simplified slabs).", related: ["in-hand-salary-calculator", "salary-tax-calculator", "ctc-to-take-home-calculator"] },
      { slug: "advance-tax-calculator", title: "Advance Tax Calculator", type: "advance-tax", desc: "Quarterly advance tax instalments from estimated annual tax.", related: ["income-tax-calculator", "tds-calculator", "capital-gains-tax-calculator"] },
    ],
  },
  {
    id: "salary",
    icon: "👨‍💼",
    title: "Salary & Income Calculators",
    tools: [
      { slug: "in-hand-salary-calculator", title: "In-Hand Salary Calculator", type: "in-hand", desc: "Net take-home salary from CTC after PF, tax, and deductions.", featured: true, related: ["ctc-to-take-home-calculator", "hra-exemption-calculator", "salary-tax-calculator"] },
      { slug: "ctc-to-take-home-calculator", title: "CTC to Take Home Calculator", type: "in-hand", desc: "Convert annual CTC to monthly in-hand pay.", config: { mode: "ctc" }, related: ["in-hand-salary-calculator", "salary-hike-calculator", "bonus-calculator"] },
      { slug: "salary-hike-calculator", title: "Salary Hike Calculator", type: "hike", desc: "New salary and percentage hike from old and new CTC.", related: ["in-hand-salary-calculator", "bonus-calculator", "ctc-to-take-home-calculator"] },
      { slug: "overtime-pay-calculator", title: "Overtime Pay Calculator", type: "overtime", desc: "Overtime earnings from hourly rate and extra hours worked.", related: ["hourly-rate-calculator", "in-hand-salary-calculator", "commission-calculator"] },
      { slug: "freelance-rate-calculator", title: "Freelance Rate Calculator", type: "freelance", desc: "Set freelance hourly or project rates from desired annual income.", related: ["hourly-rate-calculator", "commission-calculator", "in-hand-salary-calculator"] },
      { slug: "hourly-rate-calculator", title: "Hourly Rate Calculator", type: "hourly", desc: "Convert annual salary or project fee to an hourly rate.", related: ["freelance-rate-calculator", "overtime-pay-calculator", "ctc-to-take-home-calculator"] },
      { slug: "commission-calculator", title: "Commission Calculator", type: "commission", desc: "Sales commission from deal value and commission rate.", related: ["bonus-calculator", "profit-margin-calculator", "freelance-rate-calculator"] },
      { slug: "bonus-calculator", title: "Bonus Calculator", type: "bonus", desc: "Bonus amount and post-tax bonus from percentage of CTC.", related: ["in-hand-salary-calculator", "salary-hike-calculator", "commission-calculator"] },
    ],
  },
  {
    id: "business",
    icon: "🏢",
    title: "Business Finance Calculators",
    tools: [
      { slug: "profit-margin-calculator", title: "Profit Margin Calculator", type: "margin-pct", desc: "Net profit margin percentage from revenue and costs.", related: ["gross-profit-calculator", "net-profit-calculator", "pricing-calculator"] },
      { slug: "gross-profit-calculator", title: "Gross Profit Calculator", type: "gross-profit", desc: "Gross profit and margin from revenue and COGS.", related: ["net-profit-calculator", "profit-margin-calculator", "break-even-business-calculator"] },
      { slug: "net-profit-calculator", title: "Net Profit Calculator", type: "net-profit", desc: "Net profit after all expenses from revenue.", related: ["gross-profit-calculator", "profit-margin-calculator", "cash-flow-calculator"] },
      { slug: "break-even-business-calculator", title: "Break-Even Calculator", type: "breakeven-biz", desc: "Units or revenue needed to cover fixed and variable costs.", related: ["pricing-calculator", "profit-margin-calculator", "cash-flow-calculator"] },
      { slug: "roi-calculator", title: "ROI Calculator", type: "roi", desc: "Return on investment as a percentage of gain vs cost.", related: ["roe-calculator", "roce-calculator", "business-valuation-calculator"] },
      { slug: "roe-calculator", title: "ROE Calculator", type: "roe", desc: "Return on equity from net income and shareholders' equity.", related: ["roce-calculator", "roi-calculator", "debt-to-equity-ratio-calculator"] },
      { slug: "roce-calculator", title: "ROCE Calculator", type: "roce", desc: "Return on capital employed for operational efficiency.", related: ["roe-calculator", "roi-calculator", "working-capital-calculator"] },
      { slug: "working-capital-calculator", title: "Working Capital Calculator", type: "working-capital", desc: "Current assets minus current liabilities.", related: ["cash-flow-calculator", "inventory-turnover-calculator", "runway-calculator"] },
      { slug: "cash-flow-calculator", title: "Cash Flow Calculator", type: "cash-flow", desc: "Operating cash flow from inflows and outflows.", related: ["working-capital-calculator", "burn-rate-calculator", "runway-calculator"] },
      { slug: "business-valuation-calculator", title: "Business Valuation Calculator", type: "valuation", desc: "Simple revenue or earnings multiple business valuation.", related: ["roi-calculator", "pricing-calculator", "profit-margin-calculator"] },
      { slug: "inventory-turnover-calculator", title: "Inventory Turnover Calculator", type: "inventory", desc: "How fast inventory sells — COGS divided by average inventory.", related: ["working-capital-calculator", "gross-profit-calculator", "cash-flow-calculator"] },
      { slug: "debt-to-equity-ratio-calculator", title: "Debt-to-Equity Ratio Calculator", type: "debt-equity", desc: "Financial leverage ratio from total debt and equity.", related: ["roe-calculator", "working-capital-calculator", "loan-eligibility-calculator"] },
      { slug: "burn-rate-calculator", title: "Burn Rate Calculator", type: "burn", desc: "Monthly cash burn for startups from expenses minus revenue.", related: ["runway-calculator", "cash-flow-calculator", "business-valuation-calculator"] },
      { slug: "runway-calculator", title: "Runway Calculator", type: "runway", desc: "Months of runway from cash balance and monthly burn.", related: ["burn-rate-calculator", "cash-flow-calculator", "fire-calculator"] },
      { slug: "pricing-calculator", title: "Pricing Calculator", type: "pricing", desc: "Product price from cost, margin target, and GST.", related: ["profit-margin-calculator", "gst-calculator", "break-even-business-calculator"] },
    ],
  },
  {
    id: "banking",
    icon: "💳",
    title: "Banking Calculators",
    tools: [
      { slug: "fd-calculator", title: "Fixed Deposit (FD) Calculator", type: "fd", desc: "Maturity amount and interest on bank fixed deposits.", featured: true, related: ["recurring-deposit-calculator", "compound-interest-calculator", "rule-of-72-calculator"] },
      { slug: "recurring-deposit-calculator", title: "Recurring Deposit (RD) Calculator", type: "rd", desc: "RD maturity value from monthly deposit and interest rate.", related: ["fd-calculator", "sip-calculator", "savings-interest-calculator"] },
      { slug: "savings-interest-calculator", title: "Savings Interest Calculator", type: "simple", desc: "Interest earned on savings account balance.", config: { mode: "savings" }, related: ["bank-interest-calculator", "fd-calculator", "compound-interest-calculator"] },
      { slug: "bank-interest-calculator", title: "Bank Interest Calculator", type: "compound", desc: "Compound interest on bank deposits with quarterly compounding.", config: { quarterly: true }, related: ["fd-calculator", "savings-interest-calculator", "recurring-deposit-calculator"] },
      { slug: "credit-card-emi-calculator", title: "Credit Card EMI Calculator", type: "emi", desc: "Convert credit card outstanding to EMI at bank rate.", config: { defaultAmount: 100000, defaultRate: 18, defaultYears: 1 }, related: ["credit-card-payoff-calculator", "personal-loan-emi-calculator", "emi-calculator"] },
      { slug: "credit-card-payoff-calculator", title: "Credit Card Payoff Calculator", type: "cc-payoff", desc: "Months to pay off credit card debt with fixed monthly payment.", related: ["credit-card-emi-calculator", "loan-prepayment-calculator", "emi-calculator"] },
    ],
  },
  {
    id: "currency",
    icon: "🌍",
    title: "Currency & International Finance",
    tools: [
      { slug: "currency-converter", title: "Currency Converter", type: "currency", desc: "Convert INR, USD, EUR, GBP and more with reference rates.", related: ["exchange-rate-calculator", "forex-profit-calculator", "purchasing-power-calculator"] },
      { slug: "forex-profit-calculator", title: "Forex Profit Calculator", type: "forex", desc: "Profit or loss on forex trades from entry, exit, and lot size.", related: ["currency-converter", "position-size-calculator", "risk-reward-ratio-calculator"] },
      { slug: "exchange-rate-calculator", title: "Exchange Rate Calculator", type: "exchange", desc: "Cross-currency conversion with custom exchange rate.", related: ["currency-converter", "forex-profit-calculator", "purchasing-power-calculator"] },
      { slug: "purchasing-power-calculator", title: "Purchasing Power Calculator", type: "purchasing", desc: "Compare purchasing power across countries using PPP estimates.", related: ["inflation-calculator", "currency-converter", "exchange-rate-calculator"] },
    ],
  },
  {
    id: "planning",
    icon: "👶",
    title: "Personal Financial Planning",
    tools: [
      { slug: "retirement-planning-calculator", title: "Retirement Planning Calculator", type: "retirement", desc: "Long-term retirement plan with inflation-adjusted expenses.", config: { mode: "plan" }, related: ["retirement-corpus-calculator", "fire-calculator", "swp-calculator"] },
      { slug: "child-education-planning-calculator", title: "Child Education Planning Calculator", type: "goal", desc: "SIP needed for future education costs with inflation.", config: { goal: "education" }, related: ["sip-calculator", "financial-goal-calculator", "inflation-calculator"] },
      { slug: "marriage-planning-calculator", title: "Marriage Planning Calculator", type: "goal", desc: "Save for wedding expenses with target date and inflation.", config: { goal: "marriage" }, related: ["financial-goal-calculator", "sip-calculator", "fd-calculator"] },
      { slug: "emergency-fund-calculator", title: "Emergency Fund Calculator", type: "emergency", desc: "Recommended emergency fund based on monthly expenses.", related: ["net-worth-calculator", "in-hand-salary-calculator", "financial-goal-calculator"] },
      { slug: "net-worth-calculator", title: "Net Worth Calculator", type: "net-worth", desc: "Total assets minus liabilities — your financial snapshot.", featured: true, related: ["portfolio-allocation-calculator", "emergency-fund-calculator", "financial-goal-calculator"] },
      { slug: "financial-goal-calculator", title: "Financial Goal Calculator", type: "goal", desc: "Monthly savings needed to reach any financial goal by target year.", related: ["sip-calculator", "child-education-planning-calculator", "retirement-planning-calculator"] },
      { slug: "inflation-calculator", title: "Inflation Calculator", type: "inflation", desc: "Future cost of goods after inflation over time.", featured: true, related: ["retirement-corpus-calculator", "financial-goal-calculator", "purchasing-power-calculator"] },
    ],
  },
  {
    id: "premium",
    icon: "🏗️",
    title: "Premium Finance Tools",
    tools: [
      { slug: "nifty-position-size-calculator", title: "NIFTY Position Size Calculator", type: "position", desc: "Position size for NIFTY trades based on risk per trade.", config: { index: "NIFTY" }, related: ["position-size-calculator", "risk-management-calculator", "futures-profit-calculator"] },
      { slug: "bank-nifty-option-calculator", title: "Bank Nifty Option Calculator", type: "options", desc: "Bank Nifty option payoff at expiry.", config: { index: "BANKNIFTY" }, related: ["options-profit-calculator", "nifty-position-size-calculator", "margin-calculator"] },
      { slug: "trading-journal-calculator", title: "Trading Journal Calculator", type: "journal", desc: "Win rate, average gain/loss, and expectancy from trade log.", related: ["profit-loss-calculator", "risk-management-calculator", "trader-psychology-score-calculator"] },
      { slug: "gann-square-of-9-calculator", title: "GANN Square of 9 Calculator", type: "gann", desc: "GANN support and resistance levels from a base price.", related: ["pivot-point-calculator", "fibonacci-calculator", "nifty-position-size-calculator"] },
      { slug: "fibonacci-calculator", title: "Fibonacci Calculator", type: "fibonacci", desc: "Fibonacci retracement and extension levels for trading.", related: ["pivot-point-calculator", "gann-square-of-9-calculator", "risk-reward-ratio-calculator"] },
      { slug: "pivot-point-calculator", title: "Pivot Point Calculator", type: "pivot", desc: "Classic pivot, support, and resistance from OHLC.", related: ["fibonacci-calculator", "gann-square-of-9-calculator", "intraday-calculator"] },
      { slug: "risk-management-calculator", title: "Risk Management Calculator", type: "risk-mgmt", desc: "Max loss, position count, and risk per trade for a portfolio.", related: ["position-size-calculator", "risk-reward-ratio-calculator", "portfolio-rebalancing-calculator"] },
      { slug: "trader-psychology-score-calculator", title: "Trader Psychology Score Calculator", type: "psychology", desc: "Self-assessment score for trading discipline and psychology.", related: ["trading-journal-calculator", "risk-management-calculator", "risk-reward-ratio-calculator"] },
      { slug: "portfolio-rebalancing-calculator", title: "Portfolio Rebalancing Calculator", type: "rebalance", desc: "Trades needed to rebalance portfolio to target weights.", related: ["portfolio-allocation-calculator", "net-worth-calculator", "risk-management-calculator"] },
    ],
  },
];

/** Bonus tools kept from earlier finance launch */
export const BONUS_TOOLS = [
  { slug: "home-loan-calculator", title: "Home Loan Calculator", type: "emi", desc: "Home loan EMI planner — alias for home loan EMI.", config: { defaultAmount: 5000000, defaultRate: 8.5, defaultYears: 20 }, related: ["home-loan-emi-calculator", "mortgage-calculator", "loan-prepayment-calculator"] },
  { slug: "car-loan-calculator", title: "Car Loan Calculator", type: "emi", desc: "Car loan EMI with down payment.", config: { defaultAmount: 1200000, defaultRate: 9.5, defaultYears: 5, downPayment: true, defaultDown: 200000 }, related: ["car-loan-emi-calculator", "personal-loan-emi-calculator", "emi-calculator"] },
  { slug: "home-equity-calculator", title: "Home Equity Calculator", type: "equity", desc: "Home equity and borrowing capacity against property.", related: ["mortgage-calculator", "reverse-mortgage-calculator", "home-loan-emi-calculator"] },
  { slug: "loan-calculator", title: "Loan Calculator", type: "emi", desc: "General loan EMI and amortization calculator.", config: { defaultAmount: 1000000, defaultRate: 11, defaultYears: 5 }, related: ["emi-calculator", "loan-comparison-calculator", "loan-prepayment-calculator"] },
];

export function allTools() {
  const main = CATEGORIES.flatMap((c) => c.tools.map((t) => ({ ...t, category: c.id, categoryTitle: c.title })));
  const slugs = new Set(main.map((t) => t.slug));
  BONUS_TOOLS.forEach((t) => {
    if (!slugs.has(t.slug)) main.push({ ...t, category: "loan", categoryTitle: "Loan & EMI Calculators" });
  });
  return main;
}

export function featuredTools() {
  return allTools().filter((t) => t.featured);
}
