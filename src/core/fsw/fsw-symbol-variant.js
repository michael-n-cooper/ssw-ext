import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as structure from "./fsw-structure.js";
import "../../../node_modules/@sutton-signwriting/core/src/types";

/**
 * Determine if a symbol applies to left hand
 * @memberof module:ext/core/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to test
 * @returns {boolean} True if left hand, false if other hand or not handed
 */
export function isLeftHand(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
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
	}
	return false;
}
/**
 * Determine if a symbol applies to right hand
 * @memberof module:ext/core/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to test
 * @returns {boolean} True if right hand, false if other hand or not handed
 */
export function isRightHand(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
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
	}
	return false;
}

/**
 * Determine if a symbol applies to both hands
 * @memberof module:ext/core/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to test
 * @returns {boolean} True if both hands, false if other hand or not handed
 */
export function isBothHand(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (structure.isVariant(sp.baseNum, "handGroup2")) {
			return (sp.fillNum == 2);
		}
		if (structure.isVariant(sp.baseNum, "handGroup3")) {
			return (sp.fillNum == 2 || sp.fillNum == 5);
		}
	}
	return false;
}

/**
 * Determine if a symbol is on the floor plane
 * @memberof module:ext/core/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to test
 * @returns {boolean} True if floor plane, false if other or no plane
 */
export function isFloorPlane(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (core.fsw.isType(parsed.symbol, "hand") && sp.fillNum > 2) return true;
		return structure.isVariant(sp.baseNum, "planeFloor");
	}
	return false;
}
/**
 * Determine if a symbol is on the wall plane
 * @memberof module:ext/core/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to test
 * @returns {boolean} True if wall plane, false if other or no plane
 */
export function isWallPlane(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (core.fsw.isType(parsed.symbol, "hand") && sp.fillNum < 3) return true;
		return structure.isVariant(sp.baseNum, "planeWall");
	}
	return false;
}
/**
 * Determine if a symbol is on the diagonal towards plane
 * @memberof module:ext/core/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to test
 * @returns {boolean} True if diagonal towards, false if other or no plane
 */
export function isDiagonalTowards(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (structure.isVariant(sp.baseNum, "planeDiagonalTowards")) return true;
	}
	return false;
}

/**
 * Determine if a symbol is on the diagonal away plane
 * @memberof module:ext/core/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to test
 * @returns {boolean} True if diagonal away, false if other or no plane
 */
export function isDiagonalAway(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (structure.isVariant(sp.baseNum, "planeDiagonalAway")) return true;
	}
	return false;
}
/**
 * Determine if a symbol is on either diagonal plane
 * @memberof module:ext/core/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to test
 * @returns {boolean} True if diagonal, false if other or no plane
 */
export function isDiagonalPlane(fswSym) {
	return isDiagonalAway(fswSym) || isDiagonalTowards(fswSym);
}

/**
 * Determine how the hand is oriented
 * @memberof module:ext/core/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to test
 * @returns {string} Orientation as "palm", "side", or "back"
 */
export function getHandOrientation(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
	if (parsed.symbol && core.fsw.isType(fswSym, "hand")) {
		let sp = structure.symbolParts(parsed.symbol);
		if (sp.fillNum == 0 || sp.fillNum == 3) return "palm";
		if (sp.fillNum == 1 || sp.fillNum == 4) return "side";
		if (sp.fillNum == 2 || sp.fillNum == 5) return "back";
	}
	return "";
}