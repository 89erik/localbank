export default name => ({
    get: {
        request: {type: id("GET", "REQUEST", name)},
        success: {type: id("GET", "SUCCESS", name)},
        failure: {type: id("GET", "FAILURE", name)}
    }
});

const id = (verb, name, stage) => `${name}_${stage}_${verb}`;