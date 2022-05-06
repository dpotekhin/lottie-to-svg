module.exports = {
	
	processArray: async function( array, action ) {
		let i=0;
		for (const item of array) {
			await action(item,i);
			i++;
		}
		// console.log('Done!');
	},

}