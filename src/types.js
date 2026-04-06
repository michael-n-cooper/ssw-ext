/**
 * Pair of FSW symbols that define a range
 * @typedef {number[]} SymbolRange 
 */

/**
 * Set of symbol ranges
 * @typedef {(SymbolRange | SymbolRange[])} RangeSet 
 */

/**
 * Numeric components of a symbol
 * @typedef {object} symbolPartsNum
 * @property {number} base Base
 * @property {number} fill Fill
 * @property {number} rot Rotation
 */
/**
 * String components of a symbol
 * @typedef {object} symbolPartsStr
 * @property {string} base Base
 * @property {string} fill Fill
 * @property {string} rot Rotation
 */
/**
 * Symbol components as string and number
 * @typedef symbolParts
 * @property {symbolPartsStr} str Components as strings
 * @property {symbolPartsNum} num Components as numbers
 */
