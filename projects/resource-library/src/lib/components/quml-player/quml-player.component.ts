import { AfterViewInit, Component, ElementRef, Input, OnInit , ViewChild, ViewEncapsulation} from '@angular/core';
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
export class QumlPlayerComponent implements OnInit, AfterViewInit {
  qumlPlayerConfig: any;
  @Input() questionSetHierarchy: any;
  @Input() collectionData: any;
  @Input() isSingleQuestionPreview = false;
  showPreview = false;
  @ViewChild('qumlPlayer') qumlPlayer: ElementRef;
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
  }

  ngAfterViewInit() {
      (window as any).questionListUrl = `/api/${_.get(this.configService,'urlConFig.URLS.QUESTION.LIST')}`;
      const qumlElement = document.createElement('sunbird-quml-player');
      qumlElement.setAttribute('player-config', JSON.stringify(this.qumlPlayerConfig));

      qumlElement.addEventListener('playerEvent', this.getPlayerEvents);

      qumlElement.addEventListener('telemetryEvent', this.getTelemetryEvents);
      this.qumlPlayer.nativeElement.append(qumlElement);
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

}
