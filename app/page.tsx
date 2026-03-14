"use client";
import { ClaudeTest } from "@/components/ClaudeTest";
import { TopNav } from "@/components/TopNav";
import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function AnimatedSection({
  children,
  className = "",
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const GREEN = "#2d7a4f";
const LIGHT_GREEN = "#68BA7F";
const DARK = "#0f2419";

export default function LandingPage() {
  const [quickAssets, setQuickAssets] = useState({
    cash: "",
    gold: "",
    investments: "",
  });
  const quickZakat =
    ((parseFloat(quickAssets.cash) || 0) +
      (parseFloat(quickAssets.gold) || 0) +
      (parseFloat(quickAssets.investments) || 0)) *
    0.025;

  return (
    <div style={{ fontFamily: 'Open Sans, sans-serif', color: DARK, overflowX: 'hidden' }}>
      {/* NAV */}
      <TopNav />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/mosque-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,18,0.55)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 90%, white 100%)' }} />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "120px 32px 80px",
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(104,186,127,0.2)",
              border: "1px solid rgba(104,186,127,0.4)",
              borderRadius: 50,
              padding: "6px 18px",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                fontSize: 11,
                letterSpacing: 3,
                color: LIGHT_GREEN,
                textTransform: "uppercase",
                fontFamily: "Open Sans, sans-serif",
              }}
            >
              Purify Your Wealth
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Fulfill Your Zakat
          </h1>
          <h2
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 700,
              color: LIGHT_GREEN,
              lineHeight: 1.1,
              marginBottom: 28,
            }}
          >
            Transform Lives
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 44px",
              fontFamily: "Open Sans, sans-serif",
            }}
          >
            Calculate your Zakat accurately and give with confidence. Every
            contribution brings hope to those in need and blessings to your
            wealth.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/calculator"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: LIGHT_GREEN,
                color: "white",
                padding: "16px 32px",
                borderRadius: 50,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "Open Sans, sans-serif",
                boxShadow: "0 8px 32px rgba(104,186,127,0.4)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Calculate Your Zakat →
            </a>
            <a
              href="#why"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.1)",
                color: "white",
                padding: "16px 32px",
                borderRadius: 50,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "Open Sans, sans-serif",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Learn More
            </a>
          </div>

        </div>
      </section>

      {/* WHY ZAKAT MATTERS */}
      <section id="why" style={{ padding: "100px 32px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <AnimatedSection style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 3,
                color: LIGHT_GREEN,
                textTransform: "uppercase",
                fontFamily: "Open Sans, sans-serif",
                marginBottom: 12,
              }}
            >
              A Sacred Duty
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Why Zakat Matters
            </h2>
            <p
              style={{
                fontSize: 18,
                color: "#666",
                maxWidth: 600,
                margin: "0 auto",
                lineHeight: 1.7,
                fontFamily: "Open Sans, sans-serif",
              }}
            >
              More than charity, Zakat is a divine obligation that purifies
              wealth, elevates souls, and transforms communities.
            </p>
          </AnimatedSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: "🤲",
                title: "Purification of Wealth",
                desc: "Zakat purifies your wealth and soul, removing greed and fostering compassion for those in need.",
                verse:
                  "Take from their wealth a charity to purify them — Quran 9:103",
                delay: 0,
              },
              {
                icon: "⚖️",
                title: "Social Justice",
                desc: "A divine system ensuring wealth circulates fairly, preventing inequality and supporting the vulnerable.",
                verse: "And establish prayer and give Zakat — Quran 2:43",
                delay: 0.1,
              },
              {
                icon: "🛡️",
                title: "Protection & Barakah",
                desc: "Giving Zakat protects your remaining wealth and brings divine blessings and growth.",
                verse:
                  "Allah destroys interest and gives increase for charities — Quran 2:276",
                delay: 0.2,
              },
              {
                icon: "🕌",
                title: "Third Pillar of Islam",
                desc: "One of the five fundamental pillars, making it an essential obligation for every eligible Muslim.",
                verse: "Mentioned 82 times in the Quran alongside prayer",
                delay: 0.3,
              },
            ].map((card) => (
              <AnimatedSection key={card.title} delay={card.delay}>
                <div
                  style={{
                    background: "#fafafa",
                    borderRadius: 20,
                    padding: 32,
                    border: "1px solid #f0f0f0",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: `${LIGHT_GREEN}20`,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      marginBottom: 16,
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3
                    style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#666",
                      lineHeight: 1.7,
                      marginBottom: 16,
                      fontFamily: "Open Sans, sans-serif",
                    }}
                  >
                    {card.desc}
                  </p>
                  <div
                    style={{
                      borderLeft: `3px solid ${LIGHT_GREEN}`,
                      paddingLeft: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        color: LIGHT_GREEN,
                        fontStyle: "italic",
                        fontFamily: "Open Sans, sans-serif",
                        margin: 0,
                      }}
                    >
                      {card.verse}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.2} style={{ marginTop: 48 }}>
            <div
              style={{
                background: `linear-gradient(135deg, ${GREEN}, ${LIGHT_GREEN})`,
                borderRadius: 24,
                padding: "48px 40px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 12,
                }}
              >
                Your Zakat Can Change Everything
              </h3>
              <p
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "Open Sans, sans-serif",
                  lineHeight: 1.7,
                  maxWidth: 600,
                  margin: "0 auto",
                }}
              >
                Imagine a child getting their first meal of the day, a family
                finding shelter, a student receiving education — all through
                your generosity.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        style={{ padding: "100px 32px", background: "#f8fdf9" }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <AnimatedSection>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 3,
                color: LIGHT_GREEN,
                textTransform: "uppercase",
                fontFamily: "Open Sans, sans-serif",
                marginBottom: 12,
              }}
            >
              Simple & Accurate
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 700,
                marginBottom: 20,
                lineHeight: 1.2,
              }}
            >
              Calculate Your Zakat in Minutes
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#666",
                lineHeight: 1.8,
                marginBottom: 36,
                fontFamily: "Open Sans, sans-serif",
              }}
            >
              Our calculator follows authentic Islamic guidelines to help you
              determine your exact Zakat obligation. Just enter your assets, and
              we'll handle the rest.
            </p>
            {[
              {
                icon: "📋",
                title: "Easy Input",
                desc: "Add all your zakatable assets in one guided step-by-step flow",
              },
              {
                icon: "⚡",
                title: "Instant Results",
                desc: "Get your Zakat amount calculated instantly with 2.5% precision",
              },
              {
                icon: "💳",
                title: "Direct Payment",
                desc: "Pay your Zakat securely to verified charitable organizations",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{ display: "flex", gap: 16, marginBottom: 24 }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: `${LIGHT_GREEN}20`,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#888",
                      fontFamily: "Open Sans, sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div
              style={{
                background: "white",
                borderRadius: 24,
                padding: 36,
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: GREEN,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                Quick Calculator
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#888",
                  marginBottom: 24,
                  fontFamily: "Open Sans, sans-serif",
                }}
              >
                Enter your zakatable assets below
              </p>
              {[
                { key: "cash", label: "Cash & Savings ($)" },
                { key: "gold", label: "Gold & Silver ($)" },
                { key: "investments", label: "Investments & Assets ($)" },
              ].map((field) => (
                <div key={field.key} style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#444",
                      fontFamily: "Open Sans, sans-serif",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={quickAssets[field.key as keyof typeof quickAssets]}
                    onChange={(e) =>
                      setQuickAssets((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#f5f5f5",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 15,
                      fontFamily: "Open Sans, sans-serif",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
              <div
                style={{
                  borderTop: "1px solid #f0f0f0",
                  paddingTop: 16,
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: "Open Sans, sans-serif",
                  }}
                >
                  Your Zakat (2.5%)
                </span>
                <span style={{ fontSize: 24, fontWeight: 700, color: GREEN }}>
                  $
                  {quickZakat.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <a
                href="/calculator"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: GREEN,
                  color: "white",
                  padding: "16px",
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                  fontFamily: "Open Sans, sans-serif",
                }}
              >
                Continue to Full Calculator →
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* IMPACT */}
      <section
        id="impact"
        style={{ padding: "100px 32px", background: "white" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <AnimatedSection style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 3,
                color: LIGHT_GREEN,
                textTransform: "uppercase",
                fontFamily: "Open Sans, sans-serif",
                marginBottom: 12,
              }}
            >
              Where It Goes
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Your Zakat, Directed With Purpose
            </h2>
            <p
              style={{
                fontSize: 18,
                color: "#666",
                fontFamily: "Open Sans, sans-serif",
                lineHeight: 1.7,
              }}
            >
              Zakat is one of Islam's most powerful tools for change. Here are
              the causes your contribution can support.
            </p>
          </AnimatedSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              marginBottom: 64,
            }}
          >
            {[
              {
                icon: "🍽️",
                title: "Food Security",
                stat: "Feeding families facing hunger",
                delay: 0,
              },
              {
                icon: "🏠",
                title: "Shelter",
                stat: "Housing those without a safe home",
                delay: 0.1,
              },
              {
                icon: "🎓",
                title: "Education",
                stat: "Keeping children in school",
                delay: 0.2,
              },
              {
                icon: "🏥",
                title: "Healthcare",
                stat: "Delivering essential medical care",
                delay: 0.3,
              },
            ].map((item) => (
              <AnimatedSection key={item.title} delay={item.delay}>
                <div
                  style={{
                    background: "#fafafa",
                    borderRadius: 20,
                    padding: "28px 20px",
                    textAlign: "center",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 12 }}>
                    {item.icon}
                  </div>
                  <div
                    style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: LIGHT_GREEN,
                      fontWeight: 600,
                      fontFamily: "Open Sans, sans-serif",
                    }}
                  >
                    {item.stat}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: "100px 32px", background: "#f8fdf9" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <AnimatedSection style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 3,
                color: LIGHT_GREEN,
                textTransform: "uppercase",
                fontFamily: "Open Sans, sans-serif",
                marginBottom: 12,
              }}
            >
              Why Choose Us
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Zakat Made Simple & Trustworthy
            </h2>
            <p
              style={{
                fontSize: 18,
                color: "#666",
                maxWidth: 600,
                margin: "0 auto",
                fontFamily: "Open Sans, sans-serif",
                lineHeight: 1.7,
              }}
            >
              We've designed every aspect of our platform to make fulfilling
              your Zakat obligation as easy and meaningful as possible.
            </p>
          </AnimatedSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 40,
            }}
          >
            {[
              {
                icon: "🔒",
                title: "100% Secure & Transparent",
                desc: "Your donations are protected with bank-level security. Track every dollar to see exactly where it goes.",
                delay: 0,
              },
              {
                icon: "🕐",
                title: "Calculate Anytime",
                desc: "Access our Zakat calculator 24/7 from anywhere. Get instant, accurate results based on current nisab values.",
                delay: 0.1,
              },
              {
                icon: "✅",
                title: "Verified Recipients",
                desc: "All beneficiaries are thoroughly verified to ensure your Zakat reaches those truly eligible.",
                delay: 0.2,
              },
              {
                icon: "📖",
                title: "Scholar Approved",
                desc: "Our calculations and distribution methods are reviewed and approved by Islamic scholars.",
                delay: 0.3,
              },
              {
                icon: "🌍",
                title: "Global Reach",
                desc: "Support communities worldwide or choose specific regions where your Zakat will make the biggest impact.",
                delay: 0.4,
              },
              {
                icon: "📱",
                title: "Easy Payment Options",
                desc: "Pay securely via credit card, bank transfer, or digital wallet. Get instant receipts for your records.",
                delay: 0.5,
              },
            ].map((item) => (
              <AnimatedSection key={item.title} delay={item.delay}>
                <div style={{ padding: "8px 0" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: `${LIGHT_GREEN}20`,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      marginBottom: 16,
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#777",
                      lineHeight: 1.7,
                      fontFamily: "Open Sans, sans-serif",
                      margin: 0,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        style={{
          position: "relative",
          padding: "100px 32px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${DARK} 0%, #1a3a2a 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 70% 50%, rgba(104,186,127,0.15) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <AnimatedSection>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 700,
                color: "white",
                marginBottom: 20,
                lineHeight: 1.2,
              }}
            >
              Don't Wait. Your Zakat is Due.
            </h2>
            <p
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.7,
                marginBottom: 40,
                fontFamily: "Open Sans, sans-serif",
              }}
            >
              Ramadan is the perfect time to fulfill this sacred obligation.
              Calculate your Zakat now and bring blessings to your wealth while
              transforming lives.
            </p>
            <a
              href="/calculator"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "white",
                color: GREEN,
                padding: "18px 40px",
                borderRadius: 50,
                fontSize: 17,
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "Open Sans, sans-serif",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Calculate My Zakat Now →
            </a>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 32,
                marginTop: 32,
              }}
            >
              {[
                "100% Transparent",
                "Scholar Approved",
                "Instant Calculation",
              ].map((badge) => (
                <div
                  key={badge}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: LIGHT_GREEN,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: "Open Sans, sans-serif",
                    }}
                  >
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0a1a0f", padding: "60px 32px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 48,
          }}
        >
          <div style={{ maxWidth: 340 }}>
            <img src="/logo.png" alt="Zakatly" style={{ height: 40, width: 'auto', objectFit: 'contain', marginBottom: 16, filter: 'brightness(0) invert(1)' }} />
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.7,
                fontFamily: "Open Sans, sans-serif",
              }}
            >
              Making Zakat simple, transparent, and impactful for Muslims
              worldwide.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 16, fontFamily: "Open Sans, sans-serif", letterSpacing: 0.5 }}>
              Contact
            </div>
            {["support@zakatly.app", "San Ramon, CA"].map((link) => (
              <div key={link} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 10, fontFamily: "Open Sans, sans-serif" }}>
                {link}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            maxWidth: 1100,
            margin: "40px auto 0",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "Open Sans, sans-serif" }}>
            © 2026 Zakatly. All rights reserved.
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "Open Sans, sans-serif" }}>
            Made with ❤️ for the Ummah
          </span>
        </div>
      </footer>
       
    </div>
  );
}
