namespace("");

CreateInstructionFileUploadAgent = function()
{
    /**
     * Creates a new instruction with the given reference and title
     */
    var createInstruction = function(reference, title)
    {
        var promise = $.Deferred();
        
        var request = 
        {
            workItem:
            {
                sharedoTypeSystemName: "instruction-b2c-enquiry",
                title: title,
                titleIsUserProvided: true,
                reference: reference,
                referenecIsUserProvided: true
            },
            aspectData:
            {
                // You would typically capture this info on your ingestion form
                instructionWorkTypeDetails:
                {
                    caseSharedoTypeSystemName: "matter-private-client-general",
                    caseWorkTypeId: 310000,
                    jurisdictionId: 5002601
                }
            },
            keyDates:
            {
                "kd-instruction-date": new Date()
            },
            participants:
            [
                // You would typically capture the client, matter owner etc on the ingestion form,
                // or via some lookups / allocation rules or whatever.
                {
                    roleSystemName: "client",
                    odsId: "725ef4c4-8d9a-428a-b588-e933c6f73155"
                },
                {
                    roleSystemName: "matter-owner",
                    odsId: "e35935ac-006c-4d5f-bb34-17246220b06b"
                }
            ]
        };
        
        $ajax.post("/api/v1/public/workItem", request).then(response =>
        {
            promise.resolve(response.workItem.id);
        })
        
        
        return promise;
    };
    
    /**
     * Uploads the list of File items to the given work item in a specified folder
     */
    var uploadFiles = function(workItemId, targetFolder, arrayOfFile)
    {
        var promise = $.Deferred();
        
        var formData = new FormData();
    
        _.each(arrayOfFile, function(f)
        {
            formData.append(f.name, f);
        });

        formData.append("folder", targetFolder);

        $ajax.rawPost(`/api/v1/public/workItem/${workItemId}/relatedDocuments`, formData).then(() =>
        {
            promise.resolve();
        });
        
        return promise;
    };

    return {
        createInstruction: createInstruction,
        uploadFiles: uploadFiles
    }
};
