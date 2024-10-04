import type { TextItems, Line, Lines } from "./types";

export const groupTextItemsIntoLines = (textItems: TextItems): Lines => {
  // Implementation of groupTextItemsIntoLines function
  // This function needs to be implemented based on the logic you want to use
}

const shouldAddSpaceBetweenText = (leftText: string, rightText: string) => {
  const leftTextEnd = leftText[leftText.length - 1];
  const rightTextStart = rightText[0];
  const conditions = [
    [":", ",", "|", ".", ...BULLET_POINTS].includes(leftTextEnd) &&
      rightTextStart !== " ",
    leftTextEnd !== " " && ["|", ...BULLET_POINTS].includes(rightTextStart),
  ];

  return conditions.some((condition) => condition);
};

const getTypicalCharWidth = (textItems: TextItems): number => {
  // Implementation of getTypicalCharWidth function
  // This function needs to be implemented based on the logic you want to use
}

// Include other helper functions like shouldAddSpaceBetweenText and getTypicalCharWidth
