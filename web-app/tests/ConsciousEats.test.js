import ConsciousEats from "../common/ConsciousEats.js";
import R from "../common/ramda.js";

const player1 = ConsciousEats.player1;
const player2 = ConsciousEats.player2;
const path = ConsciousEats.emptyPath;


describe("Before Play", function () {

    it(`Given that neither player has started;
        Their scores must be the same;
        and the length of their arrays must be;
        the same;`,
    function () {
        const sustainabilityEqual = R.equals(player1.sustainabilityScore,
                                            player2.sustainabilityScore);
        const eDEqual = R.equals(player1.environmentalDamagesScore,
                                            player2.environmentalDamagesScore);
        const hHEqual = R.equals(player1.humanHealthDamagesScore,
                                            player2.humanHealthDamagesScore);
        const rSEqual = R.equals(player1.resourceScarcityScore,
                                player2.resourceScarcityScore);
        //the following fail and return the specific property that failed
        if (!sustainabilityEqual) {
            throw new Error (
                `Sustainability scores are not equal.
                player1: ${player1.sustainabilityScore},
                player2: ${player2.sustainabilityScore}`
            );
        }
        if (!eDEqual) {
            throw new Error (
                `Environmental Damages scores are not equal.
                player1: ${player1.environmentalDamagesScore},
                player2: ${player2.environmentalDamagesScore}`
            );
        }
        if (!hHEqual) {
            throw new Error (
                `Human Health Damages scores are not equal.
                player1: ${player1.humanHealthDamagesScore},
                player2: ${player2.humanHealthDamagesScore}`
            );
        }
        if (!rSEqual) {
            throw new Error (
                `Resource scarcity scores are not equal.
                player1: ${player1.resourceScarcityScore},
                player2: ${player2.resourceScarcityScore}`
            );
        }
    });

    it (`Given that neither player has started;
        the length of their "tags" and "badges";
        arrays should be equal and the value should;
        be an empty array.`,
    function () {
        const tEquals = R.equals(player1.tags, player2.tags);
        const bEquals = R.equals(player1.badges, player2.badges);
        //checks if the tags and badges are dissimilar in any way
        if (!tEquals && !bEquals) {
            throw new Error (
                "The tags or badges are not equal in length or value"
            );
        }
        //checks if the tags are empty arrays
        if (!R.equals(player1.tags, []) && !R.equals(player2.tags, [])) {
            throw new Error (
                "The tags for player 1 or player2 are not empty arrays"
            );
        }
        //checks if the badges are empty arrays
        if (!R.equals(player1.badges, []) && !R.equals(player2.badges, [])) {
            throw new Error (
                "The badges for player 1 or player2 are not empty arrays"
            );
        }
    });

    it (`Given that no moves have been made;
        and the game has not started, the path;
        should contain only single empty arrays and;
        no tokens.`,
    function () {
        path.forEach(function (array, index) {
            //if any array is not equal to an empty array, then an error should
            //be thrown
            if (!R.equals(array, [])) {
                throw new Error (
                    `The array at index ${index} of emptyPath is not single or
                    empty. It instead reads ${array}`
                );
            }
        });
    });
});

