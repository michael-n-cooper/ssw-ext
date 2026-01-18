// Describe a sign
import * as core from "@sutton-signwriting/core";
import * as structure from "../../core/fsw/fsw-structure.js";
import defmessages from "@sutton-signwriting/signmaker/config/messages.js";

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

