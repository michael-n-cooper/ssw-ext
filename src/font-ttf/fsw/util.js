import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import { variantRanges } from "./variant-ranges";
import "../../types.js";

/**
 * Get just the base component of a FSW symbol
 * @memberof module:ext/core/fsw
 * @param {string} fswSym Symbol
 * @returns {string} Base
 * @private
 */
export function baseSymbol(fswSym) {
	const baseRegEx = new RegExp("S" + core.fswquery.re.base);
	return baseRegEx.exec(fswSym);
}

/**
 * Split a symbol into base, fill, and rotation
 * @memberof module:ext/core/fsw
 * @param {(string | SymbolObject)} fswSym 
 * @returns {symbolParts} base, fill, and rotation components of symbol
 * @private
 */
export function symbolParts(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
	if (parsed.symbol) {
		const base = fswSym.slice(0, 4);
		const baseNum = parseInt(base.slice(1), 16);
		const fill = fswSym.slice(4, 5);
		const fillNum = parseInt(fill, 16);
		const rot = fswSym.slice(5, 6);
		const rotNum = parseInt(rot, 16);
		return {
			"str": { "base": base, "fill": fill, "rot": rot }, "num": { "base": baseNum, "fill": fillNum, "rot": rotNum }
			
		};
	}
	return undefined;
}

/**
 * Test if a symbol is in one of the ranges of a rangeset
 * @memberof module:ext/core/fsw
 * @param {number} val Value to test
 * @param {RangeSet} rangeSet Set of ranges to test
 * @private
 */
export function inRangeSet(val, rangeSet) {
	if (Array.isArray(rangeSet[0])) return rangeSet.some((range) => {
		return (range[0] <= val && val <= range[1]);
	});
	else return rangeSet[0] <= val && val <= rangeSet[1];
}

/**
 * Determine if a symbol is in a hand or plane variant group
 * @memberof module:ext/core/fsw
 * @param {number} key ID of a base symbol
 * @param {string} variant Variant group to test
 * @returns boolean
 * @private
 */
export function isVariant(key, variant) {
	const rangeSet = variantRanges[variant];
	if (rangeSet) {
		return (inRangeSet(key, rangeSet));
	}
	return false;
}