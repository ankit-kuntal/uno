import { GameState, Card } from "./types";
import { aiPlay } from "./ai";

export function gameReducer(state: GameState, action: any): GameState {
  switch (action.type) {
    case "PLAY_CARD":
      return {
        ...state,
        currentCard: action.card,
        currentPlayer: state.currentPlayer === 0 ? 1 : 0
      };

    default:
      return state;
  }
}
