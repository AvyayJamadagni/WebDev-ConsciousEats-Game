import MI from "./Meal_information.js";
import R from "./ramda.js";
/**
 * ConsciousEats.js is a module to create a game where 2 players develop
 * sustainable eating habits.
 * INSTRUCTIONS:
 * Players choose dishes for each meal and move around the board based on
 * the sustainability rating of the dish they chose. Each dish has tags
 * associated with them, and if they collect 5 tags of the same kind, they
 * earn a badge. If the damages of their selected dishes decrease with every
 * meal, that is, they are eating sustainably, they earn a powerup which is
 * immediately applied. The game ends when one of the players reach the end.
 * The sustainability score is added to the number badges they have, and the
 * winner is then decided.
 * @namespace ConsciousEats
 * @author Avyay Jamadagni
 * @version 2021/22
 */
const ConsciousEats = Object.create(null);

/**
 * The path that the players follow will be present on a board. It will be
 * created using a 2D array, consisting of empty arrays representing 0 to 60.
 * Tokens representing each player will move along the path depending on their
 * sustainability score.
 * @memberof ConsciousEats
 * @typedef {ConsciousEats.token_or_array_index[][]} Path
 */

/**
 * Tokens will be disks that will move along the path on the board based
 * on the players' sustainability scores. For the game module, strings as
 * described below will be used instead.
 * @memberof ConsciousEats
 * @typedef {("p1"|"p2")} token used in the player objects created
 */

/**
 * Tokens will be placed on the path in empty arrays. The index of the array
 * containing the token will indicate the location of each player on the board.
 * @memberof ConsciousEats
 * @typedef {(ConsciousEats.token | array_index)} token_or_array_index
 */

/**
 * An empty path of empty arrays has been created for numbers from 0 to 60.
 * Each column will have 6 positions. This will be formated using HTML.
 * @memberof ConsciousEats
 * @constant
 * @typedef {Array} 61 empty arrays for numbers from 0 to 60.
 * @example ConsciousEats.emptyPath = R.repeat([], 61);
 */

ConsciousEats.emptyPath = R.repeat([], 61);


/**
 * Player 1 will be an object containing various parameters that will be
 * changed throughout the game
 * @memberof ConsciousEats
 * @typedef {Object} ConsciousEats.player1
 * @property {String} player1.token string "p1"
 * @property {Array} player1.sustainabilityScore starts with [0]
 * @property {Array} player1.environmentalDamagesScore starts with [0]
 * @property {Array} player1.humanHealthDamagesScore starts with [0]
 * @property {Array} player1.resourceScarcityScore starts with [0]
 * @property {Array} player1.tags starts with []
 * @property {Array} player1.badges starts []
 * @example ConsciousEats.player1 = {
    "token": "p1",
    "sustainabilityScore": [0],
    "environmentalDamagesScore": [0],
    "humanHealthDamagesScore": [0],
    "resourceScarcityScore": [0],
    "tags": [],
    "badges" : []
};
 */

ConsciousEats.player1 = {
    "token": "p1",
    "sustainabilityScore": [0],
    "environmentalDamagesScore": [0],
    "humanHealthDamagesScore": [0],
    "resourceScarcityScore": [0],
    "tags": [],
    "badges": []
};

/**
 * Player 2 will be an object containing various parameters that will be
 * changed throughout the game
 * @memberof ConsciousEats
 * @typedef {Object} ConsciousEats.player2
 * @property {String} player2.token string "p2"
 * @property {Array} player2.sustainabilityScore starts with [0]
 * @property {Array} player2.environmentalDamagesScore starts with [0]
 * @property {Array} player2.humanHealthDamagesScore starts with [0]
 * @property {Array} player2.resourceScarcityScore starts with [0]
 * @property {Array} player2.tags starts with []
 * @property {Array} player2.badges starts []
 * @example ConsciousEats.player2 = {
    "token": "p2",
    "sustainabilityScore": [0],
    "environmentalDamagesScore": [0],
    "humanHealthDamagesScore": [0],
    "resourceScarcityScore": [0],
    "tags": [],
    "badges" : []
};
 */

ConsciousEats.player2 = {
    "token": "p2",
    "sustainabilityScore": [0],
    "environmentalDamagesScore": [0],
    "humanHealthDamagesScore": [0],
    "resourceScarcityScore": [0],
    "tags": [],
    "badges": []
};

/**
 * The scores of each player must be updated after the choose a dish.
 * This function updates the scores of each player using data from the
 * meal.
 * @memberof ConsciousEats
 * @function
 * @param {ConsciousEats.meal} meal taken from a database of meals objects
 * @param {ConsciousEats.dish} dish taken from meal objects in the database
 * @param {ConsciousEats.player} player player to be updated
 * @returns {ConsciousEats.player} returns the player's scores with updated
 *                                 information
 */

