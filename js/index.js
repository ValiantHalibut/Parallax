//var s = skrollr.init();

var testApp = {
	scrollIntervalID: null,
	wH: null,
	sY: null,
	animElements: [
		{
			selector: ".spinner",
			el: null,
			start: 0,
			end: 1.5,
			mods: [
				{
					transform: true,
					name: "rotate",
					frames: [
						{
							position: 0,
							value: 0
						},
						{
							position: 1,
							value: 90
						}
					]
				},
				{
					style: true,
					name: "background-color",
					frames: [
						{
							position: 0,
							value: [255,0,0]
						},
						{
							position: .5,
							value: [0,255,0]
						},
						{
							position: 1,
							value: [0,0,255]
						}
					]
				},
				{
					style: true,
					name: "opacity",
					frames: [
						{
							position: 0,
							value: 0
						},
						{
							position: 1,
							value: 1
						}
					]
				}
			]
		},
		{
			selector: ".s-4",
			start: 0,
			end: 1,
			mods: [
				{
					transform: true,
					name: "translate",
					frames: [
						{
							position: 0,
							value: [0,0]
						},
						{
							position: 1,
							value: [50,100]
						}
					]
				}
			]
		}
	],
	init: function(){
		this.setAnimElements();
		this.doParallax(this);
		//this.scrollIntervalID = setInterval(this.doParallax, 10, this);
	},
	end: function(){
		clearInterval(this.scrollIntervalID);
	},
	doParallax: function(context){		
		window.requestAnimationFrame(function(){
			context.doParallax(context);
		});
		context.animateElements();
	},
	animateElements: function(){
		this.wH = window.innerHeight;
		this.sY = window.scrollY || window.pageYOffset;
		var aeNum = this.animElements.length;

		// Loop through all of the elements in animElements
		while(aeNum--){
			var elem = this.animElements[aeNum];
			if(elem.el == null) {
				elem.el = document.querySelectorAll(elem.selector);
			}
			
			var startPoint = elem.start * this.wH;
			var endPoint = elem.end * this.wH;
			var duration = endPoint - startPoint;
			var m = elem.mods.length;
			
			// Loop through all of the modified attributes of an element
			while(m--) {
				var mod = elem.mods[m];
				var lastPosition = 0;
				
				// Loop through the keyframes of each element
				for(var i = 0, l = mod.frames.length; i < l; i++) {
					var result;
					
					// If this keyframe has already passed, skip it...
					if(this.sY >= (mod.frames[i].position * duration) + startPoint) {
						lastPosition = mod.frames[i].position;
						// ... unless it is the final keyframe, in which case ensure that the final positioning is set
						if(i == l-1) {
							result = mod.frames[i].value;
							this.setValues(result, mod, elem.el);
						}
						continue;
					}
					
					var finalValue = mod.frames[i].value;
					var initialValue = mod.frames[(i-1 >= 0 ? i - 1 : 0)].value;
					var startY = (lastPosition * duration) + startPoint;
					var endY = (mod.frames[i].position * duration) + startPoint;
					var percent = (this.sY - startY) / (endY - startY);
					
					result = this.interpolate(initialValue, finalValue, percent);
					
					this.setValues(result, mod, elem.el);
					
					// no need to process any further keyframes for this attribute of this element, so break
					break;
				}
			}
		}
	},
	setAnimElements: function(){
		
	},
	interpolate: function(start, end, percent){
		// This expects start and end to match - either both arrays of the same size or both numbers. Percent is 0 - 1
		// Only interpolates linearly at the moment
		var result;
		if(Array.isArray(start)) {
			var l = start.length;
			result = [];
			while(l--) {
				var resultVal = this.interpolate(start[l], end[l], percent);
				result[l] = resultVal;
			}
		}
		else result = (start + ((end - start) * percent)).toFixed(2);
		return result;
	},
	setValues: function(result, mod, el){
		var eNum = el.length;
		if(mod.style){
			switch(mod.name) {
				case "color":
				case "background-color":
					result = result.map(Math.round);
					result = "rgb(" + result.toString() + ")";
					break;
				default:
					break;
			}
			while(eNum--) el[eNum].style[mod.name] = result;
		} else if (mod.transform) {
			switch(mod.name) {
				case "rotate":
					//result = "rotate(" + result + "deg)";
					result = Matrix.getRotation(result);
					break;
				case "translate":
					result = Matrix.getTranslate(result);
					break;
			}
			while(eNum--) {
				var matrixArray = Matrix.getMatrix(el[eNum]);
				el[eNum].style.transform = Matrix.getCombinedCss(matrixArray, result);
			}
		}
	}
}

document.onload = testApp.init();