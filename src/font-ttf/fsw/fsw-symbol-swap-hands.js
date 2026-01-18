import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as structure from "./fsw-structure.js";

/**
 * Swap between left-hand and right-hand symbol
 * @param {string} fswSym Symbol to change
 * @returns {string} Updated symbol
 */
export function fswSymbolSwapHands(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);
		if (structure.isVariant(sp.baseNum, "handGroup1")) {
			const newRot = (sp.rotNum ^ 8).toString(16);
			parsed.symbol = sp.base + sp.fill + newRot;
		}
		if (structure.isVariant(sp.baseNum, "handGroup2")) {
			let newFill = sp.fillNum;
			if (newFill == 0) newFill = 1;
			if (newFill == 1) newFill = 0;
			parsed.symbol = sp.base + newFill + sp.rot;
		}
		if (structure.isVariant(sp.baseNum, "handGroup3")) {
			let newFill = sp.fillNum;
			if (newFill == 0) newFill = 1;
			if (newFill == 1) newFill = 0;
			if (newFill == 3) newFill = 4;
			if (newFill == 4) newFill = 3;
			parsed.symbol = sp.base + newFill + sp.rot;
		}
		if (structure.isVariant(sp.baseNum, "handGroup4")) {
			let newFill = sp.fillNum;
			if (newFill == 1) newFill = 2;
			if (newFill == 2) newFill = 1;
			parsed.symbol = sp.base + newFill + sp.rot;
		}
		return core.compose.symbol(parsed);
	}
	return fswSym;
}

/**
 * Swap symbol between heel and palm orientation
 * @param {string} fswSym Symbol to change
 * @returns {string} Updated symbol
 */
export function fswSymbolSwapPerspective(fswSym) {

}

/**
 * @typedef {object} SpatialSymbol
 * @property {string} fswSym Symbol to change
 * @property {number[]} coord Position of symbol upper left
 */

/**
 * Swap horizontal position of symbol across centre
 * @param {SpatialSymbol} spatialSymbol Symbol with coordinates
 * @returns {SpatialSymbol} Updated symbol with coordinates
 */
export function fswSymbolSwapSides(spatialSymbol) {

}