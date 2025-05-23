angularApp.directive("ngAgameFlexAnimations", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/AGAMEFLEX1/view/agameflexAnimations.htm?' + Date.now(),
        scope: {
            assoc: "@",
            text: "@",
            details: "@",
            cid: "@",
            filters: "@",
            panel: "@",
            hidetopper: "@",
            toppertext: "@",
            includeheader: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {

            var scope_isAnimating = false;
            var animationCounter = 0;
            var scope_initLeftPosition = 0;
            var scope_initTopPosition = 0;
            var timeoutInformation = [];
            var scope_AutomaticReload = false;
            var scope_IsReadyToAnimate = false;
            var scope_UserProfiles = [];
            var displayWinnerInSeconds = 8;

            function Initialize() {
                scope.LoadedGame = null;
                timeoutInformation.length = 0;
                scope_UserProfiles.length = 0;
                HideWinner();
                SetAnimationLight();
                DisableAnimationButtons();
                SetGameToLoadAnimationsFor(function () {
                    LoadGameAnimationInitState();
                    EnableAnimationButtons();
                });
            };

            function LoadUserProfilesForGame(gameId) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "getAllUserProfilesForGame",
                        gameid: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage == "true") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            let userProfiles = JSON.parse(data.gameUserProfileList);
                            scope_UserProfiles.length = 0;
                            scope_UserProfiles = userProfiles;
                        }
                    }
                });

            }

            function DisableAnimationButtons() {
                $("#flexAnimationButton-run", element).hide();
                $("#flexAnimationButton-reload", element).hide();
                $("#flexAnimationButton-stop", element).show();
            }
            function EnableAnimationButtons() {
                $("#flexAnimationButton-run", element).show()
                $("#flexAnimationButton-reload", element).show()
                $("#flexAnimationButton-stop", element).hide()
            }

            function SetGameToLoadAnimationsFor(callback) {
                let gameId = a$.gup("gameId");
                $("#gameIdToLoad", element).val(gameId);
                LoadGameInformation(gameId);
                LoadUserProfilesForGame(gameId);
                if (callback != null) {
                    callback();
                }
            }

            function LoadGameInformation(gameId) {
                scope.LoadedGame = null;
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getGameById",
                        gameid: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage == "true") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            let game = JSON.parse(data.gameList);
                            if (game != null) {
                                scope.LoadedGame = game;
                            }
                            return;

                        }
                    }
                });
            }

            function LoadGameAnimationInitState() {
                if (scope.LoadedGame != null) {
                    LoadHeaderInformation()
                    LoadScoreboardInitState();
                    LoadGameboardInitState();
                }
            }

            function LoadHeaderInformation() {
                let gameObject = scope.LoadedGame;
                $(".flex-animation-header", element).empty();
                $(".flex-animation-header", element).append(gameObject.Name);
            }

            function LoadScoreboardInitState() {
                let gameParticipants = [];

                if (scope.LoadedGame != null) {
                    gameParticipants = scope.LoadedGame.GameLeaderboard;
                }

                let scoreboardList = $("<div class=\"flex-animation-scoreboard-list\" />");
                for (let i = 0; i < gameParticipants.length; i++) {
                    let item = gameParticipants[i];
                    let scoreboardItemHolder = $("<div class=\"flex-animation-scoreboard-list-item\" id=\"scoreboardItem_" + item.UserId + "\" />");
                    $(scoreboardItemHolder, element).off("click").on("click", function () {
                        let id = this.id;
                        let idToHandle = id.split("_")[1];
                        HandleScoreboardItemClicked(idToHandle, false);
                    });
                    let playerNameHolder = $("<div class=\"flex-animation-scoreboard-item player-name\" />");
                    let playerName = item.UserId;

                    let playerProfile = scope_UserProfiles.find(u => u.UserId == item.UserId);
                    if (playerProfile != null) {
                        if (playerProfile.AvatarImageFileName != null && playerProfile.AvatarImageFileName != "" &&
                            playerProfile.AvatarImageFileName != "empty_headshot.png") {
                            let playerAvatarUrl = CleanAvatarUrl(playerProfile.AvatarImageFileName);
                            let playerAvatar = $("<img class=\"scoreboard-player-avatar\" src=\"" + playerAvatarUrl + "\" />");
                            playerNameHolder.append(playerAvatar);
                        }
                    }

                    if (item.UserIdSource != null) {
                        playerName = item.UserIdSource.UserFullName;
                    }
                    playerNameHolder.append(playerName);
                    let playerScoreHolder = $("<div class=\"flex-animation-scoreboard-item player-score\" />");
                    let playerScore = item.KpiScoreTotal.toFixed(2);

                    playerScoreHolder.append(playerScore);

                    scoreboardItemHolder.append(playerNameHolder);
                    scoreboardItemHolder.append(playerScoreHolder);

                    scoreboardList.append(scoreboardItemHolder);

                }
                $(".flex-animation-score-board", element).empty();
                $(".flex-animation-score-board", element).append(scoreboardList);

            }
            function LoadGameboardInitState() {
                let gameParticipants = [];
                let themeTagName = "default";
                let isSinglePass = false;

                if (scope.LoadedGame != null) {
                    gameParticipants = scope.LoadedGame.GameParticipants;
                    if (scope.LoadedGame.ThemeIdSource != null) {
                        themeTagName = scope.LoadedGame.ThemeIdSource.ThemeTagName;
                        isSinglePass = (scope.LoadedGame.ThemeIdSource.AnimationName == "dragstrip")
                    }
                }
                $("#endAtFinishLine", element).val(isSinglePass);

                $(".flex-animation-board", element).empty();
                let gameBoardWithPlayerTokens = null;
                switch (themeTagName.toLowerCase()) {
                    case "racecars":
                    case "racecar":
                        gameBoardWithPlayerTokens = BuildRaceCarsGameBoard(scope.LoadedGame, themeTagName);
                        break;
                    // case "wizard":                        
                    //     gameBoardWithPlayerTokens = BuildWizardGameBoard(scope.LoadedGame, themeTagName);
                    //     break;
                    default:
                        gameBoardWithPlayerTokens = BuildDefaultGameBoard(scope.LoadedGame, themeTagName);
                        break;
                }
                $(".flex-animation-board", element).append(gameBoardWithPlayerTokens);

                SetupTokens(gameParticipants);

                scope_IsReadyToAnimate = true;
                SetAnimationLight();

            }
            function BuildDefaultGameBoard(gameObject, themeTagName) {
                let gameboard = $("<div />");
                gameboard.append("[NYI]: Implement default game board creation");

                return gameboard;
            }
            function BuildWizardGameBoard(gameObject, themeTagName) {
                let boardSpaces = Math.abs(gameObject.DaysInGame) || 20;
                let pageBoardHolder = $("#animation-board-holder", element);
                let availableHeight = $(pageBoardHolder, element).innerHeight();
                let availableWidth = $(pageBoardHolder, element).innerWidth();
                let boardBoundariesItem = $(".flex-animation-board-holder", element);
                let gameboard = $("<div class=\"animation-game-board-main\" />");
                let gameParticipants = [];
                gameParticipants = gameObject.GameParticipants;

                let boardBoundariesPosition = $(boardBoundariesItem).offset();

                //build enemy positioning and tokens                
                let enemyTopPosition = (boardBoundariesItem.height() / 2);
                let enemyLeftPosition = (boardBoundariesItem.width() / 2);

                let enemyToken = $("<div class=\"flex-animation-enemy-token " + themeTagName + "\" id=\"enemyToken_en1\" />");
                let enemyAbility = $("<div class=\"flex-animation-enemy-ability\" />");

                enemyToken.append(enemyAbility);


                enemyAbility.css("top", enemyTopPosition);
                enemyAbility.css("left", enemyLeftPosition);

                enemyToken.css("top", enemyTopPosition);
                enemyToken.css("left", enemyLeftPosition);

                //add the enemy
                gameboard.append(enemyToken);

                //build the players
                for (let i = 0; i < gameParticipants.length; i++) {

                    let item = gameParticipants[i];
                    let playerName = item.Name;
                    let topPosition = (i * 60);
                    let leftPosition = 0;

                    let enemyAbilityAnimation = $("<div class=\"flex-animation-ability " + themeTagName + " \" id=\"enemyAbility_" + item.UserId + "\" />");
                    if (i < 2) {
                        enemyAbilityAnimation.addClass("animation-item");
                    }
                    enemyAbilityAnimation.append("&nbsp;" + i);
                    enemyAbilityAnimation.css("top", 0);
                    enemyAbilityAnimation.css("left", 0);

                    enemyAbility.append(enemyAbilityAnimation);

                    let playerStep = $("<div class=\"flex-animation-player-step step1of1\" id=\"playerTokenStep_" + item.UserId + "_1\" />");
                    playerStep.append("&nbsp;");

                    let playerToken = $("<div class=\"flex-animation-player-token " + themeTagName + "\" id=\"playerToken_" + item.UserId + "\" />");
                    playerToken.append("&nbsp;");
                    let playerScoreInfo = gameObject.GameLeaderboard.find(x => x.UserId == item.UserId);
                    let playerScore = 0;
                    let playerRank = 0;
                    if (playerScoreInfo != null) {
                        playerScore = playerScoreInfo.KpiScoreTotal;
                        playerRank = playerScoreInfo.StackRanks || playerScoreInfo.RankKpiScore || 0;
                    }

                    playerToken.attr("playerScoreTotal", playerScore);
                    playerToken.attr("playerRank", playerRank);
                    playerToken.css("top", 0);
                    playerToken.css("left", 0);

                    let userProfile = scope_UserProfiles.find(u => u.UserId == item.UserId);
                    let playerHasAvatar = false;
                    let playerAvatarUrl = "";

                    if (userProfile != null) {
                        if (userProfile.AvatarImageFileName != null && userProfile.AvatarImageFileName != "") {
                            if (userProfile.AvatarImageFileName == "empty_headshot.png") {
                                userProfile.AvatarImageFileName = "/jq/avatars/empty_headshot.png";
                            }
                            playerHasAvatar = true;
                            playerAvatarUrl = CleanAvatarUrl(userProfile.AvatarImageFileName);
                        }
                    }
                    if (playerHasAvatar) {
                        let playerAvatar = $("<img class=\"flex-animation-player-token-avatar\" src=\"" + playerAvatarUrl + "\" id=\"playerAvatar_" + item.UserId + "\" />");
                        playerToken.append(playerAvatar);
                    }

                    playerStep.append(playerToken)

                    gameboard.append(playerStep);
                }

                return gameboard;
            }

            function BuildRaceCarsGameBoard(gameObject, themeTagName) {
                let boardSpaces = Math.abs(gameObject.DaysInGame) || 20;
                let pageBoardHolder = $("#animation-board-holder", element);
                let availableHeight = $(pageBoardHolder, element).innerHeight();
                let availableWidth = $(pageBoardHolder, element).innerWidth();
                let gameboard = $("<div class=\"animation-game-board-main\" />");
                let gameParticipants = [];
                gameParticipants = gameObject.GameParticipants;

                for (let i = 0; i < gameParticipants.length; i++) {
                    let item = gameParticipants[i];

                    let playerRaceLane = $("<div class=\"flex-animation-player-race-lane " + themeTagName + "\" id=\"playerRaceLane_" + item.UserId + "\" />");
                    let playerName = item.Name;
                    let playerRaceLaneNameHolder = $("<div class=\"flex-animation-player-race-lane-name\" />");
                    let playerRaceLaneLapsCounter = $("<div class=\"flex-animation-player-race-lane-user-laps\" id=\"playerRaceLapCounter_" + item.UserId + "\" />");
                    playerRaceLaneNameHolder.append(playerName);
                    playerRaceLaneNameHolder.append(playerRaceLaneLapsCounter);

                    playerRaceLane.append(playerRaceLaneNameHolder);


                    for (let spaceCounter = 1; spaceCounter <= boardSpaces; spaceCounter++) {
                        let playerRaceLaneStep = $("<div class=\"flex-animation-player-race-lane-step step" + spaceCounter + "of" + boardSpaces + "\" id=\"playerTokenStep_" + item.UserId + "_" + spaceCounter + "\" />");
                        playerRaceLaneStep.append("&nbsp;");
                        //playerRaceLaneStep.append(spaceCounter);

                        playerRaceLane.append(playerRaceLaneStep);
                    }

                    let playerToken = $("<div class=\"flex-animation-player-token " + themeTagName + " animation-item\" id=\"playerToken_" + item.UserId + "\" />");
                    //TODO: Determine how many moves the player can go in any particular frame.                    
                    //Need a way to determine what this would be.
                    let playerScoreInfo = gameObject.GameLeaderboard.find(x => x.UserId == item.UserId);
                    let playerScore = 0;
                    let maxMoves = 0;
                    let playerRank = 0;
                    if (playerScoreInfo != null) {
                        playerScore = playerScoreInfo.KpiScoreTotal;
                        maxMoves = playerScore / boardSpaces;
                        playerRank = playerScoreInfo.StackRanks || playerScoreInfo.RankKpiScore || 0;
                    }
                    playerToken.attr("playerScoreTotal", playerScore);
                    playerToken.attr("playerRank", playerRank);
                    playerToken.attr("currentLaps", 0);
                    playerToken.css("top", 0);
                    playerToken.css("left", 0);

                    let userProfile = scope_UserProfiles.find(u => u.UserId == item.UserId);
                    let playerHasAvatar = false;
                    let playerAvatarUrl = "";
                    if (userProfile != null) {
                        if (userProfile.AvatarImageFileName != null && userProfile.AvatarImageFileName != "" &&
                            userProfile.AvatarImageFileName != "empty_headshot.png") {
                            playerHasAvatar = true;
                            playerAvatarUrl = CleanAvatarUrl(userProfile.AvatarImageFileName);
                        }
                    }
                    if (playerHasAvatar) {
                        let playerAvatar = $("<img class=\"flex-animation-player-token-avatar\" src=\"" + playerAvatarUrl + "\" id=\"playerAvatar_" + item.UserId + "\" />");
                        playerToken.append(playerAvatar);
                    }
                    playerRaceLane.append(playerToken);

                    gameboard.append(playerRaceLane);
                }

                return gameboard;
            }
            function SetupTokens(gameParticipants) {
                for (let playerIndex = 0; playerIndex < gameParticipants.length; playerIndex++) {
                    let item = gameParticipants[playerIndex];
                    let playerStartingLocation = $("#playerTokenStep_" + item.UserId + "_1", element);
                    let playerPiece = $("#playerToken_" + item.UserId, element);
                    if (playerPiece != null && playerStartingLocation != null && playerStartingLocation.position() != null) {
                        playerPiece.css("top", playerStartingLocation.position().top);
                        playerPiece.css("left", playerStartingLocation.position().left);
                        if (scope_initLeftPosition == 0) {
                            scope_initLeftPosition = playerStartingLocation.position().left;
                        }
                        if (scope_initTopPosition == 0) {
                            scope_initTopPosition = playerStartingLocation.position().top;
                        }
                    }
                }
            }

            function RunAnimationForGame() {
                if (scope_IsReadyToAnimate == false && scope_isAnimating == false && scope_AutomaticReload == false) {
                    ReloadGame();
                }
                animationCounter = $("#animationCounter", element).val();
                if (animationCounter == null || animationCounter == "") {
                    animationCounter = 0;
                }
                scope_isAnimating = true;
                scope_IsReadyToAnimate = false;
                SetAnimationLight();
                let timeoutId = setTimeout(animateGameBoard, 100);
                timeoutInformation.push(timeoutId);
            }
            function SetAnimationLight() {
                $(".flex-animation-lights-red", element).css("background-color", "lightgray");
                $(".flex-animation-lights-yellow", element).css("background-color", "lightgray");
                $(".flex-animation-lights-green", element).css("background-color", "lightgray");

                if (scope_isAnimating) {
                    $(".flex-animation-lights-green", element).css("background-color", "green");
                }
                else if (scope_IsReadyToAnimate) {
                    $(".flex-animation-lights-yellow", element).css("background-color", "yellow");
                }
                else {
                    $(".flex-animation-lights-red", element).css("background-color", "red");
                }
            }
            function StopAnimationForGame() {
                ClearTimeouts();
                animationCounter = $("#animationCounter", element).val();
                scope_isAnimating = false;
                SetAnimationLight();
                EnableAnimationButtons();
            }
            function DetermineMovementForAnimation(movementValue, animationName) {
                let xMovement = 0;
                let yMovement = 0;
                let zMovement = 0;
                //TODO: Determine which animation names we are going to handle
                //and how they are handled.
                switch (animationName.toLowerCase()) {
                    case "dragstrip":
                    case "straightline":
                        xMovement = movementValue;
                        yMovement = 0;
                        zMovement = 0;
                        break;
                    case "dragstripdown":
                    case "raining":
                    case "vertical":
                        xMovement = 0;
                        yMovement = movementValue;
                        zMovement = 0;
                        break;
                    case "wizard":
                        xMovement = movementValue;
                        yMovement = movementValue;
                        zMovement = 0;
                        break;
                }

                let returnMovementObject = new Object();

                returnMovementObject.X = xMovement;
                returnMovementObject.Y = yMovement;
                returnMovementObject.Z = zMovement;

                return returnMovementObject;
            }
            function DetermineVertialBoundsAnimation(animationName) {
                let returnValue = false;
                switch (animationName.toLowerCase()) {
                    case "dragstrip":
                    case "straightline":
                        returnValue = false;
                        break;
                    case "dragstripdown":
                    case "raining":
                    case "vertical":
                        returnValue = true;
                        break;
                    case "wizard":
                        returnValue = true;
                        break;
                }
                return returnValue;

            }
            function DetermineHorizontalBoundsAnimation(animationName) {
                let returnValue = false;
                switch (animationName.toLowerCase()) {
                    case "dragstrip":
                    case "straightline":
                        returnValue = true;
                        break;
                    case "dragstripdown":
                    case "raining":
                    case "vertical":
                        returnValue = false;
                        break;
                    case "wizard":
                        returnValue = true;
                        break;
                }
                return returnValue;

            }

            function CalculateAnimationBaseMovementValue(animationName, userId, playerToken) {
                let returnValue = parseInt($(playerToken).attr("playerScoreTotal"));

                switch (animationName.toLowerCase()) {
                    case "wizard":
                        let playerToken = $("#playerToken_" + userId, element);
                        let enemyToken = $("#enemyToken_en1", element);
                        let playerPosition = $(playerToken).offset();
                        let enemyPosition = $(enemyToken).offset();
                        let xVal = 0;
                        let yVal = 0;
                        xVal = playerPosition.left - enemyPosition.left;
                        yVal = playerPosition.top - enemyPosition.top;
                        //use rise/run to determine the path of the animation.
                        returnValue = yVal / xVal;
                        break;
                }
                return returnValue;
            }
            let animateGameBoard = function () {
                //TODO: Handle the varioius configurations for the games that will allow to handle the number of FPS, and animations.
                //As frames go up, maxmoves should go down.
                //Need to constrain the animation to finishLine or a continuous running aka "laps" type of game.

                var framesPerSecond = 60;
                var totalSecondsToRun = 15;
                var maxAnimations = (framesPerSecond * totalSecondsToRun);
                //TODO: Determine if the game is a finish line game or if it is a looping game.
                var endAtFinishLine = ($("#endAtFinishLine", element).val() === "true") || false;
                var gameAnimationName = "default";
                var animationHasVerticalBounds = false;
                var animationHasHorizontalBounds = true;

                if (maxAnimations < 60) {
                    maxAnimations = 60;
                }
                $("#maxAminations", element).val(maxAnimations);
                let frameTiming = (1000 / framesPerSecond);
                let isComplete = false;

                if (scope.LoadedGame != null && scope.LoadedGame.ThemeIdSource != null) {
                    gameAnimationName = scope.LoadedGame.ThemeIdSource.AnimationName;
                }
                animationHasVerticalBounds = DetermineVertialBoundsAnimation(gameAnimationName);
                animationHasHorizontalBounds = DetermineHorizontalBoundsAnimation(gameAnimationName);

                if (scope_isAnimating == false || animationCounter > maxAnimations) {
                    ClearTimeouts();
                    scope_isAnimating = false;
                    return CompleteAnimation();
                }
                else {
                    $(".animation-item").each(function () {
                        let itemId = $(this).attr("id");
                        let userId = itemId.split("_")[1]

                        let baseMoveValue = CalculateAnimationBaseMovementValue(gameAnimationName, userId, this);
                        //parseInt($(this).attr("playerScoreTotal"));

                        let stepMoveX = 0;
                        let stepMoveY = 0;
                        let moveValue = 0;
                        moveValue = (baseMoveValue / framesPerSecond);
                        let animationMovement = DetermineMovementForAnimation(moveValue, gameAnimationName);

                        stepMoveX = animationMovement.X;
                        stepMoveY = animationMovement.Y;

                        let curX = $(this).offset().left;
                        let curY = $(this).offset().top;
                        let newX = curX + stepMoveX;
                        let newY = curY + stepMoveY;

                        let holderWidth = $("#animation-board-holder").innerWidth() - 25;
                        //let holderHeight = $("#animation-board-holder").innerHeight() - 25;
                        //TODO: User the holder hight once we get vertical information in there.
                        let holderHeight = $(".flex-animation-board-holder", element).innerHeight() - 25;

                        if (animationHasHorizontalBounds) {
                            if (newX > holderWidth) {
                                if (endAtFinishLine == true) {
                                    $(this).removeClass("animation-item");
                                    isComplete = true;
                                }
                                else {
                                    let currentLaps = parseInt($(this).attr("currentLaps"));
                                    currentLaps++;
                                    $(this).attr("currentLaps", currentLaps);
                                    $("#playerRaceLapCounter_" + userId).html("Laps: " + currentLaps);

                                    newX = scope_initLeftPosition;
                                }
                            }
                        }

                        if (animationHasVerticalBounds) {
                            if (newY > holderHeight) {
                                if (endAtFinishLine == true) {
                                    $(this).removeClass("animation-item");
                                    isComplete = true;
                                }
                                else {
                                    let currentLaps = parseInt($(this).attr("currentLaps"));
                                    currentLaps++;
                                    $(this).attr("currentLaps", currentLaps);
                                    $("#playerRaceLapCounter_" + userId).html("Laps: " + currentLaps);

                                    newY = scope_initLeftPosition;
                                }
                            }
                        }
                        $(this).css("left", newX + "px");
                        $(this).css("top", newY + "px");
                    });

                    if (isComplete == true) {
                        ClearTimeouts();
                        scope_isAnimating = false;
                        return CompleteAnimation();
                    }

                    animationCounter++;
                    $("#animationCounter").val(animationCounter);
                }
                let timeoutId = setTimeout(animateGameBoard, frameTiming);
                timeoutInformation.push(timeoutId);
            }

            function ClearTimeouts() {
                for (let i = 0; i < timeoutInformation.length; i++) {
                    window.clearTimeout(timeoutInformation[i]);
                }
            }
            function CompleteAnimation() {
                SetAnimationLight();
                DisplayWinner();
            }
            function ShowWinner() {
                $("#animation-winner-holder", element).show();
            }
            function HideWinner() {

                $("#animation-winner-holder", element).hide();
            }
            function DisplayWinner() {
                $("#animation-winner-display").empty();
                let game = scope.LoadedGame;
                let isGameInProgress = true;
                let themeTagName = "";
                let winnerInfo = $("<div class=\"winner-information-display-holder\"/>");
                let winnerHeadlineMessage = $("<div class=\"winner-information-headline\" />");
                winnerInfo.append(winnerHeadlineMessage)

                if (game != null) {
                    if (game.ThemeIdSource != null) {
                        themeTagName = game.ThemeIdSource.ThemeTagName;
                    }
                    isGameInProgress = (new Date() <= new Date(game.GameEndDate));
                    let gameLeaders = game.GameLeaderboard.filter(x => x.StackRank == 1);
                    let winnerHeadlineMessageText = "";
                    let hasMultipleWinners = (gameLeaders.length > 1);
                    if (hasMultipleWinners > 1) {
                        if (isGameInProgress == true) {
                            winnerHeadlineMessageText = "<p>The current leaders are...</p>";
                        }
                        else {
                            winnerHeadlineMessageText = "<p>The winners are...</p>";
                        }
                    }
                    else {
                        if (isGameInProgress == true) {
                            winnerHeadlineMessageText = "<p>The current leader is...</p>";
                        }
                        else {
                            winnerHeadlineMessageText = "<p>The winner is...</p>";
                        }
                    }
                    winnerHeadlineMessage.append(winnerHeadlineMessageText);
                    let winnerHolder = $("<div class=\"winners-list-holder\" />");
                    for (let i = 0; i < gameLeaders.length; i++) {
                        let item = gameLeaders[i];

                        let winnerName = item.UserId;

                        let userProfile = scope_UserProfiles.find(u => u.UserId == item.UserId);
                        if (userProfile != null) {
                            let playerAvatarUrl = "";
                            winnerName = userProfile.UserFullName;
                            if (userProfile.AvatarImageFileName != null && userProfile.AvatarImageFileName != "" &&
                                userProfile.AvatarImageFileName != "empty_headshot.png") {
                                playerAvatarUrl = CleanAvatarUrl(userProfile.AvatarImageFileName);
                                let playerAvatar = $("<img class=\"winner-player-avatar\" src=\"" + playerAvatarUrl + "\" />");
                                winnerHolder.append(playerAvatar);
                            }
                        }
                        let winnerNameHolder = $("<div class=\"winner-player-name\"/>");
                        if (hasMultipleWinners > 1) {
                            winnerNameHolder.addClass("winner-player-name-multiple");
                        }

                        winnerNameHolder.append(winnerName);
                        winnerHolder.append(winnerNameHolder);
                    }
                    if (isGameInProgress == false) {
                        winnerInfo.addClass("game-complete");
                    }

                    winnerInfo.append(winnerHolder);
                }

                if (themeTagName != null && themeTagName != "") {
                    $("#animation-winner-holder", element).removeClass();
                    $("#animation-winner-holder", element).addClass(themeTagName);
                }

                $("#animation-winner-display").append(winnerInfo);
                ShowWinner();
                let timeoutId = setTimeout(function () {
                    HideWinner();
                    let reloadTimeoutId = setTimeout(ReloadAndGo, 50);
                    timeoutInformation.push(reloadTimeoutId);
                }, (displayWinnerInSeconds * 1000));
                timeoutInformation.push(timeoutId);
            }

            function ResetGameAnimationControls() {
                animationCounter = 0;
                $("#animationCounter", element).val(0);
                scope_isAnimating = false;
                scope_IsReadyToAnimate = false;
            }
            function ReloadGame() {
                HideWinner();
                ResetGameAnimationControls();
                SetAnimationLight();
                LoadGameboardInitState();
                let highlightedUserId = $("#highlightedUserId", element).val();
                if (highlightedUserId != "") {
                    HandleScoreboardItemClicked(highlightedUserId, true);
                }
            }
            function ReloadAndGo() {
                scope_AutomaticReload = $("#AnimationAutoReload", element).is(":checked");
                if (scope_AutomaticReload == true) {
                    ReloadGame();
                    let timeoutId = setTimeout(function () {
                        $("#flexAnimationButton-run", element).trigger("click");
                    }, 5000);
                    timeoutInformation.push(timeoutId);
                }
                else {
                    $("#flexAnimationButton-stop", element).trigger("click");
                }
            }
            function HandleScoreboardItemClicked(idToHandle, isReload) {
                let currentHighlighted = $("#highlightedUserId", element).val();
                if (currentHighlighted == idToHandle && isReload == false) {
                    idToHandle = "";
                }
                $("#highlightedUserId", element).val(idToHandle);

                $(".flex-animation-player-token", element).each(function () {
                    $(this).removeClass("active");
                    let itemId = $(this).attr("id");

                    if (idToHandle != "" && itemId == "playerToken_" + idToHandle) {
                        $(this).addClass("active");
                    }
                });
                $(".flex-animation-scoreboard-list-item", element).each(function () {
                    $(this).removeClass("active");
                    let itemId = $(this).attr("id");

                    if (idToHandle != "" && itemId == "scoreboardItem_" + idToHandle) {
                        $(this).addClass("active");
                    }
                });
            }
            function ValidateStartingPositions() {
                var isAllStartingPositionsAligned = true;
                var animationBoard = $("#animation-board-holder", element);
                $(".flex-animation-player-token").each(function () {
                    let curXToken = $(this).position().left;
                    let curYToken = $(this).position().top;
                    let curXStartPosition = 0;
                    let curYStartPosition = 0;

                    if (isAllStartingPositionsAligned == true &&
                        curXToken > $(animationBoard).position().left &&
                        curYToken > $(animationBoard).position().top) {
                        let itemId = this.id;
                        let userId = itemId.split("_")[1];
                        let startStep = $("#playerTokenStep_" + userId + "_1", element);
                        if (startStep != null && $(startStep).position() != null) {
                            curXStartPosition = $(startStep).position().left;
                            curYStartPosition = $(startStep).position().top;
                        }

                        isAllStartingPositionsAligned = isAllStartingPositionsAligned && ((curXToken == curXStartPosition) && (curYToken == curYStartPosition));

                    }
                    else {
                        isAllStartingPositionsAligned = false;
                    }
                });
                if (isAllStartingPositionsAligned == false) {
                    ReloadGame();
                }
            }

            function CleanAvatarUrl(urlToClean) {
                let returnUrl = urlToClean;
                returnUrl.replace("../", "");
                returnUrl.replace("./", "");
                if (!returnUrl.startsWith("/")) {
                    returnUrl = "/" + returnUrl;
                }
                returnUrl = a$.debugPrefix() + returnUrl;
                return returnUrl;
            }

            scope.load = function (callback) {
                Initialize();
                $(".flex-game-winner-btn-close", element).off("click").on("click", function () {
                    scope_AutomaticReload = $("#AnimationAutoReload", element).is(":checked");
                    if (scope_AutomaticReload == false) {
                        ClearTimeouts();
                    }
                    ResetGameAnimationControls();
                    HideWinner();
                    EnableAnimationButtons();
                });

                $("#flexAnimationButton-run", element).off("click").on("click", function () {
                    DisableAnimationButtons();
                    RunAnimationForGame();
                });
                $("#flexAnimationButton-stop", element).off("click").on("click", function () {
                    StopAnimationForGame();
                    EnableAnimationButtons();
                });
                $("#flexAnimationButton-reload", element).off("click").on("click", function () {
                    StopAnimationForGame();
                    ReloadGame();
                });
                $("#flexAnimationButton-close", element).off("click").on("click", function () {
                    window.close();
                });
                if (callback != null) {
                    callback();
                }

            };
            scope.load(function () {
                ValidateStartingPositions();
            });
        }
    };
}]);