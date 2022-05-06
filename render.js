const lottie = require("lottie-web");

module.exports = (document, animationData, opts, startFrame, endFrame ) => 

	new Promise((resolve, reject) => {

		const frames = [];

		try {

			const container = document.createElement("div");
			document.body.append(container);

			let currentFrame = startFrame;
			let totalFrames;
			let interval;

			const instance = lottie.loadAnimation({
				container: container,
				renderer: "svg",
				loop: false,
				autoplay: false,
				animationData,
				rendererSettings: opts
			});

			instance.addEventListener("DOMLoaded", () => {

				totalFrames = instance.getDuration(true);
				console.log('Total frames: ', totalFrames );

				interval = setInterval( renderFrame, 10 );
				// resolve(container.innerHTML);

			});

			// instance.addEventListener('onEnterFrame', (e) => console.log('onEnterFrame', e ) );

			const renderFrame = () => {

				console.log('render frame: '+currentFrame);
				instance.goToAndStop(currentFrame, true);
				frames.push({
					frame: currentFrame,
					data: container.innerHTML
				});
				// instance.updateTextDocumentData();
				
				if( (endFrame === true && currentFrame < totalFrames-1 ) || ( endFrame && currentFrame < endFrame) ){
					currentFrame++;
					return;
				}

				// console.log('complete');

				clearInterval( interval );
				resolve(frames);

			}

		} catch (err) {
			reject(err);
		}

	});

