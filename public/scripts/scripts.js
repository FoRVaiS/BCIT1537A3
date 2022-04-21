"use strict";
(() => {
    let results;
    const checkboxIsChecked = function (ref) {
        return ref.checked;
    };
    const fetchQuery = (endpoint, data) => new Promise((resolve, reject) => {
        jQuery.ajax({
            url: endpoint,
            type: "POST",
            data: data,
            success: resolve,
            error: reject
        });
    });
    const getOutputPanel = function () {
        let panel = document.querySelector('#output-panel');
        if (!panel) {
            panel = document.createElement('pre');
            panel.id = 'output-panel';
            document.querySelector('section[region="Results Area"]').append(panel);
        }
        return panel;
    };
    const updateResult = function (data) {
        results = data;
    };
    const displayResult = function (data) {
        const output = JSON.stringify(data, null, 2);
        getOutputPanel().textContent = output;
    };
    const handleResult = function (data) {
        updateResult(data);
        displayResult(data);
    };
    const findByName = function () {
        const name = document.querySelector('#in-query-name-name').value;
        if (name) {
            fetchQuery('/find/name', { name }).then(handleResult).catch(console.error);
        }
        else {
            console.warn("'Unicorn Name' value can not be empty!");
        }
    };
    const findByWeight = function () {
        const lower = document.querySelector('#in-query-weight-lower').value;
        const upper = document.querySelector('#in-query-weight-higher').value;
        fetchQuery('/find/weight', { lower, upper }).then(handleResult).catch(console.error);
    };
    const findByFood = function () {
        const foods = Array.from((document.querySelectorAll('.query[query-type="foods"] input[type="checkbox"]')))
            .filter(ref => checkboxIsChecked(ref))
            .map(ref => ref.value);
        fetchQuery('/find/food', { foods }).then(handleResult).catch(console.error);
    };
    const filterResults = function () {
        const filters = Array.from((document.querySelectorAll('section[region="Filters"] input[type="checkbox"]')))
            .filter(ref => checkboxIsChecked(ref))
            .map(ref => ref.value);
        const data = [...results];
        const filteredData = data.map((unicorn) => {
            const filteredUnicorn = Object.fromEntries(Object.entries(unicorn).filter(([key]) => filters.includes(key)));
            return filteredUnicorn;
        }).filter(unicorn => Object.keys(unicorn).length);
        displayResult(filteredData);
    };
    const nameSubmitRef = document.querySelector('.query[query-type="name"] > .query__submit');
    const weightSubmitRef = document.querySelector('.query[query-type="weight"] > .query__submit');
    const foodsSubmitRef = document.querySelector('.query[query-type="foods"] > .query__submit');
    const filterSubmitRef = document.querySelector('.filter__submit');
    nameSubmitRef.onclick = findByName;
    weightSubmitRef.onclick = findByWeight;
    foodsSubmitRef.onclick = findByFood;
    filterSubmitRef.onclick = filterResults;
})();
