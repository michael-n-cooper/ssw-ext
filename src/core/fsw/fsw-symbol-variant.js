import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as structure from "./fsw-structure.js";

/**
 * Determine if a symbol applies to left hand
 * @param {string} fswSym Symbol to test
 * @returns {boolean} True if left hand, false if other hand or not handed
 */
export function isLeftHand(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (structure.isVariant(sp.baseNum, "handGroup1")) {
			return (sp.rotNum > 7);
		}
		if (structure.isVariant(sp.baseNum, "handGroup2")) {
			return (sp.fillNum == 1);
		}
		if (structure.isVariant(sp.baseNum, "handGroup3")) {
			return (sp.fillNum == 1 || sp.fillNum == 4);
		}
		if (structure.isVariant(sp.baseNum, "handGroup4")) {
			return (sp.fillNum == 2);
		}
	}
	return false;
}
/**
 * Determine if a symbol applies to right hand
 * @param {string} fswSym Symbol to test
 * @returns {boolean} True if right hand, false if other hand or not handed
 */
export function isRightHand(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (structure.isVariant(sp.baseNum, "handGroup1")) {
			return (sp.rotNum < 8);
		}
		if (structure.isVariant(sp.baseNum, "handGroup2")) {
			return (sp.fillNum == 0);
		}
		if (structure.isVariant(sp.baseNum, "handGroup3")) {
			return (sp.fillNum == 0 || sp.fillNum == 3);
		}
		if (structure.isVariant(sp.baseNum, "handGroup4")) {
			return (sp.fillNum == 1);
		}
	}
	return false;
}

/**
 * Determine if a symbol applies to both hands
 * @param {string} fswSym Symbol to test
 * @returns {boolean} True if both hands, false if other hand or not handed
 */
export function isBothHand(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (structure.isVariant(sp.baseNum, "handGroup2")) {
			return (sp.fillNum == 2);
		}
		if (structure.isVariant(sp.baseNum, "handGroup3")) {
			return (sp.fillNum == 2 || sp.fillNum == 5);
		}
		if (structure.isVariant(sp.baseNum, "handGroup4")) {
			return (sp.fillNum == 0);
		}
	}
	return false;
}

export function isFloorPlane(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (core.fsw.isType(parsed.symbol, "hand") && sp.fillNum > 2) return true;
		return structure.isVariant(sp.baseNum, "planeFloor");
	}
	return false;
}
export function isWallPlane(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (core.fsw.isType(parsed.symbol, "hand") && sp.fillNum < 3) return true;
		return structure.isVariant(sp.baseNum, "planeWall");
	}
	return false;
}
export function isDiagonalPlane(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (structure.isVariant(sp.baseNum, "planeDiagonalTowards")) return true;
		if (structure.isVariant(sp.baseNum, "planeDiagonalAway")) return true;
	}
	return false;
}

