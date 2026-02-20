# Specification

## Summary
**Goal:** Fix the YHash 32-byte serialization error that prevents profile creation.

**Planned changes:**
- Fix the YHash serialization in ProfileSetupModal to ensure the hash value is exactly 32 bytes instead of 64 bytes
- Verify ExternalBlob initialization for aadharPhoto produces valid 32-byte hashes
- Add error logging to capture any remaining serialization issues

**User-visible outcome:** Users can successfully create their profile by entering their name without encountering YHash byte length errors.
