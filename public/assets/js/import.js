// Data.
var DATA   = json('/assets/json/data.json'),
	CHAMPS = DATA['champions'],
	SKINS  = DATA['skins'];



// Element bindings.
var EMAIL_INPUT_ELEMENT       = $('#email-input-element'),
	CHOICE_INPUT_ELEMENT      = $('#choice-input-element'),
	SUBMIT_INPUT_ELEMENT      = $('#submit-input-element'),
	HINT_ELEMENT              = $('#hint-actual-element'),
	HINT_PADDING_ELEMENT      = $('#hint-padding-element');
	CHOICES_CONTAINER_ELEMENT = $('choices-container-element');



var Model = {

	events:   [],
	choices:  [],
	cache:    null,
	mails:    '', // the value of <input type='email' />
	picks:    '', // the value of <input type='text'  />

	data: {
		validnames: CHAMPS,

		// Looks for the first match in the provided data array. Depending on the second argument the function attempts to either come across a full match (regardless of case) or find a match by its beginning (case-insensitive as well).
		select: function (value, strictness) 
		{
			function strict(element)
			{
				if (caseblind_equal( [element, value] ))
				{
					return element;
				}
				else
				{
					return null;
				}
			}

			function loose(element)
			{
				var regexp = new RegExp(('^' + value), 'gi');
				
				// This check prevents space-only values from working.
				if (value) 
				{
					return regexp.test(element);
				}
				else
				{
					return null;
				}
			}

			if (strictness)
			{
				return _.find(this.validnames, strict);
			}
			else
			{
				return _.find(this.validnames, loose);
			}
		}
	},

	// The inherited heart of the beast.
	set: function (hash)
	{
		// Support for set('property_name', 'value') syntax.
		if (arguments.length == 2)
		{
			arguments = Array.prototype.slice.call(arguments);
			hash      = {};

			hash[ arguments.shift() ] = arguments.shift();
		}

		// Perform changes.
		_.each(hash, function (value, key)
		{
			this[key] = value;
		}, this);

		// For each changed attribute trigger every event that is listening to changes of that particular attribute.
		_.each(hash, function (value, attribute) 
		{
			_.each(this.events, function (e) 
			{
				var callback = e['callback'],
					context  = e['context'],
					focus    = e['focus'];

				if (attribute == (focus || 'all')) 
				{
					callback.call(context, value);
				}
			}, this );
		}, this);
	},

	// Does what a set() does, but runs callback functions upon the appended element, not the whole array.
	append: function (array, value)
	{
		
		this.choices.push(value);

		_.each(this.events, function (e)
		{
			var callback = e['callback'],
				context  = e['context'],
				focus    = e['focus'];

			if (array == (focus || 'all')) 
			{
				callback.call(context, value);
			}	
		});
	},

	// Updates model's state.
	rebuild: function ()
	{
		var match;

		match = this.data.select(this.picks, true);
		
		if (match && !_.contains(this.choices, match))
		{
			this.append('choices', match);
			this.set('cache', '');

			return true;
		}

		match = this.data.select(this.picks, false);

		if (match)
		{
			this.set('cache', match);
			return true;
		}
		else
		{
			this.set('cache', '');
			return false;
		}
	},

	// Returns data ready to be posted.
	form_data: function (mails, picks)
	{
		var data = new FormData();

		data.append('mail', this.mails);
		data.append('picks', this.choices);
		
		return data;
	},

	// Fetches data to the handling scipt.
	save: function ()
	{
		post.call(this, '/', this.form_data(), { 'enctype': 'application/x-www-form-urlencoded' });
	},

	// Creates an event that runs the callback once the specific model property changes.
	tie: function (property, callback, context)
	{
		this.events.push( { 'focus': property, 'callback': callback, 'context': (context || this) } );
	}
};

function View(options)
{
	// Provide `destination` (an HTMLElement object). Optionally provide `tag` attribute (so that the data could be wrapped in it before being published) and `prepare` method.
	_.extend(this, options || {});
}

	// If this particaular view has a non-negative 'tag' attribute, it wraps a string into the specified tag and sends it to the destination. Otherwise, it sets the destination's text content to the provided value.
	View.prototype.render = function (str)
	{
		if (this.prepare)
		{
			str = this.prepare(str);
		}

		if (this.tag)
		{
			this.destination.appendChild(this.wrap(str));
		}
		else
		{
			this.destination.textContent = str;
		}
	};

	// Creates and returns an HTML element with specified text content.
	View.prototype.template = function (str)
	{
		var element;

		element = document.createElement(this.tag);
		element.textContent = str;

		return element;
	};

	// Removes all the contents of the destination element, thus returning it to its default state.
	View.prototype.reset = function ()
	{
		this.destination.textContent = '';
	};


// A Raw is an HTML <input /> element bound to a model. It's purpose is to update the associated model upon user interaction.
function Raw(options)
{
	// Provide `element` (an HTMLInputElement object), `model`, `attribute` (the model's attribute to be changed on input).
	_.extend(this, options || {});
}

	// Adds an event listener to track specific events of the element. 'context' argument is optional.
	Raw.prototype.on = function (trigger, callback, context)
	{
		if (context)
		{
			this.element.addEventListener(trigger, callback.bind(context));
		}
		else
		{
			this.element.addEventListener(trigger, callback);
		}
	};

	Raw.prototype.relay = function ()
	{
		var attribute,
			value;

		attribute = this.attribute;
		value     = this.element.value;

		this.model.set(attribute, value);
	};

	Raw.prototype.get = function ()
	{
		return this.element.value;
	};

	Raw.prototype.reset = function ()
	{
		this.element.value = '';
	};

var hint = new View(
	{
		destination: HINT_ELEMENT,

		prepare: function (str)
		{
			return str.substr(Model.picks.length);
		}
	}
);
var padding = new View(
	{
		destination: HINT_PADDING_ELEMENT, 
	}
);
var choices = new View(
	{
		destination: CHOICES_CONTAINER_ELEMENT, 
		tag: 'li'
	}
);
var picker = new Raw(
	{
		'element'  : CHOICE_INPUT_ELEMENT,
		'model'    : Model,
		'attribute': 'picks'
	}
);

var mailer = new Raw(
	{
		'element'  : EMAIL_INPUT_ELEMENT,
		'model'    : Model,
		'attribute': 'mails'
	}
);

// Start waiting for user interaction with `input#pick` and 'input#mail' controls.
picker.on('input', picker.relay, picker);
mailer.on('input', mailer.relay, mailer);

// Update model.
Model.tie('picks',   Model.rebuild);

// Update views according to the changes of the model.
Model.tie('cache',   hint.render,    hint);
Model.tie('choices', choices.render, choices);
Model.tie('picks',   padding.render, padding);

// Reset the input field whenever a choice is published.
Model.tie('choices', picker.reset,   picker);

SUBMIT_INPUT_ELEMENT.onclick = function ()
{
	//preventDefault(); ??
	Model.save();
	return false;
};