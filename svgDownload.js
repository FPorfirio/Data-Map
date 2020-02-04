
function downloadCanvas(update, shapes, worldBankReq, keys){

    let blobCollection = []

    

    return function(){
		
		keys.forEach(year => {
			let svg = update(shapes, worldBankReq[year])
			let canvas = document.createElement('canvas');
			let svgHeight = parseInt(window.getComputedStyle(svg).getPropertyValue('height'));
			let svgWidth = parseInt(window.getComputedStyle(svg).getPropertyValue('width'));
			console.log(svgHeight,svg.style.width)
			canvas.height = svgHeight;
			canvas.width = svgWidth
		
			function triggerDownload (imgURI) {
				var evt = new MouseEvent('click', {
				view: window,
				bubbles: false,
				cancelable: true
				});
			
				var a = document.createElement('a');
				a.setAttribute('download', 'MY_COOL_IMAGE.jpg');
				a.setAttribute('href', imgURI);
				a.setAttribute('target', '_blank');
			
				a.dispatchEvent(evt);
			}
      
			var ctx = canvas.getContext('2d');
			var data = (new XMLSerializer()).serializeToString(svg);
			var DOMURL = window.URL || window.webkitURL || window;
		
			var img = new Image();
			var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
			var url = DOMURL.createObjectURL(svgBlob);
		
			img.onload = function () {
				ctx.drawImage(img, 0, 0);
				DOMURL.revokeObjectURL(url);
			
				var imgURI = canvas
					.toDataURL('image/jpg')
					.replace('image/jpg', 'image/octet-stream');
				console.log(imgURI)
				blobCollection.push(imgURI)
				console.log(canvas)
				console.log(blobCollection)
				triggerDownload(imgURI);
			};
			img.src = url;
		  });
    }   
}


export default downloadCanvas

