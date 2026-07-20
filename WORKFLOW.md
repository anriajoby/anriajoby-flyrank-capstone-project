# AI Development Workflow

## Overview

This project uses AI-assisted development with a review-first approach. AI tools are used for planning, implementation, and testing support, but all generated code is reviewed, tested, and verified before being accepted.

## Development Process

The workflow followed for feature development is:

1. Inspect the existing repository structure and project rules before making changes.
2. Define requirements and expected behavior before implementation.
3. Use AI to assist with architecture decisions and code generation.
4. Review generated code for correctness, maintainability, and unnecessary complexity.
5. Run automated tests and manually verify behavior.
6. Fix issues found during review or testing.
7. Commit changes using Conventional Commit messages.

## Branch Comparison

Two experimental branches were created to compare different AI prompting approaches.

### experiment/vague-prompt

The vague prompt branch focused on generating a settings form from a general feature request.

Specific characteristics:
- The implementation was generated with fewer requirements provided upfront.
- The AI produced a working settings form quickly.
- Less planning was performed before implementation.
- More assumptions were made about structure and validation behavior.

The result was functional, but additional review was needed to verify whether the implementation matched the desired project structure and requirements.

### experiment/precise-prompt

The precise prompt branch included detailed requirements for architecture, validation, testing, and accessibility.

Specific improvements included:
- Validation logic separated into `validateSettings.ts`.
- Automated tests added in `validateSettings.test.ts` using Vitest.
- Settings persistence handled through local storage utilities.
- Clear separation between UI components and business logic.

The implementation included accessibility considerations such as linking labels with inputs, using `useId()` for stable identifiers, and providing status messages through `aria-live`.

## Correctness and Edge Case Review

The precise prompt approach required more verification because it introduced more functionality. Testing covered:
- Empty or invalid display names.
- Invalid email formats.
- Unsupported theme values.
- Multiple validation errors.
- Settings persistence behavior.

During testing, an AI-generated test case contained an error. The `normalizeSettings` test expected `"Anria Joby"` while providing `"  Anria  "` as input. The failure was detected by running the test suite, the test case was corrected, and all tests passed afterwards.

## Review Effort and Lessons Learned

The precise prompt approach required more initial planning but reduced uncertainty during implementation. The vague prompt approach was faster to start, but required more manual checking because requirements were not explicitly defined.

The main lesson learned is that AI-generated code should be treated as a starting point. Reviewing requirements, running tests, and checking edge cases are necessary steps to ensure correctness and maintainable code.