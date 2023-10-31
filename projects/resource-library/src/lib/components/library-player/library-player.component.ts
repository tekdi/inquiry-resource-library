import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ConfigService} from '../../services/config/config.service';
import {EditorTelemetryService} from '../../services/telemetry/telemetry.service';
import {EditorService} from '../../services/editor/editor.service';
import * as _ from 'lodash-es';

@Component({
    selector: 'lib-library-player',
    templateUrl: './library-player.component.html',
    styleUrls: ['./library-player.component.scss']
})
export class LibraryPlayerComponent implements OnInit, OnChanges {
    @Input() collectionData;
    @Input() contentListDetails;
    @Input() metadataFormConfig;
    @Input() libraryLabels;
    public createdByField;
    public createdByValue;

    constructor(public telemetryService: EditorTelemetryService, public editorService: EditorService,
                public configService: ConfigService) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.createdByField = _.get(this.libraryLabels, 'createdByField');
        if(this.createdByField) {
            this.createdByValue = _.get(this.contentListDetails, this.createdByField);
        }
    }

}
