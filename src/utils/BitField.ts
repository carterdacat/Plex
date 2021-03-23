/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { BitFieldResolvable } from "../main/Types";

/**
 * Data structure that makes it easy to interact with a bitfield.
 */
export default class BitField<S extends string> {
    bitfield: number;
    FLAGS: object;
    /**
     * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
     */
    constructor(bits: BitFieldResolvable<S> = 0, FLAGS = {}) {
        /**
         * Bitfield of the packed bits
         * @type {number}
         */
        this.bitfield = this.resolve(bits);
        /**
         * The Flags of the Bitfield
         * @type {Object}
         */
        this.FLAGS = FLAGS;
    }
    /**
     * Checks whether the bitfield has a bit, or any of multiple bits.
     * @param {BitFieldResolvable} bit Bit(s) to check for
     * @returns {boolean}
     */
    any(bit: BitFieldResolvable<S>): boolean {
        return (this.bitfield & this.resolve(bit)) !== 0;
    }

    /**
     * Checks if this bitfield equals another
     * @param {BitFieldResolvable} bit Bit(s) to check for
     * @returns {boolean}
     */
    equals(bit: BitFieldResolvable<S>): boolean {
        return this.bitfield === this.resolve(bit);
    }

    /**
     * Checks whether the bitfield has a bit, or multiple bits.
     * @param {BitFieldResolvable} bit Bit(s) to check for
     * @returns {boolean}
     */
    has(bit: BitFieldResolvable<S>): boolean {
        if (Array.isArray(bit)) return bit.every((p) => this.has(p));
        bit = this.resolve(bit);
        //@ts-ignore
        return (this.bitfield & bit) === bit;
    }

    /**
     * Gets all given bits that are missing from the bitfield.
     * @param {BitFieldResolvable} bits Bit(s) to check for
     * @returns {string[]}
     */
    missing(bits: BitFieldResolvable<S>): S[] {
        if (!Array.isArray(bits)) bits = this.constructor(bits).toArray(false);
        //@ts-ignore
        return bits.filter((p) => !this.has(p));
    }

    /**
     * Freezes these bits, making them immutable.
     * @returns {Readonly<BitField>} These bits
     */
    freeze(): Readonly<BitField<S>> {
        return Object.freeze(this);
    }

    /**
     * Adds bits to these ones.
     * @param {...BitFieldResolvable} [bits] Bits to add
     * @returns {BitField} These bits or new BitField if the instance is frozen.
     */
    add(...bits: BitFieldResolvable<S>[]): BitField<S> {
        let total = 0;
        for (const bit of bits) {
            total |= this.resolve(bit);
        }
        if (Object.isFrozen(this)) return this.constructor(this.bitfield | total);
        this.bitfield |= total;
        return this;
    }

    /**
     * Removes bits from these.
     * @param {...BitFieldResolvable} [bits] Bits to remove
     * @returns {BitField} These bits or new BitField if the instance is frozen.
     */
    remove(...bits: BitFieldResolvable<S>[]): BitField<S> {
        let total = 0;
        for (const bit of bits) {
            total |= this.resolve(bit);
        }
        if (Object.isFrozen(this)) return this.constructor(this.bitfield & ~total);
        this.bitfield &= ~total;
        return this;
    }

    /**
     * Gets an object mapping field names to a boolean indicating whether the
     * bit is available.
     * @returns {Object}
     */
    serialize(): object {
        const serialized = {};
        //@ts-ignore
        for (const [flag, bit] of Object.entries(this.FLAGS)) serialized[flag] = this.has(bit);
        return serialized;
    }

    /**
     * Gets an array of bitfield names based on the bits available.
     * @returns {string[]}
     */
    toArray(): S[] {
        //@ts-ignore
        return Object.keys(this.FLAGS).filter((bit) => this.has(bit));
    }

    toJSON(): number {
        return this.bitfield;
    }

    valueOf(): number {
        return this.bitfield;
    }

    *[Symbol.iterator](): IterableIterator<S> {
        yield* this.toArray();
    }

    /**
     * Data that can be resolved to give a bitfield. This can be:
     * * A string (see {@link BitField.FLAGS})
     * * A bit number
     * * An instance of BitField
     * * An Array of BitFieldResolvable
     * @typedef {string|number|BitField|BitFieldResolvable[]} BitFieldResolvable
     */

    /**
     * Resolves bitfields to their numeric form.
     * @param {BitFieldResolvable} [bit=0] - bit(s) to resolve
     * @returns {number}
     */
    public resolve(bit: BitFieldResolvable<any> = 0): number {
        if (typeof bit === "number" && bit >= 0) return bit;
        if (bit instanceof BitField) return bit.bitfield;
        if (Array.isArray(bit))
            return bit.map((p) => this.resolve(p)).reduce((prev, p) => prev | p, 0);
        //@ts-ignore
        if (typeof bit === "string" && typeof this.FLAGS[bit] !== "undefined")
            //@ts-ignore
            return this.FLAGS[bit];
        const error = new RangeError("BITFIELD_INVALID");
        throw error;
    }
}
