import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as describe from "./fsw-symbol-description.js";
import { generateTemporalIdx } from "./fsw-sign-generate-sequence.js";
import "../../../node_modules/@sutton-signwriting/core/src/types";

/**
 * Describe a sign 
 * @param {(string|SignObject)} fswSign Sign
 * @returns {string} Description
 */
export function describeSign(fswSign) {
	const returnObj = (typeof fswSign == "object");
	let parsed = (returnObj ? fswSign : core.fsw.parse.sign(fswSign));

	if (parsed.spatials) {
		if (!parsed.sequence) parsed = generateTemporalIdx(parsed);

		const description = parsed.sequence.map((symbol) => describe.describeSymbol(symbol));

		return description.join("; ");
	}
	return "";
}

