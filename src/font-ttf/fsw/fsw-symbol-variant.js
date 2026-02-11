import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as util from "./util.js";
import "../../../node_modules/@sutton-signwriting/core/src/types.js";

/**
 * Determine if a symbol applies to left hand
 * @memberof module:ext/ttf/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to test
 * @returns {boolean} True if left hand, false if other hand or not handed
 */
export function isLeftHand(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
	if (parsed.symbol) {
		let sp = util.symbolParts(parsed.symbol);
		if (util.isVariant(sp.num.base, "handGroup1")) {
			return (sp.num.rot > 7);
		}
		if (util.isVariant(sp.num.base, "handGroup2")) {
			return (sp.num.fill == 1);
		}
		if (util.isVariant(sp.num.base, "handGroup3")) {
			return (sp.num.fill == 1 || sp.num.fill == 4);
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
		let sp = util.symbolParts(parsed.symbol);
		if (util.isVariant(sp.num.base, "handGroup1")) {
			return (sp.num.rot < 8);
		}
		if (util.isVariant(sp.num.base, "handGroup2")) {
			return (sp.num.fill == 0);
		}
		if (util.isVariant(sp.num.base, "handGroup3")) {
			return (sp.num.fill == 0 || sp.num.fill == 3);
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
		let sp = util.symbolParts(parsed.symbol);
		if (util.isVariant(sp.num.base, "handGroup2")) {
			return (sp.num.fill == 2);
		}
		if (util.isVariant(sp.num.base, "handGroup3")) {
			return (sp.num.fill == 2 || sp.num.fill == 5);
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
		let sp = util.symbolParts(parsed.symbol);
		if (core.fsw.isType(parsed.symbol, "hand") && sp.num.fill > 2) return true;
		return util.isVariant(sp.num.base, "planeFloor");
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
		let sp = util.symbolParts(parsed.symbol);
		if (core.fsw.isType(parsed.symbol, "hand") && sp.num.fill < 3) return true;
		return util.isVariant(sp.num.base, "planeWall");
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
		let sp = util.symbolParts(parsed.symbol);
		if (util.isVariant(sp.num.base, "planeDiagonalTowards")) return true;
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
		let sp = util.symbolParts(parsed.symbol);
		if (util.isVariant(sp.num.base, "planeDiagonalAway")) return true;
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
		let sp = util.symbolParts(parsed.symbol);
		if (sp.num.fill == 0 || sp.num.fill == 3) return "palm";
		if (sp.num.fill == 1 || sp.num.fill == 4) return "side";
		if (sp.num.fill == 2 || sp.num.fill == 5) return "back";
	}
	return "";
}