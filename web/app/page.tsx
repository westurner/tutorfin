"use client";

import { FormattedMessage } from "react-intl";
import { useExhibitStore } from "@/lib/store";

export default function HomePage() {
  const { locale, setLocale, manualReset } = useExhibitStore();

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>
        <FormattedMessage id="app.title" defaultMessage="TutorFin" />
      </h1>
      <p>
        <FormattedMessage
          id="app.tagline"
          defaultMessage="A guided financial-literacy exhibit."
        />
      </p>

      <section>
        <h2>
          <FormattedMessage id="lang.label" defaultMessage="Language" />
        </h2>
        {(["en-US", "es-US", "fr-CA"] as const).map((loc) => (
          <button
            key={loc}
            onClick={() => setLocale(loc)}
            disabled={loc === locale}
            style={{ marginRight: 8 }}
          >
            {loc}
          </button>
        ))}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <button
          onClick={() => {
            if (confirm("Reset the exhibit? Your scores will be cleared.")) {
              manualReset();
            }
          }}
        >
          <FormattedMessage id="reset.manual" defaultMessage="Reset exhibit" />
        </button>
      </section>
    </main>
  );
}
