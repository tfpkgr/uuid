import {
	v1,
	v3,
	v4,
	v5,
	NIL,
	MAX,
	parse,
	stringify,
	validate,
	version,
} from 'uuid';
import util from 'node:util';

/**
 * Extracts the timestamp from a UUID and converts it to a Date object.
 * @param uuid - The UUID string from which to extract the timestamp.
 * @returns The Date object representing the timestamp extracted from the UUID.
 */
export const extractTimeFromUUID = (uuid: string): Date => {
	const hex = uuid.replace(/-/g, '');

	const timeLow = hex.substring(0, 8);
	const timeMid = hex.substring(8, 12);
	const timeHigh = hex.substring(12, 16);

	const timestampHex = timeHigh + timeMid + timeLow;

	const timestamp = parseInt(timestampHex, 16);

	const UUID_EPOCH_START = -12219292800000;
	const unixTimestamp = timestamp / 10000 + UUID_EPOCH_START;

	return new Date(unixTimestamp);
};

export type UUID_JSON = {
	uuid: string;
	int: string;
	hex: string;
	bytes: Uint8Array<ArrayBufferLike>;
	time: Date | null;
	clock: string;
	node: string;
	variant: string;
	version: number;
};

/**
 * Class representing a UUID (Universally Unique Identifier).
 */
export class UUID {
	/**
	 * The UUID string.
	 */
	private uuid: string;

	/**
	 * Creates an instance of UUID.
	 * @param uuid - The UUID string or another UUID instance. If not provided, a new UUID v4 will be generated.
	 * @throws Error if the provided UUID is invalid.
	 */
	constructor(uuid?: string | UUID) {
		if (uuid && uuid instanceof UUID) {
			uuid = uuid.toString();
		} else if (uuid && !UUID.validate(uuid)) {
			throw new Error('Invalid UUID provided.');
		}

		this.uuid = uuid || v4();
	}

	/**
	 * A constant representing the NIL UUID.
	 */
	static NIL = new UUID(NIL);

	/**
	 * A constant representing the MAX UUID.
	 */
	static MAX = new UUID(MAX);

	/**
	 * Creates a UUID instance from a string or another UUID instance.
	 * @param uuid - The UUID string or UUID instance.
	 * @returns A new UUID instance.
	 */
	static from(uuid: string | UUID): UUID {
		return new UUID(typeof uuid === 'string' ? uuid : uuid.toString());
	}

	/**
	 * Generates a new UUID v1.
	 * @returns A new UUID instance.
	 */
	static v1() {
		return new UUID(v1());
	}

	/**
	 * Gets a new UUID v1.
	 * @returns A new UUID instance.
	 */
	get v1(): UUID {
		return UUID.v1();
	}

	/**
	 * Generates a new UUID v3.
	 * @param name - The name for the UUID.
	 * @param namespace - The namespace for the UUID.
	 * @returns A new UUID instance.
	 */
	static v3(name: string, namespace: string | UUID) {
		namespace =
			typeof namespace === 'string' ? namespace : namespace.toString();
		return new UUID(v3(name, namespace));
	}

	/**
	 * Generates a new UUID v4.
	 * @returns A new UUID instance.
	 */
	static v4() {
		return new UUID(v4());
	}

	/**
	 * Generates a UUID v4 with a custom prefix.
	 * @param prefix - The custom prefix to prepend to the UUID.
	 * @returns A string combining the prefix and the UUID v4.
	 */
	static v4WithPrefix(prefix: string): string {
		return `${prefix}-${v4()}`;
	}

	/**
	 * Gets a new UUID v4.
	 * @returns A new UUID instance.
	 */
	get v4(): UUID {
		return UUID.v4();
	}

	/**
	 * Generates a new UUID v5.
	 * @param name - The name for the UUID.
	 * @param namespace - The namespace for the UUID.
	 * @returns A new UUID instance.
	 */
	static v5(name: string, namespace: string | UUID) {
		namespace =
			typeof namespace === 'string' ? namespace : namespace.toString();
		return new UUID(v5(name, namespace));
	}

	/**
	 * Validates a UUID string or UUID instance.
	 * @param uuid - The UUID string or UUID instance.
	 * @returns True if the UUID is valid, false otherwise.
	 */
	static validate(uuid: string | UUID): boolean {
		return validate(typeof uuid === 'string' ? uuid : uuid.toString());
	}

	/**
	 * Parses a UUID string or UUID instance into a byte array.
	 * @param uuid - The UUID string or UUID instance.
	 * @returns A byte array representing the UUID.
	 */
	static parse(uuid: string | UUID): Uint8Array {
		return parse(typeof uuid === 'string' ? uuid : uuid.toString());
	}

	/**
	 * Converts a byte array into a UUID string.
	 * @param bytes - The byte array.
	 * @returns The UUID string.
	 */
	static stringify(bytes: Uint8Array): string {
		return stringify(bytes);
	}

	/**
	 * Gets the version of a UUID string or UUID instance.
	 * @param uuid - The UUID string or UUID instance.
	 * @returns The version number of the UUID.
	 */
	static version(uuid: string | UUID): number {
		return version(typeof uuid === 'string' ? uuid : uuid.toString());
	}

	/**
	 * Gets the integer representation of the UUID.
	 * @returns The integer representation of the UUID as a string.
	 */
	get int(): string {
		return String(BigInt(`0x${this.uuid.replace(/-/g, '')}`));
	}

