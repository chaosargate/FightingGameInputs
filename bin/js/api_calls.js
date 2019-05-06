function getPlatformList() {
    return new Promise(function(resolve, reject) {
        resolve(
            makeAjaxGet("/api/get_platform_list")
        );
    });
}

function getSeriesList() {
    return new Promise(function(resolve, reject) {
        resolve(
            makeAjaxGet("/api/get_series_list")
        );
    });
}

function getGamesList() {
    return new Promise(function(resolve, reject) {
        resolve(
            makeAjaxGet("/api/get_game_list")
        );
    });
}

function getCharactersFromGame(gameId) {
    return new Promise(function(resolve, reject) {
        resolve(
            makeAjaxGet(`/api/get_characters_from_game`, {game_id: gameId})
        );
    })
}

function getMovesFromGame(gameId) {
    return new Promise(function(resolve, reject) {
        resolve(
            makeAjaxGet(`/api/get_movelist_from_game`, {game_id: gameId})
        );
    })
}

function getMovesForChar(charId) {
    return new Promise(function(resolve, reject) {
        resolve(
            makeAjaxGet(`/api/get_movelist_for_char`, {char_id: charId})
        );
    })
}

function postPlatform(payload) {
    return new Promise(function(resolve, reject) {
        var url = "/api/submit_platform";
        resolve(makeAjaxPost(url, payload));
    });
}

function postSeries(payload) {
    return new Promise(function(resolve, reject) {        
        var url = "/api/submit_series";
        resolve(makeAjaxPost(url, payload));
    });
}

function postGame(payload) {
    return new Promise(function(resolve, reject) {        
        var url = "/api/submit_game";
        resolve(makeAjaxPost(url, payload));
    });
}

function postCharacter(payload) {
    return new Promise(function(resolve, reject) {        
        var url = "/api/submit_character";
        resolve(makeAjaxPost(url, payload));
    });
}

function postMove(payload) {
    return new Promise(function(resolve, reject) {        
        var url = "/api/submit_move";
        resolve(makeAjaxPost(url, payload));
    });
}

function postCharacterMove(payload) {
    return new Promise(function(resolve, reject) {        
        var url = "/api/submit_character_move";
        resolve(makeAjaxPost(url, payload));
    });
}