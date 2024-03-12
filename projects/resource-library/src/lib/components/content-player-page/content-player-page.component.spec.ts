import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContentPlayerPageComponent } from './content-player-page.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditorService } from '../../services/editor/editor.service';
import { PlayerService } from '../../services/player/player.service';
import { ConfigService } from '../../services/config/config.service';
import { mockData } from './content-player-page.component.spec.data';
import { of } from 'rxjs';
import * as _ from 'lodash-es';
describe('ContentPlayerPageComponent', () => {
  let component: ContentPlayerPageComponent;
  let fixture: ComponentFixture<ContentPlayerPageComponent>;
  const contentMetadata = {
    data: {
      metadata: {
        identifier: 'do_123',
        mimeType: 'application/pdf',
        objectType: 'content'
      }
    }
  };

  const questionMetadata = {
    data: {
      metadata: {
        identifier: 'do_12345',
        mimeType: 'application/vnd.sunbird.question',
        objectType: 'question'
      }
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ContentPlayerPageComponent ],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlayerPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should be called', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  })

  it('#ngOnChanges() should not call #getContentDetails method', () => {
    component.contentMetadata = contentMetadata;
    spyOn(component, 'ngOnChanges').and.callThrough();
    spyOn(component, 'getContentDetails').and.callFake(() => {});
    component.ngOnChanges();
    expect(component.getContentDetails).toHaveBeenCalledWith('content');
    
  });

  it('#ngOnChanges() should call #getContentDetails method', () => {
    component.contentMetadata = questionMetadata;
    spyOn(component, 'ngOnChanges').and.callThrough();
    spyOn(component, 'getContentDetails').and.callFake(() => {});
    component.ngOnChanges();
    expect(component.getContentDetails).toHaveBeenCalledWith('question');
  });

  it('#getContentDetails should fetch content details when API success', () => {
    spyOn(component, 'setContentLabelMapping').and.callFake(() => {});
    spyOn(component, 'getContentDetails').and.callThrough();
    const editorService = TestBed.get(EditorService);
    spyOn(editorService, 'getQuestionList').and.returnValue(of({result: { questions: [{ name: 'test' }]}}));
    component.contentId = 'do_1234';
    component.getContentDetails('question');
    expect(editorService.getQuestionList).toHaveBeenCalled();
  });

  it('#getContentDetails should fetch content details when API success', () => {
    spyOn(component, 'setContentLabelMapping').and.callFake(() => {});
    spyOn(component, 'getContentDetails').and.callThrough();
    const editorService = TestBed.get(EditorService);
    spyOn(editorService, 'fetchContentDetails').and.returnValue(of({result: { content: { name: 'test' }}}));
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'getPlayerConfig').and.returnValue({});
    spyOn(component, 'setPlayerType').and.callFake(() => {});
    spyOn(component, 'loadDefaultPlayer').and.callFake(() => {});
    component.contentId = 'do_1234';
    component.getContentDetails('content');
    expect(component.setPlayerType).toHaveBeenCalled();
    expect(component.loadDefaultPlayer).toHaveBeenCalled();
  });

  it('#setContentLabelMapping() should set content metadata field mapping', () => {
    component.metadataDetails = [];
    spyOn(component, 'setContentLabelMapping').and.callThrough();
    component.contentDetails = {
      contentId: mockData.subjectiveQuestion.identifier,
      contentData: mockData.subjectiveQuestion
    };
    component.metadataFormConfig = mockData.metadataFormConfig;
    component.setContentLabelMapping();
    expect(component.metadataDetails.length).toEqual(12);
  })


  it('#setPlayerType() should set #playerType to "pdf-player" ', () => {
    spyOn(component, 'setPlayerType').and.callThrough();
    component.contentDetails = {
      contentId: 'do_123',
      contentData: contentMetadata.data.metadata
    };
    component.setPlayerType();
    expect(component.playerType).toEqual('pdf-player');
  });

  it('#eventHandler() should get called', () => {
    spyOn(component, 'eventHandler').and.callThrough();
    component.eventHandler({});
    expect(component.eventHandler).toHaveBeenCalled();
  })

  it('#generateContentReadEvent() should get called', () => {
    spyOn(component, 'generateContentReadEvent').and.callThrough();
    component.generateContentReadEvent({});
    expect(component.generateContentReadEvent).toHaveBeenCalled();
  })
});
