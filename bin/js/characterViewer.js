
function makeInputTd(input, series) {
    var inputs = input.split(",");
    return inputs.map(function(button) {
        return <img src={`/bin/buttons/${series}/${button}.png`} height='24px' key={inputs.indexOf(button)} />
    });
}

function CharacterInfo(props) {
    var currCharacter = props.character;
    var moves = props.moves;

    var header = currCharacter ? currCharacter.name : "Select a character!";
    
    var moveRows = moves.map(function(move) {
        var moveClass = "moveRow ";

        if (move.ex) {
            moveClass += "exMove";
        }

        return (
            <tr className={moveClass} key={move.id}>
                <td className="moveName">{move.name}</td>
                <td className="moveInput">{makeInputTd(move.input, move.series)}</td>
            </tr>
        )
    });
    
    var moveTable = (
        <table className="moveTable">
            <tbody>
                {moveRows.length > 0 ? moveRows : "No moves found!"}
            </tbody>
        </table>
    );

    return(
        <div id='CharacterInfo' className='CharacterInfo'>
            <h2 className="characterName">{header}</h2>
            {currCharacter ? moveTable : null}
        </div>
    )
}

function CharacterSelect(props) {
    var characters = props.characters;
    return(
        <div id='CharacterSelect' className='CharacterSelect'>
            {characters.map(x => <span charid={x.id} onClick={props.clickFn} key={x.id}>{x.name}</span>)}
        </div>
    )
}

class CharacterViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: props.gameId,
            characters: [],
            moves: [],
            currCharacter: null,
            loading: true,
        };
    }

    componentDidMount() {
        var dataPromises = [];
        dataPromises.push(getCharactersFromGame(this.state.gameId));

        var thisObj = this;
        Promise.all(dataPromises).then(function(dataArrays) {
            var currState = thisObj.state;
            currState.characters = dataArrays[0]["data"];
            currState.loading = false;
            thisObj.setState(currState);        
        });
    }

    characterClickFn(evt) {
        var charId = evt.target.getAttribute("charid");

        var thisObj = this;
        getMovesForChar(charId).then(function(data) {
            var movelist = data["data"];
            thisObj.state.currCharacter = thisObj.state.characters.find(x => x.id == charId);
            thisObj.state.moves = movelist ? movelist : [];
            thisObj.setState(thisObj.state);
        });
    }

    renderCharacterSelect(characterClickFn) {
        return (
            <CharacterSelect
                characters={this.state.characters}
                clickFn={characterClickFn}
            />
        )
    }

    render() {
        var viewer = (
            <div id='CharacterViewer' className='CharacterViewer'>
                {this.renderCharacterSelect(e => this.characterClickFn(e))}
                <CharacterInfo character={this.state.currCharacter} moves={this.state.moves} />
            </div>
        )
        return this.state.loading ? "Loading..." : viewer;
    }
}


ReactDOM.render(<CharacterViewer gameId={gameId} />, document.getElementById("root"));