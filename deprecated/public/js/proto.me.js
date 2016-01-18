// Iterates over every key-value pair of an object.
// Discards parents' (prototypal) properties.
Object.prototype.each = function (callback, context)
{
	var key, 
		value;
	
	for (key in this)
	{
		if (this.hasOwnProperty( key ))
		{
			value = this[key];

			context ? callback.call(context, value, key) : callback(value, key);
		}
	}

	return null;
}

Object.prototype.extend = function (object)
{
	var combined = this;

	object.each( function (value, key)
	{
		combined[key] = value;
	});

	return combined;
};

Array.prototype.contains = function (query)
{
	function compare(element) 
	{
		return element === query;
	}
	
	return this.some(compare);
};

Array.prototype.last = function ()
{
	return this[ (this.length-1) ];
};

Array.prototype.remove = function (unnecessary)
{
	function rest(element)
	{
		return element !== unnecessary;
	}

	return this.filter(rest);
};

Array.prototype.pick = function (callback)
{
	var element, index, length = this.length;

	for (index = 0; index < length; index++)
	{
		element = this[index];

		if (Array.isArray(element) || (typeof element === 'object')) 
			element.pick(condition);

		if (callback(element,index))
			return element;
	}

	return null;
};
