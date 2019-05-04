class CharacterMoveAddForm extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            games: [],
            characters: [],
            moves: [],
            selectedGame: null,
            submitFn: props.submitFn,
        }
    }

    componentDidMount() {
        var dataPromises = [];
        dataPromises.push(makeAjaxGet("/get_game_list", {}));

        var thisObj = this;
        Promise.all(dataPromises).then(function(dataArrays) {
            var currState = thisObj.state;
            currState.games = dataArrays[0]["data"];

            currState.loading = false;
            currState.selectedGame = currState.games[0].id;
            thisObj.setState(currState);
            thisObj.fetchCharactersAndMoves(currState.selectedGame);
        });
    }

    updateSelectedGame(evt) {
        var gameId = getValOfSelect(evt.target.getAttribute("id"));
        this.fetchCharactersAndMoves(gameId);
    }

    fetchCharactersAndMoves(gameId) {
        var dataPromises = [];
        dataPromises.push(makeAjaxGet(`/get_characters_from_game?game_id=${gameId}`))
        dataPromises.push(makeAjaxGet(`/get_movelist_from_game?game_id=${gameId}`))

        var thisObj = this;
        Promise.all(dataPromises).then(function(dataArrays) {
            var characterList = dataArrays[0]["data"];
            var movelist = dataArrays[1]["data"];

            var currState = thisObj.state;
            currState.selectedGame = gameId;
            currState.characters = characterList;
            currState.moves = movelist;
            thisObj.setState(currState);
        })
    }

    render() {
        const loading = this.state.loading;
        var gameSelect = <Dropdown data={this.state.games} name="gameSelect" selectFn={e => this.updateSelectedGame(e)} />;
        var characterSelect = (
            this.state.characters.length == 0 ?
            null :
            <Dropdown data={this.state.characters} name="characterSelect" />
        )
        var moveSelect = (
            this.state.moves.length == 0 ?
            null :
            <Dropdown data={this.state.moves} name="moveSelect" />
        )

        var inputHolder = (
            <div className="inputHolder">
                {gameSelect}
                {characterSelect}
                {moveSelect}
                <SubmitButton submitFn={this.state.submitFn} />
            </div>
        );
    
        return (
            <div>
                {loading ? "Loading..." : inputHolder}
            </div>
        );
    }
}
