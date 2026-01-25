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
		/*
		if (structure.isVariant(sp.baseNum, "handGroup1")) {
		}
		*/
		if (structure.isVariant(sp.baseNum, "handGroup2")) {
			sp = structure.symbolParts(parsed.symbol);
			let newFill = sp.fillNum;
			if (sp.fillNum == 0) newFill = 1;
			if (sp.fillNum == 1) newFill = 0;
			parsed.symbol = sp.base + newFill + sp.rot;
			//special case to "undo" a built-in mirror
			if (sp.baseNum == 0x2ef || sp.baseNum == 0x2f0) parsed.symbol = symbolMirror(parsed.symbol);
		}
		if (structure.isVariant(sp.baseNum, "handGroup3")) {
			sp = structure.symbolParts(parsed.symbol);
			let newFill = sp.fillNum;
			if (sp.fillNum == 0) newFill = 1;
			if (sp.fillNum == 1) newFill = 0;
			if (sp.fillNum == 3) newFill = 4;
			if (sp.fillNum == 4) newFill = 3;
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

export function symbolMirror(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);

	if (parsed.symbol) {
		let sp = structure.symbolParts(parsed.symbol);

		if (structure.isVariant(sp.baseNum, "mirrorGroup1")) {
			let newFill = sp.fillNum;
			if (sp.fillNum == 1) newFill = 2;
			if (sp.fillNum == 2) newFill = 1;
			return sp.base + newFill.toString(16) + sp.rot;
		}
		else if (structure.isVariant(sp.baseNum, "mirrorGroup2")) {
			const newRot = (sp.rotNum > 7) ? (sp.rotNum - 8) : (sp.rotNum + 8);
			return sp.base + sp.fill + newRot.toString(16);
		}
		else if (structure.isVariant(sp.baseNum, "mirrorGroup3")) {
			const rotMap = new Map([
				[0, 1],
				[1, 0],
				[2, 7],
				[7, 2],
				[3, 6],
				[6, 3],
				[4, 5],
				[5, 4]
			]);
			return sp.base + sp.fill + rotMap.get(sp.rotNum).toString(16);
		 }
		else if (structure.isVariant(sp.baseNum, "mirrorGroup4")) { 
			const newFill = (sp.fillNum % 2 == 0) ? (sp.fillNum + 1) : (sp.fillNum - 1);
			return sp.base + newFill.toString(16) + sp.rot;
		}
		else if (structure.isVariant(sp.baseNum, "mirrorGroup5")) { 
			const newRot = (sp.rotNum % 2 == 0) ? (sp.rotNum + 1) : (sp.rotNum - 1);
			return sp.base + sp.fill + newRot.toString(16);
		}
		else if (structure.isVariant(sp.baseNum, "mirrorGroup6")) {
			const newRot = (sp.rotNum > 3) ? (sp.rotNum - 4) : (sp.rotNum + 4);
			return sp.base + sp.fill + newRot.toString(16);
		}
		else if (structure.isVariant(sp.baseNum, "mirrorGroup7")) { 
			if (sp.rotNum > 0) {
				const newRot = (sp.rotNum % 2 == 0) ? (sp.rotNum - 1) : (sp.rotNum + 1);
				return sp.base + sp.fill + newRot.toString(16);
			}
			return fswSym;
		}
		else if (structure.isVariant(sp.baseNum, "mirrorGroup8")) { 
			if (sp.rotNum < 5) {
				const rotMap = new Map([
					[2, 2],
					[0, 4],
					[4, 0],
					[1, 3],
					[3, 1]
				]);
				return sp.base + sp.fill + rotMap.get(sp.rotNum).toString(16);
			} else {
				const newFill = sp.fillNum ^ 1;
				return sp.base + newFill.toString(16) + sp.rot;
			}	
		}
		else if (structure.isVariant(sp.baseNum, "mirrorGroup9")) {
			const rotMap = new Map([
				[0, 2],
				[2, 0],
				[1, 3],
				[3, 1],
				[4, 5],
				[5, 4],
				[6, 7],
				[7, 6]
			]);
			return sp.base + sp.fill + rotMap.get(sp.rotNum).toString(16);
		}
		else if (structure.isVariant(sp.baseNum, "mirrorGroup10")) {
			return fswSym;
		}
		else return ttf.fsw.symbolMirror(fswSym);
	}
	return fswSym;
}