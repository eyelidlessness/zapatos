/**
 * Evaluates to `true` if types `X` and `Y` are exactly identical.
 */
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ?
  true :
  false;
