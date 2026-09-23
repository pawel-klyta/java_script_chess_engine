const makeCpuMove = (color) => {
    (async () => {
    console.log("Start der IIFE...");

    // Die Pause (10 Sekunden) verpackt in ein Promise
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('Oh mann was ein placeholder' + color);

    })();
};

module.exports = { makeCpuMove };