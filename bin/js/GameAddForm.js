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
