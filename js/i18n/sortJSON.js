var fs = require('fs');

fs.readdir('./', function(err, files) {

	files.forEach(function(f) {
		var ext = f.split('.')[f.split('.').length - 1];
		
		if (ext === 'json') {
			console.log(f, 'sorting');
			var d = require('./' + f);
			var newD = {};
			Object.keys(d).sort().forEach(function(k) {
				newD[k] = d[k];
			});

			console.log(newD);

			fs.writeFile('./' + f, JSON.stringify(newD, null, 4), function(err) {
				if (err) {
					return err;
				}
				console.log(f, 'sorted');
			});
		}
	});
});
