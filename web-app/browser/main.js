import R from "./common/ramda.js";
import Json_rpc from "./Json_rpc.js";
import ConsciousEats from "./common/ConsciousEats.js";
import MI from "./common/Meal_information.js";

//defining the grid dimensions
const grid_columns = 10;
const grid_rows = 6;

//gamePath will be modified throughout the game
let gamePath = R.clone(ConsciousEats.emptyPath);

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

//players will be modified throughout the game
let player1 = ConsciousEats.player1;
let player2 = ConsciousEats.player2;

//turn indicates how many turns have passed.
//it is also used to determine the current meal to be served
let turn = 1;

//converts the coordinates on the grid to an index that can
//be referenced from the path
const coordinates_to_index = function (column_index, row_index) {
    return 6 * column_index + row_index;
};


const grid = document.getElementById("grid");

//creation of the grid:
const cells = R.range(0, grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = R.range(0, grid_columns).map(function (column_index) {
        const cell = document.createElement("div");
        cell.className = "cell";
        row.append(cell);
        return cell;
    });
    grid.append(row);
    return rows;
});

//the below function translates the data from the path onto the grid
const move_token_of_player = function() {
    cells.forEach(function (row, row_index) {
        row.forEach(function (cell, column_index) {
            //while iterating through each cell, the position is aquired
            //using the function created previously. If the column index
            //is odd, then the token needs to be added on the inverse side.
            //This is because the path is designed that way (please view
            //the path on the webpage for more clarity).
            let position = coordinates_to_index(column_index, row_index);
            if (column_index % 2 !== 0) {
                position = coordinates_to_index(column_index, 5 - row_index);
            }
            const token = gamePath[position];
            cell.classList.remove("p1token");
            cell.classList.remove("p2token");
            cell.classList.remove("p1andp2token");
            //3 token types are used, p1, p2, and one for when p1 and p2
            //are on the same position
            if (token.includes("p1") && token.includes("p2")) {
                cell.classList.add("p1andp2token");
            } else if (token.includes("p1")) {
                cell.classList.add("p1token");
            } else if (token.includes("p2")) {
                cell.classList.add("p2token");
            }
        });
    }
);
};

//the following place the player tokens at the 0th position
gamePath = ConsciousEats.move_token_on_path(player1, gamePath);
gamePath = ConsciousEats.move_token_on_path(player2, gamePath);
move_token_of_player(gamePath);

//the following is the function responsible for the movement of the game.
const game_play = function () {

    const card_grid1 = document.getElementById("card_grid1");
    const card_grid2 = document.getElementById("card_grid2");

    //this translates the turn to a specific meal
    const get_current_meal = function () {
        if (turn % 3 === 0) {
            return "dinner";
        }
        if ((turn + 2) % 3 === 0) {
            return "breakfast";
        }
        return "lunch";
    };

    //this updates the information bar with the current meal information
    document.getElementById("information_bar").textContent = `
    ${get_current_meal().charAt(0).toUpperCase() + get_current_meal().slice(1)}
    time! Both players, choose a dish!`;

    //returns a random dish from an array of dishes from the selected meal
    const get_random_dish = function (array) {
        return array[Math.floor(Math.random()*array.length)];
    };
    //references the meal options and returns an array of 3 random
    //and unique dishes
    const get_dish_options = function (player1, player2, player) {
        const meal = get_current_meal();
        const allOptions = Object.keys(MI[meal]);
        const playerOptions = [];
        while (playerOptions.length < 3) {
            const dish = get_random_dish(allOptions);
            //this checks if more sustainable options must be given to a player
            if (ConsciousEats.should_give_more_sustainable_options(player1,
                                                        player2) === player) {
                if (!(playerOptions.includes(dish)) &&
                    MI[meal][dish].sustainabilityRating > 1) {
                    playerOptions.push(dish);
                }
            }
            //this makes sure that the 3 dishes are different to each other
            if (!(playerOptions.includes(dish))) {
                playerOptions.push(dish);
            }
        }
        return playerOptions;
    };

    //below code generates meal options for player1
    const card_row1 = document.createElement("div");
    card_row1.id = "card_row1";
    //cards are what the dish options are placed on
    const optionArray1 = get_dish_options(player1, player2, player1);
    R.range(0, 3).forEach(function (card_index) {
        const card = document.createElement("div");
        card.className = "card";
        const card_name = document.createElement("div");
        card_name.id = "card_name";
        card_name.textContent = `
        ${MI[get_current_meal()][optionArray1[card_index]].name}`;
        const card_rating = document.createElement("div");
        card_rating.id = "card_rating";
        card_rating.textContent = `
        Sustainability rating:
        ${MI[get_current_meal()]
            [optionArray1[card_index]].sustainabilityRating}`;

            card.onclick = function () {
                if (player1.sustainabilityScore.length <=
                    player2.sustainabilityScore.length) {
                    const player1Choice = optionArray1[card_index];
                    player1 = ConsciousEats.score_updater(get_current_meal(),
                                                        player1Choice,
                                                        player1);
                    document.getElementById("current_sustainability_score1").textContent = ConsciousEats.get_current_position(player1);
                    token_movement(player1);
                }
            };
        card.append(card_name);
        card.append(card_rating);
        card_row1.append(card);
    });

    card_grid1.append(card_row1);


    //below code generates meal options for player2
    const card_row2 = document.createElement("div");
    card_row2.id = "card_row2";
    //cards are what the dish options are placed on
    const optionArray2 = get_dish_options(player1, player2, player2);
    R.range(0, 3).forEach(function (card_index) {
        const card = document.createElement("div");
        card.className = "card";
        const card_name = document.createElement("div");
        card_name.id = "card_name";
        card_name.textContent = `
        ${MI[get_current_meal()][optionArray2[card_index]].name}`;
        const card_rating = document.createElement("div");
        card_rating.id = "card_rating";
        card_rating.textContent = `Sustainability rating:
        ${MI[get_current_meal()]
            [optionArray2[card_index]].sustainabilityRating}`;

            card.onclick = function () {
                if (player2.sustainabilityScore.length <=
                    player1.sustainabilityScore.length) {
                    const player2Choice = optionArray2[card_index];
                    player2 = ConsciousEats.score_updater(get_current_meal(),
                                                        player2Choice,
                                                        player2);
                    document.getElementById("current_sustainability_score2").textContent = ConsciousEats.get_current_position(player2);
                    token_movement(player2);
                }
            };

        card.append(card_name);
        card.append(card_rating);
        card_row2.append(card);
    });
    card_grid2.append(card_row2);
};