describe ("During Play", function () {

    it (`Given that the game has started but neither player;
        has moved yet, the tokens of the player must be on;
        the first position, that is, position 0.`,
    function () {
        let trialPath = R.clone(path);
        trialPath = ConsciousEats.move_token_on_path(player1, trialPath);
        trialPath = ConsciousEats.move_token_on_path(player2, trialPath);
        //if the first position is anything but the following, error is thrown
        if (!R.equals(trialPath[0], ["p1", "p2"])) {
            throw new Error(
                `First position is ${trialPath[0]} instead of ["p1", "p2"].`
            );
        }
    });

    it (`Given that a move is made during the game, only;
        the player whos token is being moved moves. After;
        every move, there should only be exactly one player1;
        token and one player2 token`,
    function () {
        const initialPath = [[], [], [], ["p1", "p2"], []];
        const trialplayer = {
            "token": "p1",
            "sustainabilityScore": [0, 3, 1]
        };
        const expectedPath = [[], [], [], ["p2"], ["p1"]];
        const returnedPath = ConsciousEats.move_token_on_path(trialplayer,
                                                            initialPath);
        //if the paths don't match, the tokens have not been moved properly
        if (!R.equals(returnedPath, expectedPath)) {
            throw new Error(
                "The player tokens haven't moved correctly."
            );
        }
        //if exactly one p1 and p2 token aren't present at any point of time,
        //then there is something wrong
        if (!R.flatten(returnedPath).length === 2 &&
            !R.flatten(returnedPath).includes("p1") &&
            !R.flatten(returnedPath).includes("p2")) {
                throw new Error(
                    `The returned path does not have exactly one player1 and
                    player2 token.
                    flattened returnedPath: ${R.flatten(returnedPath)}`
                );
            }
    });

    it (`Given that a player makes a move and their score;
        goes below zero, their position should still be;
        displayed as zero.`,
    function () {
        const initialPath = [["p1"], [], [], ["p2"], []];
        const trialPlayer = {
            "token": "p1",
            "sustainabilityScore": [0, -1]
        };
        //if p1 is not at index 0, then the function has not worked properly
        const expectedPath = [["p1"], [], [], ["p2"], []];
        const returnedPath = ConsciousEats.move_token_on_path(trialPlayer,
                                                            initialPath);
        if (!R.equals(returnedPath, expectedPath)) {
            throw new Error(
                "The player1 token has not moved to the zero position."
            );
        }
    });

    it (`Given that a player has made over 5 moves, it;
        must be determined if the player has eaten;
        sustainably or not.`,
    function () {
        //this player is eating sustainably
        const trialPlayer1 = {
            "token": "p1",
            "sustainabilityScore": [0, 2, 3, 4, 5, -1, 3],
            "environmentalDamagesScore": [0, 7, 6, 5, 4, 8, 6],
            "humanHealthDamagesScore": [0, 8, 6, 4, 4, 3, 2],
            "resourceScarcityScore": [0, 1, 6, 5, 4, 3, 1]
        };
        //this player is not eating sustainably
        const trialPlayer2 = {
            "token": "p2",
            "sustainabilityScore": [0, 2, 3, 4, 5, -1, 3],
            "environmentalDamagesScore": [0, 1, 2, 1, 4, 8, 9],
            "humanHealthDamagesScore": [0, 1, 3, 1, 4, 6, 6],
            "resourceScarcityScore": [0, 1, 6, 5, 4, 3, 1]
        };
        if (!ConsciousEats.eating_sustainably(trialPlayer1) &&
            ConsciousEats.eating_sustainably(trialPlayer2)) {
                throw new Error(
                    `trialPlayer1 should be eating sustainably and
                    trialPlayer2 should not be eating sustainably.`
                );
            }
    });

    it (`Given that the negative to positive powerup;
        is applied, all the negative sustainability scores;
        should become positive. If there are no negative;
        scores, no changes are made.`,
    function () {
        //negative scores should become positive here
        const trialPlayer1 = {
            "sustainabilityScore": [0, 2, -1, 4, 5, -1, 3]
        };
        //no changes should be made here
        const trialPlayer2 = {
            "sustainabilityScore": [0, 2, 3, 4, 5, 1, 3]
        };
        const expectedScore1 = [0, 2, 1, 4, 5, 1, 3];
        const alteredScore1 = ConsciousEats.negative_to_positive_powerup(trialPlayer1).sustainabilityScore;
        const alteredScore2 = ConsciousEats.negative_to_positive_powerup(trialPlayer2).sustainabilityScore;
        if (!R.equals(alteredScore1, expectedScore1) &&
            alteredScore1.includes(-1)) {
            throw new Error(
                `The negative scores haven't been turned positive and so it
                does not match the expected outcome.`
            );
        }
        if (!R.equals(alteredScore2, trialPlayer2.sustainabilityScore)) {
            throw new Error(
                "Non-negative scores were unnecessarily altered."
            );
        }
    });

    it (`Given that the lowest value doubled powerup;
        is used, all the lowest non-zero values must;
        be doubled.`,
    function () {
        const trialPlayer1 = {
            "sustainabilityScore": [0, 2, 3, 2, 5, 2, 3]
        };
        //all the 2s should be doubled
        const expectedScore1 = [0, 4, 3, 4, 5, 4, 3];
        const alteredScore1 = ConsciousEats.lowest_value_doubled_powerup(trialPlayer1).sustainabilityScore;
        if (!R.equals(expectedScore1, alteredScore1)) {
            throw new Error(
                "Not all lowest values were doubled."
            );
        }
    });

    it (`Given that a player has moved ahead of another;
        player, the other player should be given more;
        sustainable options. However, if the players;
        were on the same spot before, then there is;
        no need to give more sustainable options for any;
        player.`,
    function () {
        //this player has overtaken the other player
        const trialPlayer1 = {
            "sustainabilityScore": [0, 2, -1, 4, 5, 4, 6]
        };
        const trialPlayer2 = {
            "sustainabilityScore": [0, 2, 3, 4, 5, 1, 3]
        };

        const overtakenPlayer = ConsciousEats.should_give_more_sustainable_options(trialPlayer1, trialPlayer2);
        if (!R.equals(overtakenPlayer, trialPlayer2)) {
            throw new Error(
                "The wrong player or no player has been returned."
            );
        }
        //here both players were on the same spot before their next move, so
        //false should be returned
        const trialPlayer3 = {
            "sustainabilityScore": [0, 2, -1, 4, 5, 4, 6]
        };
        const trialPlayer4 = {
            "sustainabilityScore": [0, 2, 3, 4, 6, -1, 3]
        };
        if (ConsciousEats.should_give_more_sustainable_options(trialPlayer3,
                                                                trialPlayer4)) {
            throw new Error(
                `False should have been returned but instead
            ${ConsciousEats.should_give_more_sustainable_options(trialPlayer3,
                                                                trialPlayer4)}
            was returned.`
            );
        }
    });

    it (`Given that the player has collected tags while;
        choosing dish options, badges must be given for;
        every 5 tags of the same type collected. Only one;
        badge of the same type can be collected per game.`,
    function () {
        //there are 10 "Locally sourced", 5 "Vegetarian", and less than 5
        //of the others. The returned badges should be one "Locally sourced"
        //and one "Vegetarian"
        const trialPlayer1 = {
            "tags": ["Locally sourced",
                    "Vegan",
                    "Locally sourced",
                    "Locally sourced",
                    "Locally sourced",
                    "Vegan",
                    "Locally sourced",
                    "Vegetarian",
                    "Locally sourced",
                    "Vegetarian",
                    "Vegetarian",
                    "Healthy",
                    "Vegetarian",
                    "Locally sourced",
                    "Vegetarian",
                    "Locally sourced",
                    "Locally sourced",
                    "Locally sourced"],
            "badges": []
        };
        const expectedBadges1 = ["Locally sourced", "Vegetarian"];
        const returnedBadges1 = ConsciousEats.give_badges(trialPlayer1).badges;
        expectedBadges1.forEach(function (badge) {
            //if any other badges were returned, there is an error
            if (!returnedBadges1.includes(badge)) {
                throw new Error(
                    `The returned badges were different from those expected.
                    returnedBadges = ${returnedBadges1}`
                );
            }
        });
        //if more or fewer badges than expected were returned, there is an error
        if (expectedBadges1.length !== returnedBadges1.length) {
            throw new Error(
                `The returned badges had more or fewer badges than expected.
                returnedBadges = ${returnedBadges1}`
            );
        }
    });
});

describe ("After Play", function () {

    it (`Given that one player finishes with a score above;
        60, the position on the path should be last position;
        available, that is, the 60th position.`,
    function () {
        //total score is 68, which should land on position 60
        const trialPlayer1 = {
            "token": "p1",
            "sustainabilityScore": [0, 8, 20, 40]
        };
        const newPath = ConsciousEats.move_token_on_path(trialPlayer1, path);
        if (!R.equals(newPath[60], ["p1"])) {
            throw new Error(
                `Player has not been taken to the 60th position.
                Content of 60th position = ${path[60]}`
            );
        }
    });
});

//NOTE: in this test file, the movement of the player was focused on and the
//winning conditions were ignored as they were less complex