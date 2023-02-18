function CssPlugin (owndir) {

	// as designed, this runs server-side, but there's not reason it COULDN'T just run right in the client
	// this is what I mean when I think about the fsAccess routes obviating the custom handlers almost entirely 
	owndir.css = async function () {
		const cssText = [];
		try {
			const cssFiles = (await this.directory.walk('.owndir').children())
													.filter(child => child.name.toLowerCase().endsWith(".css"));
			for (const fsNode of cssFiles) {
				// not sure how I feel about all the try/catch that's flying around right now ...
				// but, we can give it a whirl - might not be too bad ...
				try { cssText.push(await fsNode.text()) }
				catch (e) {}
			}
		} 
		catch (e) {}

		const parentCss = await this.O.parent?.module?.css() 
		if (parentCss) {
			cssText.unshift(parentCss)
		}

		return cssText.join('\n\n')
	}

	owndir.O.routes.push(['/style.css', ['get', 
		async function (req, res, next) {
			const css = await this.css();
			res.type("text/css");
			res.send(css);
			res.end();
		}
	]]);
}
CssPlugin.propagate = true;

module.exports = CssPlugin;

async function cssText (file) {
	return `/* ${file.path} */\n${ (await file.text()).toString() }`
}