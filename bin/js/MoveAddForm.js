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
        dataPromises.push(getGamesList());

        var thisObj = this;
        Promise.all(dataPromises).then(function(dataArrays) {
            var currState = thisObj.state;
            currState.games = dataArrays[0]["data"];
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
        var gameSelect = <Dropdown data={this.state.games} name="gameSelect" selectFn={e => this.updateSelectedGame(e)} />;

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
