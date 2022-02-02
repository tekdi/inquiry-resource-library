import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {ConfigService} from '../../services/config/config.service';
import {EditorService} from '../../services/editor/editor.service';
import {EditorTelemetryService} from '../../services/telemetry/telemetry.service';

@Component({
    selector: 'lib-library-list',
    templateUrl: './library-list.component.html',
    styleUrls: ['./library-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LibraryListComponent implements OnInit {
    @Input() contentList;
    @Input() showAddedContent: any;
    @Output() onChangeEvent = new EventEmitter<any>();
    @Output() moveEvent = new EventEmitter<any>();
    @Input() selectedContent: any;
    @Input() selectedContentList: any[] = [];
    public sortContent = false;

    constructor(public editorService: EditorService, public telemetryService: EditorTelemetryService,
                public configService: ConfigService) {
    }

    ngOnInit() {
    }

    onContentChange(selectedContent: any) {
        this.onChangeEvent.emit({type: 'content', content: selectedContent});
    }

    changeFilter() {
        this.moveEvent.emit({
            action: 'showFilter'
        });
    }

    onShowAddedContentChange() {
        this.moveEvent.emit({
            action: 'showAddedContent',
            status: this.showAddedContent
        });
    }

    sortContentList() {
        this.sortContent = !this.sortContent;
        this.moveEvent.emit({
            action: 'sortContentList',
            status: this.sortContent
        });
    }

    selectContent(content) {
      const contentId = content.identifier
      const index = this.selectedContentList.indexOf(contentId);
      if (index === -1) {
        this.selectedContentList.push(contentId);
      }
      else {
        this.selectedContentList.splice(index, 1);
      }
      this.onChangeEvent.emit({
        type: 'contentList',
        contentList: this.selectedContentList,
        contentType: content.objectType
      });
    }

}
