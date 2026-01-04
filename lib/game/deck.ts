import { Card, Color } from "./types";

const colors: Color[] = ["red", "green", "blue", "yellow"];
const values = ["0","1","2","3","4","5","6","7","8","9","skip","reverse","draw2"];

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (let color of colors) {
    for (let value of values) {
      deck.push({ color, value });
      if (value !== "0") deck.push({ color, value });
    }
  }

  for (let i = 0; i < 4; i++) {
    deck.push({ color: "wild", value: "wild" });
    deck.push({ color: "wild", value: "wild4" });
  }

  return shuffle(deck);
}

function shuffle(deck: Card[]) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
