(function (r, t) {

    "use strict";
    // suppress errors
    r.onerror = function (e, r, t) {
        return false;
    };

    // set up audio context for the game
    r.AudioContext = r.AudioContext || r.webkitAudioContext;

    // check if local storage is available
    var s = function (e) {
        try {
            var r = "_";

            // check if local storage can be used
            e.setItem(r, r);
            e.removeItem(r);
            return true;
        } catch (e) {
            return false;
        }
    }(r.localStorage);

    // adjust UI for mobile devices with safe area insets
    if (r.MutationObserver && t.body.classList && t.body.classList.contains("mobile")) {
        var o = new MutationObserver(function () {
            var e = t.querySelector(".google-revocation-link-placeholder");

            // adjust position to accommodate safe area insets
            if (e) {
                e.style = e.getAttribute("style") + "bottom: calc(60px + env(safe-area-inset-bottom)) !important;";
                o.disconnect();
            }
        });
        o.observe(t.body, {
            childList: true
        });
    }

    var n = {};

    // track game scores
    var i = {
            player1: 0,
            player2: 0,
            ties: 0
        };
    var u = {
            player1: 0,
            player2: 0,
            ties: 0
        };
    var c = "x";
    var v = "o";
    var l = {};
    var f, m = 9;
    var d, p, humanTurn = true;
    var h = false;
    var q = false;
    var b = 300;
    var S = .75;
    var g, w = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

    // add symbol to the game board
    function addSymbol(e, r) {
        n.squares[r].querySelector("div").classList.add(e);
    }

    function changeTurn() {
        var e = n.scores.turn1.classList,
            r = n.scores.turn2.classList,
            t = n.scores.turnTies.classList;
        
        // change turn indicator based on player's move
        if (q && n.restart.style.display === "none") {
            if (humanTurn) {
                r.remove("turn");
                e.add("turn");
            } else {
                e.remove("turn");
                r.add("turn");
            }
            t.add("turn");
        } else {
            e.remove("turn");
            r.remove("turn");
            t.remove("turn");
        }
    }

    function findAvailableMove(e) {

        // check if the chosen square is already occupied or if the game is over
        if (g[e] !== 0 || checkWin() || !q && humanTurn) {
            return;
        }

        // if playing against another player
        if (q) {
            humanTurn = !humanTurn;
            g[e] = humanTurn ? -1 : 1;
            addSymbol(humanTurn ? c : v, e);
            checkWin();

        // if playing against the computer
        } else {
            g[e] = -1;
            addSymbol(c, e);
            humanTurn = true;

            // introduce a delay before the computer makes its move
            setTimeout(computerMove, b);
        }

        // change the turn indicator
        changeTurn();
    }

    function displayEndResults(s, o) {

        // display the end results of the game
        n.restart.style.display = "block";
        setTimeout(function () {
            setTimeout(function () {
                p = false
            }, b);

            // highlight the winning squares
            if (o) {
                for (var t = 3; t--;) {
                    n.squares[o[t]].classList.add("win")
                }
            }
            switch (s) {

                // update the score for player 1 or the computer if playing against it
                case c:
                    n.scores.player1.innerHTML = q ? ++u.player1 : ++i.player1;
                    n.scores.player1.classList.add("appear");
                    n.board.classList.add("win");
                    break;
                
                // update the score for player 2 if playing against another player
                case v:
                    n.scores.player2.innerHTML = q ? ++u.player2 : ++i.player2;
                    n.scores.player2.classList.add("appear");
                    n.board.classList.add("win");
                    break;
                
                // update the score for ties
                default:
                    n.scores.ties.innerHTML = q ? ++u.ties : ++i.ties;
                    n.scores.ties.classList.add("appear");
                    n.board.classList.add("tie");
                    break;
            }
        }, humanTurn && !q ? 100 : b + 100)
    }

    // check if any player has won or if it's a tie
    function checkWin() {
        for (var e = w.length; e--;) {
            var r = w[e],
                t = g[r[0]] + g[r[1]] + g[r[2]];
            
            // display end results if there's a winner
            if (t === 3 || t === -3) {
                displayEndResults(t === 3 ? v : c, r);
                return true;
            }
        }
        var s = 0;
        for (e = m; e--;) {
            if (g[e] !== 0) {
                s++;
            }
        }

        // display end results if it's a tie
        if (s === 9) {
            displayEndResults();
            return true;
        }
        return false;
    }

    // simulate the computer's move
    function computerMove() {

        // check if the game is already won
        if (checkWin()) {
            return;
        }
        var e, r, t, s, o, a, n = 0;

        // set "humanTurn" to false, indicating it's not the player's turn
        humanTurn = false;
        changeTurn();

        // iterate over the game board to find available moves
        for (e = m; e--;) {

            // if the square is not empty, increment the count of occupied squares
            if (g[e] !== 0) {
                n++;

                // if it's the first occupied square encountered, store its index
                if (n === 1) {
                    a = e;
                }
            }
        }

        // if there's only one occupied square and a random condition is met
        if (n < 2 && Math.random() > .2) {

            // choose a random empty square, until the chosen square is different from the previously stored one
            do {
                o = Math.floor(Math.random() * m);
            } while (o === a);
        } else {

            // if there's no immediate winning move for the computer, evaluate potential moves
            for (e = m; e--;) {
                for (r = m; r--;) {

                    // if the square is already occupied, skip to the next iteration
                    if (g[r] !== 0) {
                        continue;
                    }

                    // simulate placing the computer's symbol in the square
                    g[r] = 1;
                    if (checkWin()) { // if this move results in a win for the computer
                        addSymbol(v, r); // add the symbol to the square
                        return;
                    }

                    // else, reset the square to empty for the next iteration
                    g[r] = 0;
                }

                // if the square is already occupied, skip to the next iteration
                if (g[e] !== 0) {
                    continue;
                }

                // simulate placing the computer's symbol in the square
                g[e] = 1;

                var i = null, // evaluation result for each potential move
                    u = g.concat(); // create a copy of the game board to evaluate the move
                
                // evaluate the potential move by iterating over all possible winning combinations
                for (r = m; r--;) {

                    // if the square is already occupied, skip to the next iteration
                    if (u[r] !== 0) {
                        continue;
                    }

                    // simulate placing the human's symbol in the square
                    u[r] = -1;
                    for (t = w.length; t--;) {

                        // if the human wins with this move and a random condition is met
                        if (u[w[t][0]] + u[w[t][1]] + u[w[t][2]] === -3 && Math.random() > S) {

                            g[e] = 0; // reset the original square
                            g[r] = 1; // place the computer's symbol in the winning square
                            addSymbol(v, r); // add the symbol to the square
                            checkWin();

                            return;
                        }
                    }
                    var c = 0,
                        l = 0,
                        f = u.concat(), // create a copy of the game board for the computer
                        d = u.concat(); // create a copy of the game board for the human
                    
                    // evaluate the potential move by iterating over all possible winning combinations
                    for (t = m; t--;) {

                        if (f[t] === 0) { // if the square is empty, place the computer's symbol in the square
                            f[t] = 1;
                        }
                        if (d[t] === 0) { // if the square is empty, place the human's symbol in the square
                            d[t] = -1;
                        }
                    }

                    // count winning combinations for the computer and the player
                    for (t = w.length; t--;) {

                        // computer's winning combinations count
                        if (f[w[t][0]] + f[w[t][1]] + f[w[t][2]] === 3) {
                            c++;
                        }

                        // human's winning combinations count
                        if (d[w[t][0]] + d[w[t][1]] + d[w[t][2]] === -3) {
                            l++;
                        }
                    }

                    // difference between computer's and player's winning combinations
                    var p = c - l;

                    // evaluation result for this potential move
                    i = i == null ? p : i > p ? i : p;

                    // reset the square for the next iteration
                    u[r] = 0;
                }

                // update the best move based on the evaluation result
                if (s == null || s < i) {

                    s = i; // evaluation result
                    o = e; // best move index
                }

                // reset the square for the next iteration
                g[e] = 0;
            }
        }

        // place the computer's symbol in the best move square
        g[o] = 1;
        addSymbol(v, o); // add the symbol to the square
        
        checkWin();
    }

    // allow the player to make a move by clicking on a square
    function playerMove(r) {
        n.squares[r].onmousedown = function (e) {
            e.preventDefault();
            findAvailableMove(r);
        };
    }

    // reset the game state
    function resetGame() {
        if (p) {
            return;
        }
        p = true;
        n.restart.style.display = "none";
        g = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var e = m; e--;) {
            n.squares[e].classList.remove("win");
            n.squares[e].querySelector("div").className = "";
        }
        n.scores.ties.classList.remove("appear");
        n.scores.player1.classList.remove("appear");
        n.scores.player2.classList.remove("appear");
        n.board.classList.remove("win");
        n.board.classList.remove("tie");
        humanTurn = h;
        changeTurn();
    }

    // initialize the game when the DOM content is loaded
    t.addEventListener("DOMContentLoaded", function () {
        n = {
            board: t.querySelector(".board"),
            squares: t.querySelectorAll(".square"),
            restart: t.querySelector(".restart"),
            muteButton: t.querySelector(".mute"),
            mute: t.querySelectorAll(".mute path"),
            privacy: t.querySelector(".privacy"),
            scores: {
                scores: t.querySelector(".scores"),
                swap: t.querySelector(".swap"),
                player1: t.querySelector(".player1 .score"),
                player2: t.querySelector(".player2 .score"),
                ties: t.querySelector(".ties .score"),
                turn1: t.querySelector(".player1"),
                turn2: t.querySelector(".player2"),
                turnTies: t.querySelector(".ties")
            }
        };

        // set up event listeners for player moves
        for (var e = m; e--;) {
            playerMove(e);
        }

        // prevent default actions for touch events
        n.restart.ontouchstart = n.scores.scores.ontouchstart = function (e) {
            e.preventDefault();
        };
        n.scores.scores.ontouchend = n.scores.scores.onclick = function (e) {
            e.preventDefault();
        };

        // set up event listener for game reset
        n.restart.ontouchend = n.restart.onclick = function (e) {
            e.preventDefault();
            resetGame();
        };
        resetGame();
    });
})(window, document);