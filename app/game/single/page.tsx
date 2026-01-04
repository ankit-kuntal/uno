"use client";

import { useEffect, useReducer, useState } from "react";
import { createDeck } from "@/lib/game/deck";
import { gameReducer } from "@/lib/game/reducer";
import { GameState } from "@/lib/game/types";

export default function SinglePlayerGame() {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    const deck = createDeck();

    const initialState: GameState = {
      players: [
        { id: "you", hand: deck.slice(0, 7) },
        { id: "ai", hand: deck.slice(7, 14) }
      ],
      currentPlayer: 0,
      currentCard: deck[14],
      deck: deck.slice(15),
      direction: 1,
      winner: null
    };

    setState(initialState);
  }, []);

  if (!state) return <p className="p-6">Loading game...</p>;

  return (
    <div className="p-6">
      <h1>Single Player Card Game</h1>
      <p>
        Current Card: {state.currentCard.color}{" "}
        {state.currentCard.value}
      </p>
    </div>
  );
}
