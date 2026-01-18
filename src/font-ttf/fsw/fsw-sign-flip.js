import * as swap from "./fsw-symbol-swap-hands.js";
import * as core from "@sutton-signwriting/core";

/**
 * Change sign between left-handed and right-handed
 * Conceptually flips sign in the X direction
 * @param {string} fswSign Sign to flip
 * @returns {string} Updated sign
 */
export function fswSignFlipX(fswSign) {
	let sign = core.fsw.parse.sign(fswSign);
	sign.spatials.map((sym) => {
		let newSym = swap.fswSymbolSwapSides(sym);
		newSym.symbol = swap.fswSymbolSwapHands(newSym.symbol);
		return newSym;
	})
}

/**
 * Change sign between signer perspective and viewer perspective
 * Conceptually flips sign in the Z direction
 * @param {string} fswSign Sign to flip
 * @returns {string} Updated sign
 */
export function fswSignFlipZ(fswSign) {
	let sign = core.fsw.parse.sign(fswSign);
	sign.spatials.map((sym) => {
		let newSym = swap.fswSymbolSwapSides(sym);
		newSym.symbol = swap.fswSymbolSwapPerspective(newSym.symbol);
		return newSym;
	})
}

/**
 * Change sign between signer perspective and viewer perspective, and between left-handed and right-handed
 * Conceptually flips sign in the X and Z direction
 * @param {string} fswSign Sign to flip
 * @returns {string} Updated sign
 */
export function fswSignFlipXZ(fswSign) {
	let sign = core.fsw.parse.sign(fswSign);
	sign.spatials.map((sym) => {
		let newSym = sym;
		newSym.symbol = swap.fswSymbolSwapPerspective(newSym.symbol);
		newSym.symbol = swap.fswSymbolSwapHands(newSym.symbol);
		return newSym;
	})
}