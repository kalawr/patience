function Popup(element, trigger)
{
	trigger = trigger || element + '-close';

	this.element = document.querySelector(element);
	this.trigger = document.querySelector(trigger);

	this.trigger.addEventListener('click', this.hide.bind(this));
}




Popup.prototype.show = function ()
{
	this.element.classList.remove('hide')
};




Popup.prototype.hide = function ()
{
	this.element.classList.add('hide');
};




var message = new Popup('.message');