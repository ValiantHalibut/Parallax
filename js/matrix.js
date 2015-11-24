var Matrix = {
	getMatrix: function(element) {
		var matrixString = getComputedStyle(element).transform;
		if(matrixString === "none") return [0, 0, 0, 0, 0, 0];
		var startPoint = matrixString.indexOf("(") + 1;
		var endPoint = matrixString.indexOf(")");
		matrixString = matrixString.slice(startPoint, endPoint);
		var matrixArray = matrixString.split(",");
		return matrixArray;
	},
	getRotation: function(rot) {
		var rad = rot * (Math.PI * 2/360);
		var cosRot = Math.cos(rad).toFixed(2);
		var sinRot = Math.sin(rad).toFixed(2);
		return [cosRot, sinRot * - 1, sinRot, cosRot, null, null];
	},
	getTranslate: function(pos) {
		return [null, null, null, null, pos[0], pos[1]];
	},
	getCombinedCss: function(original, target) {
		var output = original;
		for (var i = 0, l = output.length; i < l; i++) {
			output[i] = target[i] == null ? original[i] : target[i];
		}
		var outputString = "matrix(" + output.toString() + ")";
		return outputString;
	}
}