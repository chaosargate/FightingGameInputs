
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
        dataPromises.push(getGamesList());

        var thisObj = this;
        Promise.all(dataPromises).then(function(dataArrays) {
            var currState = thisObj.state;
            currState.games = dataArrays[0]["data"];
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
