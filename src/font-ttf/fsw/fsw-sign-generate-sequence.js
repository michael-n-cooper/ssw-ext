import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
//import * as structure from "../../core/fsw/fsw-structure.js";
import * as variants from "../../core/fsw/fsw-symbol-variant.js";

/**
 * Generate the temporal sequence for a sign
 * @param {SignObject} sign 
 * @returns {string[]} sequence
 */
export function generateTemporalIdx(signObj) {
	if (!signObj.spatials) return "";

	let sequence = signObj.spatials.map((item) => item.symbol);
	sequence = sequence.sort((a, b) => {
		let aOrder = getOrder(a);
		let bOrder = getOrder(b);

		if (aOrder == bOrder) return a - b;
		return aOrder - bOrder;
	});
	return sequence;

	function getOrder(symbol) {
		//all, writing, hand, movement, dynamic, head, hcenter, vcenter, trunk, limb, location, punctuation
		if (core.fsw.isType(symbol, "hand") && variants.isRightHand(symbol)) return 1;
		if (core.fsw.isType(symbol, "hand") && variants.isLeftHand(symbol)) return 2;
		if (core.fsw.isType(symbol, "movement") && variants.isRightHand(symbol)) return 3;
		if (core.fsw.isType(symbol, "movement") && variants.isLeftHand(symbol)) return 4;
		if (core.fsw.isType(symbol, "dynamic")) return 5;
		if (core.fsw.isType(symbol, "head")) return 6;
		if (core.fsw.isType(symbol, "trunk")) return 7;
		if (core.fsw.isType(symbol, "limb")) return 8;
		if (core.fsw.isType(symbol, "location")) return 9;
		if (core.fsw.isType(symbol, "punctuation")) return 10;
		return 11;
	}
}

