import { Component, Input, OnInit , ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash-es';
import { ConfigService } from '../../services/config/config.service';
import { PlayerService } from '../../services/player/player.service';
import { EditorService } from '../../services/editor/editor.service';
@Component({
  selector: 'lib-quml-player',
  templateUrl: './quml-player.component.html',
  styleUrls: ['./quml-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QumlPlayerComponent implements OnInit {
  qumlPlayerConfig: any;
  @Input() questionSetHierarchy: any;
  @Input() collectionData: any;
  @Input() isSingleQuestionPreview = false;
  showPreview = false;
  constructor(private configService: ConfigService, private playerService: PlayerService,
    private editorService: EditorService ) { }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.setQumlPlayerData();
    this.showPreview = true;
  }

  setQumlPlayerData() {
    const playerConfig = _.cloneDeep(this.playerService.getQumlPlayerConfig());
    this.qumlPlayerConfig = playerConfig;
    this.qumlPlayerConfig.context.threshold = _.get(this.configService, 'playerConfig.threshold');
    this.qumlPlayerConfig.metadata = _.cloneDeep(this.collectionData);
    if (this.qumlPlayerConfig.metadata) {
      this.qumlPlayerConfig.metadata.childNodes = [ this.questionSetHierarchy.identifier ];
      this.qumlPlayerConfig.metadata.children = [ this.questionSetHierarchy ];
      if (this.isSingleQuestionPreview) {
        this.qumlPlayerConfig.context.threshold = 1;
        this.qumlPlayerConfig.metadata.maxQuestions = 1;
        this.qumlPlayerConfig.metadata.showStartPage = 'No';
        this.qumlPlayerConfig.metadata.showTimer = 'No';
        this.qumlPlayerConfig.metadata.requiresSubmit = 'No';
        this.qumlPlayerConfig.config.showLegend = false;
      }
    }
    console.log('qumlPlayerConfig:: ', this.qumlPlayerConfig);
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

}
