# AI Self-Healing Locator Exercise

The assessment asks for 3–5 incorrect/brittle locators to be left broken and a markdown explanation of how an AI-based self-healing system would detect, propose and validate replacements.

## Deliberately incorrect locator examples

These are examples only and are **not used by the passing test path**:

```javascript
// 1. Positional CSS — breaks when input order changes
page.locator("div:nth-child(4) > input");

// 2. Absolute XPath — breaks when layout containers change
page.locator("/html/body/div[2]/div[1]/div[3]/input");

// 3. Generated class name — breaks after a CSS build/deployment
page.locator(".css-8f3a91");

// 4. Deep descendant chain — breaks when an intermediate div is added
page.locator("div.container > div.row > div.col > div.field > input");
```

## Proposed self-healing flow

### 1. Detection

Capture a locator failure with:
- selector that failed
- URL
- page title
- DOM snapshot around the failed element
- screenshot
- expected element description
- previous successful locator, if available

Example event:

```text
Locator failed:
  .css-8f3a91
Expected:
  Interest Rate input
URL:
  https://emicalculator.net/
```

### 2. AI prompt

Give the model only the relevant DOM context rather than the entire page:

```text
The Playwright locator below failed.

Old locator:
.css-8f3a91

Expected element:
Interest Rate input on the EMI Calculator.

Generate up to 5 replacement locators.
Priority:
1. getByRole / getByLabel
2. data-testid
3. stable name/id
4. stable text + nearby input
Do not use nth-child, absolute XPath, generated classes, or indexes.

Return:
- candidate locator
- reason
- confidence score
```

### 3. Candidate generation

The AI might propose:

```javascript
page.getByLabel("Interest Rate")
page.locator("input[name='interest']")
page.locator("[data-testid='interest-rate']")
```

### 4. Validation before applying

Never automatically replace a locator only because an AI suggested it.

For each candidate:
1. resolve the locator
2. verify exactly one intended element is matched
3. verify visibility/enabled state
4. perform the intended action
5. verify the expected post-condition
6. run the affected scenario twice
7. run the full regression suite

A candidate should be promoted only if all checks pass.

### 5. Safe update

Store the original locator and replacement in a review file:

```json
{
  "old": ".css-8f3a91",
  "new": "page.getByLabel('Interest Rate')",
  "confidence": 0.96,
  "validated": true
}
```

Require human review for low-confidence changes.

## Why this is safer

Self-healing can hide real application regressions if it blindly searches for any element that makes a test pass. The validation step ensures that the replacement represents the same business element, not merely another clickable input.
