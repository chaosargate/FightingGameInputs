function makeAjaxCall(url, inputData, verb) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            type: verb,
            data: inputData,
            dataType: "json",
        }).done(resp => resolve(resp));
    })
}

function makeAjaxGet(url, inputData) {
    return new Promise(function(resolve, reject) {
        resolve(makeAjaxCall(url, inputData, "GET"));
    })
}

function makeAjaxPost(url, inputData) {
    return new Promise(function(resolve, reject) {
        resolve(makeAjaxCall(url, inputData, "POST"));
    })
}

function getValOfSelect(selectId) {
    var select = document.getElementById(selectId);
    var selectedIndex = select.selectedIndex;
    return select[selectedIndex].id;
}