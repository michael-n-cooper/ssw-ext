import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as ttf from "../../../node_modules/@sutton-signwriting/font-ttf/index.mjs";
import * as structure from "../../core/fsw/fsw-structure.js";

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
			if (sp.fillNum == 0) newFill = 1;
			if (sp.fillNum == 1) newFill = 0;
			parsed.symbol = sp.base + newFill + sp.rot;
		}
		if (structure.isVariant(sp.baseNum, "handGroup3")) {
			let newFill = sp.fillNum;
			if (sp.fillNum == 0) newFill = 1;
			if (sp.fillNum == 1) newFill = 0;
			if (sp.fillNum == 3) newFill = 4;
			if (sp.fillNum == 4) newFill = 3;
			parsed.symbol = sp.base + newFill + sp.rot;
		}
		if (structure.isVariant(sp.baseNum, "handGroup4")) {
			let newFill = sp.fillNum;
			if (sp.fillNum == 1) newFill = 2;
			if (sp.fillNum == 2) newFill = 1;
			parsed.symbol = sp.base + newFill + sp.rot;
		}
		return core.fsw.compose.symbol(parsed);
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
 * Swap horizontal position of symbol across centre
 * @param {SymbolObject} spatialSymbol Symbol with coordinates
 * @returns {SymbolObject} Updated symbol with coordinates
 */
export function fswSymbolSwapSides(symObj) {
	if (!symObj.coord) return symObj;
	const symWidth = ttf.fsw.symbolSize(symObj.symbol)[0];
	symObj.coord[0] = 749 - (symObj.coord[0] + symWidth);
	return symObj;
}