import { TestBed } from '@angular/core/testing';
import { HelperService } from './helper.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PublicDataService } from '../public-data/public-data.service';
import * as mockData from './helper.service.spec.data';
import { DataService } from './../data/data.service';
import { ConfigService } from '../config/config.service';
import * as urlConfig from '../../services/config/url.config.json';
import * as labelConfig from '../../services/config/label.config.json';
import * as editorConfig from '../../services/config/editor.config.json';
import * as _ from 'lodash-es';
import { of, throwError } from 'rxjs';

describe('HelperService', () => {
    let helperService: HelperService;
    let publicDataService: PublicDataService;
    const configStub = {
        urlConFig: (urlConfig as any).default,
        labelConfig: (labelConfig as any).default,
        editorConfig: (editorConfig as any).default
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [HttpClient, DataService, PublicDataService, { provide: ConfigService, useValue: configStub }]
        });
        helperService = TestBed.inject(HelperService);
        publicDataService = TestBed.inject(PublicDataService);
        spyOn(publicDataService, 'post').and.returnValue(of(mockData.licenseMockResponse));
        const dataService = TestBed.inject(DataService);
        spyOn(dataService, 'get').and.returnValue(of(mockData.channelMockResponse));
    });

    it('should be created', () => {
        const service: HelperService = TestBed.inject(HelperService);
        expect(service).toBeTruthy();
    });

    it('#initialize should emit the channel data', () => {
        helperService.initialize('01309282781705830427');
        helperService.channelData$.subscribe((data) => {
            expect(data).toEqual({err: null, channelData: mockData.channelMockResponse.result.channel})
        });
    });

    it('#channelPrimaryCategories should return channel primary catregory', () => {
        helperService.initialize('01309282781705830427');
        console.log(helperService.channelPrimaryCategories);
        expect(helperService.channelPrimaryCategories).toEqual(mockData.channelMockResponse.result.channel.primaryCategories);
    });

    it('#contentPrimaryCategories should return contentPrimaryCategories group by #targetObjectType', () => {
        helperService.initialize('01309282781705830427')        
        expect(helperService.contentPrimaryCategories).toBeTruthy();
    });

    it('#contentPrimaryCategories should not return contentPrimaryCategories when content not exist', () => {        
        expect(helperService.contentPrimaryCategories).toEqual([]);
    });

    it('#questionPrimaryCategories should return questionPrimaryCategories group by #targetObjectType', () => {
        helperService.initialize('01309282781705830427');
        expect(helperService.questionPrimaryCategories).toBeTruthy();
    });

    it('#questionPrimaryCategories should not return questionPrimaryCategorieswhen content not exist', () => {
        expect(helperService.questionPrimaryCategories).toEqual([]);
    });


    it('#collectionPrimaryCategories should return collectionPrimaryCategories group by #targetObjectType', () => {
        helperService.initialize('01309282781705830427');
        expect(helperService.collectionPrimaryCategories).toBeTruthy();
    });

    it('#getLicenses() should return list of licenses when API success ', async () => {
        helperService.getLicenses().subscribe(data => {
            expect(data).toEqual(mockData.licenseMockResponse.result);
        });
    });

    it('#getLicenses() should throw error when API failed ', async () => {
        publicDataService.post = jasmine.createSpy().and.returnValue(throwError({}));
        helperService.getLicenses().subscribe(data => {
        }, err => {
            expect(err).toEqual({errorMsg: 'search failed'});
        });
    });

    it('#getAvailableLicenses should return license', () => {
        helperService.initialize('01309282781705830427');
        const expectResult = helperService.getAvailableLicenses();
        expect(expectResult).toEqual(mockData.licenseMockResponse.result.license);
    });

    it('#getChannelData() should make API call if data not cached', async () => {
        helperService.getChannelData('01309282781705830427').subscribe(data => {
            expect(data).toEqual(mockData.channelMockResponse.result.channel);
        });
    });

    it('#getChannelData() should not make API call if data is cached', async () => {
        const mockLocalStorage = {
            getItem: (key: string): any => {
              return mockData.channelMockResponse.result.channel;
            }
        };
        spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
        spyOn(publicDataService, 'get').and.callThrough();
        helperService.getChannelData('01309282781705830427').subscribe(data => {
            expect(data).toEqual(mockData.channelMockResponse.result.channel);
            expect(publicDataService.get).not.toHaveBeenCalled();
        });
    });

    it('#channelData() should return contentPrimaryCategories', () => {
        helperService.initialize('01309282781705830427');
        expect(helperService.channelData).toBeTruthy();
    });


    it('#getAllUser() should return users data', async () => {
        helperService.getAllUser({request: {}}).subscribe(data => {
            expect(data).toBeTruthy();
        });
    });

});
