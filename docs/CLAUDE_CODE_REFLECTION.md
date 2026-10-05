# Claude Code / AI Pair-Programming Reflection

## How AI was used

AI was used as a pair programmer rather than only as a project scaffolding tool.

I used AI to:
- propose the Cucumber folder structure
- create the initial Page Object Model
- draft API validation logic
- generate positive and negative API scenarios
- explain Playwright request and browser APIs
- review locator resilience
- draft SQL window-function logic for consecutive-match streaks
- review README and execution instructions

## What worked well

AI was useful for producing repetitive framework code quickly and for suggesting edge cases such as:
- invalid page/limit values
- unsupported sort values
- missing/unknown records
- chart visibility
- independent EMI calculation

## What did not work perfectly

AI-generated UI selectors can become brittle when the live application changes its HTML structure. I therefore kept selectors in the Page Object and preferred role/text/label-based strategies.

AI can also assume that a chart is rendered as SVG when the application uses canvas, so the implementation checks both and keeps chart logic isolated in the page object.

## Human validation

I manually reviewed:
- API status codes
- EMI formula and expected values
- selector strategy
- SQL logic
- negative test expectations
- test artifacts before submission

The final rule was: AI may propose an implementation, but the test engineer decides whether the behavior and locator are actually correct.
