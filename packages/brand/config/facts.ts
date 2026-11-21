import { PUBLISH_UNVERIFIED_FACTS } from '../lib/env';

/**
 * Estate facts used in the copy, each with its provenance.
 *
 * The previous website (glazebrookecoffee.com) could not be reached while
 * this build was made, so these come second-hand from the project brief,
 * which reports what the old site said. They are marked `verified: false`
 * until the estate confirms them. Set `verified: true` once confirmed.
 *
 * With PUBLIC_PUBLISH_UNVERIFIED_FACTS=false, `fact()` returns null for every
 * unverified entry and the pages fall back to copy without the claim.
 */
interface Fact<T> {
  value: T;
  source: string;
  verified: boolean;
}

const BRIEF = 'Project brief (CLAUDE.md), reporting the previous glazebrookecoffee.com website';

export const facts = {
  established: { value: '1950s', source: BRIEF, verified: false } as Fact<string>,
  heritageYears: { value: 70, source: BRIEF, verified: false } as Fact<number>,
  familyOwned: { value: true, source: BRIEF, verified: false } as Fact<boolean>,
  elevationFeet: { value: { min: 3400, max: 4200 }, source: BRIEF, verified: false } as Fact<{ min: number; max: number }>,
};

export type FactKey = keyof typeof facts;

export function fact<K extends FactKey>(key: K): (typeof facts)[K]['value'] | null {
  const f = facts[key];
  if (f.verified || PUBLISH_UNVERIFIED_FACTS) return f.value;
  return null;
}

const ftToM = (ft: number) => Math.round((ft * 0.3048) / 10) * 10;
const fmt = (n: number) => n.toLocaleString('en-IN');

/** "3,400–4,200 feet" style string, or null when the fact is withheld. */
export function elevationRange() {
  const e = fact('elevationFeet');
  if (!e) return null;
  return {
    feet: `${fmt(e.min)}–${fmt(e.max)} feet`,
    metres: `${fmt(ftToM(e.min))}–${fmt(ftToM(e.max))} m`,
    ...e,
  };
}
