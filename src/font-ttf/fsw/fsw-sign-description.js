// Describe a sign
import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as describe from "./fsw-symbol-description.js";
import {generateTemporalIdx} from "./fsw-sign-generate-sequence.js";

export function describeSign(signFsw) {
	if (!signFsw.startsWith("A")) signFsw = generateTemporalIdx(signFsw) + signFsw;
	const sign = core.fsw.parse.sign(signFsw);

	if (sign.spatials) {
		const description = sign.sequence.map((symbol) => describe.describeSymbol(symbol));

		return description.join("; ");
	}
	return "";
}

