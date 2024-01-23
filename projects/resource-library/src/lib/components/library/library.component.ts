import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    AfterViewInit,
    ViewEncapsulation,
    OnDestroy
} from '@angular/core';
import * as _ from 'lodash-es';
import {EditorService} from '../../services/editor/editor.service';
import {ToasterService} from '../../services/toaster/toaster.service';
import {EditorTelemetryService} from '../../services/telemetry/telemetry.service';
import {ConfigService} from '../../services/config/config.service';
import {Router} from '@angular/router';
import {HelperService} from '../../services/helper/helper.service';
import {FrameworkService} from '../../services/framework/framework.service';
import { metadataDefaultConfig } from './library.component.data';

@Component({
    selector: 'lib-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LibraryComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() libraryInput: any;
    @Output() libraryEmitter = new EventEmitter<any>();
    collectionData: any;
    public searchFormConfig: any;
    public metadataFormConfig: any;
    public pageId = 'add_from_library';
    public contentList: any;
    public selectedContent: any;
    public selectedContentList: any[] = [];
    public contentType: string;
    public childNodes: any;
    public targetPrimaryCategories: any[] = [];
    public targetObjectTypes: any[] = [];
    collectionHierarchy = [];
    collectionId: string;
    public showAddedContent = true;
    public showListing = true;
    public showLoader = true;
    public isFilterOpen = true;
    collectionhierarcyData: any;
    public defaultFilters: any;
    pageStartTime: any;
    public frameworkId: any;
    enableAddContentButton = true;
    filterInput: any;
    existingContentCounts: number;
    public defaultLibraryLabels = {
        itemType: 'content',
        collectionType: 'collection',
        createdByField: 'board'
    };
    public addContentTelemetryLabel = '';

    constructor(public telemetryService: EditorTelemetryService,
                private editorService: EditorService,
                private router: Router,
                private toasterService: ToasterService,
                public configService: ConfigService,
                private frameworkService: FrameworkService
    ) {
        this.pageStartTime = Date.now();
    }

    ngOnInit() {
        this.frameworkService.initialize(_.get(this.libraryInput, 'framework'));
        this.editorService.initialize(_.get(this.libraryInput, 'editorConfig'));
        this.telemetryService.initializeTelemetry(_.get(this.libraryInput, 'editorConfig'));
        this.setLibraryLabel();
        this.setPrimaryCategory();
        this.existingContentCounts = this.libraryInput.existingcontentCounts;
        this.collectionId = _.get(this.libraryInput, 'collectionId');
        this.collectionData = _.get(this.libraryInput, 'collection');
        this.searchFormConfig = _.get(this.libraryInput, 'searchFormConfig', []);
        this.metadataFormConfig = _.get(this.libraryInput, 'metadataFormConfig', metadataDefaultConfig);
        this.editorService.fetchCollectionHierarchy(this.collectionId).subscribe((response: any) => {
            this.collectionhierarcyData = response.result.question || response.result.questionset || response.result.content;
            this.collectionHierarchy = this.getUnitWithChildren(this.collectionhierarcyData, this.collectionId);
            if (_.has(this.collectionhierarcyData, 'targetFWIds')) {
                this.frameworkId = _.first(_.castArray(this.collectionhierarcyData.targetFWIds));
            } else {
                this.frameworkId = _.first(_.castArray(this.collectionhierarcyData.framework));
            }
            this.setDefaultFilters();
            this.fetchContentList();
            this.telemetryService.telemetryPageId = this.pageId;
            this.childNodes = _.get(this.collectionhierarcyData, 'childNodes');
        }, err => {
            this.toasterService.error(_.get(this.configService.labelConfig, 'messages.error.001'));
        });
    }

    setLibraryLabel() {
        if (_.has(this.libraryInput, 'libraryLabels') &&
        !_.isUndefined(this.libraryInput, 'libraryLabels')) {
            if (this.libraryInput.libraryLabels.itemType) {
                this.defaultLibraryLabels.itemType = this.libraryInput.libraryLabels.itemType;
            }
            if (this.libraryInput.libraryLabels.collectionType) {
                this.defaultLibraryLabels.collectionType = this.libraryInput.libraryLabels.collectionType;
            }
            if (this.libraryInput.libraryLabels.createdByField) {
                this.defaultLibraryLabels.createdByField = this.libraryInput.libraryLabels.createdByField;
            }
        }
        this.addContentTelemetryLabel = 'add_' + _.lowerCase(this.defaultLibraryLabels.itemType);
    }

    setPrimaryCategory() {
        if (!_.isUndefined(this.libraryInput.targetPrimaryCategories) &&
        _.isArray(this.libraryInput.targetPrimaryCategories)) {
            _.forEach(this.libraryInput.targetPrimaryCategories, (primaryCategory) => {
                if (_.has(primaryCategory, 'name')) {
                    this.targetPrimaryCategories.push(primaryCategory.name);
                }
                if (_.has(primaryCategory, 'targetObjectType')) {
                    if (!_.includes(this.targetObjectTypes, primaryCategory.targetObjectType)) {
                        this.targetObjectTypes.push(primaryCategory.targetObjectType);
                    }
                }
                if (_.isEmpty(this.targetObjectTypes)) {
                    this.targetObjectTypes = ['Content', 'Question'];
                }
            });
        }
    }

    ngAfterViewInit() {
        this.telemetryService.impression({
            type: 'edit', pageid: this.telemetryService.telemetryPageId, uri: this.router.url,
            duration: (Date.now() - this.pageStartTime) / 1000
        });
    }

    back() {
        this.libraryEmitter.emit({action: 'back'});
        this.editorService.contentsCountAddedInLibraryPage(true);
    }

    onFilterChange(event: any) {
        this.selectedContentList = []
        switch (event.action) {
            case 'filterDataChange':
                this.fetchContentList(event.filters, event.query);
                this.isFilterOpen = false;
                break;
            case 'filterStatusChange':
                this.isFilterOpen = event.filterStatus;
                break;
        }
    }

    setDefaultFilters() {
        this.defaultFilters = {};
        if (_.isUndefined(_.find(this.searchFormConfig, {code: 'primaryCategory'}))) {
            this.defaultFilters['primaryCategory'] = this.targetPrimaryCategories;
            this.defaultFilters['objectType'] = this.targetObjectTypes;
        }
        this.searchFormConfig.forEach(config => {
            const value = _.get(this.collectionhierarcyData, config.code);
            if (value && config.code !== 'primaryCategory') {
                this.defaultFilters[config.code] = Array.isArray(value) ? value : [value];
            } else if (config.code === 'primaryCategory') {
                config.default = this.targetPrimaryCategories;
                config.range = this.targetPrimaryCategories;
                this.defaultFilters['primaryCategory'] = this.targetPrimaryCategories;
                this.defaultFilters['objectType'] = this.targetObjectTypes;
            }
        });
    }

    fetchContentList(filters?, query?) {
        filters = filters || this.defaultFilters;
        const option = {
            url: 'composite/v3/search',
            data: {
                request: {
                    query: query || '',
                    filters: _.pickBy({ ...filters, ...{ status: ['Live'], visibility: 'Default', qumlVersion: 1.1 , objectType: this.targetObjectTypes }}),
                    sort_by: {
                        lastUpdatedOn: 'desc'
                    }
                }
            }
        };
        if(_.get(this.libraryInput, 'collection.evalMode') == 'server') {
            option.data.request.filters = {...option.data.request.filters,evalMode: _.get(this.libraryInput, 'collection.evalMode')}
        } else {
            option.data.request['not_exists'] = ["evalMode"];
        }
        this.showListing = false;
        this.editorService.fetchContentListDetails(option).subscribe((response: any) => {
            this.showLoader = false;
            this.showListing = true;
            const targetObjects = _.uniqBy(this.libraryInput.targetPrimaryCategories, 'targetObjectType');
            if (!(_.get(response, 'result.count'))) {
                this.contentList = [];
            } else {
                this.contentList = [];
                targetObjects.forEach(targetObject => {
                    if (targetObject.targetObjectType === 'Content') {
                        targetObject.targetObjectType = 'content';
                    }
                    this.contentList = _.concat(this.contentList, _.get(response.result, targetObject.targetObjectType, []));
                });
                this.filterContentList();
            }
        });
    }

    getUnitWithChildren(data, collectionId, level?) {
        const self = this;
        const childData = data.children;
        if (_.isEmpty(childData)) {
            return [];
        }
        data.level = level ? (level + 1) : 1;
        const tree = childData.map(child => {
            const treeItem: any = this.generateNodeMeta(child);
            // tslint:disable-next-line:max-line-length
            treeItem.showButton = _.isEmpty(_.get(this.editorService.editorConfig, `config.hierarchy.level${data.level}.children`)) ? true : false;
            const treeUnit = self.getUnitWithChildren(child, collectionId, data.level);
            const treeChildren = treeUnit && treeUnit.filter(item => {
                return item.visibility === 'Parent' && item.mimeType === 'application/vnd.ekstep.content-collection';
            }); // TODO: rethink this : need to check for questionSet
            treeItem.children = (treeChildren && treeChildren.length > 0) ? treeChildren : null;
            return treeItem;
        });
        return tree;
    }

    generateNodeMeta(node) {
        return {
            identifier: node.identifier,
            name: node.name,
            contentType: node.contentType,
            topic: node.topic,
            status: node.status,
            creator: node.creator,
            createdBy: node.createdBy || null,
            parentId: node.parent || null,
            organisationId: _.has(node, 'organisationId') ? node.organisationId : null,
            prevStatus: node.prevStatus || null,
            visibility: node.visibility,
            mimeType: node.mimeType
        };
    }


    onChangeEvent(event: any) {
        switch (event.type) {
          case 'content':
            this.selectedContent = event.content;
            break;
          case 'contentList':
            this.selectedContentList = event.contentList;
            this.contentType = event.contentType;
            break;
          default:
            break;
        }
    }

    showResourceTemplate(event) {
        switch (event.action) {
            case 'showFilter':
                this.openFilter();
                break;
            case 'showAddedContent':
                this.showAddedContent = event.status;
                this.filterContentList();
                break;
            case 'sortContentList':
                this.sortContentList(event.status);
                break;
            default:
                break;
        }
    }

    addtolibrary() {
      this.libraryEmitter.emit({
        action: 'addBulk',
        collectionIds: this.selectedContentList,
        resourceType: this.contentType
      });
    }

    sortContentList(status) {
        this.contentList = this.contentList.sort((a, b) => {
            return this.editorService.sort(status ? b : a, status ? a : b, status ? 'name' : 'lastUpdatedOn');
        });
        const selectedContentIndex = this.showAddedContent ? 0 : _.findIndex(this.contentList, {isAdded: false});
        this.selectedContent = this.contentList[selectedContentIndex];
    }

    openFilter(): void {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        this.isFilterOpen = true;
    }

    filterContentList(isContentAdded?) {
        if (_.isEmpty(this.contentList)) {
            return;
        }
        _.forEach(this.contentList, (value, key) => {
            if (value) {
                value.isAdded = _.includes(this.childNodes, value.identifier);
            }
        });
        if (!isContentAdded) {
            let selectedContentIndex = this.showAddedContent ? 0 : _.findIndex(this.contentList, {isAdded: false});
            if (this.contentList.length === 1 && this.contentList[0].isAdded === true) {
                this.showAddedContent = true;
                selectedContentIndex = 0;
            }
            this.selectedContent = this.contentList[selectedContentIndex];
        }
    }

    checkContentAdd(event) {
        switch (event.action) {
            case 'enableAddContent':
                this.enableAddContentButton = true;
                break;
            case 'disableAddContent':
                this.enableAddContentButton = false;
                break;
            default:
                break;
        }
    }

    ngOnDestroy() {
        this.editorService.contentsCountAddedInLibraryPage(true); // contents count updated from library page to zero
    }
}
