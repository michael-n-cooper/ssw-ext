import * as core from "../node_modules/@sutton-signwriting/core/core.mjs";
import * as util from "./util.js";
import * as variants from "./fsw-symbol-variant.js";
import { defmessages } from "../config/messages.js";
import { rotData } from "./rot-data.js";
import labels from "../config/descMessages.json" with { type: "json" };
import "../node_modules/@sutton-signwriting/core/src/types.js";
import "./types.js";

/**
 * Describe a symbol. This starts with the label of the base symbol, then examines range, fill, and rotation to work out information about orientation in space, movement direction, etc. The final text uses strings from /config/descMessages.json.
 * @memberof module:ssw-ext
 * @param {string | SymbolObject} fswSym Symbol to describe
 * @returns {string} Description
 * @example
 * // returns "Right - Index - Palm - Wall Plane - Up Left"
 * describeSymbol("S10001")
 */
export function symbolDescribe(fswSym) {
	const parsed = (typeof fswSym == "object" ? fswSym : core.fsw.parse.symbol(fswSym));
	if (parsed.symbol) {
		let val = [];
		if (variants.isLeftHand(parsed.symbol)) val.push(labels.hand.left);
		if (variants.isRightHand(parsed.symbol)) val.push(labels.hand.right);
		if (variants.isBothHand(parsed.symbol)) val.push(labels.hand.both);

		val.push(defmessages["base_" + util.baseSymbol(parsed.symbol)]);

		switch (variants.getHandOrientation(parsed.symbol)) {
			case "back":
				val.push(labels.palm.back);
				break;
			case "palm":
				val.push(labels.palm.palm);
				break;
			case "side":
				val.push(labels.palm.side)
				break;
		}

		if (core.fsw.isType(parsed.symbol, "hand")) {
			if (variants.isWallPlane(parsed.symbol)) val.push(labels.plane.wall);
			if (variants.isFloorPlane(parsed.symbol)) val.push(labels.plane.floor);
		}

		const rotDesc = getRotDescComponent(parsed.symbol, rotData.orientations);
		if (rotDesc.length > 0) val.push(rotDesc.join(", "));
		const circleType = getRotDescComponent(parsed.symbol, rotData.circleTypes);
		if (circleType.length > 0) val.push(circleType.join(", "));
		//const circleDir = getRotDescComponent(parsed.symbol, rotData.circleDirections);
		//if (circleDir.length > 0) val.push(circleDir.join(", "));
		const circleStart = getRotDescComponent(parsed.symbol, rotData.circleStarts);
		if (circleStart.length > 0) val.push(circleStart.join(", "));
		const twistDesc = getTwistDescription(parsed.symbol);
		if (twistDesc.length > 0) val.push(twistDesc.join(", "));

		return val.join(" - ");
	}
	return "";
}

/**
 * Find the rotation pattern for a symbol
 * @memberof module:ssw-ext
 * @private
 * @param {number} baseNum Symbol base number
 * @param {Object[]} map Array of symbol ranges and patterns
 * @returns {number[]} Pattern
 * @see rotData
 */
function getRotPattern(baseNum, map) {
	for (const pattern of map) {
		if (util.inRangeSet(baseNum, pattern[0])) {
			return pattern[1];
		}
	};
	return null;
}
/**
 * Find the rotation name sequence for a symbol
 * @memberof module:ssw-ext
 * @private
 * @param {number} baseNum Symbol base number
 * @param {Object[]} map Array of symbol ranges and names
 * @returns {number[]} Sequence
 * @see rotData
 */
function getRotSeq(baseNum, map) {
	for (const seq of map) {
		if (util.inRangeSet(baseNum, seq[0])) {
			return seq[1];
		}
	}
}
/**
 * Adjust a rotation pattern to match the rotation of the symbol
 * @memberof module:ssw-ext
 * @private
 * @param {number[]} pattern Rotation pattern
 * @param {number} rot Symbol rotation
 * @returns {number[]} Rotated pattern
 */
function rotateSymbolPattern(pattern, rot, short = false) {
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
 * @memberof module:ssw-ext
 * @private
 * @param {string | SymbolObject} fswSym Symbol to describe
 * @returns {string} Description
 */
function getRotDescComponent(fswSym, comp) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		const sp = util.symbolParts(fswSym);
		const floorPlane = variants.isFloorPlane(parsed.symbol);
		// orientations and movement directions
		const rotPattern = getRotPattern(sp.num.base, comp.patterns);
		const rotSeq = getRotSeq(sp.num.base, comp.sequences);
		const startNames = floorPlane ? comp.names.floor : comp.names.wall;
		return processRotPattern(sp.num.rot, rotPattern, rotSeq, startNames);

	}
	return [];
}

/**
 * Generate information about the rotation of a symbol.
 * @memberof module:ssw-ext
 * @private
 * @param {number} rot Symbol rotation
 * @param {number[]} rotPattern Rotation pattern for the symbol
 * @param {number[]} rotSequence Sequence for name list
 * @param {string[]} nameList List of rotation descriptions
 * @returns {string[]} Array of rotation descriptions
 */
function processRotPattern(rot, rotPattern, rotSequence, nameList) {
	//console.log(rot, rotPattern, rotSequence, nameList)
	if (rotPattern != null) {
		rotPattern = rotateSymbolPattern(rotPattern, rot, (nameList.length == 2));
		return rotPattern.map((pos) => {
			return nameList[rotSequence[pos]];
		});
	}
	return [];
}

// Special case of processRotPattern for twists, until I work out how / whether to combine
function getTwistDescription(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		const sp = util.symbolParts(fswSym);
		let rotPattern, rotSeq, startNames, result = [];

		// twists
		if (util.inRangeSet(sp.num.base, ...new Map(rotData.twists.sequences).keys())) {
			rotPattern = getRotPattern(sp.num.base, rotData.twists.patterns);
			rotSeq = getRotSeq(sp.num.base, rotData.twists.sequences);
			startNames = rotData.twists.names.over;
			if (0x24e <= sp.num.base && sp.num.base <= 0x250 && sp.num.fill < 3) startNames = rotData.twists.names.under;
			else if (sp.num.fill > 2) startNames = rotData.twists.names.under;
			result = processRotPattern(sp.num.rot, rotPattern, rotSeq, startNames);
		}
		return result;
	}
	return [];
}
