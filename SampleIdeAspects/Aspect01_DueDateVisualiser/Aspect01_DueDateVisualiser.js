namespace("AspectDemos");

/**
 * Constructor for your widget - remember the name of this JS type must match the ID of the widget in it's .widget.json manifest
 * @param {} element            The Html DOM element to which this widget will bind
 * @param {} configuration      The configuration passed in from the designer/config
 * @param {} baseModel          The base widget model (contains unique id etc)
 * @returns {} 
 */
AspectDemos.Aspect01_DueDateVisualiser = function(element, configuration, baseModel)
{
    var self = this;
    var defaults =
    {
        // Parameters from the host
        _host:
        {
            model: null,
            blade: null,
            enabled: false
        },

    };
    
    var options = $.extend(true, {}, defaults, configuration);
    
    // Store host parameters
    self._host = options._host;

    // Setup model for due date
    self.due = ko.observable(moment());
    self.now = ko.observable(moment());
    
    // Calculated fields
    self.msRemaining = ko.pureComputed(() =>
    {
        return (moment(self.due()) - moment(self.now()));
    })
    
    self.css = ko.pureComputed(() =>
    {
        var ms = self.msRemaining();
        if( ms <= 0 ) return "overdue";
        if( ms <= 60000 ) return "dueNow";
        if( ms <= 3600000 ) return "dueWithinTheHour";
        return "timeYet";
    });
    
    self.message = ko.pureComputed(() =>
    {
        var ms = self.msRemaining();
        if( ms <= 0 ) return "Time is up!";
        if( ms <= 60000 ) return `${Math.round(ms/1000)} seconds!`;
        return `You still have ${moment.duration(ms).humanize()}`;
    })
    
    // Set an interval to constantly refresh "now"
    self.timer = window.setInterval(() =>
    {
        self.now(moment());
    }, 1000);
    
    // The aspect model isn't observable and might not be populated with the task details yet
    // so here we subscribe to listen to the due date being changed.
    self.subscriptions = 
    [
        $ui.events.subscribe("Sharedo.Core.Case.Aspect.Tasks.DueDateChanged", ev =>
        {
            if( ev.dueDateTime ) self.due(ev.dueDateTime);
        })
    ];
};

/**
 * Called by the UI framework when this widget is being unloaded - clean up
 * any subscriptions or references here that would keep this instance alive
 */
AspectDemos.Aspect01_DueDateVisualiser.prototype.onDestroy = function()
{
    var self = this;
    
    // Stop the now() update
    window.clearInterval(self.timer);
    
    // Clear out subscriptions
    _.each(self.subscriptions, s => $ui.events.unsubscribe(s));
};



