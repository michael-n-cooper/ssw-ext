import * as ext from "../src/index.js";
import * as core from "../node_modules/@sutton-signwriting/core/core.mjs";
import * as ttf from "../node_modules/@sutton-signwriting/font-ttf/index.mjs";
import { fswSymbolSwapHands, fswSymbolSwapPerspective, fswSymbolSwapSides } from "../src/font-ttf/fsw/fsw-symbol-swap.js";
import "../config/alphabet.js";

window.addEventListener("load", windowLoaded);

async function windowLoaded() {
	document.querySelector("#symbolFsw").addEventListener("change", showSymbol);
	document.querySelectorAll("#symbolDemo button").forEach((button) => button.addEventListener("click", modifySymbol));
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
	const fswSym = document.querySelector("#symbolFsw").value;
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		let info = "<ul>";
		info += "<li>Left hand: " + ext.core.fsw.isLeftHand(parsed.symbol) + "</li>";
		info += "<li>Right hand: " + ext.core.fsw.isRightHand(parsed.symbol) + "</li>";
		info += "<li>Both hands: " + ext.core.fsw.isBothHand(parsed.symbol) + "</li>";
		info += "<li>Floor plane: " + ext.core.fsw.isFloorPlane(parsed.symbol) + "</li>";
		info += "<li>Wall plane: " + ext.core.fsw.isWallPlane(parsed.symbol) + "</li>";
		info += "<li>Diagonal plane: " + ext.core.fsw.isDiagonalPlane(parsed.symbol) + "</li>";
		info += "<li>Description: " + ext.ttf.fsw.describeSymbol(parsed.symbol) + "</li>";
		info += "</ul>";
		document.querySelector("#symbolInfo .outputArea").innerHTML = info;

		let newSym = ext.ttf.fsw.symbolMirror(fswSym);
		document.querySelector("#symbolMirror .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolMirror .outputArea").innerText = newSym;
			
		newSym = fswSymbolSwapHands(fswSym);
		document.querySelector("#symbolHands .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolHands .outputArea").innerText = newSym;

		newSym = fswSymbolSwapPerspective(fswSym);
		document.querySelector("#symbolPerspective .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolPerspective .outputArea").innerText = newSym;

		newSym = fswSymbolSwapSides(fswSym);
		document.querySelector("#symbolSides .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolSides .outputArea").innerText = newSym;
	}
}

function modifySymbol(event) {
	event.preventDefault();
	let fswSym = document.querySelector("#symbolFsw").value;
	let parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		if (event.target.value == "hands") fswSym = fswSymbolSwapHands(fswSym);
		if (event.target.value == "sides") fswSym = fswSymbolSwapSides(fswSym);
		if (event.target.value == "mirror") fswSym = ext.ttf.fsw.symbolMirror(fswSym);
		if (event.target.value == "perspective") fswSym = fswSymbolSwapPerspective(fswSym);                
		document.querySelector("#symbolFsw").value = fswSym;
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
	let fswSign = document.querySelector("#signFsw").value;
	if (event.target.value == "flipX") fswSign = ext.ttf.fsw.fswSignFlipX(fswSign);
	if (event.target.value == "flipZ") fswSign = ext.ttf.fsw.fswSignFlipZ(fswSign);
	if (event.target.value == "flipXZ") fswSign = ext.ttf.fsw.fswSignFlipXZ(fswSign);
	if (event.target.value == "sequence") {
		let parsed = core.fsw.parse.sign(fswSign);
		parsed.sequence = ext.ttf.fsw.generateTemporalIdx(fswSign);
		fswSign = ttf.fsw.signNormalize(core.fsw.compose.sign(fswSign));
	}
	document.querySelector("#signFsw").value = fswSign;
	document.querySelector("#signFsw").dispatchEvent(new Event("change"));
}

function showMirrors() {
	const mirrorArea = document.querySelector("#mirrorArea");
	Object.values(window.alphabet).forEach((group) => {
		group.forEach((sym) => {
			sym = sym.slice(0, 4) + "01";
			let fswSec = document.createElement("div");
			let origSec = document.createElement("div");
			let mirrorSec = document.createElement("div");
			let handSec = document.createElement("div");

			fswSec.textContent = sym;
			origSec.innerHTML = ttf.fsw.symbolSvg(sym);
			mirrorSec.innerHTML = ttf.fsw.symbolSvg(ext.ttf.fsw.symbolMirror(sym));
			handSec.innerHTML = ttf.fsw.symbolSvg(ext.ttf.fsw.fswSymbolSwapHands(sym));

			mirrorArea.append(fswSec, origSec, mirrorSec, handSec);
		});
	});
}