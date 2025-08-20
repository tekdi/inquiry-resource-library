import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LibraryFilterComponent } from './library-filter.component';
import { FormsModule } from '@angular/forms';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from '@project-sunbird/ng2-semantic-ui';
import * as $ from 'jquery';
import 'jquery.fancytree';
import { EditorService } from '../../services/editor/editor.service';
import { By } from '@angular/platform-browser';
import { mockData } from './library-filter.component.spec.data';
import { FrameworkService } from '../../services/framework/framework.service';

const mockEditorService = {
  editorConfig: {
    config: {
      hierarchy: {
        level1: {
          name: 'Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {}
        }
      }
    }
  }
};

describe('LibraryFilterComponent', () => {
  let component: LibraryFilterComponent;
  let fixture: ComponentFixture<LibraryFilterComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [EditorTelemetryService, { provide: Router, useClass: RouterStub },
        { provide: EditorService, useValue: mockEditorService }],
     declarations: [LibraryFilterComponent, TelemetryInteractDirective],
     imports: [FormsModule, HttpClientTestingModule, SuiModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryFilterComponent);
    component = fixture.componentInstance;
  });

  it('#isFilterShow should be false by default', () => {
    expect(component.isFilterShow).toBeFalsy()
  });

  it('#ngOnInit should call method #setFilterDefaultValues', () => {
    component.searchFormConfig = [{
      "code": "primaryCategory",
      "dataType": "list",
      "description": "Type",
      "editable": true,
      "default": [],
      "renderingHints": {
        "class": "sb-g-col-lg-1"
      },
      "inputType": "nestedselect",
      "label": "Question Type(s)",
      "name": "Type",
      "placeholder": "Select QuestionType",
      "required": false,
      "visible": true
    }]
    spyOn(component, 'setFilterDefaultValues').and.callFake(() => {});
    spyOn(component, 'fetchFrameWorkDetails').and.callFake(() => {});
    component.ngOnInit();
    expect(component.filterFields).toBeDefined();
    expect(component.setFilterDefaultValues).toHaveBeenCalled();
    expect(component.fetchFrameWorkDetails).toHaveBeenCalled();
  });

  it('#setFilterDefaultValues() should set default values', () => {
    component.filterFields = [{
      "code": "primaryCategory",
      "dataType": "list",
      "description": "Type",
      "editable": true,
      "default": [],
      "renderingHints": {
        "class": "sb-g-col-lg-1"
      },
      "inputType": "nestedselect",
      "label": "Question Type(s)",
      "name": "Type",
      "placeholder": "Select QuestionType",
      "required": false,
      "visible": true
    }];
    component.filterValues = {primaryCategory: ['Multiple Choice Question']}
    spyOn(component, 'setFilterDefaultValues').and.callThrough();
    component.setFilterDefaultValues();
    expect(component.filterFields[0].default.length).toEqual(1);
  });

  it('#ngOnChanges() should set isFilterShow value', () => {
    spyOn(component, 'setFilterDefaultValues').and.callFake(() => {});
    component.isFilterShow = false;
    component.filterOpenStatus  = true;
    component.ngOnChanges();
    expect(component.isFilterShow).toBeTruthy();
    expect(component.setFilterDefaultValues).toHaveBeenCalled();
  });

  it('#fetchFrameWorkDetails() should set fetchFrameWorkDetails and for targetFrameworkIds', () => {
    component.frameworkId = 'inquiry_k-12';
    component.frameworkService.organisationFramework = 'inquiry_k-12';
    component.frameworkService.targetFrameworkIds = 'inquiry_k-12';
    component.frameworkDetails = mockData.frameWorkDetails;
    spyOn(component, 'fetchFrameWorkDetails').and.callThrough();
    spyOn(component, 'populateFilters').and.callFake(() => {});
    component.fetchFrameWorkDetails();
    expect(component.frameworkDetails).toBeDefined();
  });

  it('#populateFilters() should set the filterConfig', () => {
    component.filterConfig = [];
    component.frameworkDetails = {frameworkData: mockData.frameWorkDetails.frameworkData.categories};
    component.filterFields = mockData.searchConfig;
    spyOn(component, 'populateFilters').and.callThrough();
    component.populateFilters();
    expect(component.filterConfig.length).toEqual(1);
  });

  it('#onQueryEnter should call method #emitApplyFilter', () => {
    spyOn(component, 'emitApplyFilter').and.callFake(() => {});
    component.onQueryEnter({});
    expect(component.emitApplyFilter).toHaveBeenCalled();
  });

  it('#showfilter should toggle #isFilterShow', () => {
    component.showfilter();
    expect(component.isFilterShow).toBe(true, 'on after first click');
    component.showfilter();
    expect(component.isFilterShow).toBe(false, 'on after second click');
  });

  it('#showfilter should emit #filterChangeEvent event', () => {
    spyOn(component.filterChangeEvent, 'emit');
    component.showfilter();
    expect(component.filterChangeEvent.emit).toHaveBeenCalled();
  });

  it('#onQueryEnter should return false', () => {
    spyOn(component, 'onQueryEnter').and.callThrough();
    let result = component.onQueryEnter({});
    expect(result).toBe(false)
  });

  it('#resetFilter should remove filters values and call method #emitApplyFilter', () => {
    component.filterFields = mockData.searchConfig;
    component.targetPrimaryCategories = ['Multiple Choice Question']
    spyOn(component, 'emitApplyFilter').and.callFake(() => {});
    spyOn(component, 'setFilterDefaultValues').and.callFake(() => {});
    spyOn(component, 'resetFilter').and.callThrough();
    component.resetFilter();
    expect(component.searchQuery).toEqual('');
    expect(component.setFilterDefaultValues).toHaveBeenCalled();
    expect(component.emitApplyFilter).toHaveBeenCalled();
  });

  it('#applyFilter should call method #emitApplyFilter', () => {
    spyOn(component, 'emitApplyFilter').and.callFake(() => {});
    component.applyFilter();
    expect(component.emitApplyFilter).toHaveBeenCalled();
  });

  it('#emitApplyFilter should call #emit event', () => {
    component.filterValues = {board: ['CBSE']};
    component.searchQuery = 'test content';
    spyOn(component.filterChangeEvent, 'emit').and.callFake(() => {});
    component.emitApplyFilter();
    expect(component.filterChangeEvent.emit).toHaveBeenCalled();
  });

   it('#outputData() should call outputData', () => {
    spyOn(component, 'outputData');
    component.outputData('');
    expect(component.outputData).toHaveBeenCalled();
  });

  it('#onStatusChanges() should call on form value changes', () => {
    spyOn(component, 'onStatusChanges');
    component.onStatusChanges('');
    expect(component.onStatusChanges).toHaveBeenCalled();
  });

  it('#valueChanges should set value in #filterValues', () => {
    spyOn(component, 'valueChanges').and.callThrough();
    component.valueChanges({});
    expect(component.filterValues).toBeDefined();
  });
});