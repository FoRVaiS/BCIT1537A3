(() => {
    let results: Array<{}>;

    const checkboxIsChecked = function (ref: HTMLInputElement) {
        return ref.checked;
    }

    const fetchQuery = <T = any>(endpoint: string, data: T) => new Promise<Array<object>>((resolve, reject) => {
        jQuery.ajax({
            url: endpoint,
            type: "POST",
            data: (data as any),
            success: resolve,
            error: reject
        });
    });

    const getOutputPanel = function () {
        let panel = document.querySelector('#output-panel');

        if (!panel) {
            panel = document.createElement('pre');
            panel.id = 'output-panel';

            document.querySelector('section[region="Results Area"]')!.append(panel);
        }

        return panel!;
    }
    
    const updateResult = function (data: Array<object>) {
        results = data;
    }

    const displayResult = function (data: Array<object>) {
        const output = JSON.stringify(data, null, 2);

        getOutputPanel().textContent = output;
    }

    const handleResult = function (data: Array<object>) {
        updateResult(data);
        displayResult(data);
    }
    
    const findByName = function () {
        const name = (document.querySelector('#in-query-name-name') as HTMLInputElement)!.value;

        if (name) {
            fetchQuery('/find/name', { name }).then(handleResult).catch(console.error);
        } else {
            console.warn("'Unicorn Name' value can not be empty!");
        }
    };

    const findByWeight = function () {
        const lower = (document.querySelector('#in-query-weight-lower') as HTMLInputElement)!.value;
        const upper = (document.querySelector('#in-query-weight-higher') as HTMLInputElement)!.value;

        fetchQuery('/find/weight', { lower, upper }).then(handleResult).catch(console.error);
    };

    const findByFood = function () {
        const foods = Array.from((document.querySelectorAll<HTMLInputElement>('.query[query-type="foods"] input[type="checkbox"]')))
            .filter(ref => checkboxIsChecked(ref))
            .map(ref => ref.value);

        console.log(foods);

        fetchQuery('/find/food', { foods }).then(handleResult).catch(console.error);
    };

    const filterResults = function () {
        const filters = Array.from((document.querySelectorAll<HTMLInputElement>('section[region="Filters"] input[type="checkbox"]')))
            .filter(ref => checkboxIsChecked(ref))
            .map(ref => ref.value);

        const data = [ ...results ];

        const filteredData = data.map((unicorn: object) => {
            const filteredUnicorn = Object.fromEntries(
                Object.entries(unicorn).filter(([key]) => filters.includes(key))
            );

            return filteredUnicorn;
        }).filter(unicorn => Object.keys(unicorn).length);

        displayResult(filteredData);
    };

    const nameSubmitRef: HTMLInputElement = document.querySelector('.query[query-type="name"] > .query__submit')!;
    const weightSubmitRef: HTMLInputElement = document.querySelector('.query[query-type="weight"] > .query__submit')!;
    const foodsSubmitRef: HTMLInputElement = document.querySelector('.query[query-type="foods"] > .query__submit')!;
    const filterSubmitRef: HTMLInputElement = document.querySelector('.filter__submit')!;

    nameSubmitRef.onclick = findByName;
    weightSubmitRef.onclick = findByWeight;
    foodsSubmitRef.onclick = findByFood;
    filterSubmitRef.onclick = filterResults;
})();
