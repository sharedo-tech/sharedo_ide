namespace("");

/**
 * Constructor for your widget - remember the name of this JS type must match the ID of the widget in it's .widget.json manifest
 * @param {} element            The Html DOM element to which this widget will bind
 * @param {} configuration      The configuration passed in from the designer/config
 * @param {} baseModel          The base widget model (contains unique id etc)
 * @returns {} 
 */
CreateInstructionFileUpload = function(element, configuration, baseModel)
{
    var self = this;
    var defaults =
    {
        // Model items from the designer widget
    };
    var options = $.extend(true, {}, defaults, configuration);

    // Setup the local model
    self.model =
    {
        reference: ko.observable(null),
        title: ko.observable(null),
        target: ko.observable("Other"),
        files: ko.observableArray([])
    };
    
    self.validation =
    {
        reference: Validator.required(self, self.model.reference, "Reference is required"),
        title: Validator.required(self, self.model.title, "Title is required"),
        isValid: ko.pureComputed(() =>
        {
            var fails = 0;
            if( self.validation.reference() ) fails++;
            if( self.validation.title() ) fails++;
            return fails === 0;
        })
    }
};

/**
 * Called by the UI framework when this widget is being unloaded - clean up
 * any subscriptions or references here that would keep this instance alive
 */
CreateInstructionFileUpload.prototype.onDestroy = function()
{
    var self = this;
};

/**
 * Called by the UI framework after initial creation and binding to load data
 * into it's model
 */
CreateInstructionFileUpload.prototype.loadAndBind = function()
{
    var self = this;
};


CreateInstructionFileUpload.prototype.removeFile = function(file)
{
    var self = this;
    self.model.files.remove(file);
}

CreateInstructionFileUpload.prototype.selectFiles = function(model, ev)
{
    var self = this;

    _.each(ev.target.files, f =>
    {
        self.model.files.push(f);
    });
};

CreateInstructionFileUpload.prototype.dropFiles = function(dropInfo)
{
    var self= this;
    
    if (dropInfo.isFile)
    {
        _.each(dropInfo.dataTransfer.files, function(f)
        {
            self.model.files.push(f);
        });
    }
};


CreateInstructionFileUpload.prototype.create = function()
{
    var self = this;

    $ui.startWaitingFor("step1", "Create instruction");
    
    var agent = CreateInstructionFileUploadAgent();
    
    agent.createInstruction(self.model.reference(), self.model.title()).then( id =>
    {
        $ui.stopWaitingFor("step1");
        
        if( self.model.files().length > 0 )
        {
            $ui.startWaitingFor("step2", "Uploading files");
            agent.uploadFiles(id, self.model.target(), self.model.files()).then(() =>
            {
                $ui.stopWaitingFor("step2");
                
                self.model.reference(null);
                self.model.title(null);
                self.model.target("Other");
                self.model.files([]);
            });
        }
    });
};




