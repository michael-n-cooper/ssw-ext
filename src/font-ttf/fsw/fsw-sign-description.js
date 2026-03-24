import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as describe from "./fsw-symbol-description.js";
import { signGenerateTemporalIdx } from "./fsw-sign-generate-sequence.js";
import "../../../node_modules/@sutton-signwriting/core/src/types";

/**
 * Describe a sign by assembling symbol descriptions in order of the temporal sequence, which is generated if absent.
 * @memberof module:ext/ttf/fsw
 * @param {(string|SignObject)} fswSign Sign
 * @returns {string} Description
 * @see symbolDescribe
 * @see signGenerateTemporalIdx
 * @example
 * // returns "Right - Index Middle Unit, Thumb Side - Side - Floor Plane - Forward; Hinge Movement, Up Down Large; Mouth Smile"
 * describeSign("AS12d40S22112S33e00M542x540S33e00482x483S10001507x510S20f00516x504")
 */
export function signDescribe(fswSign) {
	const returnObj = (typeof fswSign == "object");
	let parsed = (returnObj ? fswSign : core.fsw.parse.sign(fswSign));

	if (parsed.spatials) {
		if (!parsed.sequence) parsed = signGenerateTemporalIdx(parsed);

		const description = parsed.sequence.map((symbol) => describe.symbolDescribe(symbol));

		return description.join("; ");
	}
	return "";
}

