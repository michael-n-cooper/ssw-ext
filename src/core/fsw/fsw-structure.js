// Additional ranges and types
import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";

export function baseSymbol(fswSym) {
	const baseRegEx = new RegExp("S" + core.fswquery.re.base);
	return baseRegEx.exec(fswSym);
}

/**
 * Split a symbol into base, fill, and rotation
 * @param {*} fswSym 
 * @returns {string, string, string} base, fill, and rotation components of symbol
 */
export function symbolParts(fswSym) {
	const base = fswSym.slice(0, 4);
	const baseNum = parseInt(base.slice(1), 16);
	const fill = fswSym.slice(4, 5);
	const fillNum = parseInt(fill, 16);
	const rot = fswSym.slice(5, 6);
	const rotNum = parseInt(rot, 16);
	return {
		"base": base, "fill": fill, "rot": rot, "baseNum": baseNum, "fillNum": fillNum, "rotNum": rotNum
	};
}

/**
 * Pair of FSW symbols that define a range
 * @typedef {[number, number]} SymbolRange 
 */

/**
 * Set of symbol ranges
 * @typedef {SymbolRange | SymbolRange[]} RangeSet 
 */

/**
 * ranges for hand and plane variants of symbols
 */
const variantRanges = {
	"handGroup1": [
		[0x100, 0x204],
		[0x37e, 0x37e]
	],
	"handGroup2": [
		[0x22a, 0x24a],
		[0x251, 0x280],
		[0x287, 0x2b6],
		[0x2b9, 0x2c2],
		[0x2c8, 0x2e6],
		[0x2ed, 0x2f0]
	],
	"handGroup3": [
		[0x24b, 0x250],
		[0x281, 0x286],
		[0x2b7, 0x2b8],
		[0x2c6, 0x2c7],
		[0x2e7, 0x2ec]
	],
	"handGroup4": [
		[0x30a, 0x310],
		[0x314, 0x320],
		[0x32a, 0x330],
		[0x335, 0x336],
		[0x356, 0x358],
		[0x367, 0x367]
	],
	"planeGroup1": [],
	"planeGroup2": []
}

export const handVariantGroups = ["handGroup1", "handGroup2", "handGroup3", "handGroup4"];
export const planeVariantGroups = ["planeGroup1", "planeGroup2"];

/**
 * 
 * @param {number} val Value to test
 * @param {RangeSet} rangeSet Set of ranges to test
 */
function inRangeSet(val, rangeSet) {
	return rangeSet.some((range) => {
		return (range[0] <= val && val <= range[1]);
	});
}

/**
 * Determine if a symbol is in a hand or plane variant group
 * @param {number} key ID of a base symbol
 * @param {string} variant Variant group to test
 * @returns boolean
 */
export function isVariant(key, variant) {
	const rangeSet = variantRanges[variant];
	if (rangeSet) {
		return (inRangeSet(key, rangeSet));
	}
	return false;
}