ConsciousEats.score_updater = function (meal, dish, player) {
    const updatedPlayer = R.clone(player);
    updatedPlayer.sustainabilityScore.push(MI[meal][dish].sustainabilityRating);
    updatedPlayer.environmentalDamagesScore.push(
        MI[meal][dish].environmentalDamages
    );
    updatedPlayer.humanHealthDamagesScore.push(
        MI[meal][dish].humanHealthDamages
    );
    updatedPlayer.resourceScarcityScore.push(MI[meal][dish].resourceScarcity);
    updatedPlayer.tags.push(MI[meal][dish].tags);
    updatedPlayer.tags = R.flatten(updatedPlayer.tags);
    return updatedPlayer;
};

//calculates the sum of the player's sustainability scores except the latest one
const get_previous_position = function (player) {
    const previousPosition = R.sum(R.dropLast(1, player.sustainabilityScore));
    return previousPosition;
};

//calculates the sum of the player's sustainability scores
ConsciousEats.get_current_position = function (player) {
    const currentPosition = R.sum(player.sustainabilityScore);
    return currentPosition;
};

/**
 * This function removes the token from its previous position.
 * @function
 * @param {ConsciousEats.player} player player to be moved
 * @param {ConsciousEats.currentPosition} previousPosition sum of player's
 * sustainability scores without the latest score.
 * @param {ConsciousEats.path} path the latest version of the path is used
 * @returns {ConsciousEats.path} returns the updated path without player token
 */

ConsciousEats.remove_token_from_previous_position = function (player, path) {
    const token = player.token;
    const updatedPath = R.clone(path);
    updatedPath.forEach(function (ignore, index) {
        updatedPath[index] = updatedPath[index].filter(function (value) {
            if (value !== token) {
                return value;
            }
        });
    });
    return updatedPath;
};

/**
 * This function adds the token to the current position
 * @function
 * @param {ConsciousEats.player} player player to be moved
 * @param {ConsciousEats.nextPosition} currentPosition sum of player's
 * sustainabilty score including the latest score
 * @param {ConsciousEats.path} path the latest version of the path is used
 * @returns {ConsciousEats.path} returns the updated path with player token
 */

ConsciousEats.add_token_to_current_position = function (
    player,
    currentPosition,
    path
) {
    const token = player.token;
    if (currentPosition > 60) {
        currentPosition = 60;
    } else if (currentPosition < 0) {
        currentPosition = 0;
    }
    const updatedPath = R.update(currentPosition,
    R.append(
        token,
        path[currentPosition]
    ),
    path
    );
    return updatedPath;
};

/**
 * The token must be moved based on the player's sustainability scores. Hence
 * this function transports the player to a new position on the path, and
 * checks if the players are on the same spot, in which case, they will need
 * to interact with each other.
 * @memberof ConsciousEats
 * @function
 * @param {ConsciousEats.player} player player to be moved
 * @param {ConsciousEats.path} path path to be updated
 * @returns {ConsciousEats.path} returns the updated path with new positions
 */
ConsciousEats.move_token_on_path = function (player, path) {
    const currentPosition = ConsciousEats.get_current_position(player);
    let updatedPath = R.clone(path);
    updatedPath = ConsciousEats.remove_token_from_previous_position(
        player,
        updatedPath
    );
    updatedPath = ConsciousEats.add_token_to_current_position(player,
        currentPosition,
        updatedPath
    );
    return updatedPath;
};

//returns if the values are generally decreasing or not
const decrease_in_damages = function (array) {
    let counter = 0;
    array.reduce(function (previousValue, currentValue) {
        let difference = previousValue - currentValue;
        if (difference < 0) {
            counter += 1;
        }
        previousValue = currentValue;
        return previousValue;
    });
    const maxNumberOfIncreases = 0.5 * array.length + 1;
    if (counter >= maxNumberOfIncreases) {
        return false;
    }
    return true;
};


/**
 * As the players move across the path, they must be monitered whether they
 * are actually eating sustainably or not. This can be calculated by measuring
 * change in the damages over turns.
 * @function
 * @param {ConsciousEats.player} player player to check
 * @returns {Boolean} returns true if the player is eating sustainably
 */

ConsciousEats.eating_sustainably = function (player) {
    if (player.sustainabilityScore.length >= 6) {
        return (
            decrease_in_damages(player.environmentalDamagesScore) &&
            decrease_in_damages(player.humanHealthDamagesScore) &&
            decrease_in_damages(player.resourceScarcityScore)
        );
    }
    return false;
};

//converts all negative values into positive values
const negative_to_positive = (element) => Math.abs(element);

/**
 * If a player consistently eats more sustainably, then the player should
 * be rewarded by a power up that enables them to convert all their
 * negative scores to positive ones.
 * @function
 * @param {ConsciousEats.player} player player to receive powerup
 * @returns {ConsciousEats.player} returns the player with changed
 *                                 sustainability scores.
 */
ConsciousEats.negative_to_positive_powerup = function (player) {
    const updatedPlayer = R.clone(player);
    const positiveScores = R.map(
        negative_to_positive,
        updatedPlayer.sustainabilityScore
    );
    updatedPlayer.sustainabilityScore = positiveScores;
    return updatedPlayer;
};