//game_play() is called here because it generates the first set of options
game_play();

//this function displays the player's badges
const update_badges = function (player) {
    const number = player.token[1];
    if (document.getElementById(`badge_list${number}`) != null) {
        document.getElementById(`badge_list${number}`).remove();
    }
    const badges = document.getElementById(`badges${number}`);
    const badge_list = document.createElement("div");
    badge_list.id = `badge_list${number}`;
    player.badges.forEach(function (badge) {
        const badge_name = document.createElement("div");
        badge_name.id = "badge_name";
        badge_name.textContent = badge;
        if (!badge_list.textContent.includes(badge)) {
            badge_list.append(badge_name);
        }
        badges.append(badge_list);
    });
};

//this functions gives powerups to players
const update_powerups = function (player) {
    let newPlayer = R.clone(player);
    if (ConsciousEats.eating_sustainably(player) && turn % 5 === 0) {
        const number = player.token[1];
        if (document.getElementById(`powerup_list${number}`) != null) {
            document.getElementById(`powerup_list${number}`).remove();
        }
        const powerups = document.getElementById(`powerups${number}`);
        const powerup_list = document.createElement("div");
        powerup_list.id = `powerup_list${number}`;
        const powerup_name = document.createElement("div");
        powerup_name.id = "powerup_name";
        //issuing first type of powerup
        if (player.sustainabilityScore.includes(-1)) {
            powerup_name.textContent = "Positive scores powerup used! 2 points awarded!";
            if (!powerup_list.textContent.includes("Positive scores powerup used! 2 points awarded!")) {
                powerup_list.append(powerup_name);
            }
            powerups.append(powerup_list);
            newPlayer = R.clone(ConsciousEats.negative_to_positive_powerup(newPlayer));
            document.getElementById(`current_sustainability_score${number}`).textContent = ConsciousEats.get_current_position(newPlayer);
        }
        //issuing second type of powerup
        if (!player.sustainabilityScore.includes(-1)) {
            powerup_name.textContent = "Minimum doubled powerup used!";
            if (!powerup_list.textContent.includes("Minimum doubled powerup used!")) {
                powerup_list.append(powerup_name);
            }
            powerups.append(powerup_list);
            newPlayer = R.clone(ConsciousEats.lowest_value_doubled_powerup(newPlayer));
            document.getElementById(`current_sustainability_score${number}`).textContent = ConsciousEats.get_current_position(newPlayer);
        }
    }
    return newPlayer;
};

//This function is responsible for the movement of tokens on the path
const token_movement = function () {
    if (player1.sustainabilityScore.length === player2.sustainabilityScore.length) {
        if (ConsciousEats.winner(player1, player2)) {
            if (ConsciousEats.winner(player1, player2) === true) {
                document.getElementById("information_bar").textContent = `The game has been tied! Click here to restart the game.`;
            } else if (ConsciousEats.winner(player1, player2).token === "p1") {
                document.getElementById("information_bar").textContent = `${document.getElementById("player1_name").value} has won! Click here to restart the game.`;
            } else if (ConsciousEats.winner(player1, player2).token === "p2") {
                document.getElementById("information_bar").textContent = `${document.getElementById("player2_name").value} has won! Click here to restart the game.`;
            }
            document.getElementById("card_row1").remove();
            document.getElementById("card_row2").remove();

            //the following code resets the game
            document.getElementById("information_bar").onclick = function () {
                gamePath = ConsciousEats.emptyPath;
                player1 = ConsciousEats.player1;
                player2 = ConsciousEats.player2;
                turn = 1;
                gamePath = ConsciousEats.move_token_on_path(player1, gamePath);
                gamePath = ConsciousEats.move_token_on_path(player2, gamePath);
                document.getElementById("current_sustainability_score1").textContent = ConsciousEats.get_current_position(player1);
                document.getElementById("current_sustainability_score2").textContent = ConsciousEats.get_current_position(player2);
                if (document.getElementById("powerup_list1") != null) {
                    document.getElementById("powerup_list1").remove();
                }
                if (document.getElementById("powerup_list2") != null) {
                    document.getElementById("powerup_list2").remove();
                }
                document.getElementById("badge_list1").remove();
                document.getElementById("badge_list2").remove();
                move_token_of_player(gamePath);
                game_play();
            };
        }
        //this code is executed if no winner is seen
        player1 = ConsciousEats.give_badges(player1);
        update_badges(player1);
        player1 = update_powerups(player1);
        gamePath = ConsciousEats.move_token_on_path(player1, gamePath);

        player2 = ConsciousEats.give_badges(player2);
        update_badges(player2);
        player2 = update_powerups(player2);
        gamePath = ConsciousEats.move_token_on_path(player2, gamePath);

        move_token_of_player(gamePath);

        turn += 1;
        //cards are reset so new cards can be generated
        document.getElementById("card_row1").remove();
        document.getElementById("card_row2").remove();
        game_play();
    }
};
