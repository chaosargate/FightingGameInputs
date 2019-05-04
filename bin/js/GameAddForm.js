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
        dataPromises.push(getPlatformList());
        dataPromises.push(getSeriesList());

        var thisObj = this;
        Promise.all(dataPromises).then(function(dataArrays) {
            var currState = thisObj.state;
            currState.platforms = dataArrays[0]["data"];
            currState.series = dataArrays[1]["data"];
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
