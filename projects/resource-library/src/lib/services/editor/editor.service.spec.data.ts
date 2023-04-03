
export const editorConfig = {
    context: {
      framework: 'tpd',
      user: {
        id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
        name: 'Vaibhav',
        orgIds: ['01309282781705830427'],
      },
      identifier: 'do_113274017771085824116',
      unitIdentifier: 'do_113274017771085824119',
      collectionObjectType: '',
      channel: '01307938306521497658',
      authToken: ' ',
      sid: 'iYO2K6dOSdA0rwq7NeT1TDzS-dbqduvV',
      did: '7e85b4967aebd6704ba1f604f20056b6',
      uid: 'bf020396-0d7b-436f-ae9f-869c6780fc45',
      additionalCategories: [
        {
          value: 'Textbook',
          label: 'Textbook',
        },
        {
          value: 'Lesson Plan',
          label: 'Lesson Plan',
        },
      ],
      pdata: {
        id: 'dev.dock.portal',
        ver: '2.8.0',
        pid: 'creation-portal',
      },
      contextRollup: {
        l1: '01307938306521497658',
      },
      tags: ['01307938306521497658'],
      cdata: [
        {
          id: '01307938306521497658',
          type: 'sourcing_organization',
        },
        {
          type: 'project',
          id: 'ec5cc850-3f71-11eb-aae1-fb99d9fb6737',
        },
        {
          type: 'linked_collection',
          id: 'do_113140468925825024117',
        },
      ],
      timeDiff: 5,
      objectRollup: {
        l1: 'do_113140468925825024117',
        l2: 'do_113140468926914560125',
      },
      host: '',
      defaultLicense: 'CC BY 4.0',
      endpoint: '/data/v3/telemetry',
      env: 'question_set',
      cloudStorageUrls: [
        'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/',
        'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
        'https://dockstorage.blob.core.windows.net/sunbird-content-dock/',
      ],
      mode: 'edit',
      cloudStorage: {
        presigned_headers: {
          'x-ms-blob-type': 'BlockBlob'
        }
      }
    },
    config: {
      mode: 'edit',
      maxDepth: 2,
      objectType: 'Collection',
      primaryCategory: 'Course',
      isReadOnlyMode: false,
      isRoot: true,
      dialcodeMinLength: 2,
      dialcodeMaxLength: 250,
      iconClass: 'fa fa-book',
      children: {},
      renderTaxonomy: false,
      categoryInstance: 'topic',
      hierarchy: {
        level1: {
          name: 'Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'CourseUnit',
          primaryCategory: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {},
        },
        level2: {
          name: 'Sub-Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'CourseUnit',
          primaryCategory: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {
            Content: [
              'Explanation Content',
              'Learning Resource',
              'eTextbook',
              'Teacher Resource',
              'Course Assessment',
            ],
          },
        },
        level3: {
          name: 'Sub-Sub-Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'CourseUnit',
          primaryCategory: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {
            Content: [
              'Explanation Content',
              'Learning Resource',
              'eTextbook',
              'Teacher Resource',
              'Course Assessment',
            ],
          },
        },
      },
      collection: {
        maxContentsLimit: 10,
      },
      questionSet: {
        maxQuestionsLimit: 10,
      },
      contentPolicyUrl: '/term-of-use.html',
    },
  };

export const serverResponse = {
    id: '',
      params: {
        resmsgid: '',
        msgid: '',
        err: '',
        status: '',
        errmsg: ''
      },
      responseCode: 'OK',
      result: {
      },
      ts: '',
      ver: '',
      headers: {}
};
