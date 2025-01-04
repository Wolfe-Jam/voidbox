# Core Functionality Changelog

## ⚠️ CRITICAL NOTICE
This directory contains core functionality that interfaces with Make.com webhooks.
**ANY MODIFICATIONS REQUIRE EXPLICIT APPROVAL AND DOCUMENTATION.**

## Current Implementation (v1.3.5) - 2025-01-04
- Endpoints locked and frozen
- Response format: Plain text URL for images, "success" for email
- No JSON parsing (Make.com specification)
- Error handling for Make.com responses

## Make.com Integration Details
- WITH_BACKGROUND: `https://hook.us1.make.com/x4gwbl1cqz789cqe23a187s411plbwo2`
- ZERO_BACKGROUND: `https://hook.us1.make.com/f3d6i90kedqpcuut3y1691cs3onnjofw`
- EMAIL: `https://hook.us1.make.com/ge2xit3rtum5nvk1vfmbu89z5p9um54e`
- Response Type: Plain text URL for images, "success" for email
- Content-Type: application/json (request only)
- CORS: Enabled

## Core Email Integration
- Webhook: `https://hook.us1.make.com/ge2xit3rtum5nvk1vfmbu89z5p9um54e`
- Request Format: `{ imageUrl: string, email: string }`
- Response: "success" on successful email send
- Error Handling: HTTP status codes with descriptive messages

## Modification Protocol
1. Changes require written approval
2. Document Make.com's confirmation for any endpoint changes
3. Test in staging environment first
4. Update version number
5. Log all changes below

## Change History
| Date | Version | Change | Approved By | Make.com Ticket |
|------|---------|---------|-------------|-----------------|
| 2024-12-28 | 1.0.0 | Initial core implementation | @wolfejam | N/A |

## Responsibility Matrix
- **Make.com**: Webhook stability, response format, endpoint availability
- **VoidBox**: Correct request format, error handling
- **Integration Issues**: Report to Make.com support first

## Testing Requirements
- Must verify plain text URL response
- Must handle Make.com downtime gracefully
- Must maintain CORS compliance
- Must validate URL format
