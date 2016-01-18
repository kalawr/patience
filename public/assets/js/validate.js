// import champion data

function json(url)
{
	var request = new XMLHttpRequest();

	request.open('GET', url, false); // yes, synchronous
	request.send();

	return JSON.parse(request.response);
}

var valid_names = json('assets/json/data.json');








// new Mail('input[type="text"]')
// .validate()
// .value()

function Mail(query)
{
	this.element = document.querySelector(query);
}

Mail.prototype.validate = function ()
{
	var starter_email_regexp = /^[\w\-\.]+@[\w\-]+\.[\w\-\.]{2,6}$/i;

	return starter_email_regexp.test(this.element.value);
};

Mail.prototype.value = function ()
{
	return this.element.value;
};