function Browser(ua) {
	this.ua = ua.replace(/\s*/g, '').toLowerCase();
}
module.exports = Browser;

Browser.prototype.isMobile = function() {
	var ua = this.ua;
	if (ua.indexOf('android') != -1
		|| ua.indexOf('iphone') != -1
		|| ua.indexOf('ipad') != -1
		|| ua.indexOf('ipod') != -1
		|| ua.indexOf('windowsphone') != -1
		|| ua.indexOf('meego') != -1
		|| ua.indexOf('compatible') != -1
		|| ua.indexOf('playbook') != -1
		|| ua.indexOf('mobile') != -1) {
		return true;
	}
};