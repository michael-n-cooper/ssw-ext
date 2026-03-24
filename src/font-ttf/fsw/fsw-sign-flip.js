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
 * @example
 * // returns "AS12d40S22112S33e00M518x540S33e00482x483S10009472x510S20f00458x504"
 * signFlipX("AS12d40S22112S33e00M542x540S33e00482x483S10001507x510S20f00516x504")
 */
export function signFlipX(fswSign) {
	const returnObj = (typeof fswSign == "object");
	let parsed = (returnObj ? fswSign : core.fsw.parse.sign(fswSign));

	if (parsed.spatials) {
		parsed.spatials = parsed.spatials.map((sym) => {
			sym.symbol = swap.symbolMirror(sym.symbol);
			sym.symbol = swap.symbolSwapHands(sym.symbol);
			sym = core.fsw.parse.symbol(swap.symbolSwapSides(core.fsw.compose.symbol(sym)));
			return sym;
		});
		if (returnObj) return core.fsw.parse.sign(ttf.fsw.signNormalize(core.fsw.compose.sign(parsed)));
		return ttf.fsw.signNormalize(core.fsw.compose.sign(parsed));
	}
	return fswSign;
}

/**
 * Change sign between signer perspective and viewer perspective.
 * Conceptually flips sign in the X and Z direction.
 * @memberof module:ext/ttf/fsw
 * @private
 * @param {(string|SignObject)} fswSign Sign to flip
 * @returns {(string|SignObject)} Updated sign
 * @example
 * // returns "AS12d40S22112S33e00M518x531S33e00482x483S10029463x510S20f00458x504"
 * signFlipXZ("AS12d40S22112S33e00M542x540S33e00482x483S10001507x510S20f00516x504")
 */
export function signFlipXZ(fswSign) {
	const returnObj = (typeof fswSign == "object");
	let parsed = (returnObj ? fswSign : core.fsw.parse.sign(fswSign));

	if (parsed.spatials) {
		console.log(parsed.spatials)
		parsed.spatials = parsed.spatials.map((sym) => {
			sym.symbol = swap.symbolMirror(sym.symbol);
			sym.symbol = swap.symbolSwapPerspective(sym.symbol);
			sym.symbol = swap.symbolSwapHands(sym.symbol);
			sym = swap.symbolSwapSides(sym);
			return sym;
		});
		console.log(parsed.spatials)
		if (returnObj) return core.fsw.parse.sign(ttf.fsw.signNormalize(core.fsw.compose.sign(parsed)));
		return ttf.fsw.signNormalize(core.fsw.compose.sign(parsed));
	}
	return fswSign;
}

/**
 * Change sign between signer perspective and viewer perspective, and between left-handed and right-handed.
 * Conceptually flips sign in the Z direction.
 * @memberof module:ext/ttf/fsw
 * @param {(string|SignObject)} fswSign Sign to flip
 * @returns {(string|SignObject)} Updated sign
 * @example
 * // returns "AS12d40S22112S33e00M542x531S33e00482x483S10021507x510S20f00516x504"
 * signFlipY("AS12d40S22112S33e00M542x540S33e00482x483S10001507x510S20f00516x504")
 */
export function signFlipZ(fswSign) {
	const returnObj = (typeof fswSign == "object");
	let parsed = (returnObj ? fswSign : core.fsw.parse.sign(fswSign));

	if (parsed.spatials) {
		parsed.spatials = parsed.spatials.map((sym) => {
			sym.symbol = swap.symbolSwapPerspective(sym.symbol);
			return sym;
		});
		if (returnObj) return core.fsw.parse.sign(ttf.fsw.signNormalize(core.fsw.compose.sign(parsed)));
		return ttf.fsw.signNormalize(core.fsw.compose.sign(parsed));
	}
	return fswSign;
}