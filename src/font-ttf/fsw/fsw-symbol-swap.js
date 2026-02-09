import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as ttf from "../../../node_modules/@sutton-signwriting/font-ttf/index.mjs";
import * as util from "./util.js";
import * as variant from "./fsw-symbol-variant.js";
import "../../../node_modules/@sutton-signwriting/core/src/types.js";

/**
 * Swap between left-hand and right-hand symbol
 * @memberof module:ext/ttf/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to change
 * @returns {(string|SymbolObject)} Updated symbol
 */
export function symbolSwapHands(fswSym) {
	const returnObj = (typeof fswSym == "object");
	const parsed = (returnObj ? fswSym : core.fsw.parse.symbol(fswSym));

	if (parsed.symbol) {
		const sp = util.symbolParts(parsed.symbol);
		/*
		if (util.isVariant(sp.baseNum, "handGroup1")) {
		}
		*/
		// swap fill 0,1
		if (util.isVariant(sp.baseNum, "handGroup2")) {
			let newFill = sp.fillNum;
			if (sp.fillNum == 0) newFill = 1;
			if (sp.fillNum == 1) newFill = 0;
			parsed.symbol = sp.base + newFill + sp.rot;
			//special case to "undo" a built-in mirror
			if (sp.baseNum == 0x2ef || sp.baseNum == 0x2f0) parsed.symbol = symbolMirror(parsed.symbol);
		}
		// ignore fill 2 and swap fill 0,1; 3,4
		else if (util.isVariant(sp.baseNum, "handGroup3")) {
			let newFill = sp.fillNum;
			if (sp.fillNum == 0) newFill = 1;
			if (sp.fillNum == 1) newFill = 0;
			if (sp.fillNum == 3) newFill = 4;
			if (sp.fillNum == 4) newFill = 3;
			parsed.symbol = sp.base + newFill + sp.rot;
		}
		if (returnObj) return parsed;
		return core.fsw.compose.symbol(parsed);
	}
	return fswSym;
}

/**
 * Swap symbol between heel and palm orientation
 * @memberof module:ext/ttf/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to change
 * @returns {(string|SymbolObject)} Updated symbol
 */
export function symbolSwapPerspective(fswSym) {
	const returnObj = (typeof fswSym == "object");
	const parsed = (returnObj ? fswSym : core.fsw.parse.symbol(fswSym));

	if (parsed.symbol) {
		const sp = util.symbolParts(parsed.symbol);

		// swap fill between 0 - 2 and 3 - 5
		if (util.inRangeSet(sp.baseNum, [0x2e7, 0x2ec])) {
			let newFill = sp.fillNum < 3 ? sp.fillNum + 3 : sp.fillNum - 3;
			parsed.symbol = sp.base + newFill.toString(16) + sp.rot;
		}
		// swap fill 0,2 and swap rot between 0 - 7 and 8 - f
		else if (core.fsw.isType(parsed.symbol, "hand") && variant.isWallPlane(parsed.symbol)) {
			let newFill = sp.fillNum;
			if (sp.fillNum == 0) newFill = 2;
			else if (sp.fillNum == 2) newFill = 0;
			let newRot = sp.rotNum;
			if (sp.rotNum > 7) newRot = sp.rotNum - 8;
			else newRot = sp.rotNum + 8;
			parsed.symbol = sp.base + newFill.toString(16) + newRot.toString(16);
		}
		// swap rot between 0 - 3 and 4 - 7
		else if (util.isVariant(sp.baseNum, "planeFloor")) {
			let newRot = sp.rotNum + 4;
			if (newRot > 7) newRot = newRot - 8;
			parsed.symbol = sp.base + sp.fill + newRot.toString(16);
		}
		// add 4 to base
		else if (util.isVariant(sp.baseNum, "planeDiagonalTowards")) {
			const newBase = sp.baseNum - 4;
			parsed.symbol = "S" + newBase.toString(16) + sp.fill + sp.rot;
		}
		// subtract 4 from base
		else if (util.isVariant(sp.baseNum, "planeDiagonalAway")) {
			const newBase = sp.baseNum - 4;
			parsed.symbol = "S" + newBase.toString(16) + sp.fill + sp.rot;
		}
		if (returnObj) return parsed;
		return core.fsw.compose.symbol(parsed);
	}
	return fswSym;
}


/**
 * Swap horizontal position of symbol across centre of sign
 * @memberof module:ext/ttf/fsw
 * @param {(string|SymbolObject)} fswSym Symbol with coordinates
 * @returns {(string|SymbolObject)} Updated symbol with coordinates
 */
