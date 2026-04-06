# Sign features

## Describe sign

The initial motivation to generate a sign description was as a QA tool - the description could expose details about the symbols that have semantic relevance but might not be visually distinguished, for instance by indicating that a right-hand or left-hand symbol has been used. 

Having a description like this also seemed like a new answer to the question "What is the alt text of a sign?". As a web accessibility professional, the question of a text alternative for non-text content always comes up. We can argue that the FSW or SWU of the sign is text, but I don't know of a processor that can make meaningful non-visual representation of that text. The visual representation of that text still needs a text alternative, which is most likely to wind up being either "sign" or the gloss. Both are unsatisfactory as the first is a label not conveying content, and the second is more of a translation than a text alternative and not helpful in understanding the sign itself.

My approach to a description starts with the name of the base symbol. Rotation and fill provides information about the symbol's plane, handedness, orientation, and movement direction (not all characteristics apply to all symbols). Written labels of these characteristics are composited into a description of the symbol. 

A sign description is an ordered set of symbol descriptions. The order is, I think, important for understanding the sign description. Therefore the order is defined by the temporal sequence of the sign.

## Generate temporal sequence

I created the ability to generate a temporal sequence because not all signs in the wild have it, but it is needed for sorted and for the description algorithm. A preferred [temporal sequence is already described](https://www.signwriting.org/archive/docs6/sw0534-SignSpellingGuidelines-2008.pdf), and this algorithm follows that along with awareness of left- and right-hand symbols.

Algorithmic generation of the temporal sequence might be considered less ideal than manual creation, so it is intended for situations where the sequence hasn't been provided. But I think the algorithm mostly produces desired results, and could at least be used to get users started on adding the sequence to the sign.

In working with this and its application to a sign description, I have a question about the optimal temporal sequence. I have seen that these tend to start with two patterns: "Dominant hand, subdominant hand, dominant movement, subdominant movement", and "Dominant hand, dominant movement, subdominant hand, subdominant movement". For the sign description this might impact understanding. I'm not sure which pattern is preferable when seen in this context, but this might be a new way of looking at that question.

## Switch between right- and left-handed sign

From what I have seen, sign dictionaries generally provide right-handed signs. Left-handed users either must mentally flip them, or add a left-handed version to the dictionary (differentiated in the gloss). The function to flip a sign could simply do this as needed on individual signs or entire documents. 

The `flipSignX` function uses symbol functions described below to swap the horizontal position of symbols across the sign centre, mirror symbols, and change between left- and right-"handedness" if applicable.

## Switch between signer perspective and viewer perspective

More of an experiment "because it was there", the `flipSignXZ` function changes a sign to the viewer perspective. I'm not sure if this is useful or a bad idea, but I thought seeing it in action would help people provide input on that question. Since the signer perspective and viewer perspective swap left and right, many of the changes are the same as in the `flipSignX` function, but also the palm orientation of hand symbols is reversed, and towards and away movement are reversed.

There is also a `flipSignZ` function that changes palm orientation and towards / away movement, but not left / right aspects. This is for "completeness" but no other functions depend on it, and in experimentation I did not find this useful. I left it in the set in case anyone thinks it might be.

# Symbol features

## Determine hand and plane of symbols

Hand and movement symbols reference either the right hand, the left hand, or combined movement (both hands). Like the "isType" function, the "isLeftHand", "isRightHand", and "isBothHand" functions indicate if a symbol has the checked handedness. This information is used in modifying symbols, generating symbol descriptions, and in sorting symbols for the temporal sequence.

Hand and movement symbols also indicate the wall plane, floor plane, or diagonal plane. The `isWallPlane`, `isFloorPlane`, `isDiagonalTowards`, and `isDiagonalAway` indicates if a symbol is on one of those planes. This information is used in modifying symbols and generating symbol descriptions

## Swap hand and perspective



## Swap horizontal position of symbol



## Additional symbol mirrors
