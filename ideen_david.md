# TypeScript Talk

# Machen wir:

## No `any`
- **Wie bringt man den Typchecker dazu das anzukreiden?**  
  `noImplicitAny`

## Strict null checks
- Aktivieren mit `strictNullChecks`

## Immutablitiy

### Don’t use `let`!
- In 99 % der Fälle kann man auf `const` umstellen und erhält funktionaleren, nachvollziehbareren Code.

### `readonly`
- Zieht sich ggf. durch Funktionsketten und führt zu saubererem Code
- Es gibt auch `DeepReadonly` aus **ts‑essentials**
- Kopien per Spread erstellen (mit conditionals):

```ts
const pharaoh = { ...nameTitle, ...(hasDates && {start: -2589, end: -2566})};
``` 


# Noch zu besprechen:

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

## TypeGuards

```ts
function isInputElement(el: Element): el is HTMLInputElement {
	return 'value' in el;
}
function getElementContent(el: HTMLElement) {
	if (isInputElement(el)) {
		return el.value;
	}
	return el.textContent;
}
```

## String Literale vs. Enums:

String Literale:

```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python';

function greet(lang: Language) {
  console.log(`Hello, ${lang}-Developer!`);
}

greet('Python');        // ✅
greet('C#');             // ❌ Fehler: Argument of type '"C#"' is not assignable to parameter of type 'Language'.
```

Kann man auch ableiten:

```ts
const languages = ['JavaScript', 'TypeScript', 'Python'] as const;
type Language2 = typeof languages[number]; // 'JavaScript' | 'TypeScript' | 'Python'
```

Und Enums
```ts
enum LanguageEnum {
  JavaScript = 'JavaScript',
  TypeScript = 'TypeScript',
  Python = 'Python',
}

function greetEnum(lang: LanguageEnum) {
  console.log(`Hello, ${lang}-Developer!`);
}

greetEnum(LanguageEnum.Python); // ✅
```

| Szenario                                             | String-Literal-Union         | Enum                             |
|------------------------------------------------------|-------------------------------|----------------------------------|
| **Nur Typ-Sicherheit, kein Laufzeit-Mapping**        | ✅ Ideal                      | ❌ Overkill                      |
| **Discriminated Unions / Pattern-Matching**          | ✅ Standardlösung             | ❌ Umständlich                   |
| **Zentrale Liste, Iteration & Reverse-Lookup nötig** | ❌ Umständlich                | ✅ Perfekt                       |
| **Verwendung in JSON-APIs / Serialisierung**         | ✅ Sauber                     | ✅ Klarer                        |
| **Automatisches Refactoring / große Code-Basis**     | ✅ (mit literal-unions)       | ✅ (IDE-Unterstützung oft besser) |

## Discriminated Unions

Wichtig um State fehlerfrei abzubilden.

```ts
type ErrorResponse = {
  message: string;
  statusCode: number;
    cause: string;
    response_type: "error";  
};

type SuccessResponse = {
    message: string;
    statusCode: number;
    data: Record<string, unknown>;
    response_type: "success";  
};

type Result = ErrorResponse | SuccessResponse;
```

könnte man vielleicht mit __Union & Match__ verbinden.


## Result Types

Wie in next
