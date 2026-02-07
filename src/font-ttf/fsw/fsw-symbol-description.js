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
		if (rotDesc.length > 0) val.push(rotDesc.join(", "));
		const circleDir = getCircleDirection(parsed.symbol);
		if (circleDir.length > 0) val.push(circleDir.join(", "));
		const circleStart = getCircleStart(parsed.symbol);
		if (circleStart.length > 0) val.push(circleStart.join(", "));
		const twistDesc = getTwistDescription(parsed.symbol);
		if (twistDesc.length > 0) val.push(twistDesc.join(", "));

		return val.join(" - ");
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
	[[0x248, 0x24a], [7, 1, 7, 1]],
	[[0x27e, 0x280], [5, 0, 5, 0]]
]);
/**
 * Find the rotation pattern for a symbol
 * @private
 * @param {number} baseNum Symbol base number
 * @returns {number[]} Pattern
 */
function getRotPattern(baseNum, map) {
	for (const pattern of map.entries()) {
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
function getRotSeq(baseNum, map) {
	for (const seq of map.entries()) {
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
function rotateSymbolPattern(pattern, rot, short=false) {
	return pattern.map((pos) => {
		let newPos = pos + rot;
		if (short) {
			newPos = (rot > 7 ? (pos ^ 1) : pos);
		}
		else if ((rot < 8 && newPos > 7) || newPos > 15) newPos = newPos - 8;
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
		const floorPlane = variants.isFloorPlane(parsed.symbol);
		let rotPattern, rotSeq, startNames, result = [];
		// orientations and movement directions
			rotPattern = getRotPattern(sp.baseNum, symbolRotPatterns);
			rotSeq = getRotSeq(sp.baseNum, symbolRotSequences);
			startNames = floorPlane ? rotNames.floor : rotNames.wall;
			result = result.concat(processRotPattern(sp.rotNum, rotPattern, rotSeq, startNames));
		return result;
	}
	return [];
}
function processRotPattern(rot, rotPattern, rotSequence, nameList) {
	if (rotPattern != null) {
		rotPattern = rotateSymbolPattern(rotPattern, rot, (rotSequence.length == 2));
		return rotPattern.map((pos) => {
			return nameList[rotSequence[pos]];
		});
	}
	return [];
}

function getTwistDescription(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		const sp = structure.symbolParts(fswSym);
		let rotPattern, rotSeq, startNames, result = [];
	
		// twists
		if (structure.inRangeSet(sp.baseNum, [[0x23e, 0x23e], [0x24b, 0x24c], [0x24e, 0x24f], [0x281, 0x285], [0x24d, 0x24d], [0x250, 0x250], [0x286, 0x286]])) {
			rotPattern = getRotPattern(sp.baseNum, symbolTwistPatterns);
			rotSeq = getRotSeq(sp.baseNum, symbolTwistSequences);
			startNames = symbolTwistNames.twistsOver;
			if (0x24e <= sp.baseNum && sp.baseNum <= 0x250 && sp.fillNum < 3) startNames = symbolTwistNames.twistsUnder;
			else if (sp.fillNum > 2) startNames = symbolTwistNames.twistsUnder;
			result = processRotPattern(sp.rotNum, rotPattern, rotSeq, startNames);
		}
		return result;
	}
	return [];
}
function getCircleDirection(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		const floorPlane = variants.isFloorPlane(parsed.symbol);
		const sp = structure.symbolParts(fswSym);
		let rotPattern, rotSeq, startNames, result = [];

		// circles
		if (structure.inRangeSet(sp.baseNum, [0x2e3, 0x2ec])) {
			// circle types (direction of motion)
			rotPattern = getRotPattern(sp.baseNum, symbolCircleTypePatterns);
			rotSeq = getRotSeq(sp.baseNum, symbolCircleTypeSequences);
			startNames = floorPlane ? symbolCircleNames.circleTypeFloor : symbolCircleNames.circleTypeWall;
			result = result.concat(processRotPattern(sp.rotNum, rotPattern, rotSeq, startNames));
		}
		return result;
	}
	return [];
}
function getCircleStart(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		const floorPlane = variants.isFloorPlane(parsed.symbol);
		const sp = structure.symbolParts(fswSym);
		let rotPattern, rotSeq, startNames, result = [];

		if (structure.inRangeSet(sp.baseNum, [0x2e3, 0x2ec])) {
			// circle starts (location where motion starts)
			rotPattern = getRotPattern(sp.baseNum, symbolCirclePatterns);
			rotSeq = getRotSeq(sp.baseNum, symbolCircleSequences);
			startNames = floorPlane ? symbolCircleNames.circleStartsFloor : symbolCircleNames.circleStartsWall;
			result = result.concat(processRotPattern(sp.rotNum, rotPattern, rotSeq, startNames));
		}
		return result;
	}
	return [];
}
const symbolTwistNames = {
	"twistsOver": ["Over Left", "Over Right"],
	"twistsUnder": ["Under Left", "Under Right"]
}
const symbolTwistPatterns = new Map([
	[[[0x23e, 0x23e], [0x24b, 0x24c], [0x24e, 0x24f], [0x281, 0x282], [0x284, 0x285]], [0]],
	[[[0x24d, 0x24d], [0x250, 0x250], [0x283, 0x283], [0x286, 0x286]], [0, 1]],
]);
const symbolTwistSequences = new Map([
	[[0x23e, 0x286], [0, 1]],
]);

const symbolCircleNames = {
	"circleTypeWall": ["Anti-clockwise", "Clockwise"],
	"circleTypeFloor": ["Forward-Back", "Back-Forward"],
	"circleStartsWall": ["High", "High-Diagonal-Left", "Left Side", "Low-Diagonal-Left", "Low", "Low-Diagonal-Right", "Right Side", "High-Diagonal-Right"],
	"circleStartsFloor": ["Near", "Away"],
	"circleDirectionFloor": ["Parallel with Side Wall", "Left High Diagonal", "Parallel with Floor", "Left Low Diagonal", "Parallel with Side Wall", "Right Low Diagonal", "Parallel with Floor", "Right High Diagonal"]
}
const symbolCircleSequences = new Map([
	[[0x100, 0x500], [0, 1, 2, 3, 4, 5, 6, 7, 0, 7, 6, 5, 4, 3, 2, 1]]
]);
const symbolCirclePatterns = new Map([
	[[0x100, 0x500], [0]]
]);
const symbolCircleTypeSequences = new Map([
	[[0x100, 0x500], [0, 1]]
]);
const symbolCircleTypePatterns = new Map([
	[[0x100, 0x500], [0]]
]);