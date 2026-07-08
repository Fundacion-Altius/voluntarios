# Mission

## Purpose

**Voluntarios** is a digital contracting platform for **Fundación Altius**, a charitable foundation. It replaces paper-based volunteer agreements with an end-to-end digital workflow — from sign-up and contract wizard to digital signature and automated follow-up.

## The Problem

Fundación Altius relies on a large number of volunteers to operate. Managing their contracts on paper is slow, error-prone, and opaque. There is no way to:

- Track who has signed and who hasn't.
- Give administrators role-based visibility into contracts.
- Collect structured feedback after a volunteer's first experience.
- Generate and store signed contracts as digital files.

## Target Users

| User | Needs |
|---|---|
| **Volunteers** | A simple, mobile-friendly wizard to submit personal data, accept legal terms, and digitally sign. Later, an anonymous survey to rate their experience. |
| **Foundation staff (Nave / General / Admin leads)** | A dashboard to view, search, filter, and manage contracts. Role-based access so each lead sees only their area's volunteers. |
| **IT operators** | A system that runs on three environments (dev / staging / production) with minimal friction, no vendor lock-in, and easy debugging. |

## Goals

1. **Frictionless onboarding** — A volunteer can complete the entire contract in under 5 minutes on any device.
2. **Role-based visibility** — Each admin sees only the contracts relevant to their area.
3. **Audit trail** — Every signed contract is stored and retrievable.
4. **Feedback loop** — Every volunteer receives a satisfaction survey 24 hours after signing.
5. **Operational efficiency** — Dashboard supports pagination, search, sort, and export so staff can manage 250+ contracts without frustration.

## Guiding Principles

- **Simplicity over abstraction.** Choose the straightforward solution unless there is a proven need for complexity. Avoid over-engineering.
- **Environment parity with escape hatches.** Use the same ORM and patterns in staging and production. The in-memory dev mode is a convenience, not a separate platform.
- **Spec-driven development.** Every change starts with an OpenSpec proposal. The spec is the source of truth, not the code.
- **Security and privacy.** JWT in HTTP-only cookies, role-based middleware, anonymous survey submissions. Volunteer data is treated with care.
- **Incremental delivery.** Ship small, verifiable chunks. Each phase should produce a working system, even if it is not feature-complete.
- **Testable by design.** Repository interfaces, dependency injection via factory, and environment flags make the codebase testable without mocks or global state.
