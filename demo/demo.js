import * as ext from "../src/index.js";
import * as core from "../node_modules/@sutton-signwriting/core/core.mjs";
import * as ttf from "../node_modules/@sutton-signwriting/font-ttf/index.mjs";
import { fswSymbolSwapHands, fswSymbolSwapSides } from "../src/font-ttf/fsw/fsw-symbol-swap.js";

window.addEventListener("load", windowLoaded);

async function windowLoaded() {
	document.querySelector("#symbolFsw").addEventListener("change", showSymbol);
	document.querySelectorAll("#symbolDemo .optionsArea button").forEach((button) => button.addEventListener("click", showSymbolInfo));
	document.querySelectorAll("#symbolDemo .modifyArea button").forEach((button) => button.addEventListener("click", modifySymbol));
	document.querySelector("#signFsw").addEventListener("change", showSign);
	document.querySelectorAll("#signDemo .optionsArea button").forEach((button) => button.addEventListener("click", showSignInfo));
	document.querySelectorAll("#signDemo .modifyArea button").forEach((button) => button.addEventListener("click", modifySign));
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
	let parsed = core.fsw.parse.symbol(document.querySelector("#symbolFsw").value);
	if (parsed.symbol) {
		let info = "";
		if (event.target.value == "left") info = ext.core.fsw.isLeftHand(parsed.symbol);
		if (event.target.value == "right") info = ext.core.fsw.isRightHand(parsed.symbol);
		if (event.target.value == "both") info = ext.core.fsw.isBothHand(parsed.symbol);
		if (event.target.value == "floor") info = ext.core.fsw.isFloorPlane(parsed.symbol);
		if (event.target.value == "wall") info = ext.core.fsw.isWallPlane(parsed.symbol);
		if (event.target.value == "diagonal") info = ext.core.fsw.isDiagonalPlane(parsed.symbol);
		if (event.target.value == "width") info = ttf.fsw.symbolSize(parsed.symbol)[0];
		document.querySelector("#symbolDemo .outputArea").innerText = info;
	}
}

function modifySymbol(event) {
	event.preventDefault();
	let parsed = core.fsw.parse.symbol(document.querySelector("#symbolFsw").value);
	if (parsed.symbol) {
		if (event.target.value == "hands") parsed.symbol = fswSymbolSwapHands(parsed.symbol);
		if (event.target.value == "sides") parsed = fswSymbolSwapSides(parsed);
		document.querySelector("#symbolFsw").value = core.fsw.compose.symbol(parsed);
		document.querySelector("#symbolFsw").dispatchEvent(new Event("change"));
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

function modifySign(event) {
	event.preventDefault();
	const signFsw = document.querySelector("#signFsw").value;
	let parsed = core.fsw.parse.sign(signFsw);
	if (parsed) {
		if (event.target.value == "flipX") parsed = ext.ttf.fsw.fswSignFlipX(parsed);
		if (event.target.value == "sequence") parsed.sequence = ext.ttf.fsw.generateTemporalIdx(parsed); 
		document.querySelector("#signFsw").value = ttf.fsw.signNormalize(core.fsw.compose.sign(parsed));
		document.querySelector("#signFsw").dispatchEvent(new Event("change"));
	}
}