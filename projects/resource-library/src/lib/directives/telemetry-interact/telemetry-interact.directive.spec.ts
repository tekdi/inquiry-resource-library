import { TelemetryInteractDirective } from './telemetry-interact.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {  Component, ViewChild } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service'

const telemetryInteractEdata = {
    id: 'change_filter',
    type: 'click',
    subtype: 'launch',
    pageid : 'library'
};

@Component({
  template: `<button libTelemetryInteract
            [telemetryInteractEdata]="telemetryInteractEdata"
  class="ui primary button">Change Filters</button>`
})
class TestDirectiveComponent {
  @ViewChild(TelemetryInteractDirective) appTelemetryInteract: TelemetryInteractDirective;
  telemetryInteractEdata = telemetryInteractEdata;
  constructor() {
  }
}
describe('TelemetryInteractDirective', () => {
    let component: TestDirectiveComponent;
    let fixture: ComponentFixture<TestDirectiveComponent>;
    let inputEl: HTMLElement;


    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TestDirectiveComponent, TelemetryInteractDirective],
        providers: [{ provide: EditorTelemetryService }]
      });
      fixture = TestBed.createComponent(TestDirectiveComponent);
      component = fixture.componentInstance;
      inputEl = fixture.nativeElement.querySelector('button');
    });

    it('Should generate telemetry #click event', () => {
      const telemetryService = TestBed.inject(EditorTelemetryService)
      spyOn(telemetryService, 'interact').and.callThrough();
      fixture.detectChanges();
      inputEl.click();
      fixture.detectChanges();
      expect(component.appTelemetryInteract.telemetryInteractEdata).toEqual(telemetryInteractEdata);
      expect(component.appTelemetryInteract.appTelemetryInteractData).toEqual({
        edata: telemetryInteractEdata
      });
      expect(telemetryService.interact).toHaveBeenCalledOnceWith({
        edata: telemetryInteractEdata
      });
    });
});