import * as ext from "../src/index.js";
import * as core from "../node_modules/@sutton-signwriting/core/core.mjs";
import * as ttf from "../node_modules/@sutton-signwriting/font-ttf/index.mjs";
import "../config/alphabet.js";

window.addEventListener("load", windowLoaded);

async function windowLoaded() {
	document.querySelector("#symbolFsw").addEventListener("keydown", showSymbol);
	document.querySelectorAll("#symbolDemo button").forEach((button) => button.addEventListener("click", modifySymbol));
	document.querySelector("#signFsw").addEventListener("keydown", showSign);
	document.querySelectorAll("#signDemo button").forEach((button) => button.addEventListener("click", modifySign));
}

function renderSymbol(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) return ttf.fsw.symbolSvg(parsed.symbol);
	return "";
}
function renderSign(fswSign) {
	const parsed = core.fsw.parse.sign(fswSign);
	if (parsed.spatials) return ttf.fsw.signSvg(fswSign);
	return "";
}

function showSymbol(event) {
	const fswSym = document.querySelector("#symbolFsw").value;
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		document.querySelector("#symbolDemo .renderArea").innerHTML = renderSymbol(event.target.value);

		document.querySelector("#symbolDesc .outputArea").textContent = ext.symbolDescribe(parsed.symbol);

		let newSym = ext.symbolMirror(fswSym);
		document.querySelector("#symbolMirror .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolMirror .outputArea").innerText = newSym;
			
		newSym = ext.symbolSwapHands(fswSym);
		document.querySelector("#symbolHands .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolHands .outputArea").innerText = newSym;
	}
}

function modifySymbol(event) {
	event.preventDefault();
	let fswSym = document.querySelector("#symbolFsw").value;
	let parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		if (event.target.value == "hands") fswSym = ext.symbolSwapHands(fswSym);
		if (event.target.value == "sides") fswSym = ext.symbolSwapSides(fswSym);
		if (event.target.value == "mirror") fswSym = ext.symbolMirror(fswSym);
		document.querySelector("#symbolFsw").value = fswSym;
		document.querySelector("#symbolFsw").dispatchEvent(new Event("change"));
	}
}

function showSign(event) {
	const fswSign = document.querySelector("#signFsw").value;
	const parsed = core.fsw.parse.sign(fswSign);
	if (parsed.spatials) {
		document.querySelector("#signDemo .renderArea").innerHTML = renderSign(event.target.value);

		document.querySelector("#signDesc .outputArea").textContent = ext.signDescribe(parsed);

		document.querySelector("#signSequence .renderArea").innerHTML = "";
		let newSign = ext.signGenerateTemporalIdx(parsed);
		newSign.sequence.forEach((symbol) => document.querySelector("#signSequence .renderArea").innerHTML += renderSymbol(symbol));
		document.querySelector("#signSequence .outputArea").innerHTML = ext.signGenerateTemporalIdx(fswSign);

		let newerSign = ext.signFlipX(parsed);
		document.querySelector("#signMirror .renderArea").innerHTML = renderSign(core.fsw.compose.sign(newerSign));
		document.querySelector("#signMirror .outputArea").innerText = core.fsw.compose.sign(newerSign);

	}
}

function modifySign(event) {
	event.preventDefault();
	let fswSign = document.querySelector("#signFsw").value;
	if (event.target.value == "flipX") fswSign = ext.signFlipX(fswSign);
	if (event.target.value == "flipZ") fswSign = ext.signFlipZ(fswSign);
	if (event.target.value == "flipXZ") fswSign = ext.signFlipXZ(fswSign);
	if (event.target.value == "sequence") fswSign = ext.signGenerateTemporalIdx(fswSign) + fswSign;
	document.querySelector("#signFsw").value = fswSign;
	document.querySelector("#signFsw").dispatchEvent(new Event("change"));
}
