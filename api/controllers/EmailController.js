module.exports = {
	

	sendEmail: function(req, res) {

		var test = {
			name: 'Jack',
			email: '*********@gmail.com'
		}

		EmailService.sendWelcomeMail(test);  // <= Here we using
       	res.json(200, {test: test});
	}
}