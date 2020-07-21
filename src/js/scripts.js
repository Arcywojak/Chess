import Chess from "./refactored/chess.js";
import ChessBoard from "./refactored/chessBoard.js";
import Controller from "./refactored/controller.js";

const chess = new Chess();

const innerBoard = document.querySelector(".board-inner");
const promotionBlock = document.querySelector(".select-counter-to-promote");


const chessBoard = new ChessBoard(innerBoard, promotionBlock);

chessBoard.setBoard();

const controller = new Controller(chess, chessBoard)

controller.addAllEventListeners();

