import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {ConfigService} from '../../services/config/config.service';
import {EditorService} from '../../services/editor/editor.service';
import {EditorTelemetryService} from '../../services/telemetry/telemetry.service';
import {ToasterService} from '../../services/toaster/toaster.service';
import * as _ from 'lodash-es';
@Component({
    selector: 'lib-library-list',
    templateUrl: './library-list.component.html',
    styleUrls: ['./library-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LibraryListComponent implements OnInit {
    @Input() contentList: any;
    @Input() showAddedContent: any;
    @Output() onChangeEvent = new EventEmitter<any>();
    @Output() moveEvent = new EventEmitter<any>();
    @Output() addContentEvent = new EventEmitter<any>();
    @Input() selectedContent: any;
    @Input() selectedContentList: any[] = [];
    @Input() existingContentCounts: number;
    @Input() libraryLabels;
    public sortContent = false;
    hasMaxQuestionLimit = false;
    public createdByField;

    constructor(public editorService: EditorService, public telemetryService: EditorTelemetryService,
                public configService: ConfigService, private toasterService: ToasterService) {
    }

    ngOnInit() {
        if (_.has(this.editorService.editorConfig, 'config.questionSet.maxQuestionsLimit')) {
            this.hasMaxQuestionLimit = true;
        }
        if (_.get(this.libraryLabels, 'createdByField')) {
            this.createdByField = this.libraryLabels.createdByField;
        }
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
        if (this.hasMaxQuestionLimit) {
            if (!this.checkIfContentsCanbeAdded()) {
                this.addContentEvent.emit({action: 'disableAddContent'});
            } else {
                this.addContentEvent.emit({action: 'enableAddContent'});
            }
        }
      }

    checkIfContentsCanbeAdded(){
        const config = {
            errorMessage: '',
            maxLimit: 0
        };
        if (_.get(this.editorService.editorConfig, 'config.objectType') === 'QuestionSet') {
            config.errorMessage = _.get(this.configService, 'labelConfig.messages.error.035');
            config.maxLimit = _.get(this.editorService.editorConfig, 'config.questionSet.maxQuestionsLimit');
            const childrenCount = this.existingContentCounts + this.selectedContentList.length;
            if (childrenCount > config.maxLimit) {
                this.toasterService.error(config.errorMessage);
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
}
