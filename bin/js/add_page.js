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

    render() {
        return (
            <div>
                <DataTypeRadioHolder
                    radioClickFn={(e) => this.dataTypeRadioButtonClickFn(e)}
                ></DataTypeRadioHolder>
                {this.state.DataType}
            </div>
        )
    }
}

ReactDOM.render(<DataForm />, document.getElementById("reactForm"));