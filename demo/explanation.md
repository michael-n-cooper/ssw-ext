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

This function swaps the horizontal position of symbols across the sign centre, mirrors symbols, and changes their "handedness" if applicable.

## Switch between signer perspective and viewer perspective

# Symbol features

## Determine and swap hand and plane of symbols

## Swap horizontal position of symbol

## Additional symbol mirrors
