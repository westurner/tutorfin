"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { A11y, A11yAnnouncer, A11yUserPreferences, useUserPreferences } from "@react-three/a11y";
import { useIntl } from "react-intl";

/**
 * Accessible R3F scene wrapper.
 *
 * - `<A11yUserPreferences>` exposes the user's `prefers-reduced-motion` and
 *   high-contrast preferences to descendants via `useUserPreferences()`.
 * - `<A11y>` turns a 3D object into a focusable, screen-reader-announced
 *   interactive element.
 * - `<A11yAnnouncer>` (rendered next to, not inside, the Canvas) provides the
 *   ARIA live region that announces focus/press events.
 */
export function AccessibleScene() {
  return (
    <>
      <Canvas style={{ height: 360, width: "100%" }} camera={{ position: [3, 2, 4] }}>
        <A11yUserPreferences>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />

          <BudgetCoin
            position={[-1.2, 0, 0]}
            color="#2a9d8f"
            labelId="scene.coin.income"
            defaultLabel="Income coin. Activate to learn about income."
          />
          <BudgetCoin
            position={[1.2, 0, 0]}
            color="#e76f51"
            labelId="scene.coin.expense"
            defaultLabel="Expense coin. Activate to learn about expenses."
          />

          <OrbitControls makeDefault enableZoom={false} />
        </A11yUserPreferences>
      </Canvas>
      <A11yAnnouncer />
    </>
  );
}

function BudgetCoin({
  position,
  color,
  labelId,
  defaultLabel,
}: {
  position: [number, number, number];
  color: string;
  labelId: string;
  defaultLabel: string;
}) {
  const intl = useIntl();
  const description = intl.formatMessage({ id: labelId, defaultMessage: defaultLabel });

  return (
    <A11y
      role="button"
      description={description}
      actionCall={() => {
        // Wire to Zustand action / lesson navigation later.
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("tutorfin:coin", { detail: { labelId } }));
        }
      }}
    >
      <Coin position={position} color={color} />
    </A11y>
  );
}

function Coin({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Suspense fallback={null}>
      <ReducedMotionGroup position={position}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.12, 48]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.35} />
        </mesh>
      </ReducedMotionGroup>
    </Suspense>
  );
}

/** Honours `prefers-reduced-motion` by skipping the idle spin. */
function ReducedMotionGroup({
  position,
  children,
}: {
  position: [number, number, number];
  children: React.ReactNode;
}) {
  const a11yPrefersState = useUserPreferences();
  const reduceMotion = a11yPrefersState?.a11yPrefersState?.prefersReducedMotion ?? false;

  return (
    <group position={position} rotation={reduceMotion ? [0, 0, 0] : [0, Math.PI / 8, 0]}>
      {children}
    </group>
  );
}
