// Describe a sign
import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as structure from "../../core/fsw/fsw-structure.js";
import * as variants from "../../core/fsw/fsw-symbol-variant.js";
import {generateTemporalIdx} from "./fsw-sign-generate-sequence.js";
import { defmessages } from "../../../config/messages.js";

export function describeSign(signFsw) {
	if (!signFsw.startsWith("A")) signFsw = generateTemporalIdx(signFsw) + signFsw;
	const sign = core.fsw.parse.sign(signFsw);

	if (sign.spatials) {
		const description = sign.sequence.map((symbol) => {
			let val = "";
			if (variants.isLeftHand(symbol)) val += "Left ";
			if (variants.isRightHand(symbol)) val += "Right ";
			val += defmessages["base_" + structure.baseSymbol(symbol)];
			return val;
		});

		return description.join("; ");
	}
	return "";
}

