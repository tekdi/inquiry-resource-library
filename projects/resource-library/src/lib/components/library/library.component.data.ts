export const questionCreationFormConfig = {
    "templateName": "",
    "required": [],
    "properties": [
        {
            "code": "name",
            "dataType": "text",
            "description": "Name of the content",
            "editable": true,
            "inputType": "text",
            "label": "Title",
            "name": "Title",
            "placeholder": "Title",
            "renderingHints": {
                "class": "sb-g-col-lg-1 required"
            },
            "required": true,
            "visible": true,
            "validations": [
                {
                    "type": "max",
                    "value": "100",
                    "message": "Input is Exceeded"
                },
                {
                    "type": "required",
                    "message": "Title is required"
                }
            ]
        },
        {
            "code": "bloomsLevel",
            "dataType": "text",
            "description": "Learning level",
            "editable": true,
            "inputType": "select",
            "label": "Learning level",
            "name": "Learning level",
            "placeholder": "Select Learning level",
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            },
            "required": false,
            "visible": true,
            "range": [
                "remember",
                "understand",
                "apply",
                "analyse",
                "evaluate",
                "create"
            ],
            "validations": []
        },
        {
            "code": "foodcrops",
            "default": "",
            "visible": true,
            "editable": false,
            "dataType": "text",
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            },
            "description": "Foodcrops",
            "label": "Foodcrops",
            "required": false,
            "name": "Foodcrops",
            "inputType": "select",
            "placeholder": "Select Foodcrops"
        },
        {
            "code": "commercialcrops",
            "visible": true,
            "editable": true,
            "default": "",
            "dataType": "list",
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            },
            "description": "",
            "label": "Commercial Crops",
            "required": false,
            "name": "Commercial Crops",
            "inputType": "select",
            "placeholder": "Select Commercial Crops"
        },
        {
            "code": "livestockmanagement",
            "visible": true,
            "editable": true,
            "default": "",
            "dataType": "list",
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            },
            "description": "Live Stock Management",
            "label": "Live Stock Management",
            "required": false,
            "name": "Live Stock Management",
            "inputType": "select",
            "placeholder": "Select Live Stock Management"
        },
        {
            "code": "livestockspecies",
            "visible": true,
            "editable": true,
            "default": "",
            "dataType": "list",
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            },
            "description": "",
            "label": "Live Stock Species",
            "required": false,
            "name": "Live Stock Species",
            "inputType": "select",
            "placeholder": "Select Live Stock Species"
        },
        {
            "code": "maxScore",
            "dataType": "number",
            "description": "Marks",
            "editable": true,
            "inputType": "text",
            "label": "Marks:",
            "name": "Marks",
            "placeholder": "Marks",
            "tooltip": "Provide marks of this question.",
            "renderingHints": {
                "class": "sb-g-col-lg-1 required"
            },
            "validations": [
                {
                    "type": "pattern",
                    "value": "^[1-9]{1}[0-9]*$",
                    "message": "Input should be numeric"
                },
                {
                    "type": "required",
                    "message": "Marks is required"
                }
            ]
        }
    ]
}