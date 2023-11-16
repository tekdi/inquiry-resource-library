import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LibraryPlayerComponent } from './library-player.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LibraryPlayerComponent', () => {
  let component: LibraryPlayerComponent;
  let fixture: ComponentFixture<LibraryPlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ LibraryPlayerComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryPlayerComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    component.collectionData = {name: 'Test'};
    component.contentListDetails = [{name: 'Test'}];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input values', () => {
    expect(component.collectionData).toBeDefined();
    expect(component.contentListDetails).toBeDefined();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  })

  it('should call ngOnChanges', () => {
    component.createdByValue = '';
    component.libraryLabels = {createdByField: 'board'};
    component.contentListDetails = {board: 'CBSE'};
    spyOn(component, 'ngOnChanges').and.callThrough();
    component.ngOnChanges();
    expect(component.createdByValue).toBe('CBSE');

  })
});
