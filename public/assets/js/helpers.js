function $(query)
{
	return document.querySelector(query);
}

function json(url)
{
	var request = new XMLHttpRequest();

	request.open('GET', url, false); // yes, synchonous
	request.send();

	return JSON.parse(request.response);
}

function post(url, data, headers)
{
	var request;

	request = new XMLHttpRequest();
	request.open('POST', url);

	if (headers)
	{
		headers.each( function (value, key) { request.setRequestHeader( key, value ) });
	}

	request.send(data);

	return request;
}

function caseblind_equal(strings)
{
	return strings[0].toLowerCase() === strings[1].toLowerCase();
}