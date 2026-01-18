import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as structure from "../../core/fsw/fsw-structure.js";

export function generateTemporalIdx(sign) {
	const signObj = core.fsw.parse.sign(sign);
	if (!signObj.spatials) return "";

	let spatials = signObj.spatials.map((item) => item.symbol);
	spatials = spatials.sort((a, b) => {
		let aOrder = getOrder(a);
		let bOrder = getOrder(b);

		if (aOrder == bOrder) return a.localeCompare(b);
		return aOrder - bOrder;
	});
	return "A" + spatials.join("");

	function getOrder(symbol) {
		//all, writing, hand, movement, dynamic, head, hcenter, vcenter, trunk, limb, location, punctuation
		if (structure.isRightHand(symbol)) return 1;
		if (structure.isLeftHand(symbol)) return 2;
		if (core.fsw.isType(symbol, "movement")) return 3;
		if (core.fsw.isType(symbol, "dynamic")) return 4;
		if (core.fsw.isType(symbol, "head")) return 5;
		if (core.fsw.isType(symbol, "trunk")) return 6;
		if (core.fsw.isType(symbol, "limb")) return 7;
		if (core.fsw.isType(symbol, "location")) return 8;
		if (core.fsw.isType(symbol, "punctuation")) return 9;
		return 10;
	}
}

