import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as structure from "../../core/fsw/fsw-structure.js";
import * as variants from "../../core/fsw/fsw-symbol-variant.js";
import { defmessages } from "../../../config/messages.js";
import "../../../node_modules/@sutton-signwriting/core/src/types";

/**
 * Describe a symbol
 * @memberof module:ext/ttf/fsw
 * @param {string | SymbolObject} fswSym Symbol to describe
 * @returns {string} Description
 */
export function describeSymbol(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
	if (parsed.symbol) {
		let val = [];
		if (variants.isLeftHand(parsed.symbol)) val.push("Left");
		if (variants.isRightHand(parsed.symbol)) val.push("Right");
		if (variants.isBothHand(parsed.symbol)) val.push("Both Hands");

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

		if (core.fsw.isType(parsed.symbol, "hand")) {
			if (variants.isWallPlane(parsed.symbol)) val.push("Wall Plane");
			if (variants.isFloorPlane(parsed.symbol)) val.push("Floor Plane");
		}

		const rotDesc = getSymbolRotationDescription(parsed.symbol);

		return val.join(" - ") + (rotDesc.length > 0 ? (" - " + rotDesc.join(", ")) : "");
	}
	return "";
}

/**
 * Sets of names for symbol rotations
 * @private
 */
const rotNames = {
	"wall": ["Up", "Up Left", "Left", "Down Left", "Down", "Down Right", "Right", "Up Right"],
	"floor": ["Forward", "Forward Left", "Left", "Back Left", "Back", "Back Right", "Right", "Forward Right"],
	"diagonal": ["Up", "Up Left", "Down Left", "Down", "Down Right", "Up Right"],
	"curveWall": ["Up & Right", "Right Down Diagonal", "Right & Down", "Down Diagonal Left", "Down & Left", "Up Diagonal Left", "Left & Up", "Up Diagonal Left", "Up & Left", "Left Down Diagonal", "Left & Down", "Down Diagonal Right", "Down & Right", "Up Diagonal Right", "Right & Up", "Up Diagonal Right"],
	"curveX": ["Right", "Left"],
	"curveY": ["Forward", "Back"],
	"curveZ": ["Over", "Under"]
}
/**
 * Pointers to the symbol rotation name for a give rotation value
 * @private
 */
const symbolRotSequences = new Map([
	[[0x231, 0x232], [0, 1, 2, 3, 4, 5, 6, 7, 4, 3, 2, 1, 0, 7, 6, 5]],
	[[0x100, 0x500], [0, 1, 2, 3, 4, 5, 6, 7, 0, 7, 6, 5, 4, 3, 2, 1]]
]);
/**
 * Sequences of rotation names for symbol ranges
 * @private
 */
const symbolRotPatterns = new Map([
	[[[0x100, 0x204], [0x22a, 0x230], [0x234, 0x235], [0x24b, 0x254], [0x265, 0x26b], [0x26f, 0x270], [0x281, 0x287]], [0]],
	[[[0x231, 0x232], [0x26c, 0x26d]], [4, 0]],
	[[[0x233, 0x233], [0x26e, 0x26e]], [2, 0]],
	[[[0x236, 0x237], [0x271, 0x272]], [0, 4, 0]],
	[[[0x238, 0x23a], [0x273, 0x273]], [1, 0]],
	[[[0x23b, 0x23d], [0x274, 0x276]], [2, 0]],
	[[0x23e, 0x23e], [6, 4]],
	[[[0x23f, 0x241], [0x277, 0x277]], [3, 0]],
	[[[0x242, 0x244], [0x278, 0x27a]], [4, 2, 0]],
	[[[0x245, 0x247], [0x27b, 0x27d]], [0, 3, 0]],
	[[[0x248, 0x24a], [0x2, 0x2]], [7, 1, 7, 1]],
	[[0x27e, 0x280], [5, 0, 5, 0]]
]);
/**
 * Find the rotation pattern for a symbol
 * @private
 * @param {number} baseNum Symbol base number
 * @returns {number[]} Pattern
 */
function getRotPattern(baseNum) {
	for (const pattern of symbolRotPatterns.entries()) {
		if (structure.inRangeSet(baseNum, pattern[0])) {
			return pattern[1];
		}
	}
	return null;
}
/**
 * Find the rotation name sequence for a symbol
 * @private
 * @param {number} baseNum Symbol base number
 * @returns {number[]} Sequence
 */
function getRotSeq(baseNum) {
	for (const seq of symbolRotSequences.entries()) {
		if (structure.inRangeSet(baseNum, seq[0])) {
			return seq[1];
		}
	}
}
/**
 * Adjust a rotation pattern to match the rotation of the symbol
 * @private
 * @param {number[]} pattern Rotation pattern
 * @param {number} rot Symbol rotation
 * @returns {number[]} Rotated pattern
 */
function rotateSymbolPattern(pattern, rot) {
	return pattern.map((pos) => {
		let newPos = pos + rot;
		if ((rot < 8 && newPos > 7) || newPos > 15) newPos = newPos - 8;
		return newPos;
	})
}
/**
 * Get the description for the rotation component of a symbol
 * @private
 * @param {string | SymbolObject} fswSym Symbol to describe
 * @returns {string} Description
 */
function getSymbolRotationDescription(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		const sp = structure.symbolParts(fswSym);
		let rotPattern = getRotPattern(sp.baseNum);
		if (rotPattern != null) {
			rotPattern = rotateSymbolPattern(rotPattern, sp.rotNum);
			const rotSeq = getRotSeq(sp.baseNum);
			let nameList = rotNames.wall;
			if (variants.isFloorPlane(fswSym)) nameList = rotNames.floor;
			return rotPattern.map((pos) => {
				return nameList[rotSeq[pos]]
			});
		}
	}
	return [];
}
/*
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
	*/