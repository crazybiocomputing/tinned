'use strict';

export function Periodic(period) {
  this.type = 'periodic';
  this.period = period;
  this.intervalID = -1;
  this.i = 0;
}
Periodic.prototype._start = function (out) {
    var self = this;
    function intervalHandler() { out._n(self.i++); }
    this.intervalID = setInterval(intervalHandler, this.period);
};
Periodic.prototype._stop = function () {
    if (this.intervalID !== -1)
        clearInterval(this.intervalID);
    this.intervalID = -1;
    this.i = 0;
};

