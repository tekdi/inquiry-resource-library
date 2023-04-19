
export const licenseMockResponse = {
  "id": "api.search-service.search",
  "ver": "3.0",
  "ts": "2023-04-19T06:46:51ZZ",
  "params": {
      "resmsgid": "1897de38-859e-40b8-8fee-2bad3b6e55a2",
      "msgid": null,
      "err": null,
      "status": "successful",
      "errmsg": null
  },
  "responseCode": "OK",
  "result": {
      "license": [
          {
              "identifier": "cc-by-4.0",
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "apoc_json": "{\"batch\": true}",
              "consumerId": "02bf5216-c947-492f-929b-af2e61ea78cd",
              "description": "This license is Creative Commons Attribution",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "createdOn": "2022-07-27T11:17:18.368+0000",
              "url": "https://creativecommons.org/licenses/by/4.0/legalcode",
              "apoc_text": "APOC",
              "versionKey": "1658920638368",
              "objectType": "License",
              "IL_FUNC_OBJECT_TYPE": "License",
              "name": "CC BY 4.0",
              "lastUpdatedOn": "2022-07-27T11:17:18.368+0000",
              "IL_UNIQUE_ID": "cc-by-4.0",
              "node_id": 213,
              "apoc_num": 1,
              "status": "Live"
          }
      ],
      "count": 1
  }
}

export const channelMockResponse = {
    "id": "api.channel.read",
    "ver": "3.0",
    "ts": "2023-04-19T06:46:51ZZ",
    "params": {
        "resmsgid": "b0c0f859-d18f-4686-b7eb-2c3609fe328b",
        "msgid": null,
        "err": null,
        "status": "successful",
        "errmsg": null
    },
    "responseCode": "OK",
    "result": {
        "channel": {
            "name": "NIT123",
            "primaryCategories": [
                {
                    "identifier": "obj-cat:asset_asset_all",
                    "name": "Asset",
                    "targetObjectType": "Asset"
                },
                {
                    "identifier": "obj-cat:multiple-choice-question_question_all",
                    "name": "Multiple Choice Question",
                    "targetObjectType": "Question"
                },
                {
                    "identifier": "obj-cat:practice-question-set_questionset_all",
                    "name": "Practice Question Set",
                    "targetObjectType": "QuestionSet"
                },
                {
                    "identifier": "obj-cat:practice-question-set_content_all",
                    "name": "Practice Question Set",
                    "targetObjectType": "Content"
                },
                {
                    "identifier": "obj-cat:subjective-question_question_all",
                    "name": "Subjective Question",
                    "targetObjectType": "Question"
                }
            ],
            "contentPrimaryCategories": [
                "Course Assessment",
                "eTextbook",
                "Explanation Content",
                "Learning Resource",
                "Practice Question Set",
                "Teacher Resource",
                "Exam Question"
            ],
            "status": "Live",
            "defaultFramework": "inquiry_k-12"
        }
    }
};