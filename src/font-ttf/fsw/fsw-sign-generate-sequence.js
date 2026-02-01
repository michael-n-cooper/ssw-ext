import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
//import * as structure from "../../core/fsw/fsw-structure.js";
import * as variants from "../../core/fsw/fsw-symbol-variant.js";
import "../../../node_modules/@sutton-signwriting/core/src/types";

//type SequenceOrder = "rightHand" | "leftHand" | "rightMovement" | "leftMovement" | "dynamic" | "head" | "trunk" | "limb" | "location" | "punctuation";
/**
 * Generate the temporal sequence for a sign
 * @param {(string|SignObject)} sign Sign
 * @param {SequenceOrder[]} order Order of symbols
 * @returns {string|SignObject} Sequence, or sign with sequence added
 */
export function generateTemporalIdx(fswSign, order =["leftHand", "leftMovement", "rightHand", "rightMovement", "dynamic", "head", "trunk", "limb", "location", "punctuation"]) {
	const returnObj = (typeof fswSign == "object");
	const parsed = (returnObj ? fswSign : core.fsw.parse.sign(fswSign));
	if (parsed.spatials) {

		let sequence = parsed.spatials.map((item) => item.symbol);
		sequence = sequence.sort((a, b) => {
			let aOrder = getOrder(a, order);
			let bOrder = getOrder(b, order);

			if (aOrder == bOrder) return a - b;
			return aOrder - bOrder;
		});
		if (returnObj) {
			parsed.sequence = sequence;
			return parsed;
		}
		return "A" + sequence.join("");
	}
	return fswSign;

	function getOrder(symbol, order) {
		let num = 0;
		for (let type of order) {
			num++;
			if (type == "rightHand" && core.fsw.isType(symbol, "hand") && variants.isRightHand(symbol)) break;
			if (order == "rightMovement" && core.fsw.isType(symbol, "movement") && variants.isRightHand(symbol)) break;
			if (type == "leftHand" && core.fsw.isType(symbol, "hand") && variants.isLeftHand(symbol)) break;
			if (type == "leftMovement" && core.fsw.isType(symbol, "movement") && variants.isLeftHand(symbol)) break;
			if (type == "dynamic" && core.fsw.isType(symbol, "dynamic")) break;
			if (type == "trunk" && core.fsw.isType(symbol, "trunk")) break;
			if (type == "limb" && core.fsw.isType(symbol, "limb")) break;
			if (type == "location" && core.fsw.isType(symbol, "location")) break;
			if (type == "punctuation" && core.fsw.isType(symbol, "punctuation")) break;
		}
		return num;
	}
}

