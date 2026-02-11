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
		if (util.isVariant(sp.num.base, "handGroup1")) {
		}
		*/
		// swap fill 0,1
		if (util.isVariant(sp.num.base, "handGroup2")) {
			let newFill = sp.num.fill;
			if (sp.num.fill == 0) newFill = 1;
			if (sp.num.fill == 1) newFill = 0;
			parsed.symbol = sp.str.base + newFill + sp.str.rot;
			//special case to "undo" a built-in mirror
			if (sp.num.base == 0x2ef || sp.num.base == 0x2f0) parsed.symbol = symbolMirror(parsed.symbol);
		}
		// ignore fill 2 and swap fill 0,1; 3,4
		else if (util.isVariant(sp.num.base, "handGroup3")) {
			let newFill = sp.num.fill;
			if (sp.num.fill == 0) newFill = 1;
			if (sp.num.fill == 1) newFill = 0;
			if (sp.num.fill == 3) newFill = 4;
			if (sp.num.fill == 4) newFill = 3;
			parsed.symbol = sp.str.base + newFill + sp.str.rot;
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
		if (util.inRangeSet(sp.num.base, [0x2e7, 0x2ec])) {
			let newFill = sp.num.fill < 3 ? sp.num.fill + 3 : sp.num.fill - 3;
			parsed.symbol = sp.str.base + newFill.toString(16) + sp.str.rot;
		}
		// swap fill 0,2 and swap rot between 0 - 7 and 8 - f
		else if (core.fsw.isType(parsed.symbol, "hand") && variant.isWallPlane(parsed.symbol)) {
			let newFill = sp.num.fill;
			if (sp.num.fill == 0) newFill = 2;
			else if (sp.num.fill == 2) newFill = 0;
			let newRot = sp.num.rot;
			if (sp.num.rot > 7) newRot = sp.num.rot - 8;
			else newRot = sp.num.rot + 8;
			parsed.symbol = sp.str.base + newFill.toString(16) + newRot.toString(16);
		}
		// swap rot between 0 - 3 and 4 - 7
		else if (util.isVariant(sp.num.base, "planeFloor")) {
			let newRot = sp.num.rot + 4;
			if (newRot > 7) newRot = newRot - 8;
			parsed.symbol = sp.str.base + sp.str.fill + newRot.toString(16);
		}
		// add 4 to base
		else if (util.isVariant(sp.num.base, "planeDiagonalTowards")) {
			const newBase = sp.num.base - 4;
			parsed.symbol = "S" + newBase.toString(16) + sp.str.fill + sp.str.rot;
		}
		// subtract 4 from base
		else if (util.isVariant(sp.num.base, "planeDiagonalAway")) {
			const newBase = sp.num.base - 4;
			parsed.symbol = "S" + newBase.toString(16) + sp.str.fill + sp.str.rot;
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
		if (util.isVariant(sp.num.base, "mirrorGroup6")) {
			const newRot = (sp.num.rot > 3) ? (sp.num.rot - 4) : (sp.num.rot + 4);
			parsed.symbol = sp.str.base + sp.str.fill + newRot.toString(16);
		}
		// swap rot between 0 - 7 and 8 - f
		else if (util.isVariant(sp.num.base, "mirrorGroup2")) {
			const newRot = (sp.num.rot > 7) ? (sp.num.rot - 8) : (sp.num.rot + 8);
			parsed.symbol = sp.str.base + sp.str.fill + newRot.toString(16);
		}
		// swap rot 0,1; 2,7; 3,6; 4,5
		else if (util.isVariant(sp.num.base, "mirrorGroup3")) {
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
			parsed.symbol = sp.str.base + sp.str.fill + rotMap.get(sp.num.rot).toString(16);
		}
		// swap rot 0,2; 1,3; 4,5; 6,7
		else if (util.isVariant(sp.num.base, "mirrorGroup9")) {
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
			parsed.symbol = sp.str.base + sp.str.fill + rotMap.get(sp.num.rot).toString(16);
		}
		// ignore rot 2 and if rot < 5 swap rot 0,4; 1,3 and if rot > 4 swap fill 0,1
		else if (util.isVariant(sp.num.base, "mirrorGroup8")) {
			if (sp.num.rot < 5) {
				const rotMap = new Map([
					[2, 2],
					[0, 4],
					[4, 0],
					[1, 3],
					[3, 1]
				]);
				parsed.symbol = sp.str.base + sp.str.fill + rotMap.get(sp.num.rot).toString(16);
			} else {
				const newFill = sp.num.fill ^ 1;
				parsed.symbol = sp.str.base + newFill.toString(16) + sp.str.rot;
			}
		}
		// increase even rot, decrease odd rot
		else if (util.isVariant(sp.num.base, "mirrorGroup5")) {
			const newRot = (sp.num.rot % 2 == 0) ? (sp.num.rot + 1) : (sp.num.rot - 1);
			parsed.symbol = sp.str.base + sp.str.fill + newRot.toString(16);
		}
		// increase even rot, decrease odd rot, except rot 0
		else if (util.isVariant(sp.num.base, "mirrorGroup7")) {
			if (sp.num.rot > 0) {
				const newRot = (sp.num.rot % 2 == 0) ? (sp.num.rot - 1) : (sp.num.rot + 1);
				parsed.symbol = sp.str.base + sp.str.fill + newRot.toString(16);
			}
		}
		// swap fill 1 and 2
		else if (util.isVariant(sp.num.base, "mirrorGroup1")) {
			let newFill = sp.num.fill;
			if (sp.num.fill == 1) newFill = 2;
			if (sp.num.fill == 2) newFill = 1;
			parsed.symbol = sp.str.base + newFill.toString(16) + sp.str.rot;
		}
		// increase even fill, decrease odd fill
		else if (util.isVariant(sp.num.base, "mirrorGroup4")) { 
			const newFill = (sp.num.fill % 2 == 0) ? (sp.num.fill + 1) : (sp.num.fill - 1);
			parsed.symbol = sp.str.base + newFill.toString(16) + sp.str.rot;
		}
		// don't mirror
		else if (util.isVariant(sp.num.base, "mirrorGroup10")) {
			parsed.symbol = fswSym;
		}
		// default mirror
		else parsed.symbol = ttf.fsw.symbolMirror(fswSym);

		if (returnObj) return parsed;
		else return core.fsw.compose.symbol(parsed);
	}
	return fswSym;
}