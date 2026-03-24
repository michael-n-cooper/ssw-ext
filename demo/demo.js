import * as ext from "../src/index.js";
import * as core from "../node_modules/@sutton-signwriting/core/core.mjs";
import * as ttf from "../node_modules/@sutton-signwriting/font-ttf/index.mjs";
import { symbolSwapHands, symbolSwapPerspective, symbolSwapSides } from "../src/font-ttf/fsw/fsw-symbol-swap.js";
import "../config/alphabet.js";

window.addEventListener("load", windowLoaded);

async function windowLoaded() {
	initializeTabs();
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

		document.querySelector("#symbolDesc .outputArea").textContent = ext.ttf.fsw.describeSymbol(parsed.symbol);

		let newSym = ext.ttf.fsw.symbolMirror(fswSym);
		document.querySelector("#symbolMirror .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolMirror .outputArea").innerText = newSym;
			
		newSym = symbolSwapHands(fswSym);
		document.querySelector("#symbolHands .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolHands .outputArea").innerText = newSym;

		newSym = symbolSwapPerspective(fswSym);
		document.querySelector("#symbolPerspective .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolPerspective .outputArea").innerText = newSym;
	}
}

function modifySymbol(event) {
	event.preventDefault();
	let fswSym = document.querySelector("#symbolFsw").value;
	let parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		if (event.target.value == "hands") fswSym = symbolSwapHands(fswSym);
		if (event.target.value == "sides") fswSym = symbolSwapSides(fswSym);
		if (event.target.value == "mirror") fswSym = ext.ttf.fsw.symbolMirror(fswSym);
		if (event.target.value == "perspective") fswSym = symbolSwapPerspective(fswSym);                
		document.querySelector("#symbolFsw").value = fswSym;
		document.querySelector("#symbolFsw").dispatchEvent(new Event("change"));
	}
}

function showSign(event) {
	const fswSign = document.querySelector("#signFsw").value;
	const parsed = core.fsw.parse.sign(fswSign);
	if (parsed.spatials) {
		document.querySelector("#signDemo .renderArea").innerHTML = renderSign(event.target.value);

		document.querySelector("#signDesc .outputArea").textContent = ext.ttf.fsw.describeSign(parsed);

		document.querySelector("#signSequence .renderArea").innerHTML = "";
		let newSign = ext.ttf.fsw.generateTemporalIdx(parsed);
		newSign.sequence.forEach((symbol) => document.querySelector("#signSequence .renderArea").innerHTML += renderSymbol(symbol));
		document.querySelector("#signSequence .outputArea").innerHTML = ext.ttf.fsw.generateTemporalIdx(fswSign);

		let newerSign = ext.ttf.fsw.signFlipX(parsed);
		document.querySelector("#signMirror .renderArea").innerHTML = renderSign(core.fsw.compose.sign(newerSign));
		document.querySelector("#signMirror .outputArea").innerText = core.fsw.compose.sign(newerSign);

		let newestSign = ext.ttf.fsw.signFlipXZ(fswSign);
		document.querySelector("#signPerspective .renderArea").innerHTML = renderSign(newestSign);
		document.querySelector("#signPerspective .outputArea").innerText = newestSign;
	}
}

function modifySign(event) {
	event.preventDefault();
	let fswSign = document.querySelector("#signFsw").value;
	if (event.target.value == "flipX") fswSign = ext.ttf.fsw.signFlipX(fswSign);
	if (event.target.value == "flipZ") fswSign = ext.ttf.fsw.signFlipZ(fswSign);
	if (event.target.value == "flipXZ") fswSign = ext.ttf.fsw.signFlipXZ(fswSign);
	if (event.target.value == "sequence") fswSign = ext.ttf.fsw.generateTemporalIdx(fswSign) + fswSign;
	document.querySelector("#signFsw").value = fswSign;
	document.querySelector("#signFsw").dispatchEvent(new Event("change"));
}

function initializeTabs() {
	const tabLinks = document.querySelectorAll("a.tab");
	tabLinks.forEach((tabLink) => {
		tabLink.addEventListener("click", showTab);
	});
}
function showTab(event) {
	event.preventDefault();
	let container = event.target.closest("div,body");
	container.querySelector(".active").className = "inactive";
	const newTab = event.target.getAttribute("href");
	container.querySelector(newTab).className = "active";
}
