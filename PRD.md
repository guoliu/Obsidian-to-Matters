# Obsidian to Matters Plugin

A plugin that enables publishing Obsidian notes to Matters platform, designed with a protocol-agnostic architecture for future extension to other publishing platforms.

## Core Functionality

### Article Model

An article consists of:

- Title
- Content (in markdown)
- Summary (optional)
- Tags (optional)
- Platform-specific metadata (optional)

### Publishing Flow

#### 1. Activation

- User clicks ribbon icon
- Plugin checks/adds required frontmatter
- Opens preview modal

#### 2. Preview & Upload

- Shows article preview with metadata
- Handles image uploads with progress indicators
- Uploads draft to Matters server

#### 3. Publish

- Publishes draft to Matters
- Opens published article in browser
- Closes modal

## UI Requirements

### Preview Modal

#### Content Preview

- Display article title
- Display article content with proper markdown rendering
- Show metadata (summary, tags, etc.)

#### Image Handling

- Each image in the preview should:
  - Show a loading overlay during upload
  - Use consistent loader styling across all states
  - Display a retry button on upload failure
  - Show upload progress if possible

#### Action Buttons

- Upload button (initial state)
- Publish button (appears after successful upload)
- Cancel button (always present)

#### States & Transitions

1. **Initial State**

   - Show preview with Upload button
   - Cancel button available

2. **Upload State**

   - Upload button disabled
   - Show loading indicator
   - Cancel button available

3. **Upload Complete**

   - Show updated preview with server-cleaned content
   - Upload button changes to Publish button
   - Cancel button available

4. **Error States**
   - Show error message in modal
   - Enable retry where applicable
   - Cancel button available

### Notifications

- Show Obsidian notice when:
  - Frontmatter is automatically added
  - Upload starts/completes
  - Publish starts/completes
  - Any errors occur

### Error Display

- Image upload errors:
  - Show retry button on failed image
  - Keep other images' states intact
- Network errors:
  - Show in modal and as Obsidian notice
  - Provide clear next steps
- Validation errors:
  - Highlight problematic fields
  - Show specific error messages

## Technical Requirements

### Protocol Interface

The publishing protocol defines a single method:

- `publish(article)`: Uploads and publishes an article, returns the published URL

### Error Handling

Clear error messages for:

- Missing/invalid frontmatter
- Failed image uploads (with retry option)
- Draft upload failures
- Publishing failures

## Implementation Notes

### Refactoring Plan

#### Goals

- Clear separation between core publishing logic and Obsidian integration
- Testable and maintainable codebase
- Ready for future extensions (new platforms, auth methods)

#### Testing Strategy

- Unit tests with Jest
- Mocked Obsidian APIs for testing
- Test coverage for core functionality

#### Progress Tracking

- Phase 1: ✅ Project structure and type organization
- Phase 2: 🚧 Protocol implementation and testing
- Phase 3: ⏳ UI components and integration
- Phase 4: ⏳ Documentation and polish

### Architecture Design

#### Core Package

The core publishing logic is designed to be platform-agnostic and potentially extractable as a separate package:

- Protocol-agnostic article model
- Base publishing protocol interfaces
- Protocol-specific implementations (e.g., Matters)
- No dependencies on Obsidian API

#### Obsidian Integration

Obsidian-specific code is isolated and adapts the core functionality:

- Converts Obsidian notes to core article model
- Provides Obsidian API utilities to core protocols
- Handles UI and user interaction

### Local-First Principles

- Obsidian note is source of truth
- Server drafts are transient
- All metadata stored in frontmatter

### Future Extension

- Core package could be used by other editors
- New publishing protocols can be added
- UI components are reusable

### File Structure

```
src/
├── core/                          # Could be extracted as separate package
│   ├── models/
│   │   └── Article.ts            # Core article model and interfaces
│   ├── protocols/
│   │   ├── base.ts              # Base protocol interfaces
│   │   └── matters/
│   │       ├── adapter.ts       # Matters implementation
│   │       ├── client/
│   │       │   ├── client.ts    # GraphQL client
│   │       │   └── operations.ts # GraphQL queries
│   │       └── utils/
│   │           └── imageHandler.ts # Image processing logic
│   └── types.ts                  # Shared type definitions
├── obsidian/                      # Obsidian-specific implementation
│   ├── adapter.ts                # Converts Obsidian notes to core Article
│   ├── ui/
│   │   ├── components/
│   │   │   ├── ImageUpload.svelte
│   │   │   └── Preview.svelte
│   │   └── PublishModal.ts
│   └── utils/
│       └── frontmatter.ts        # Obsidian frontmatter handling
├── settings.ts                    # Plugin settings
└── main.ts                        # Plugin entry point

test/
├── core/
│   ├── models/
│   └── protocols/
└── obsidian/
    ├── adapter/
    └── ui/
```

### Directory Overview

#### Core Package (`src/core/`)

- **models/**: Core domain models and interfaces
- **protocols/**: Protocol implementations and base interfaces
- **types.ts**: Shared type definitions

#### Obsidian Integration (`src/obsidian/`)

- **adapter.ts**: Obsidian-specific adaptations
- **ui/**: User interface components
- **utils/**: Obsidian-specific utilities
