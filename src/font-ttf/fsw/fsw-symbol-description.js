import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as structure from "../../core/fsw/fsw-structure.js";
import * as variants from "../../core/fsw/fsw-symbol-variant.js";
import { defmessages } from "../../../config/messages.js";

export function describeSymbol(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		let val = [];
		if (variants.isLeftHand(parsed.symbol)) val.push("Left");
		if (variants.isRightHand(parsed.symbol)) val.push("Right");
		if (variants.isBothHand(parsed.symbol)) val.push("Both hands");

		val.push(defmessages["base_" + structure.baseSymbol(parsed.symbol)]);

		switch (variants.getHandOrientation(parsed.symbol)) {
			case "back":
				val.push("Back");
				break;
			case "palm":
				val.push("Palm");
				break;
			case "side":
				val.push("Side")
				break;
		}

		if (variants.isWallPlane(parsed.symbol)) val.push("Wall");
		if (variants.isFloorPlane(parsed.symbol)) val.push("Floor");
		if (variants.isDiagonalTowards(parsed.symbol)) val.push("Diagonal towards");
		if (variants.isDiagonalAway(parsed.symbol)) val.push("Diagonal away");

		return val.join(" ");
	}
	return "";
}