	/**
	 * Gets the hexadecimal representation of the UUID.
	 * @returns The hexadecimal representation of the UUID as a string.
	 */
	get hex(): string {
		return this.uuid.replace(/-/g, '');
	}

	/**
	 * Gets the byte array representation of the UUID.
	 * @returns The byte array representation of the UUID.
	 */
	get bytes(): Uint8Array {
		return parse(this.uuid);
	}

	/**
	 * Gets the timestamp from the UUID if it is a version 1 UUID.
	 * @returns The timestamp as a Date object, or null if the UUID is not version 1.
	 */
	get time(): Date | null {
		if (this.version !== 1) {
			return null;
		}

		return extractTimeFromUUID(this.uuid);
	}

	/**
	 * Gets the clock sequence from the UUID.
	 * @returns The clock sequence as a string.
	 */
	get clock(): string {
		return this.uuid.substring(14, 18);
	}

	/**
	 * Gets the node identifier from the UUID.
	 * @returns The node identifier as a string.
	 */
	get node(): string {
		return this.uuid.substring(19);
	}

	/**
	 * Gets the variant of the UUID.
	 * @returns The variant as a string.
	 */
	get variant(): string {
		const bytes = this.bytes;
		return ((bytes[8] & 0xc0) >> 6).toString();
	}

	/**
	 * Gets the version of the UUID.
	 * @returns The version number of the UUID.
	 */
	get version(): number {
		return version(this.uuid);
	}

	/**
	 * Gets the UUID string.
	 * @returns The UUID string.
	 */
	get str(): string {
		return this.uuid;
	}

	/**
	 * Converts the UUID to a string.
	 * @returns The UUID string.
	 */
	toString(): string {
		return this.uuid;
	}

	/**
	 * Converts the UUID to a JSON object.
	 * @returns The JSON representation of the UUID.
	 */
	toJSON(): UUID_JSON {
		return {
			uuid: this.uuid,
			int: String(this.int),
			hex: this.hex,
			bytes: this.bytes,
			time: this.time,
			clock: this.clock,
			node: this.node,
			variant: this.variant,
			version: this.version,
		} as const;
	}

	/**
	 * Converts the UUID to a JSON string.
	 * @returns The JSON string representation of the UUID.
	 */
	toJSONString(): string {
		return JSON.stringify({
			uuid: this.uuid,
			int: String(this.int),
			variant: this.variant,
			version: this.version,
		}) as string;
	}

	/**
	 * Converts the UUID to its integer representation.
	 * @returns The integer representation of the UUID as a string.
	 */
	toNumber(): string {
		return this.int;
	}

	/**
	 * Converts the UUID to its byte array representation.
	 * @returns The byte array representation of the UUID.
	 */
	toBytes(): Uint8Array {
		return this.bytes;
	}

	/**
	 * Converts the UUID to its hexadecimal representation.
	 * @returns The hexadecimal representation of the UUID as a string.
	 */
	toHex(): string {
		return this.hex;
	}

	/**
	 * Custom inspect method for util.inspect.
	 * @returns The custom string representation of the UUID.
	 */
	[util.inspect.custom](): string {
		return `UUID ${this.toJSONString()}`;
	}
}

/**
 * A utility function for generating and working with UUIDs.
 *
 * This function is an enhanced version of the UUID library, providing additional methods for various UUID operations.
 *
 * @function
 * @returns {UUID} A new UUID instance (defaults to v4).
 *
 * @property {Function} uuid - Alias for `UUID.from`.
 * @property {Function} from - Creates a UUID from a string or buffer.
 * @property {Function} validate - Validates if a given string is a valid UUID.
 * @property {Function} parse - Parses a UUID string into its component parts.
 * @property {Function} stringify - Converts UUID components back into a string.
 * @property {Function} version - Retrieves the version of the UUID.
 * @property {string} NIL - The NIL UUID (all zeros).
 * @property {string} MAX - The maximum possible UUID.
 * @property {Function} v1 - Generates a UUID of version 1.
 * @property {Function} v3 - Generates a UUID of version 3.
 * @property {Function} v4 - Generates a UUID of version 4.
 * @property {Function} v5 - Generates a UUID of version 5.
 */
export const uuid = Object.assign(() => new UUID(), {
	/**
	 * Alias for `UUID.from`.
	 */
	uuid: UUID.from,

	/**
	 * Creates a UUID from a string or buffer.
	 */
	from: UUID.from,

	/**
	 * Validates if a given string is a valid UUID.
	 */
	validate: UUID.validate,

	/**
	 * Parses a UUID string into its component parts.
	 */
	parse: UUID.parse,

	/**
	 * Converts UUID components back into a string.
	 */
	stringify: UUID.stringify,

	/**
	 * Retrieves the version of the UUID
	 */
	version: UUID.version,

	/**
	 * The NIL UUID (all zeros).
	 */
	NIL: UUID.NIL,

	/**
	 * The maximum possible UUID.
	 */
	MAX: UUID.MAX,

	/**
	 * Generates a UUID of version 1.
	 */
	v1: UUID.v1,

	/**
	 * Generates a UUID of version 3.
	 */
	v3: UUID.v3,

	/**
	 * Generates a UUID of version 4.
	 */
	v4: UUID.v4,

	/**
	 * Generates a UUID of version 5.
	 */
	v5: UUID.v5,

	/**
	 * Extracts the timestamp from a UUID and converts it to a Date object.
	 * @param uuid - The UUID string from which to extract the timestamp.
	 * @returns The Date object representing the timestamp extracted from the UUID.
	 */
	extractTimeFromUUID,
});

export default uuid;
