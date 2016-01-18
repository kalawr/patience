var pluck = function (array, property)
{
	return array.map(function (element)
	{
		return element[property]
	})
}

// создать View
// View -- это структура данных, которая хранит состояния некоторого объекта (или системы), позволяет их ПРИНИМАТЬ и ВЫХОДИТЬ из них.
// Можно описать состояние, можно описать способ достижения этого состояния.

function State(name, enter, leave, is_in)
{
	this.name = name;
	this.enter = enter;
	this.leave = leave;
	this.is_in = is_in;

	this.element = function () { return element }
}

// ^ view.enter(state_name)
// ^ view.leave(state_name)
// ^ view.is_in(state_name)


function View(element)
{
	this.element = element;
	this.states  = [].slice.call(arguments, 1);
}

View.prototype.addState = function (state)
{
	this.states.push(state)
}

View.prototype.removeState = function (stateName)
{
	var index = pluck(this.states, 'name').indexOf(stateName)
	index >= 0 && this.states.splice(index, 1)
}

View.prototype.findState = function (stateName)
{
	return this.states.find(function (element){ return element['name'] === stateName })
}

View.prototype.inState = function (stateName)
{ 
	return this.findState(stateName).is_in()
}

View.prototype.enterState = function (stateName)
{
	this.findState(stateName).enter()
}

View.prototype.leaveState = function (stateName)
{
	this.findState(stateName).leave()
}

var hidden = new State(
	'hidden',
	function (){ this.element.classList.add('hide') },
	function (){ this.element.classList.remove('hide') },
	function (){ return this.element.classList.contains('hide') }
)

var view = new View(
	'.message',
	hidden
)