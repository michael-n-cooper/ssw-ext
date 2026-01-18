// Describe a sign
import * as core from "../../../node_modules/@sutton-signwriting/core/core.mjs";
import * as structure from "../../core/fsw/fsw-structure.js";
import "../../../node_modules/@sutton-signwriting/signmaker/config/messages.js";

export function describeSign(signFsw) {
	const sign = core.fsw.parse.sign(signFsw);

	const description = sign.sequence.map((symbol) => {
		let val = "";
		if (structure.isLeftHand(symbol)) val += "Left ";
		if (structure.isRightHand(symbol)) val += "Right ";
		val += defmessages["base_" + structure.baseSymbol(symbol)];
		return val;
	});

	return description.join("; ");
}

