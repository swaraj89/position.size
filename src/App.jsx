import { useState } from "react";
import { calculatePosition, defaults } from "./util/sizerUtil.js";

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
      <label htmlFor={name}>{label}</label>
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

        <div className="workspace">
          <section className="inputs-panel" aria-label="Trade parameters">
            <div className="panel-top">
              <span className="eyebrow">YOUR TRADE, YOUR RULES</span>
              <button
                className="reset"
                onClick={() => setInput({ ...defaults })}
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
                        onClick={() => update("risk", value)}
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
                  : "Results will appear once all five inputs are valid."}
              </p>
            </div>
          </section>
        </div>

        <details className="method">
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
          <a href="https://swarajpanigrahi.in" target="_blank" rel="noreferrer">
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