export function symbolSwapSides(fswSym) {
	const returnObj = (typeof fswSym == "object");
	const parsed = (returnObj ? fswSym : core.fsw.parse.symbol(fswSym));

	if (parsed.coord) {
	const symWidth = ttf.fsw.symbolSize(parsed.symbol)[0];
	parsed.coord[0] = 500 - ((parsed.coord[0] + symWidth) - 500);
		if (returnObj) return parsed;
		return core.fsw.compose.symbol(parsed);
	}
	return fswSym;
}

/**
 * Mirror a symbol
 * Mirrors additional ranges from the base package, uses the base mirror if not in an additional range
 * @memberof module:ext/ttf/fsw
 * @param {(string|SymbolObject)} fswSym Symbol to change
 * @returns {(string|SymbolObject)} Mirrored symbol
 */
export function symbolMirror(fswSym) {
	const returnObj = (typeof fswSym == "object");
	const parsed = (returnObj ? fswSym : core.fsw.parse.symbol(fswSym));

	if (parsed.symbol) {
		const sp = util.symbolParts(parsed.symbol);

		// swap rot between 0 - 3 and 4 - 7
		if (util.isVariant(sp.baseNum, "mirrorGroup6")) {
			const newRot = (sp.rotNum > 3) ? (sp.rotNum - 4) : (sp.rotNum + 4);
			parsed.symbol = sp.base + sp.fill + newRot.toString(16);
		}
		// swap rot between 0 - 7 and 8 - f
		else if (util.isVariant(sp.baseNum, "mirrorGroup2")) {
			const newRot = (sp.rotNum > 7) ? (sp.rotNum - 8) : (sp.rotNum + 8);
			parsed.symbol = sp.base + sp.fill + newRot.toString(16);
		}
		// swap rot 0,1; 2,7; 3,6; 4,5
		else if (util.isVariant(sp.baseNum, "mirrorGroup3")) {
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
			parsed.symbol = sp.base + sp.fill + rotMap.get(sp.rotNum).toString(16);
		}
		// swap rot 0,2; 1,3; 4,5; 6,7
		else if (util.isVariant(sp.baseNum, "mirrorGroup9")) {
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
			parsed.symbol = sp.base + sp.fill + rotMap.get(sp.rotNum).toString(16);
		}
		// ignore rot 2 and if rot < 5 swap rot 0,4; 1,3 and if rot > 4 swap fill 0,1
		else if (util.isVariant(sp.baseNum, "mirrorGroup8")) {
			if (sp.rotNum < 5) {
				const rotMap = new Map([
					[2, 2],
					[0, 4],
					[4, 0],
					[1, 3],
					[3, 1]
				]);
				parsed.symbol = sp.base + sp.fill + rotMap.get(sp.rotNum).toString(16);
			} else {
				const newFill = sp.fillNum ^ 1;
				parsed.symbol = sp.base + newFill.toString(16) + sp.rot;
			}
		}
		// increase even rot, decrease odd rot
		else if (util.isVariant(sp.baseNum, "mirrorGroup5")) {
			const newRot = (sp.rotNum % 2 == 0) ? (sp.rotNum + 1) : (sp.rotNum - 1);
			parsed.symbol = sp.base + sp.fill + newRot.toString(16);
		}
		// increase even rot, decrease odd rot, except rot 0
		else if (util.isVariant(sp.baseNum, "mirrorGroup7")) {
			if (sp.rotNum > 0) {
				const newRot = (sp.rotNum % 2 == 0) ? (sp.rotNum - 1) : (sp.rotNum + 1);
				parsed.symbol = sp.base + sp.fill + newRot.toString(16);
			}
		}
		// swap fill 1 and 2
		else if (util.isVariant(sp.baseNum, "mirrorGroup1")) {
			let newFill = sp.fillNum;
			if (sp.fillNum == 1) newFill = 2;
			if (sp.fillNum == 2) newFill = 1;
			parsed.symbol = sp.base + newFill.toString(16) + sp.rot;
		}
		// increase even fill, decrease odd fill
		else if (util.isVariant(sp.baseNum, "mirrorGroup4")) { 
			const newFill = (sp.fillNum % 2 == 0) ? (sp.fillNum + 1) : (sp.fillNum - 1);
			parsed.symbol = sp.base + newFill.toString(16) + sp.rot;
		}
		// don't mirror
		else if (util.isVariant(sp.baseNum, "mirrorGroup10")) {
			parsed.symbol = fswSym;
		}
		// default mirror
		else parsed.symbol = ttf.fsw.symbolMirror(fswSym);

		if (returnObj) return parsed;
		else return core.fsw.compose.symbol(parsed);
	}
	return fswSym;
}