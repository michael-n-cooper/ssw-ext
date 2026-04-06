import * as core from "../node_modules/@sutton-signwriting/core/core.mjs";
import * as variants from "./fsw-symbol-variant.js";
import "../node_modules/@sutton-signwriting/core/src/types.js";
import "./types.js";

/**
 * Generate the temporal sequence for a sign. 
 * Classifies symbols and groups them in a defined order.
 * The order can be provided as an arry of tokens "rightHand" | "leftHand" | "rightMovement" | "leftMovement" | "dynamic" | "head" | "trunk" | "limb" | "location" | "punctuation".
 * The default order groups hand and movement into left- and right- groups of hand and movement symbol, and starts with the right hand.
 * This is different from the SignSpelling guidelines which group all hand symbols before movement symbols, to explore if it's a useful approach, made possible by handedness detection.
 * @memberof module:ssw-ext
 * @param {(string|SignObject)} sign Sign
 * @param {string[]} [order=["rightHand", "rightMovement", "leftHand", "leftMovement", "dynamic", "head", "trunk", "limb", "location", "punctuation"]] Order of symbols, by default right hand, left hand, right movement, left movement, dynamic, head, trunk, limb, location, punctuation
 * @returns {string|SignObject} Sequence, or sign with sequence added
 * @example
 * // returns "AS10001S33e00S20f00"
 * signGenerateTemporalIdx("M542x540S33e00482x483S10001507x510S20f00516x504")
 */
export function signGenerateTemporalIdx(fswSign, order) {
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
	 * @private
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

