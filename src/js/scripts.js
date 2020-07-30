import Chess from "./refactored/chess.js";
import ChessBoard from "./refactored/chessBoard.js";
import Controller from "./refactored/controller.js";
import UserInterface from "./refactored/userInterface.js"; 

const innerBoard = document.querySelector(".board-inner");
const promotionBlock = document.querySelector(".select-counter-to-promote");
const interfaceBlock = document.querySelector(".info-wrapper");
const endingMessageBlock = document.querySelector(".result-of-game")

const chessBoard = new ChessBoard(innerBoard, promotionBlock, endingMessageBlock);
const chess = new Chess();
const userInterface = new UserInterface(interfaceBlock);
const controller = new Controller(chess, chessBoard, userInterface);

userInterface.updateFen(chess.FEN);

chessBoard.setBoard();

controller.addAllEventListeners();

