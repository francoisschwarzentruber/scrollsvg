function getScrollTime() {    return document.body.scrollTop + window.innerHeight / 2}
const updateFunctions = []; //functions to be executed for updating the scroll SVG
const update = () => { for (const f of updateFunctions) f(); };
let slows = [];
let t; // global variables (because of scripts in SVG file). It is the time in [0, 1] in bar in the timeline

/**
 * 
 * @param {*} el 
 * @returns the rectangle around the el in the absolute coordinates
 */
function getRect(el) {
    const r = el.getBoundingClientRect();
    const dy = document.body.scrollTop;
    return { top: r.top + dy, bottom: r.bottom + dy };
}

/**
 * extract the slow-down + the update functions from the SVG
 */
function analyzeSVG() {
    for (const el of document.querySelectorAll('*')) {
        if (el.id) {
            if (el.id.startsWith("slow")) {

                /** add a slowdown around el */
                function addSlow(el) {
                    const r = getRect(el);
                    const [y1, y2] = [r.top, r.bottom];
                    const y = (y1 + y2) / 2;
                    const duration = y2 - y1;
                    slows.push([y, y + duration]);
                }
                addSlow(el);
            }
        }
    }

    for (const el of document.querySelectorAll('*')) {
        if (el.onload) {
            updateFunctions.push(() => {
                const r = getRect(el);
                r.top -= window.innerHeight / 2
                r.bottom -= window.innerHeight / 2
                const [t1, t2] = [yToTime(r.top), yToTime(r.bottom)];
                t = (getScrollTime() - t1) / (t2 - t1); // global variables for executing el.onload()
                el.onload();
            }
            )
        }

    }
}

async function load() {
    const currentURL = window.location.search;
    const urlParams = new URLSearchParams(currentURL);
    let svgURL = urlParams.get('file');
    let querySVG = await fetch(svgURL);
    let strSVG = await querySVG.text();
    document.body.innerHTML = strSVG;
    analyzeSVG();
    update();
};
load();




const factorSlow = 0.8;

/**
 * 
 * @param {*} y 
 * @returns the time for the y
 */
function yToTime(y) {
    let time = window.innerHeight / 2;
    for (let [a, b] of slows)
        if (y < a)
            return time + y;
        else if (y > b)
            time += (b - a) * factorSlow;
        else if (y > a)
            return time + y + (y - a) * factorSlow;
    return time + y;
}



document.onscroll = () => {
    /** get the y from the time */
    function getYShift(scrollTime) {
        let yshift = 0;
        for (let [a, b] of slows)
            if (scrollTime < a)
                return yshift;
            else if (scrollTime > b)
                yshift += (b - a) * factorSlow;
            else if (scrollTime > a) {
                yshift += (scrollTime - a) * factorSlow;
                return yshift;
            }
        return yshift;
    }
    const svg = document.getElementsByTagName("svg")[0];
    svg.style.position = "absolute";
    svg.style.top = getYShift(getScrollTime());
    update();
}




/*** FUNCTIONS TO BE USED in a scroll SVG ******************************** */

/**
 * 
 * @param {*} id 
 * @param {*} predicate 
 * @description makes the element of id visible when the predicate is true
 */
function visible(id, predicate = () => 0 <= t && t < 1) {
    document.getElementById(id).style.visibility = predicate() ? "visible" : "hidden";
}

/**
 * 
 * @param {*} f 
 * @returns execute f when t is i [0, 1]
 */
function execute(f) {
    if (t < 0 || t > 1) return;
    f();
}


/************************************************************ */