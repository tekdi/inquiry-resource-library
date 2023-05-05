import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SkeletonLoaderComponent } from './skeleton-loader.component';

describe('SkeletonLoaderComponent', () => {
  let component: SkeletonLoaderComponent;
  let fixture: ComponentFixture<SkeletonLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ SkeletonLoaderComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonLoaderComponent);
    component = fixture.componentInstance;
    component.height = '10px';
    component.width  = '80%';
    component.mTop = '5px';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should set the skeletonStyles with input values', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.skeletonStyles).toBeDefined();
    expect(component.skeletonStyles['height']).toBe('10px');
    expect(component.skeletonStyles['width']).toBe('80%');
    expect(component.skeletonStyles['margin-top']).toBe('5px');
  });

  it('ngOnInit should set the skeletonStyles with default values', () => {
    component.height = undefined;
    component.width = undefined;
    component.mTop = undefined;
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.skeletonStyles).toBeDefined();
    expect(component.skeletonStyles['height']).toBe('8px');
    expect(component.skeletonStyles['width']).toBe('100%');
    expect(component.skeletonStyles['margin-top']).toBe('0');
  });
});
