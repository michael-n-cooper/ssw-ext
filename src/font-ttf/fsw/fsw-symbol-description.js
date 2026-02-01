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

		const rotDesc = getSymbolRotationDescription(parsed.symbol);

		return val.concat(rotDesc).join(" ");
	}
	return "";
}

const rotNames = {
	"wall": ["Up", "Up Left", "Left", "Down Left", "Down", "Down Right", "Right", "Up Right"],
	"floor": ["Forward", "Forward Left", "Left", "Back Left", "Back", "Back Right", "Right", "Forward Right"],
	"diagonal": ["Up", "Up Left", "Down Left", "Down", "Down Right", "Up Right"],
	"twists": ["Over Right", "Over Left", "Under Right", "Under Left"],
}
//const rotSeq = [0, 1, 2, 3, 4, 5, 6, 7, 0, 7, 6, 5, 4, 3, 2, 1];
const symbolRotSequences = new Map([
	[[0x231, 0x232], [0, 1, 2, 3, 4, 5, 6, 7, 4, 3, 2, 1, 0, 7, 6, 5]],
	[[0x100, 0x500], [0, 1, 2, 3, 4, 5, 6, 7, 0, 7, 6, 5, 4, 3, 2, 1]]
]);
const symbolRotPatterns = new Map([
	[[[0x100, 0x204], [0x22a, 0x230], [0x234, 0x235], [0x24b, 0x254]], [0]],
	[[0x231, 0x232], [4, 0]],
	[[0x233, 0x233], [2, 0]],
	[[0x236, 0x237], [0, 4, 0]],
	[[0x238, 0x23a], [1, 0]],
	[[0x23b, 0x23d], [2, 0]],
	[[0x23e, 0x23e], [6, 4]],
	[[0x23f, 0x241], [3, 0]],
	[[0x242, 0x244], [4, 2, 0]],
	[[0x245, 0x247], [0, 3, 0]],
	[[0x248, 0x24a], [7, 1, 7, 1]]
]);
function getRotPattern(baseNum) {
	for (const pattern of symbolRotPatterns.entries()) {
		if (structure.inRangeSet(baseNum, pattern[0])) {
			return pattern[1];
		}
	}
	return null;
}
function getRotSeq(baseNum) {
	for (const seq of symbolRotSequences.entries()) {
		if (structure.inRangeSet(baseNum, seq[0])) {
			return seq[1];
		}
	}
}
function rotateSymbolPattern(pattern, rot) {
	return pattern.map((pos) => {
		let newPos = pos + rot;
		if ((rot < 8 && newPos > 7) || newPos > 15) newPos = newPos - 8;
		return newPos;
	})
}
function getSymbolRotationDescription(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		const sp = structure.symbolParts(fswSym);
		let rotPattern = getRotPattern(sp.baseNum);
		if (rotPattern != null) {
			rotPattern = rotateSymbolPattern(rotPattern, sp.rotNum);
			const rotSeq = getRotSeq(sp.baseNum);
			return rotPattern.map((pos) => {
				return rotNames.wall[rotSeq[pos]]
			});
		}
	}
	return [];
}
const symbolTwistPatterns = {
	"S23e": [rotNames.twists[0]],
	"S24b": [rotNames.twists[1]],
	"S24c - S24d": [rotNames.twists[1], rotNames.twists[0]],
	"S24e - S24f": [rotNames.twists[3]],
	"S250": [rotNames.twists[3], rotNames.twists[2]]
}
const symbolTwistSequences = {
	"S23e": [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
	"S24b - S24d": [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
	"S24e - ": [3,3,null,1,1,1,null,3,2,2,null,0,0,0,null,2]
}