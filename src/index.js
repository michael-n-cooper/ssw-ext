/**
 * This is a set of proposed additional features for the {@link https://www.sutton-signwriting.io/font-ttf/ Sutton Signwriting Javascript library}. For prototyping and demo purposes this is implemented only in the font-ttf module, and if accepted would need porting to the other modules. Some of the functions might be more appropriate for the core module but are here for now to keep it simple.
 * 
 * Types of features:
 * * Symbol state functions to determine handedness, plane, and palm orientation;
 * * Symbol modification functions that alter these states, and an extended left-right mirror function handling additional ranges;
 * * Generate semantic descriptions of symbols and in turn for entire signs;
 * * Flip signs between left- and right-handed signs, and between signer and viewer perspective;
 * * Generate a reasonable temporal sequence for a sign.
 * @module ssw-ext
 */

import { isLeftHand, isRightHand, isBothHand, isFloorPlane, isWallPlane, isDiagonalAway, isDiagonalTowards, isDiagonalPlane, getHandOrientation } from "./fsw-symbol-variant.js";
import { symbolSwapHands, symbolSwapPerspective, symbolSwapSides, symbolMirror } from "./fsw-symbol-swap.js";
import { symbolDescribe } from "./fsw-symbol-description.js";
import { signDescribe } from "./fsw-sign-description.js";
import { signGenerateTemporalIdx } from "./fsw-sign-generate-sequence.js";
import { signFlipX, signFlipZ, signFlipXZ } from "./fsw-sign-flip.js";

export { isLeftHand, isRightHand, isBothHand, isFloorPlane, isWallPlane, isDiagonalAway, isDiagonalTowards, isDiagonalPlane, getHandOrientation, symbolSwapHands, symbolSwapPerspective, symbolSwapSides, symbolMirror, symbolDescribe, signDescribe, signGenerateTemporalIdx, signFlipX, signFlipZ, signFlipXZ };
