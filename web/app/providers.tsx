"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { IntlProvider } from "react-intl";
import { useExhibitStore, type Locale } from "@/lib/store";
import { useIdleReset } from "@/lib/idle-reset";
import { ResetPrompt } from "@/components/reset-prompt";

import enUS from "@/lib/messages/en-US.json";
import esUS from "@/lib/messages/es-US.json";
import frCA from "@/lib/messages/fr-CA.json";

const MESSAGES: Record<Locale, Record<string, string>> = {
  "en-US": enUS,
  "es-US": esUS,
  "fr-CA": frCA,
};

export function Providers({ children }: { children: ReactNode }) {
  const locale = useExhibitStore((s) => s.locale);
  const messages = useMemo(() => MESSAGES[locale] ?? MESSAGES["en-US"], [locale]);

  const { confirming, secondsLeft, dismiss, confirm } = useIdleReset();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <IntlProvider locale={locale} defaultLocale="en-US" messages={messages}>
      {children}
      {mounted && confirming && (
        <ResetPrompt secondsLeft={secondsLeft} onDismiss={dismiss} onConfirm={confirm} />
      )}
    </IntlProvider>
  );
}
