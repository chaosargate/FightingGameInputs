function SubmitButton(props) {
    return (
        <button onClick={props.submitFn}>Submit</button>
    )
}

function Dropdown(props) {
    var dataArr = props.data;

    return (
        <select id={props.name}>
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

function CharacterAddForm(props) {
    return (
        <div>This adds characters</div>
    );
}

function MoveAddForm(props) {
    return (
        <div>This adds moves</div>
    );
}

function CharacterMoveAddForm(props) {
    return (
        <div>This links characters and moves</div>
    );
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
        var platformSelect = document.getElementById("platformSelect");
        var selectedPlatformIndex = platformSelect.selectedIndex;
        var platformId = platformSelect[selectedPlatformIndex].id;

        var seriesSelect = document.getElementById("seriesSelect");
        var selectedSeriesIndex = seriesSelect.selectedIndex;
        var seriesId = seriesSelect[selectedSeriesIndex].id;

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

    renderCharacterAddForm() {
        return (
            <CharacterAddForm />
        );
    }
    renderMoveAddForm() {
        return (
            <MoveAddForm />
        );
    }
    renderCharacterMoveAddForm() {
        return (
            <CharacterMoveAddForm />
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
            entryForm = this.renderCharacterAddForm();
        } else if (this.state.DataType == "Move") {
            entryForm = this.renderMoveAddForm();
        } else if (this.state.DataType == "Character Move Link") {
            entryForm = this.renderCharacterMoveAddForm();
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