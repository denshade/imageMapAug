const toggleAttribute = "toggled";
var imageId = null;
var mapId = null;
var codeAttribute = "code";
//@param codeAttribute Attribute to find the element by. It looks for codeAttribute on the area and toggles those with id in ids.
var updateFunction;
/**
 *
 * @param ids array of ids to toggle.
 * @param mapId Name of the map.
 */
function populateAreas(ids, mapId)
{
    var map = document.getElementById(mapId);
    if (map == null)
    {
        throw "Found no map elements with id " + mapId;
    }
    if (ids.constructor !== Array) {
        throw "ids isn't an array " + ids;
    }
    var childNodes = Array.from(map.childNodes);
    childNodes.forEach(function (child){
        if (child.nodeType != Node.TEXT_NODE)
        {
            if(contains.call(ids, child.getAttribute(codeAttribute))) {
                child.setAttribute(toggleAttribute, "1");
            } else
            {
                child.setAttribute(toggleAttribute, "0");
            }
        }
    });
}

function getDictionary()
{
    var dictionary = {};
    var map = document.getElementById(mapId);
    if (map == null)
    {
        throw "Found no map elements with id " + mapId;
    }
    var childNodes = Array.from(map.childNodes);
    childNodes.forEach(function (child) {
        if (child.nodeType != Node.TEXT_NODE) {
            var codeAttribute = child.getAttribute(codeAttribute);
            if (!child.hasAttribute(toggleAttribute) || child.getAttribute(toggleAttribute) == "0") {
                dictionary[codeAttribute] = 0;
            } else
            {
                dictionary[codeAttribute] = 1;
            }
        }
    });
    return dictionary;
}

function register(imageIdL, mapIdL)
{
    imageId = imageIdL;
    mapId = mapIdL;
}

/**
 *
 * @param imageId
 * @param mapId
 */
function renderMap(imageId, mapId)
{
    register(imageId, mapId);
    var image = document.getElementById(imageId);
    if (image == null) throw "Image with id " + imageId + " not found.";
    var canvas = document.getElementById("canvas");
    if (canvas == null)
    {
        canvas = document.createElement("canvas");
        canvas.id = "canvas";
        canvas.style.position = "absolute";
        canvas.style.left = image.offsetLeft + "px";
        canvas.style.top = image.offsetTop + "px";
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.zIndex = 2000;
    }
    canvas.onclick = clickOnImage;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var map = document.getElementById(mapId);
    if (map == null)
    {
        throw "Found no map elements with id " + mapId;
    }
    var childNodes = Array.from(map.childNodes);
    childNodes.forEach(function (child){
        if (child.nodeType != Node.TEXT_NODE) {
            if (child.getAttribute(toggleAttribute) == "1")
            {
                draw(ctx, child.getAttribute("coords").split(","));
            }
        }});

}

function getFillColor() {
    return "rgba(255, 255, 255, 0.2)";
}

function toggle(area)
{
    var newValue = "1";
    if (area.hasAttribute(toggleAttribute))
    {
        var val = area.getAttribute(toggleAttribute);
        if (val== "1") newValue = "0";
    }
    area.setAttribute(toggleAttribute, newValue);
    console.info("Toggled " + area + " to " + newValue);
    renderMap(imageId, mapId);
    if (updateFunction != null)
    {
        updateFunction(getDictionary());
    }
}

/**
 *
 */
function registerUpdateFunction(updateFunctionL)
{
    updateFunction = updateFunctionL;
}

function clickOnImage(event)
{
    // find the element at x,y
    // toggle it.
    var canvas = document.getElementById("canvas");
    //temporarily hide the element.
    canvas.style.display = 'none';
    //get the element below
    var area = document.elementFromPoint(event.x, event.y);
    toggle(area, "toggled");
    //bring it back
    canvas.style.display = 'block';

}


/**
 * Draw the image according to the coordinates.
 * @param ctx Canvas drawing context.
 * @param coords Coords as from imageMap.
 */
function draw(ctx, coords)
{
    ctx.fillStyle = getFillColor();
    function drawPoly(ctx, coords) {
        ctx.beginPath();
        ctx.moveTo(coords[0], coords[1]);

        for (var index = 2; index < coords.length; index+= 2)
        {
            ctx.lineTo(coords[index],coords[index + 1]);
        }
        ctx.closePath();
        ctx.fill();
    }

    /**
     *
     * @param ctx
     * @param coords x, y, radius
     */
    function drawCircle(ctx, coords) {
        ctx.beginPath();
        ctx.arc(coords[0], coords[1], coords[2], 0,  2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    /**
     *
     * @param ctx Context
     * @param coords int[]
     */
    function drawRectangle(ctx, coords) {
        ctx.fillRect(coords[0], coords[1], coords[2], coords[3]);
    }

    if (coords.length == 4)
    {
        drawRectangle(ctx, coords);
    }
    else if (coords.length == 3)
    {
        drawCircle(ctx, coords);
    } else {
        drawPoly(ctx, coords);
    }

}


var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};