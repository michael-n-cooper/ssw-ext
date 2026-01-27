import * as swap from "./fsw-symbol-swap.js";
import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as ttf from "../../../node_modules/@sutton-signwriting/font-ttf/index.mjs";

/**
 * Change sign between left-handed and right-handed
 * Conceptually flips sign in the X direction
 * @param {string} fswSign Sign to flip
 * @returns {string} Updated sign
 */
export function fswSignFlipX(fswSign) {
	const signObj = core.fsw.parse.sign(fswSign);

	if (signObj.spatials) {
		signObj.spatials = signObj.spatials.map((sym) => {
			sym.symbol = swap.symbolMirror(sym.symbol);
			sym.symbol = swap.fswSymbolSwapHands(sym.symbol);
			sym = core.fsw.parse.symbol(swap.fswSymbolSwapSides(core.fsw.compose.symbol(sym)));
			return sym;
		});
		return ttf.fsw.signNormalize(core.fsw.compose.sign(signObj));
	}
	return fswSign;
}

/**
 * Change sign between signer perspective and viewer perspective
 * Conceptually flips sign in the Z direction
 * @param {string} fswSign Sign to flip
 * @returns {string} Updated sign
 */
export function fswSignFlipXZ(fswSign) {
	const signObj = core.fsw.parse.sign(fswSign);

	if (signObj.spatials) {
		signObj.spatials = signObj.spatials.map((sym) => {
			sym.symbol = swap.symbolMirror(sym.symbol);
			sym.symbol = swap.fswSymbolSwapPerspective(sym.symbol);
			sym.symbol = swap.fswSymbolSwapHands(sym.symbol);
			sym = core.fsw.parse.symbol(swap.fswSymbolSwapSides(core.fsw.compose.symbol(sym)));
			return sym;
		});
		return ttf.fsw.signNormalize(core.fsw.compose.sign(signObj));
	}
	return fswSign;
}

/**
 * Change sign between signer perspective and viewer perspective, and between left-handed and right-handed
 * Conceptually flips sign in the X and Z direction
 * @param {string} fswSign Sign to flip
 * @returns {string} Updated sign
 */
export function fswSignFlipZ(fswSign) {
	const signObj = core.fsw.parse.sign(fswSign);

	if (signObj.spatials) {
		signObj.spatials = signObj.spatials.map((sym) => {
			sym.symbol = swap.fswSymbolSwapPerspective(sym.symbol);
			return sym;
		});
		return ttf.fsw.signNormalize(core.fsw.compose.sign(signObj));
	}
	return fswSign;
}