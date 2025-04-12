# @tfpkgr/uuid

This package provides a comprehensive utility for working with UUIDs (Universally Unique Identifiers). It includes functions for generating, validating, parsing, and manipulating UUIDs, as well as a `UUID` class for advanced operations.

## Installation

```bash
npm install @tfpkgr/uuid
```

## Usage

### Importing the Package

```typescript
import uuid, {UUID} from '@tfpkgr/uuid';
```

### Generating UUIDs

```typescript
// Generate a UUID v4
const newUUID = uuid.v4();
console.log(newUUID);

// Generate a UUID v1
const uuidV1 = uuid.v1();
console.log(uuidV1);

// Generate a UUID v4 with a custom prefix
const prefixedUUID = UUID.v4WithPrefix('custom-prefix');
console.log(prefixedUUID);
```

### Validating UUIDs

```typescript
const isValid = uuid.validate('550e8400-e29b-41d4-a716-446655440000');
console.log(isValid); // true or false
```

### Parsing and Stringifying UUIDs

```typescript
const bytes = uuid.parse('550e8400-e29b-41d4-a716-446655440000');
console.log(bytes);

const stringified = uuid.stringify(bytes);
console.log(stringified);
```

### Using the `UUID` Class

```typescript
// Create a new UUID instance
const myUUID = new UUID();
console.log(myUUID.toString());

// Access properties
console.log(myUUID.int); // Integer representation
console.log(myUUID.hex); // Hexadecimal representation
console.log(myUUID.bytes); // Byte array
console.log(myUUID.time); // Timestamp (if v1 UUID)

// Convert to JSON
console.log(myUUID.toJSON());
```

### Extracting Time from a UUID

```typescript
const timestamp = uuid.extractTimeFromUUID(
	'550e8400-e29b-41d4-a716-446655440000',
);
console.log(timestamp);
```

## License

This package is licensed under the MIT License.
