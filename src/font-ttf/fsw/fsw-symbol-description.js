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

const rotNames = {
	"wall": ["Up", "Up Left", "Left", "Down Left", "Down", "Down Right", "Right", "Up Right"],
	"floor": ["Forward", "Forward Left", "Left", "Back Left", "Back", "Back Right", "Right", "Forward Right"],
	"diagonal": ["Up", "Up Left", "Down Left", "Down", "Down Right", "Up Right"],
	"twists": ["Over Right", "Over Left", "Under Right", "Under Left"],
}
const symbolRotPatterns = {
	"S22a - S230, S234 - S235, S24b - S254": [rotNames.wall[0]],
	"S231 - S232": [rotNames.wall[4], rotNames.wall[0]],
	"S233 - ": [rotNames.wall[2], rotNames.wall[0]],
	"S236 - S237": [rotNames.wall[0], rotNames.wall[4], rotNames.wall[0]],
	"S238 - S23a": [rotNames.wall[1], rotNames.wall[0]],
	"S23b - S23d": [rotNames.wall[2], rotNames.wall[0]],
	"S23e": [rotNames.wall[6], rotNames.wall[4]],
	"S23f - S241": [rotNames.wall[3], rotNames.wall[0]],
	"S242 - S244": [rotNames.wall[4], rotNames.wall[2], rotNames.wall[0]],
	"S245 - S247": [rotNames.wall[0], rotNames.wall[3], rotNames.wall[0]],
	"S248 - S24a": [rotNames.wall[7], rotNames.wall[1], rotNames.wall[7], rotNames.wall[1]],
}
const symbolTwistPatterns = {
	"S23e": [rotNames.twists[0]],
	"S24b": [rotNames.twists[1]],
	"S24c - S24d": [rotNames.twists[1], rotNames.twists[0]],
	"S24e - S24f": [rotNames.twists[3]],
	"S250": [rotNames.twists[3], rotNames.twists[2]]
}
const symbolRotSequences = {
	"hand, S23e": [0, 1, 2, 3, 4, 5, 6, 7, 0, 7, 6, 5, 4, 3, 2, 1],
	"S22a - ": [0, 1, 2, 3, 4, 5, 6, 7],
}
const symbolTwistSequences = {
	"S23e": [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
	"S24b - S24d": [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
	"S24e - ": [3,3,null,1,1,1,null,3,2,2,null,0,0,0,null,2]
}