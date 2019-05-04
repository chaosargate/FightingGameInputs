function SubmitButton(props) {
    return (
        <button onClick={props.submitFn}>Submit</button>
    )
}

function Dropdown(props) {
    var dataArr = props.data;

    return (
        <select id={props.name} onChange={props.selectFn}>
            {dataArr.map(x => <option id={x.id} key={x.id}>{x.name}</option>)}
        </select>
    )
}

function PlatformAddForm(props) {
    return (
        <div className="inputHolder">
            <input id="platformName" placeholder="Platform Name"/>
            <SubmitButton submitFn={props.submitFn} />
        </div>
    );
}

function SeriesAddForm(props) {
    return (
        <div className="inputHolder">
            <input id="seriesName" placeholder="Series Name"/>
            <SubmitButton submitFn={props.submitFn} />
        </div>
    );
}

class GameAddForm extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            platforms: [],
            series: [],
            submitFn: props.submitFn,
        }
    }

    componentDidMount() {
        var dataPromises = [];
        dataPromises.push(makeAjaxGet("/get_platform_list", {}));
        dataPromises.push(makeAjaxGet("/get_series_list", {}));

        var thisObj = this;
        Promise.all(dataPromises).then(function(dataArrays) {
            var currState = thisObj.state;
            currState.platforms = dataArrays[0];
            currState.series = dataArrays[1];
            currState.loading = false;
            thisObj.setState(currState);            
        });
    }

    render() {
        const loading = this.state.loading;
        var platformSelect = <Dropdown data={this.state.platforms} name="platformSelect" />;
        var seriesSelect = <Dropdown data={this.state.series} name="seriesSelect" />;
        var inputHolder = (
            <div className="inputHolder">
                <input id="gameName" placeholder="Game Name"/>
                {platformSelect}
                {seriesSelect}
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

class CharacterAddForm extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            games: [],
            submitFn: props.submitFn,
        }
    }

    componentDidMount() {
        var dataPromises = [];
        dataPromises.push(makeAjaxGet("/get_game_list", {}));

        var thisObj = this;
        Promise.all(dataPromises).then(function(dataArrays) {
            var currState = thisObj.state;
            currState.games = dataArrays[0];
            currState.loading = false;
            thisObj.setState(currState);        
        });
    }

    render() {
        const loading = this.state.loading;
        var gameSelect = <Dropdown data={this.state.games} name="gameSelect" />;
        var inputHolder = (
            <div className="inputHolder">
                <input id="characterName" placeholder="Character Name"/>
                {gameSelect}
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

function InputImg(props) {
    var seriesName = props.seriesName;
    var button = props.button;
    return (
        button == "" ?
        null:
        <img src={`/bin/buttons/${seriesName}/${button}.png`} height="24px" />
    )
}

function MoveInput(props) {
    var inputArr = props.data.split(",");
    var seriesSelect = document.getElementById("seriesSelect");
    var seriesName = props.series;
    return (
        <div className="moveInputHolder">
            <input id="moveName" name="moveName" placeholder="Move Name" />
            <div className="exCheckbox">
                <input name="exCheck" id="exCheck" type="checkbox" />
                <label htmlFor="exCheck">EX?</label>
            </div>
            <input id="moveInput" name="moveInput" value={props.data} onChange={props.updateFn} placeholder="Move Input" />
            <span className="movePreview">{inputArr.map(x => <InputImg seriesName={seriesName} button={x} key={inputArr.indexOf(x)} />)}</span>
        </div>
    )
}

class MoveAddForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            games: [],
            selectedGame: null,
            inputStr: "",
            submitFn: props.submitFn,
        }
    }

    updateMove(evt) {
        var inputStr = evt.target.value;
        this.state.inputStr = inputStr;
        this.setState(this.state);
    }

    updateSelectedGame() {
        var gameId = getValOfSelect("gameSelect");
        var selectedGame = this.state.games.find(x => x.id == gameId);
        this.state.selectedGame = selectedGame;
        this.setState(this.state);
    }

    componentDidMount() {
        var dataPromises = [];
        dataPromises.push(makeAjaxGet("/get_game_list", {}));

        var thisObj = this;
        Promise.all(dataPromises).then(function(dataArrays) {
            var currState = thisObj.state;
            currState.games = dataArrays[0];
            currState.selectedGame = currState.games[0];
            currState.loading = false;
            thisObj.setState(currState);        
        });
    }

    render() {
        const loading = this.state.loading;
        var seriesName = (
            this.state.selectedGame == null ?
            "":
            this.state.selectedGame.series
        );

        var moveInput = <MoveInput data={this.state.inputStr} series={seriesName} updateFn={e => this.updateMove(e)} />
        var gameSelect = <Dropdown data={this.state.games} name="gameSelect" />;

        var inputHolder = (
            <div className="inputHolder">
                {gameSelect}
                {moveInput}
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

        if (this.state.selectedGame != null) {
        }

        var thisObj = this;
        Promise.all(dataPromises).then(function(dataArrays) {
            var currState = thisObj.state;
            currState.games = dataArrays[0];

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
            var characterList = dataArrays[0];
            var movelist = dataArrays[1];

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

function DataTypeRadioButton(props) {

    var id = props.id;
    var labelName = props.labelName;
    var dataTypeRadioButtonClickFn = props.dataTypeRadioButtonClickFn;

    return (
        <div className="DataTypeRadioButton">
            <input
                id={id}
                type="radio"
                name="DataTypeRadio"
                value={labelName}
                onClick={dataTypeRadioButtonClickFn}
            />
            <label
                htmlFor={id}
            >
                {labelName}
            </label>
        </div>
    )
}

function DataTypeRadioHolder(props) {
    var dataTypeRadioClickFn = props.radioClickFn;
    return (
        <div id="DataTypeRadioHolder">
            <DataTypeRadioButton
                id="PlatformRadio"
                labelName="Platform"
                dataTypeRadioButtonClickFn={dataTypeRadioClickFn}
            />
            <DataTypeRadioButton
                id="SeriesRadio"
                labelName="Series"
                dataTypeRadioButtonClickFn={dataTypeRadioClickFn}
            />
            <DataTypeRadioButton
                id="GameRadio"
                labelName="Game"
                dataTypeRadioButtonClickFn={dataTypeRadioClickFn}
            />
            <DataTypeRadioButton
                id="CharacterRadio"
                labelName="Character"
                dataTypeRadioButtonClickFn={dataTypeRadioClickFn}
            />
            <DataTypeRadioButton
                id="MoveRadio"
                labelName="Move"
                dataTypeRadioButtonClickFn={dataTypeRadioClickFn}
            />
            <DataTypeRadioButton
                id="CharacterMoveRadio"
                labelName="Character Move Link"
                dataTypeRadioButtonClickFn={dataTypeRadioClickFn}
            />
        </div>
    )
}

class DataForm extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            DataType: false,
        }
    }

    dataTypeRadioButtonClickFn(evt) {
        var currState = this.state;
        currState.DataType = evt.target.value;
        this.setState(currState);
    }

    submitPlatform(evt) {
        var platformName = document.getElementById("platformName").value;

        if (platformName == "") {
            return;
        }

        var inputData = {
            platform_name: platformName
        };

        var url = "/submit_platform";

        makeAjaxPost(url, inputData).then(function(data) {
            var success = data["success"];
            var msg = success ? "Platform successfully added!" : "Failed to add platform!";
            alert(msg);
        });
    }

    submitSeries(evt) {
        var seriesName = document.getElementById("seriesName").value;

        if (seriesName == "") {
            return;
        }

        var inputData = {
            series_name: seriesName
        };

        var url = "/submit_series";

        makeAjaxPost(url, inputData).then(function(data) {
            var success = data["success"];
            var msg = success ? "Series successfully added!" : "Failed to add series!";
            alert(msg);
        });
    }

    submitGame(evt) {
        var gameName = document.getElementById("gameName").value;
        var platformId = getValOfSelect("platformSelect");
        var seriesId = getValOfSelect("seriesSelect");

        var inputData = {
            game_name: gameName,
            platform_id: platformId,
            series_id: seriesId
        };
        
        var url = "/submit_game";

        makeAjaxPost(url, inputData).then(function(data) {
            var success = data["success"];
            var msg = success ? "Game successfully added!" : "Failed to add game!";
            alert(msg);
        });

    }

    submitCharacter(evt) {
        var characterName = document.getElementById("characterName").value;
        var gameId = getValOfSelect("gameSelect");

        var inputData = {
            character_name: characterName,
            game_id: gameId
        };
        
        var url = "/submit_character";

        makeAjaxPost(url, inputData).then(function(data) {
            var success = data["success"];
            var msg = success ? "Character successfully added!" : "Failed to add character!";
            alert(msg);
        });
    }

    submitMove(evt) {
        var moveName = document.getElementById("moveName").value;
        var input = document.getElementById("moveInput").value;
        var ex = document.getElementById("exCheck").value == "on";
        var gameId = getValOfSelect("gameSelect");

        var inputData = {
            move_name: moveName,
            input: input,
            ex: ex,
            game_id: gameId,
        }

        var url="/submit_move";

        makeAjaxPost(url, inputData).then(function(data) {
            var success = data["success"];
            var msg = success ? "Move successfully added!" : "Failed to add move!";
            alert(msg);
        });
    }

    submitCharacterMove(evt) {
        var characterId = getValOfSelect("characterSelect");
        var moveId = getValOfSelect("moveSelect");

        var inputData = {
            character_id: characterId,
            move_id: moveId,
        }

        var url = "/submit_character_move";
        
        makeAjaxPost(url, inputData).then(function(data) {
            var success = data["success"];
            var msg = success ? "Move successfully added to character!" : "Failed to add move!";
            alert(msg);
        })
    }

    renderPlatformAddForm(submitFn) {
        return (
            <PlatformAddForm submitFn={submitFn} />
        );
    }

    renderSeriesAddForm(submitFn) {
        return (
            <SeriesAddForm submitFn={submitFn} />
        );
    }

    renderGameAddForm(submitFn) {
        return (
            <GameAddForm submitFn={submitFn}/>
        );
    }

    renderCharacterAddForm(submitFn) {
        return (
            <CharacterAddForm submitFn={submitFn} />
        );
    }
    renderMoveAddForm(submitFn) {
        return (
            <MoveAddForm submitFn={submitFn} />
        );
    }
    renderCharacterMoveAddForm(submitFn) {
        return (
            <CharacterMoveAddForm submitFn={submitFn} />
        );
    }

    render() {

        var entryForm = null;
        if (this.state.DataType == "Platform") {
            entryForm = this.renderPlatformAddForm((e) => this.submitPlatform(e));
        } else if (this.state.DataType == "Series") {
            entryForm = this.renderSeriesAddForm(e => this.submitSeries(e));
        } else if (this.state.DataType == "Game") {
            entryForm = this.renderGameAddForm(e => this.submitGame(e));
        } else if (this.state.DataType == "Character") {
            entryForm = this.renderCharacterAddForm(e => this.submitCharacter(e));
        } else if (this.state.DataType == "Move") {
            entryForm = this.renderMoveAddForm(e => this.submitMove(e));
        } else if (this.state.DataType == "Character Move Link") {
            entryForm = this.renderCharacterMoveAddForm(e => this.submitCharacterMove(e));
        }

        return (
            <div className="addForm">
                <DataTypeRadioHolder
                    radioClickFn={(e) => this.dataTypeRadioButtonClickFn(e)}
                ></DataTypeRadioHolder>
                {entryForm}
            </div>
        )
    }
}

ReactDOM.render(<DataForm />, document.getElementById("reactForm"));