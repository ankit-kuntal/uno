import { Card } from "./types";

export function isValidMove(card: Card, current: Card) {
  return (
    card.color === current.color ||
    card.value === current.value ||
    card.color === "wild"
  );
}