//takes the lowest non-zero values and doubles them
const min_doubled = function (array) {
    const clonedArray = R.tail(array);
    const updatedArray = [];
    clonedArray.forEach(function (element) {
        if (element === Math.min(...clonedArray) && element !== 0) {
            element *= 2;
        }
        updatedArray.push(element);
    });
    updatedArray.splice(0, 0, 0);
    return updatedArray;
};

/**
 * A second possible powerup is for players who do have not eating a dish
 * with a negative sustainability score. This function should take the lowest
 * scoring dish and double it.
 * @function
 * @param {ConsciousEats.player} player player to receive powerup
 * @returns {ConsciousEats.player} returns the updated player score
 */

ConsciousEats.lowest_value_doubled_powerup = function (player) {
    const updatedPlayer = R.clone(player);
    const positiveScores = min_doubled(updatedPlayer.sustainabilityScore);
    updatedPlayer.sustainabilityScore = positiveScores;
    return updatedPlayer;
};

//checks if either player has overtaken the other
const has_player_moved_ahead = function (player1, player2) {
    const player1PrevPosition = get_previous_position(player1);
    const player2PrevPosition = get_previous_position(player2);
    const player1CurrPosition = ConsciousEats.get_current_position(player1);
    const player2CurrPosition = ConsciousEats.get_current_position(player2);
    if (player1PrevPosition < player2PrevPosition &&
        player1CurrPosition > player2CurrPosition) {
        return player2;
    }
    if (player1PrevPosition > player2PrevPosition &&
        player1CurrPosition < player2CurrPosition) {
        return player1;
    }
    return false;
};

/**
 * When the players move, it is possible that one moves ahead of the other,
 * although it was previously behind that other player. In such a case, the
 * other player must be motivated to catch up to the other player, so the
 * suggested dishes must vary. Hence, this function will determine who to give
 * sustainable options to.
 * @function
 * @param {ConsciousEats.player1} player1 the first player to be compared with
 * @param {ConsciousEats.player2} player2 the second player to be compared with
 * @return {(player1|player2)} who sustainable options should be given to
 */

ConsciousEats.should_give_more_sustainable_options = function (player1,
                                                                player2) {
    return (has_player_moved_ahead(player1, player2));
};

//creates an object with the tag and the number of times it appears
const get_numbers_of_tags = function (array) {
    const tagNumber = array.reduce(function (tags, labels) {
        if (tags[labels] === undefined) {
            tags[labels] = 1;
        } else if (tags[labels] !== undefined) {
            tags[labels] += 1;
        }
        return tags;
    }, {});
    return tagNumber;
};

//reduces values to multiples of 5
const five_or_more = (value) => Math.floor(value / 5);

//returns non-zero keys
const non_zero = (key) => key !== 0;

/**
 * As the player continues to choose meals, they collect tags associated
 * with the meals. When the player has 5 tags of the same type, they earn
 * a badge. These badges contribute to their final score when the game ends.
 * The following function appends the badges earned by the player to their
 * badges key.
 * @function
 * @param {ConsciousEats.player} player player to be given badges
 * @return {ConsciousEats.player} an updated player is returned
 */

ConsciousEats.give_badges = function (player) {
    const updatedPlayer = R.clone(player);
    const tagNumbers = get_numbers_of_tags(updatedPlayer.tags);
    const numberOfFives = R.map(five_or_more, tagNumbers);
    const badgeLabels = R.filter(non_zero, numberOfFives);
    Object.keys(badgeLabels).forEach(function (badge) {
        if (!updatedPlayer.badges.includes(badge)) {
            updatedPlayer.badges.push(badge);
        }
    });
    return updatedPlayer;
};

//adds number of badges to player's sustainability score
const get_final_score = function (player) {
    const finalScore = ConsciousEats.get_current_position(player) +
                                                player.badges.length;
    return finalScore;
};

//checks either player has reached the end
const reached_the_end = function (player) {
    if (ConsciousEats.get_current_position(player) >= 60) {
        return true;
    }
    return false;
};

//checks if game has ended
const game_is_ended = function (player1, player2) {
    return (reached_the_end(player1) || reached_the_end(player2)) &&
    (player1.sustainabilityScore.length === player2.sustainabilityScore.length);
};


/**
 * Finally, the winner must be decided based on who reaches the finishing
 * position first and the players' badges. Each badge counts for 3 points,
 * so the score from their badges is added to their sustainability score,
 * and whoever has the highest sustainability score wins!
 * @function
 * @param {ConsciousEats.player1} player1 first player to be checked
 * @param {ConsciousEats.player2} player2 second player to be checked
 * @return {(player1|player2|tie)} who has won or if it was a tie
 */

ConsciousEats.winner = function (player1, player2) {
    if (game_is_ended(player1, player2)) {
        const player1FinalScore = get_final_score(player1);
        const player2FinalScore = get_final_score(player2);
        if (player1FinalScore > player2FinalScore) {
            return player1;
        }
        if (player2FinalScore > player1FinalScore) {
            return player2;
        }
        if (player2FinalScore === player1FinalScore) {
            return true; // indicating a tie
        }
    }
    return false; // indicating no win
};

export default Object.freeze(ConsciousEats);