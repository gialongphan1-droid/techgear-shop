# Copilot Operator Goal Templates

## Bug fix

```text
Fix [bug name] in [area].

Constraints:
- Keep the fix minimal and localized.
- Do not change public API unless required.
- Add or update tests close to the behavior gap if needed.

Stop only when:
- relevant tests pass
- lint passes
- no high or critical blockers remain
- score >= 85
```

## Feature implementation

```text
Implement [feature] in [area].

Constraints:
- Follow existing architecture and naming patterns.
- Prefer incremental changes over broad rewrites.
- Update tests and docs affected by the feature.

Stop only when:
- feature works in the intended path
- tests pass
- lint/build pass
- no high or critical blockers remain
- score >= 85
```

## Refactor

```text
Refactor [area] without changing behavior.

Constraints:
- Keep the behavior stable.
- Prefer small reviewable slices.
- Strengthen tests or checks around risky edges if needed.

Stop only when:
- behavior is preserved
- tests/lint pass
- no high or critical blockers remain
- score >= 85
```
