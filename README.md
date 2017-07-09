# imageMapAug

This simple plain vanilla javascript library allows you to highlight areas on an imagemap with minimum intervention and dependencies.


```   
    function callback(dictionary)
    {
        console.info(dictionary);
    }
    var aug = ImageMapAug("theImageId", "theMapId", callback, "rgba(255, 255, 255, 0.2)");
    aug.populateAreas(["1", "2"]);
    aug.renderMap();
```    

# The constructor 
 The constructor uses an imageId and an imagemap id. You can supply a callback function. The last parameter is the color to highlight stuff with. 
 It will render a canvas over the imagemap.
 When something is clicked the underlying imagemap is used to render a figure with fillColors over the image.
 The imageareas are augmented with a "toggled" attribute.
 
# Selected elements to start with

The populateAreas function allows you to selected elements in the areas to be selected. 
It uses the 'code' as identifying attribute to find the image map area and toggles it. 

# Your callback
Your callback will be called whenever the user changes a selected element. 
You'll receive a dictionary with key, values: « the code of the area » : « value: 0 | 1 » depending on whether the element was selected. 

# Using your own areaMap identifier

I use 'code' as the default identifier on maps but you can the default to your specific needs: 
```   
var aug = ImageMapAug("theImageId", "theMapId", callback, "rgba(255, 255, 255, 0.2)");
aug.codeAttribute = "postalCode";
```   
