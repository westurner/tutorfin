"use client";

import { FormattedMessage } from "react-intl";

interface Props {
  secondsLeft: number;
  onDismiss: () => void;
  onConfirm: () => void;
}

export function ResetPrompt({ secondsLeft, onDismiss, onConfirm }: Props) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="reset-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: 12,
          maxWidth: 480,
          textAlign: "center",
        }}
      >
        <h2 id="reset-title">
          <FormattedMessage id="reset.title" defaultMessage="Still here?" />
        </h2>
        <p>
          <FormattedMessage
            id="reset.body"
            defaultMessage="The exhibit will reset in {seconds} seconds."
            values={{ seconds: secondsLeft }}
          />
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button onClick={onDismiss} autoFocus>
            <FormattedMessage id="reset.keep" defaultMessage="Keep going" />
          </button>
          <button onClick={onConfirm}>
            <FormattedMessage id="reset.now" defaultMessage="Reset now" />
          </button>
        </div>
      </div>
    </div>
  );
}
