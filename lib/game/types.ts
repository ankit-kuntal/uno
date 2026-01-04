export type Color = "red" | "green" | "blue" | "yellow" | "wild";

export type Card = {
  color: Color;
  value: string; // 0-9, skip, reverse, draw2, wild, wild4
};

export type Player = {
  id: string;
  hand: Card[];
};

export type GameState = {
  players: Player[];
  currentPlayer: number;
  currentCard: Card;
  deck: Card[];
  direction: 1 | -1;
  winner: string | null;
};
