# TypeScript Talk

## No `any`
- **Wie bringt man den Typchecker dazu das anzukreiden?**  
  `noImplicitAny`

## Strict null checks
- Aktivieren mit `strictNullChecks`

## Don’t use `let`!
- In 99 % der Fälle kann man auf `const` umstellen und erhält funktionaleren, nachvollziehbareren Code.

## Typisieren von Funktionen (?)

## Interfaces vs. Type Alias
- **Was sollte der Default sein?**
- *Effective TypeScript* empfiehlt `interface`, außer man benötigt spezielle Features von `type`.
- **Meine Sicht:** Semantisch meint man meistens `type`.
- **Wo funktioniert `interface` nicht?**
  - Union Types können nicht durch Interfaces erweitert werden
  - Typisieren von Funktionen sieht mit `type` besser aus
  - Mapped Types & Conditional Types
- **Wo funktioniert `type` nicht?**
  - `extends` in `interface` vs. `T & { x: string }`
  - Zusammenführen (Merken) von Interfaces, wenn man sie zweimal definiert (z. B. in *.d.ts*)
- Stil lässt sich per ESLint‑Regel `consistent-type-definitions` erzwingen

## `readonly`
- Zieht sich ggf. durch Funktionsketten und führt zu saubererem Code
- Es gibt auch `DeepReadonly` aus **ts‑essentials**
- Kopien per Spread erstellen

## Kleine Helfer
- `Pick<State, …>`
- `ReturnType<typeof someFunction>`

## Index‑Signature‑Types vermeiden
- Beispiel: `{ [key: string]: string }`

## Gegen eine Schnittstelle (oder einen Type) entwickeln
- Beispiel: `type DB` definieren, der nur die wirklich benötigten Funktionen enthält.  
  In der Praxis kann trotzdem eine echte DB verwendet werden – im Test wird es dadurch einfacher!

## Domain‑Typen statt Primitives

```ts
type Email = string & { readonly __brand: 'Email' };

const asEmail = (s: string): Email => {
  if (!/^[\w.-]+@/.test(s)) throw new Error('Invalid email');
  return s as Email;
};

function sendMail(to: Email, subject: string) { /* … */ }

sendMail('not-an-email', 'Hi');
```

## Class vs. Function
- Sichtbarkeiten, Closures etc.

## Union & Match statt `switch`

```ts
type Opened    = { type: 'OPENED';    openedAt: Date };
type Deposited = { type: 'DEPOSIT';   amount: number };
type Withdrawn = { type: 'WITHDRAWN'; amount: number; success: boolean };

type AccountEvent = Opened | Deposited | Withdrawn;

const match =
  <U extends { type: string }, R>(handlers: Record<U['type'], (u: any) => R>) =>
  (u: U): R => handlers[u.type](u);

const fee = match<AccountEvent, number>({
  OPENED:    () => 0,
  DEPOSIT:   (e) => e.amount > 1_000 ? e.amount * 0.02 : 10,
  WITHDRAWN: (e) => e.success ? e.amount * 0.03 : 15,
})(event);
```
