import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as structure from "../../core/fsw/fsw-structure.js";
import * as variants from "../../core/fsw/fsw-symbol-variant.js";
import { defmessages } from "../../../config/messages.js";
import { rotData } from "../../../config/rotData.js";
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
 * Find the rotation pattern for a symbol
 * @private
 * @param {number} baseNum Symbol base number
 * @param {[]} map Array of symbol ranges and patterns
 * @returns {number[]} Pattern
 */
function getRotPattern(baseNum, map) {
	for (const pattern of map) {
		if (structure.inRangeSet(baseNum, pattern[0])) {
			return pattern[1];
		}
	};
	return null;
}
/**
 * Find the rotation name sequence for a symbol
 * @private
 * @param {number} baseNum Symbol base number
 * @param {[]} map Array of symbol ranges and names
 * @returns {number[]} Sequence
 */
function getRotSeq(baseNum, map) {
	for (const seq of map) {
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
		rotPattern = getRotPattern(sp.baseNum, rotData.orientations.patterns);
		rotSeq = getRotSeq(sp.baseNum, rotData.orientations.sequences);
		startNames = floorPlane ? rotData.orientations.names.floor : rotData.orientations.names.wall;
		result = result.concat(processRotPattern(sp.rotNum, rotPattern, rotSeq, startNames));
		return result;
	}
	return [];
}
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

function getTwistDescription(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		const sp = structure.symbolParts(fswSym);
		let rotPattern, rotSeq, startNames, result = [];

		// twists
		if (structure.inRangeSet(sp.baseNum, ...new Map(rotData.twists.sequences).keys())) {
			rotPattern = getRotPattern(sp.baseNum, rotData.twists.patterns);
			rotSeq = getRotSeq(sp.baseNum, rotData.twists.sequences);
			startNames = rotData.twists.names.over;
			if (0x24e <= sp.baseNum && sp.baseNum <= 0x250 && sp.fillNum < 3) startNames = rotData.twists.names.under;
			else if (sp.fillNum > 2) startNames = rotData.twists.names.under;
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
			rotPattern = getRotPattern(sp.baseNum, rotData.circleTypes.patterns);
			rotSeq = getRotSeq(sp.baseNum, rotData.circleTypes.sequences);
			startNames = floorPlane ? rotData.circleTypes.names.floor : rotData.circleTypes.names.wall;
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
			rotPattern = getRotPattern(sp.baseNum, rotData.circleStarts.patterns);
			rotSeq = getRotSeq(sp.baseNum, rotData.circleStarts.sequences);
			startNames = floorPlane ? rotData.circleStarts.names.floor : rotData.circleStarts.names.wall;
			result = result.concat(processRotPattern(sp.rotNum, rotPattern, rotSeq, startNames));
		}
		return result;
	}
	return [];
}
