# CRUSH - Coding Guidelines for tml-corrosion-angular

## Project Overview
Angular 20+ application with TypeScript, using Angular CLI tooling.

## Build Commands
- `npm run build` - Production build
- `npm run build -- --configuration=development` - Development build
- `npm run watch` - Development build with watch mode

## Development Server
- `npm run start` or `npm run ng -- serve` - Start development server

## Test Commands
- `npm run test` - Run all tests
- `npm run ng -- test --watch=false` - Run all tests once
- `npm run ng -- test --include="**/*.spec.ts"` - Run specific test file
- `npm run ng -- test --include="**/component-name.spec.ts"` - Run tests for specific component

## Linting/Formatting
- Prettier is configured for HTML files with angular parser
- TypeScript strict mode is enabled

## Code Style Guidelines

### Imports
- Use absolute paths when possible
- Group imports in order: Angular core, external libraries, internal modules
- Use explicit imports rather than barrel imports for better tree-shaking

### TypeScript/JavaScript
- Strict mode enabled (strict: true in tsconfig)
- No implicit returns or fallthrough cases
- Experimental decorators enabled for Angular
- Target ES2022

### Naming Conventions
- Components: suffix with "Component" (e.g., UserCardComponent)
- Services: suffix with "Service" (e.g., DataService)
- Interfaces: prefix with "I" or use PascalCase without prefix
- Files: Use kebab-case for file names

### Angular Specific
- Use OnPush change detection strategy when possible
- Use reactive forms over template-driven forms
- Implement lifecycle hooks only when needed
- Use Angular's dependency injection appropriately

### Error Handling
- Use Angular's ErrorHandler for global error handling
- Handle observable errors with catchError operator
- Validate inputs and provide sensible defaults

## File Organization
- Components in src/app/components/
- Services in src/app/services/
- Models/Interfaces in src/app/models/
- Shared modules in src/app/shared/
- Feature modules in src/app/features/

## Git Ignore
.gitignore should include:
- node_modules/
- dist/
- .angular/
- .crush/