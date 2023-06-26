namespace("AspectDemos");

/**
 * Constructor for your widget - remember the name of this JS type must match the ID of the widget in it's .widget.json manifest
 * @param {} element            The Html DOM element to which this widget will bind
 * @param {} configuration      The configuration passed in from the designer/config
 * @param {} baseModel          The base widget model (contains unique id etc)
 * @returns {} 
 */
AspectDemos.Aspect02_CustomForm = function(element, configuration, baseModel)
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
        
        // Aspect widget config parameters
        disableSaveThreshold: 100
    };
    
    var options = $.extend(true, {}, defaults, configuration);
    
    // Store host parameters
    self._host = options._host;
    
    // Setup my local model
    self.model =
    {
        risk: ko.observable(0),
        probability: ko.observable(0)
    };
    
    // Computed values
    self.totalRisk = ko.pureComputed(() =>
    {
        return  self.model.risk() * self.model.probability(); 
    });
    
    self.totalRiskCss = ko.pureComputed(() =>
    {
        if( self.totalRisk() > options.disableSaveThreshold ) return "alert-danger";
        return "alert-info";
    });
    
    self.totalRiskMessage = ko.pureComputed(() =>
    {
        if( self.totalRisk() > options.disableSaveThreshold ) return "Risk is too high, cannot accept.";
        return "Risk within threshold, can accept";
    });
    
    self.validationErrorCount = ko.pureComputed(() =>
    {
        var count = 0;
        if( self.totalRisk() > options.disableSaveThreshold ) count++;
        return count;
    });
};

AspectDemos.Aspect02_CustomForm.prototype.formBuilder = function(model)
{
    model.aspectData = model.aspectData || {};
    model.aspectData.formBuilder = model.aspectData.formBuilder || {};
    model.aspectData.formBuilder.formData = model.aspectData.formBuilder.formData || {};
    return model.aspectData.formBuilder.formData;
}

AspectDemos.Aspect02_CustomForm.prototype.loadAndBind = function()
{
    var self = this;
    
    // Ensure the model has the form builder structure
    var data = self.formBuilder(self._host.model);
    self.model.risk(data.risk || 0);
    self.model.probability(data.probability || 0);
};

AspectDemos.Aspect02_CustomForm.prototype.onSave = function (model) 
{
    var self = this;
    var data = self.formBuilder(model);
    data.risk = self.model.risk();
    data.probability = self.model.probability();
}

