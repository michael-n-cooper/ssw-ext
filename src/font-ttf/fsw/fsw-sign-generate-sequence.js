import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as variants from "./fsw-symbol-variant.js";
import "../../../node_modules/@sutton-signwriting/core/src/types";
import "../../types.js";

//type SequenceOrder = "rightHand" | "leftHand" | "rightMovement" | "leftMovement" | "dynamic" | "head" | "trunk" | "limb" | "location" | "punctuation";
/**
 * Generate the temporal sequence for a sign
 * @memberof module:ext/ttf/fsw
 * @param {(string|SignObject)} sign Sign
 * @param {string[]} [order] Order of symbols
 * @returns {string|SignObject} Sequence, or sign with sequence added
 */
export function generateTemporalIdx(fswSign, order) {
	const returnObj = (typeof fswSign == "object");
	const parsed = (returnObj ? fswSign : core.fsw.parse.sign(fswSign));
	if (parsed.spatials) {
		if (typeof order === "undefined") order = ["rightHand", "rightMovement", "leftHand", "leftMovement", "dynamic", "head", "trunk", "limb", "location", "punctuation"];

		let sequence = parsed.spatials.map((item) => item.symbol);
		sequence = sequence.sort((a, b) => {
			let aOrder = getOrder(a);
			let bOrder = getOrder(b);

			if (aOrder == bOrder) return 0;
			return aOrder - bOrder;
		});
		if (returnObj) {
			parsed.sequence = sequence;
			return parsed;
		}
		return "A" + sequence.join("");
	}
	return fswSign;

	/**
	 * Determine sort order of a symbol
	 * @param {string} symbol Symbol to position
	 * @returns {number} Order
	 */
	function getOrder(symbol) {
		if (core.fsw.isType(symbol, "hand") && variants.isRightHand(symbol)) return order.indexOf("rightHand");
		if (core.fsw.isType(symbol, "movement") && variants.isRightHand(symbol)) return order.indexOf("rightMovement");
		if (core.fsw.isType(symbol, "hand") && variants.isLeftHand(symbol)) return order.indexOf("leftHand");
		if (core.fsw.isType(symbol, "movement") && variants.isLeftHand(symbol)) return order.indexOf("leftMovement");
		if (core.fsw.isType(symbol, "dynamic")) return order.indexOf("dynamic");
		if (core.fsw.isType(symbol, "trunk")) return order.indexOf("trunk");
		if (core.fsw.isType(symbol, "limb")) return order.indexOf("limb");
		if (core.fsw.isType(symbol, "location")) return order.indexOf("location");
		if (core.fsw.isType(symbol, "punctuation")) return order.indexOf("punctuation");
		return order.length;
	}
}

