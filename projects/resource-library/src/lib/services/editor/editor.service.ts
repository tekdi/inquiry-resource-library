import {Injectable, EventEmitter} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import * as _ from 'lodash-es';
import {PublicDataService} from '../public-data/public-data.service';
import {IEditorConfig} from '../../interfaces/editor';
import {ConfigService} from '../config/config.service';
import {ToasterService} from '../../services/toaster/toaster.service';
import {EditorTelemetryService} from '../../services/telemetry/telemetry.service';
import {DataService} from '../data/data.service';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface SelectedChildren {
    primaryCategory?: string;
    mimeType?: string;
    interactionType?: string;
}

@Injectable({providedIn: 'root'})

export class EditorService {
    data: any = {};
    private _selectedChildren: SelectedChildren = {};
    public questionStream$ = new Subject<any>();
    private _editorConfig: IEditorConfig;
    private _editorMode = 'edit';
    public showLibraryPage: EventEmitter<number> = new EventEmitter();
    public contentsCount = 0;

    constructor(private toasterService: ToasterService,
                public configService: ConfigService, private telemetryService: EditorTelemetryService,
                private publicDataService: PublicDataService, private dataService: DataService, public httpClient: HttpClient) {
    }

    public initialize(config: IEditorConfig) {
        this._editorConfig = config;
        if (this.configService.editorConfig && this.configService.editorConfig.default) {
            this._editorConfig.config = _.assign(this.configService.editorConfig.default, this._editorConfig.config);
        }
        this._editorMode = _.get(this._editorConfig, 'config.mode').toLowerCase();
    }

    public get editorConfig(): IEditorConfig {
        return this._editorConfig;
    }

    get editorMode() {
        return this._editorMode;
    }

    emitshowLibraryPageEvent(page) {
        this.showLibraryPage.emit(page);
    }

    getshowLibraryPageEmitter() {
        return this.showLibraryPage;
    }

    fetchCollectionHierarchy(collectionId): Observable<any> {
        const url = this.configService.urlConFig.URLS[this.editorConfig.config.objectType];
        const hierarchyUrl = `${url.HIERARCHY_READ}/${collectionId}`;
        const req = {
            url: hierarchyUrl,
            param: {mode: 'edit'}
        };
        return this.publicDataService.get(req);
    }

    fetchContentDetails(contentId) {
        const req = {
            url: _.get(this.configService.urlConFig, 'URLS.CONTENT.READ') + contentId
        };
        return this.publicDataService.get(req);
    }

    submitRequestChanges(contentId, comment) {
        let objType = this.configService.categoryConfig[this.editorConfig.config.objectType];
        objType = objType.toLowerCase();
        const url = this.configService.urlConFig.URLS[this.editorConfig.config.objectType];
        const requestBody = {
            request: {
                [objType]: {
                    rejectComment: _.trim(comment)
                }
            }
        };
        const option = {
            url: `${url.CONTENT_REJECT}${contentId}`,
            data: requestBody
        };
        return this.publicDataService.post(option);
    }

    public publish(value: any) {
        this.questionStream$.next(value);
    }

    calculateMaxScore(questions: Array<any>) {
        return _.reduce(questions, (sum, question) => {
            return sum + (question.responseDeclaration ? _.get(question, 'responseDeclaration.response1.maxScore') : 1);
        }, 0);
    }


    _toFlatObj(data, questionId?, selectUnitId?) {
        const instance = this;
        if (data && data.data) {
            instance.data[data.data.id] = {
                name: data.title,
                children: _.map(data.children, (child) => {
                    return child.data.id;
                }),
                root: data.data.root
            };
            if (questionId && selectUnitId && selectUnitId === data.data.id) {
                instance.data[data.data.id].children.push(questionId);
            }
            if (questionId && selectUnitId && data.folder === false) {
                delete instance.data[data.data.id];
            }
            _.forEach(data.children, (collection) => {
                instance._toFlatObj(collection, questionId, selectUnitId);
            });
        }
        return instance.data;
    }

    fetchContentListDetails(req) {
        return this.publicDataService.post(req);
    }

    sort(a, b, column) {
        if (!this.isNotEmpty(a, column) || !this.isNotEmpty(b, column)) {
            return 1;
        }
        let aColumn = a[column];
        let bColumn = b[column];
        if (_.isArray(aColumn)) {
            aColumn = _.join(aColumn, ', ');
        }
        if (_.isArray(bColumn)) {
            bColumn = _.join(bColumn, ', ');
        }
        if (_.isNumber(aColumn)) {
            aColumn = _.toString(aColumn);
        }
        if (_.isNumber(bColumn)) {
            bColumn = _.toString(bColumn);
        }
        return bColumn.localeCompare(aColumn);
    }

    isNotEmpty(obj, key) {
        if (_.isNil(obj) || _.isNil(obj[key])) {
            return false;
        }
        return true;
    }

    // this method is used to keep count of contents added from library page
    contentsCountAddedInLibraryPage(setToZero?) {
        if (setToZero) {
            this.contentsCount = 0; // setting this count to zero  while going out from library page
        } else {
            this.contentsCount = this.contentsCount + 1;
        }
    }

    validateCSVFile(formData, collectionnId: any) {
        const url = _.get(this.configService.urlConFig, 'URLS.CSV.UPLOAD');
        const reqParam = {
            url: `${url}${collectionnId}`,
            data: formData.data
        };
        return this.publicDataService.post(reqParam);
    }

    downloadHierarchyCsv(collectionId) {
        const url = _.get(this.configService.urlConFig, 'URLS.CSV.DOWNLOAD');
        const req = {
            url: `${url}${collectionId}`,
        };
        return this.publicDataService.get(req);
    }

    downloadBlobUrlFile(config) {
        try {
            this.httpClient.get(config.blobUrl, {responseType: 'blob'})
                .subscribe(blob => {
                    const objectUrl: string = URL.createObjectURL(blob);
                    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
                    a.href = objectUrl;
                    a.download = config.fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(objectUrl);
                    if (config.successMessage) {
                        this.toasterService.success(config.successMessage);
                    }
                }, (error) => {
                    console.error(_.get(this.configService, 'labelConfig.messages.error.034') + error);
                });
        } catch (error) {
            console.error(_.replace(_.get(this.configService, 'labelConfig.messages.error.033'), '{FILE_TYPE}', config.fileType) + error);
        }
    }
}
