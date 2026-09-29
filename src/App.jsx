import { trackSizeEvent, trackPlanEdit } from "./analytics.js";
import { useEffect, useRef, useState } from "react";
import { calculatePosition, defaults } from "./util/sizerUtil.js";

const fieldNames = [
  "capital",
  "allocation",
  "risk",
  "entry",
  "stop",
  "target",
  "minRewardRisk",
];
const fieldLabels = [
  "Portfolio value",
  "Max. allocation",
  "Risk per trade",
  "Entry price",
  "Stop-loss price",
  "Target price",
  "Minimum reward / risk",
];

function focusField(name) {
  const field = document.getElementById(name);
  field?.focus();
  field?.select();
}

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
const number = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);

function Field({
  name,
  label,
  value,
  onChange,
  error,
  suffix = "₹",
  hint,
  max,
}) {
  return (
    <div className="field">
      <div className="field-label-row">
        <label htmlFor={name}>{label}</label>
        <kbd className="field-shortcut" aria-hidden="true">
          Alt {fieldNames.indexOf(name) + 1}
        </kbd>
      </div>
      <div className={`input-wrap ${error ? "invalid" : ""}`}>
        {suffix === "₹" && <span aria-hidden="true">₹</span>}
        <input
          id={name}
          name={name}
          type="number"
          inputMode="decimal"
          min="0"
          max={max}
          step="0.01"
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          aria-keyshortcuts={`Alt+${fieldNames.indexOf(name) + 1}`}
          aria-invalid={!!error}
          aria-describedby={`${name}-hint`}
        />
        {suffix !== "₹" && <span aria-hidden="true">{suffix}</span>}
      </div>
      <p id={`${name}-hint`} className={error ? "field-error" : "hint"}>
        {error || hint}
      </p>
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState({ ...defaults });
  const { errors, result } = calculatePosition(input);
  const shortcutHelp = useRef(null);
  const previousFocus = useRef(null);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.getModifierState("AltGraph")
      )
        return;
      const editing =
        event.target instanceof HTMLElement &&
        (event.target.matches("input, textarea, select") ||
          event.target.isContentEditable);
      if (event.altKey && !event.shiftKey && /^Digit[1-7]$/.test(event.code)) {
        event.preventDefault();
        focusField(fieldNames[Number(event.code.slice(-1)) - 1]);
        return;
      }
      if (event.altKey && event.shiftKey && event.code === "KeyR") {
        event.preventDefault();
        setInput({ ...defaults });
        trackSizeEvent("reset");
        focusField("entry");
        return;
      }
      if (event.altKey) return;
      if (event.key === "?" && !editing) {
        event.preventDefault();
        const help = shortcutHelp.current;
        if (!help.open) {
          previousFocus.current = document.activeElement;
          help.open = true;
          help.querySelector("summary").focus();
        } else {
          help.open = false;
          previousFocus.current?.focus();
        }
      } else if (event.key === "Escape") {
        if (shortcutHelp.current.open) {
          shortcutHelp.current.open = false;
          if (shortcutHelp.current.contains(document.activeElement))
            previousFocus.current?.focus();
        } else if (editing) {
          event.target.blur();
        }
      } else if (
        event.key === "Enter" &&
        event.target instanceof HTMLInputElement
      ) {
        const index = fieldNames.indexOf(event.target.id);
        if (index < 0) return;
        event.preventDefault();
        const next = index + (event.shiftKey ? -1 : 1);
        if (next < 0) return;
        if (next >= fieldNames.length)
          document.getElementById("trade-fit-summary").focus();
        else focusField(fieldNames[next]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const update = (name, value) =>
    setInput((previous) => ({ ...previous, [name]: value }));
  const fieldProps = (name) => ({
    name,
    value: input[name],
    onChange: update,
    error: errors[name],
  });

  return (
    <div className="shell">
      <a className="skip-link" href="#calculator">
        Skip to calculator
      </a>
      <header className="nav">
        <a className="wordmark" href="./" aria-label="Position.Size home">
          <span className="logo-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          position<span className="accent">.</span>size
        </a>
        <div className="nav-right">
          <span className="micro">A LITTLE CLARITY. BEFORE EVERY TRADE.</span>
          <a
            className="source-link"
            onClick={() => trackSizeEvent("github-click")}
            href="https://github.com/swaraj89/position.size"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main id="calculator">
        <section className="hero" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">
              <span className="live-dot" /> THE POSITION SIZING CALCULATOR
            </p>
            <h1 id="page-title">
              Every trade.
              <br />
              <span>A calculated move.</span>
            </h1>
            <p className="intro">
              Know your size. Define your risk. Enter your next trade with a
              plan.
            </p>
          </div>
          <div className="hero-note">
            <span className="crosshair" aria-hidden="true">
              ⌖
            </span>
            <p>
              Built for discipline.
              <br />
              <span>Not guesswork.</span>
            </p>
          </div>
        </section>

        <div className="shortcut-bar">
          <button className="edit-trade" onClick={() => focusField("entry")}>
            Edit trade <span aria-hidden="true">↗</span>
          </button>
          <span className="keyboard-note">
            Enter → next field · Shift + Enter → previous
          </span>
          <details className="shortcut-help" ref={shortcutHelp}>
            <summary>
              Keyboard shortcuts <kbd>?</kbd>
            </summary>
            <div className="shortcut-content">
              <p>
                Use Alt on Windows/Linux, Option (⌥) on Mac. Jumping to a field
                selects its value so you can replace it immediately.
              </p>
              <dl>
                {fieldNames.map((name, index) => (
                  <div key={name}>
                    <dt>{fieldLabels[index]}</dt>
                    <dd>
                      <kbd>Alt + {index + 1}</kbd>
                    </dd>
                  </div>
                ))}
                <div>
                  <dt>Next / previous field</dt>
                  <dd>
                    <kbd>Enter / Shift + Enter</kbd>
                  </dd>
                </div>
                <div>
                  <dt>Restore defaults</dt>
                  <dd>
                    <kbd>Alt + Shift + R</kbd>
                  </dd>
                </div>
                <div>
                  <dt>Leave field / close help</dt>
                  <dd>
                    <kbd>Esc</kbd>
                  </dd>
                </div>
              </dl>
              <p>
                Enter on the last field moves to the trade-fit summary. Tab and
                Shift + Tab work normally. Press ? outside an input to toggle
                this guide. Shortcuts never place a trade.
              </p>
            </div>
          </details>
        </div>
        <div className="workspace">
          <section
            className="inputs-panel"
            aria-label="Trade parameters"
            onBlur={(event) => {
              if (
                event.target instanceof HTMLInputElement &&
                Object.hasOwn(defaults, event.target.name)
              )
                trackPlanEdit(event.target.name, input);
            }}
          >
            <div className="panel-top">
              <span className="eyebrow">YOUR TRADE, YOUR RULES</span>
              <button
                className="reset"
                aria-keyshortcuts="Alt+Shift+R"
                title="Restore defaults (Alt + Shift + R)"
                onClick={() => {
                  setInput({ ...defaults });
                  trackSizeEvent("reset");
                }}
              >
                <span aria-hidden="true">↺</span> Reset
              </button>
            </div>
            <section
              className="input-section"
              aria-labelledby="portfolio-heading"
            >
              <div className="section-heading">
                <span className="section-number">01</span>
                <h2 id="portfolio-heading">Set your capital</h2>
                <span className="section-tag">PORTFOLIO</span>
              </div>
              <Field
                {...fieldProps("capital")}
                label="Portfolio value"
                hint="Your total trading capital."
              />
              <div className="two-columns">
                <div>
                  <Field
                    {...fieldProps("allocation")}
                    label="Max. allocation"
                    suffix="%"
                    max="100"
                    hint="Capital available for one trade."
                  />
                  <input
                    className="range"
                    name="allocation"
                    type="range"
                    min="0"
                    max="100"
                    step="0.5"
                    value={Math.min(
                      100,
                      Math.max(0, Number(input.allocation) || 0),
                    )}
                    onChange={(event) =>
                      update("allocation", event.target.value)
                    }
                    aria-label="Max. allocation slider"
                  />
                </div>
                <div>
                  <Field
                    {...fieldProps("risk")}
                    label="Risk per trade"
                    suffix="%"
                    max="100"
                    hint="Portfolio loss you are willing to accept."
                  />
                  <div className="presets" aria-label="Risk presets">
                    {["0.5", "1", "2.5"].map((value) => (
                      <button
                        key={value}
                        aria-pressed={Number(input.risk) === Number(value)}
                        onClick={() => {
                          update("risk", value);
                          trackSizeEvent("risk-preset");
                          trackPlanEdit("risk", { ...input, risk: value });
                        }}
                      >
                        {value}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <section
              className="input-section trade-section"
              aria-labelledby="trade-heading"
            >
              <div className="section-heading">
                <span className="section-number">02</span>
                <h2 id="trade-heading">Plan your entry</h2>
                <span className="long-badge">↗ LONG EQUITY</span>
              </div>
              <div className="two-columns">
                <Field
                  {...fieldProps("entry")}
                  label="Entry price"
                  hint="Your planned price per share."
                />
                <Field
                  {...fieldProps("stop")}
                  label="Stop-loss price"
                  hint="Your exit price if the trade moves against you."
                />
              </div>
              <div className="stop-note">
                <span aria-hidden="true">↔</span>
                <span>Distance to stop</span>
                <strong>
                  {result ? `${money(result.distance)} / share` : "—"}
                </strong>
                <span>{result ? `${number(result.stopPercent)}%` : "—"}</span>
              </div>
            </section>
            <section
              className="input-section trade-section"
              aria-labelledby="target-heading"
            >
              <div className="section-heading">
                <span className="section-number">03</span>
                <h2 id="target-heading">Define your upside</h2>
              </div>
              <div className="two-columns">
                <Field
                  {...fieldProps("target")}
                  label="Target price"
                  hint="Your planned profit-taking price per share."
                />
                <Field
                  {...fieldProps("minRewardRisk")}
                  label="Minimum reward / risk"
                  suffix="×"
                  hint="2× means ₹2 potential reward per ₹1 at risk. Your rule, not a recommendation."
                />
              </div>
            </section>
            <p className="local-note">
              <span aria-hidden="true">◈</span> Just you and the numbers. All
              calculations stay in your browser.
            </p>
          </section>

          <section
            className="result-panel"
            aria-label="Position sizing result"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="result-heading">
              <span className="eyebrow">YOUR POSITION PLAN</span>
              <span className="result-status">
                <span className="live-dot" />
                {result ? "CALCULATED" : "CHECK INPUTS"}
              </span>
            </div>
            <div className="quantity-block">
              <p>Position size</p>
              <div className="quantity">
                <span data-testid="quantity">
                  {result ? number(result.quantity) : "—"}
                </span>
                <span className="shares">shares</span>
              </div>
              <div className="constraint">
                {result
                  ? result.quantity === 0
                    ? "No whole shares fit within your limits"
                    : `Sized by your ${result.constraint.toLowerCase()}`
                  : "Complete the highlighted fields to calculate"}
              </div>
            </div>
            <div className="primary-metrics">
              <div>
                <span>Position value</span>
                <strong data-testid="cost">
                  {result ? money(result.cost) : "—"}
                </strong>
              </div>
              <div>
                <span>Estimated loss at stop</span>
                <strong className="loss" data-testid="loss">
                  {result ? money(result.loss) : "—"}
                </strong>
              </div>
            </div>
            <div className="primary-metrics upside-metrics">
              <div>
                <span>Potential profit at target</span>
                <strong className="accent" data-testid="profit">
                  {result ? money(result.profit) : "—"}
                </strong>
              </div>
              <div>
                <span>Reward / risk</span>
                <strong data-testid="reward-risk">
                  {result ? `${number(result.rewardRisk)}×` : "—"}
                </strong>
              </div>
            </div>
            <div
              className="trade-fit"
              id="trade-fit-summary"
              tabIndex={-1}
              role="region"
              aria-label="Trade-fit summary"
              data-fit={
                result ? (result.tradeFits ? "pass" : "fail") : "pending"
              }
            >
              <p className="eyebrow">TRADE-FIT SUMMARY</p>
              <h2 data-testid="trade-fit">
                {!result
                  ? "Check your inputs"
                  : result.tradeFits
                    ? "Meets your rules"
                    : "Does not meet your rules"}
              </h2>
              {result ? (
                <ul>
                  <li>
                    <span aria-hidden="true">
                      {result.quantity > 0 ? "✓" : "×"}
                    </span>
                    {result.quantity > 0
                      ? "At least one whole share fits your limits"
                      : "No whole shares fit your risk and allocation limits"}
                  </li>
                  <li>
                    <span aria-hidden="true">
                      {result.rewardRiskPass ? "✓" : "×"}
                    </span>
                    {result.rewardRiskPass
                      ? "Reward / risk meets"
                      : "Reward / risk is below"}{" "}
                    your {input.minRewardRisk}× minimum
                  </li>
                  <li>
                    <span aria-hidden="true">✓</span>Planned loss within risk
                    budget
                  </li>
                  <li>
                    <span aria-hidden="true">✓</span>Position value within
                    allocation cap
                  </li>
                </ul>
              ) : (
                <p>
                  Complete the highlighted fields to check this trade against
                  your rules.
                </p>
              )}
              <p className="fit-caveat">
                A check of your numbers, not a buy signal. Target profit is
                hypothetical and excludes fees, taxes and slippage.
              </p>
            </div>
            <div className="allocation-chart">
              <div>
                <span>Portfolio allocation</span>
                <strong>
                  {result ? `${number(result.allocationUsed)}%` : "—"}
                </strong>
              </div>
              <div
                className="bar"
                role="img"
                aria-label={
                  result
                    ? `${number(result.allocationUsed)} percent of capital allocated`
                    : "No allocation calculated"
                }
              >
                <span style={{ width: `${result?.allocationUsed || 0}%` }} />
              </div>
              <div className="chart-legend">
                <span>
                  <i /> This trade
                </span>
                <span>
                  {result ? `${money(result.remaining)} unallocated` : "—"}
                </span>
              </div>
            </div>
            <dl className="detail-metrics">
              <div>
                <dt>
                  Allocation cap{" "}
                  <span>
                    {input.allocation && !errors.allocation
                      ? `(${input.allocation}%)`
                      : ""}
                  </span>
                </dt>
                <dd>{result ? money(result.cap) : "—"}</dd>
              </div>
              <div>
                <dt>
                  Risk budget{" "}
                  <span>
                    {input.risk && !errors.risk ? `(${input.risk}%)` : ""}
                  </span>
                </dt>
                <dd>{result ? money(result.budget) : "—"}</dd>
              </div>
              <div>
                <dt>Actual portfolio risk</dt>
                <dd>{result ? `${number(result.riskUsed)}%` : "—"}</dd>
              </div>
            </dl>
            <div className="result-note">
              <span aria-hidden="true">↳</span>
              <p>
                {result
                  ? "Rounded down to whole shares, within both your risk budget and allocation cap."
                  : "Results will appear once all inputs are valid."}
              </p>
            </div>
          </section>
        </div>

        <details
          className="method"
          onToggle={(event) => {
            if (event.currentTarget.open) trackSizeEvent("formula-open");
          }}
        >
          <summary>
            <span>
              <span className="section-number">↳</span> The math behind your
              move
            </span>
            <span className="expand" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="method-content">
            <p>
              Two limits. One position. Divide your risk budget by the
              entry-to-stop distance, then compare that quantity with what your
              allocation can buy. Take the smaller number and round down.
            </p>
            <code>
              shares = floor(min(risk budget ÷ stop distance, allocation cap ÷
              entry price))
            </code>
            <p>
              Reward / risk = (target − entry) ÷ (entry − stop). Potential
              profit = shares × (target − entry). A trade meets your rules only
              when at least one share fits and its unrounded reward / risk meets
              your minimum. Target and minimum ratio do not change position
              size. The displayed ratio is rounded to two decimals.
            </p>
            <p>
              Long equity positions only. Estimated loss assumes an exit at your
              stop price; gaps, slippage, fees and taxes can change the actual
              outcome.
            </p>
          </div>
        </details>
        <div className="bottom-note">
          <span className="micro">PLAN FIRST. TRADE SECOND.</span>
          <p>A planning tool, not investment advice. Markets carry risk.</p>
        </div>
      </main>
      <footer>
        <span>
          Made by{" "}
          <a
            href="https://swarajpanigrahi.in"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackSizeEvent("portfolio-click")}
          >
            Swaraj Panigrahi ↗
          </a>
        </span>
        <span className="micro">LESS GUESSWORK. MORE INTENTION.</span>
        <span>
          INR <span className="accent">/</span> ₹
        </span>
      </footer>
    </div>
  );
}
