# Sign features

## Describe sign

The initial motivation to generate a sign description was as a QA tool - the description could expose details about the symbols that have semantic relevance but might not be visually distinguished, for instance by indicating that a right-hand or left-hand symbol has been used. 

Having a description like this also seemed like a new answer to the question "What is the alt text of a sign?". As a web accessibility professional, the question of a text alternative for non-text content always comes up. We can argue that the FSW or SWU of the sign is text, but I don't know of a processor that can make meaningful non-visual representation of that text. The visual representation of that text still needs a text alternative, which is most likely to wind up being either "sign" or the gloss. Both are unsatisfactory as the first is a label not conveying content, and the second is more of a translation than a text alternative and not helpful in understanding the sign itself.

My approach to a description starts with the name of the base symbol. Rotation and fill provides information about the symbol's plane, handedness, orientation, and movement direction (not all characteristics apply to all symbols). Written labels of these characteristics are composited into a description of the symbol. 

A sign description is an ordered set of symbol descriptions. The order is, I think, important for understanding the sign description. Therefore the order is defined by the temporal sequence of the sign.

This brings me to a question about the optimal temporal sequence. I have seen that these tend to start with two patterns: "Dominant hand, subdominant hand, dominant movement, subdominant movement", and "Dominant hand, dominant movement, subdominant hand, subdominant movement". For the sign description this might impact understanding. I'm not sure which pattern is preferable when seen in this context, but this might be a new way of looking at that question.

## Generate temporal sequence

## Switch between right- and left-handed sign

## Switch between signer perspective and viewer perspective

# Symbol features

## Determine and swap hand and plane of symbols

## Swap horizontal position of symbol

## Additional symbol mirrors
