import * as ext from "../src/index.js";
import * as core from "../node_modules/@sutton-signwriting/core/core.mjs";
import * as ttf from "../node_modules/@sutton-signwriting/font-ttf/index.mjs";

window.addEventListener("load", windowLoaded);

async function windowLoaded() {
	document.querySelector("#symbolFsw").addEventListener("change", showSymbol);
	document.querySelectorAll("#symbolDemo .optionsArea button").forEach((button) => button.addEventListener("click", showSymbolInfo));
	document.querySelector("#signFsw").addEventListener("change", showSign);
	document.querySelectorAll("#signDemo .optionsArea button").forEach((button) => button.addEventListener("click", showSignInfo));
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
	document.querySelector("#symbolDemo .renderArea").innerHTML = renderSymbol(event.target.value);
}

function showSymbolInfo(event) {
	event.preventDefault();
	console.log(event.target)
	let parsed = core.fsw.parse.symbol(document.querySelector("#symbolFsw").value);
	if (parsed.symbol) {
		let info = "";
		if (event.target.value == "left") info = ext.core.fsw.isLeftHand(parsed.symbol);
		if (event.target.value == "right") info = ext.core.fsw.isRightHand(parsed.symbol);
		if (event.target.value == "both") info = ext.core.fsw.isBothHand(parsed.symbol);
		if (event.target.value == "floor") info = ext.core.fsw.isFloorPlane(parsed.symbol);
		if (event.target.value == "wall") info = ext.core.fsw.isWallPlane(parsed.symbol);
		if (event.target.value == "diagonal") info = ext.core.fsw.isDiagonalPlane(parsed.symbol);
		document.querySelector("#symbolDemo .outputArea").innerText = info;
	}
}

function showSign(event) {
	document.querySelector("#signDemo .renderArea").innerHTML = renderSign(event.target.value);
}
function showSignInfo(event) {
	event.preventDefault();
	const signFsw = document.querySelector("#signFsw").value;
	let parsed = core.fsw.parse.sign(signFsw);
	if (parsed.spatials) {
		let info = "";
		if (event.target.value == "describe") info = ext.ttf.fsw.describeSign(signFsw);
		document.querySelector("#signDemo .outputArea").innerText = info;
	}
}