import { DataService } from './../data/data.service';
import { TestBed } from '@angular/core/testing';
import { EditorService } from './editor.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { ConfigService } from '../config/config.service';
import * as urlConfig from '../../services/config/url.config.json';
import * as labelConfig from '../../services/config/label.config.json';
import * as editorConfig from '../../services/config/editor.config.json';
import * as categoryConfig from '../../services/config/category.config.json';
import { of } from 'rxjs';
import { PublicDataService } from '../public-data/public-data.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import * as mockData from './editor.service.spec.data';
import { map } from 'rxjs/operators';
import * as _ from 'lodash-es';

describe('EditorService', () => {
    let editorService: EditorService;
    const configStub = {
        urlConFig: (urlConfig as any).default,
        labelConfig: (labelConfig as any).default,
        categoryConfig: (categoryConfig as any).default,
        editorConfig: (editorConfig as any).default
    };
    const configServiceData = {
        labelConfig: {
            messages: {
                success: {
                    '011': 'File downloaded'
                },
            }
        },
        categoryConfig: {
            QuestionSet: 'questionSet'
        },
        urlConFig: {
            URLS: {
                questionSet: {
                    SYSYTEM_UPDATE: ''
                }
            }
        }
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [HttpClient,
                DataService,
                PublicDataService,
                { provide: ConfigService, useValue: configStub }]
        });
        editorService = TestBed.inject(EditorService);
        editorService.initialize(mockData.editorConfig);
    });

    it('should be created', () => {
        const service: EditorService = TestBed.inject(EditorService);
        expect(service).toBeTruthy();
    });

    it('#editorConfig Should return editor config', () => {
        expect(editorService.editorConfig).toBeTruthy();
    });

    it('#editorMode Should return valid mode', () => {
        expect(editorService.editorMode).toEqual('edit');
    });

    it('#emitshowLibraryPageEvent() Should emit event', () => {
        spyOn(editorService, 'emitshowLibraryPageEvent').and.callThrough();
        spyOn(editorService.showLibraryPage, 'emit').and.callFake(() => { });
        editorService.emitshowLibraryPageEvent('test');
        expect(editorService.showLibraryPage.emit).toHaveBeenCalled();
    });

    it('#getshowLibraryPageEmitter() should return #showLibraryPage event emitter object', () => {
        const result: EventEmitter<number> = editorService.getshowLibraryPageEmitter();
        expect(result).toBeTruthy();
    });

    it('#fetchCollectionHierarchy() should return collection hierarchy', async () => {
        const collectionId = 'do_11330102570702438417';
        const publicDataService = TestBed.inject(PublicDataService);
        spyOn(publicDataService, 'get').and.returnValue(of(mockData.serverResponse));
        editorService.fetchCollectionHierarchy(collectionId).subscribe(data => {
            expect(data.responseCode).toEqual('OK');
        });
    });

    it('#fetchContentDetails() should return content details', async () => {
        spyOn(editorService, 'fetchContentDetails').and.callThrough();
        const contentId = 'do_113297001817145344190';
        const publicDataService = TestBed.inject(PublicDataService);
        spyOn(publicDataService, 'get').and.returnValue(of(mockData.serverResponse));
        editorService.fetchContentDetails(contentId, 'content');
        expect(publicDataService.get).toHaveBeenCalledOnceWith({ url: `content/v3/read/${contentId}` });
    });

    it('#fetchContentDetails() should return question details', async () => {
        spyOn(editorService, 'fetchContentDetails').and.callThrough();
        const contentId = 'do_113297001817145344190';
        const publicDataService = TestBed.inject(PublicDataService);
        spyOn(publicDataService, 'get').and.returnValue(of(mockData.serverResponse));
        editorService.fetchContentDetails(contentId, 'question');
        expect(publicDataService.get).toHaveBeenCalledOnceWith({ url: `question/v1/read/${contentId}` });
    });

    it('#submitRequestChanges() should submit change request', async () => {
        const contentId = 'do_11326714211239526417';
        const comment = 'No appropriate description'
        const publicDataService = TestBed.inject(PublicDataService);
        spyOn(publicDataService, 'post').and.returnValue(of(mockData.serverResponse));
        editorService.submitRequestChanges(contentId, comment).subscribe(data => {
            expect(data.responseCode).toEqual('OK');
        });
    });

    it('#publish() Should emit question event', () => {
        spyOn(editorService.questionStream$, 'next').and.callThrough();
        editorService.publish('test');
        expect(editorService.questionStream$.next).toHaveBeenCalledOnceWith('test');
    });

    it('#calculateMaxScore should return calculated maxScore as 2', () => {
        spyOn(editorService, 'calculateMaxScore').and.callThrough();
        const questions = [{
            responseDeclaration: {
                response1: {
                    maxScore: 2
                }
            },
            primaryCategory: 'Multiple Choice Question'
        }];
        const maxScore = editorService.calculateMaxScore(questions);
        expect(maxScore).toEqual(2);
    });

    it('#calculateMaxScore should return calculated maxScore as default', () => {
        spyOn(editorService, 'calculateMaxScore').and.callThrough();
        const questions = [{
            primaryCategory: 'Multiple Choice Question'
        }];
        const maxScore = editorService.calculateMaxScore(questions);
        expect(maxScore).toEqual(1);
    });


    it('#fetchContentListDetails() should return content list', async () => {
        spyOn(editorService, 'fetchContentListDetails').and.callThrough();
        const publicDataService = TestBed.inject(PublicDataService);
        spyOn(publicDataService, 'post').and.returnValue(of(mockData.serverResponse));
        editorService.fetchContentListDetails({});
    });

    it('#isNotEmpty Should return #true when obj value is not empty', () => {
        const result = editorService.isNotEmpty({ name: 'test' }, 'name')
        expect(result).toBeTrue();
    });

    it('#isNotEmpty Should return #false when obj value is empty', () => {
        const result = editorService.isNotEmpty({ name: 'test' }, 'status')
        expect(result).toBeFalse();
    });

    it('#contentsCountAddedInLibraryPage() should increase value of contentsCount', () => {
        const service: EditorService = TestBed.inject(EditorService);
        service.contentsCount = 0;
        service.contentsCountAddedInLibraryPage(undefined);
        expect(service.contentsCount).toBe(1);
    });

    it('#contentsCountAddedInLibraryPage() should set value of contentsCount to zero', () => {
        const service: EditorService = TestBed.inject(EditorService);
        service.contentsCount = 2;
        service.contentsCountAddedInLibraryPage(true);
        expect(service.contentsCount).toBe(0);
    });

    it('#validateCSVFile() should validateCSVFile', async () => {
        const publicDataService: PublicDataService = TestBed.inject(PublicDataService);
        const file = new File([''], 'filename', { type: 'csv/text' });
        const event = {
            target: {
                files: [
                    file
                ]
            }
        };
        spyOn(publicDataService, 'post').and.returnValue(of({
            id: 'api.collection.import',
            ver: '4.0',
            ts: '2021-07-05T08:28:06ZZ',
            params: {
                resmsgid: 'f151855b-98fd-4baf-b8dc-00c31cc47b71',
                msgid: null,
                err: 'INVALID_CSV_FILE',
                status: 'failed',
                errmsg: 'Please provide valid csv file. Please check for data columns without headers.'
            },
            responseCode: 'CLIENT_ERROR',
            result: {
                messages: null
            }
        }));
        editorService.validateCSVFile(event.target.files[0], 'do_113312173590659072160').subscribe(data => {
        },
            error => {
                expect(error.error.responseCode).toBe('CLIENT_ERROR');

            });
    });

    it('#downloadHierarchyCsv() should downloadHierarchyCsv', async () => {
        const publicDataService: PublicDataService = TestBed.inject(PublicDataService);
        spyOn(publicDataService, 'get').and.returnValue(of({
            id: 'api.collection.export',
            ver: '4.0',
            ts: '2021-07-05T07:43:10ZZ',
            params: {
                resmsgid: 'd54936f9-9f9a-449a-a797-5564d5a97c6c',
                msgid: null,
                err: null,
                status: 'successful',
                errmsg: null
            },
            responseCode: 'OK',
            result: {
                collection: {
                    // tslint:disable-next-line:max-line-length
                    tocUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/textbook/toc/do_113312173590659072160_dev-testing-1_1625022971409.csv',
                    ttl: '54000'
                }
            }
        }));
        editorService.downloadHierarchyCsv('do_113312173590659072160').subscribe(data => {
            expect(data.responseCode).toBe('OK');
        });
    });

    it('#downloadBlobUrlFile() should download the file', () => {
        const service: EditorService = TestBed.inject(EditorService);
        const httpClient = TestBed.inject(HttpClient);
        const toasterService = TestBed.inject(ToasterService);
        spyOn(toasterService, 'success').and.callFake(() => { });
        const downloadConfig = {
            // tslint:disable-next-line:max-line-length
            blobUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/textbook/toc/do_113312173590659072160_dev-testing-1_1625022971409.csv',
            successMessage: 'File downloaded',
            fileType: 'csv',
            fileName: 'do_113312173590659072160'
        };
        spyOn(httpClient, 'get').and.returnValue(of(new Blob([downloadConfig.blobUrl], {})));
        spyOn(service, 'downloadBlobUrlFile').and.callThrough();
        service.downloadBlobUrlFile(downloadConfig);
        expect(httpClient.get).toHaveBeenCalled();
        expect(toasterService.success).toHaveBeenCalledWith(configServiceData.labelConfig.messages.success['011']);
    });
    it('#downloadBlobUrlFile() should download the file and dose not show toaster message', () => {
        const service: EditorService = TestBed.inject(EditorService);
        const http = TestBed.inject(HttpClient);
        const toasterService = TestBed.inject(ToasterService);
        spyOn(toasterService, 'success').and.callThrough();
        const downloadConfig = {
            // tslint:disable-next-line:max-line-length
            blobUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/textbook/toc/do_113312173590659072160_dev-testing-1_1625022971409.csv',
            successMessage: false,
            fileType: 'csv',
            fileName: 'do_113312173590659072160'
        };
        spyOn(http, 'get').and.returnValue(of(new Blob([downloadConfig.blobUrl], {})));
        spyOn(service, 'downloadBlobUrlFile').and.callThrough();
        service.downloadBlobUrlFile(downloadConfig);
        expect(http.get).toHaveBeenCalled();
        expect(http.get).toHaveBeenCalledTimes(1);
        expect(http.get).toHaveBeenCalled();
        expect(toasterService.success).not.toHaveBeenCalledWith(configServiceData.labelConfig.messages.success['011']);
    });

});
