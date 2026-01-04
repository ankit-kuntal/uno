import { Card } from "./types";
import { isValidMove } from "./rules";

export function aiPlay(hand: Card[], current: Card) {
  return hand.find(card => isValidMove(card, current)) || null;
}
