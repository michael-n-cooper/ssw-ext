import * as swap from "./fsw-symbol-swap.js";
import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as ttf from "../../../node_modules/@sutton-signwriting/font-ttf/index.mjs";
import "../../../node_modules/@sutton-signwriting/core/src/types";

/**
 * Change sign between left-handed and right-handed
 * Conceptually flips sign in the X direction
 * @memberof module:ext/ttf/fsw
 * @param {(string|SignObject)} fswSign Sign to flip
 * @returns {string|SignObject} Updated sign
 */
export function fswSignFlipX(fswSign) {
	const returnObj = (typeof fswSign == "object");
	let parsed = (returnObj ? fswSign : core.fsw.parse.sign(fswSign));

	if (parsed.spatials) {
		parsed.spatials = parsed.spatials.map((sym) => {
			sym.symbol = swap.symbolMirror(sym.symbol);
			sym.symbol = swap.symbolSwapHands(sym.symbol);
			sym = core.fsw.parse.symbol(swap.symbolSwapSides(core.fsw.compose.symbol(sym)));
			return sym;
		});
		if (returnObj) return parsed;
		return ttf.fsw.signNormalize(core.fsw.compose.sign(parsed));
	}
	return fswSign;
}

/**
 * Change sign between signer perspective and viewer perspective
 * Conceptually flips sign in the Z direction
 * @memberof module:ext/ttf/fsw
 * @param {(string|SignObject)} fswSign Sign to flip
 * @returns {(string|SignObject)} Updated sign
 */
export function fswSignFlipXZ(fswSign) {
	const returnObj = (typeof fswSign == "object");
	let parsed = (returnObj ? fswSign : core.fsw.parse.sign(fswSign));

	if (parsed.spatials) {
		parsed.spatials = parsed.spatials.map((sym) => {
			sym.symbol = swap.symbolMirror(sym.symbol);
			sym.symbol = swap.symbolSwapPerspective(sym.symbol);
			sym.symbol = swap.symbolSwapHands(sym.symbol);
			sym = core.fsw.parse.symbol(swap.symbolSwapSides(core.fsw.compose.symbol(sym)));
			return sym;
		});
		if (returnObj) return parsed;
		return ttf.fsw.signNormalize(core.fsw.compose.sign(parsed));
	}
	return fswSign;
}

/**
 * Change sign between signer perspective and viewer perspective, and between left-handed and right-handed
 * Conceptually flips sign in the X and Z direction
 * @memberof module:ext/ttf/fsw
 * @param {(string|SignObject)} fswSign Sign to flip
 * @returns {(string|SignObject)} Updated sign
 */
export function fswSignFlipZ(fswSign) {
	const returnObj = (typeof fswSign == "object");
	let parsed = (returnObj ? fswSign : core.fsw.parse.sign(fswSign));

	if (parsed.spatials) {
		parsed.spatials = parsed.spatials.map((sym) => {
			sym.symbol = swap.symbolSwapPerspective(sym.symbol);
			return sym;
		});
		if (returnObj) return parsed;
		return ttf.fsw.signNormalize(core.fsw.compose.sign(parsed));
	}
	return fswSign;
}