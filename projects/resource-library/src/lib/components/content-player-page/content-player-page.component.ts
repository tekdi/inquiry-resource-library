import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash-es';
import { EditorService } from '../../services/editor/editor.service';
import { PlayerService } from '../../services/player/player.service';
import { ConfigService } from '../../services/config/config.service';
declare var $: any;

@Component({
  selector: 'lib-contentplayer-page',
  templateUrl: './content-player-page.component.html',
  styleUrls: ['./content-player-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentPlayerPageComponent implements OnInit, OnChanges {
  @ViewChild('contentIframe') contentIframe: ElementRef;
  @ViewChild('pdfPLayer') pdfPlayer: ElementRef;
  @ViewChild('videoPlayer') videoPlayer: ElementRef;

  @Input() contentMetadata: any;
  @Input() collectionData: any;
  @Input() metadataFormConfig: any;
  public contentDetails: any;
  public playerConfig: any;
  public content: any;
  public playerType: string;
  public contentId: string;
  public metadataDetails = [];

  constructor(private editorService: EditorService, private playerService: PlayerService,
    public configService: ConfigService) { }

  ngOnInit() { }

  ngOnChanges() {
    this.contentMetadata = _.get(this.contentMetadata, 'data.metadata') || this.contentMetadata;
    if (this.contentId !== this.contentMetadata.identifier) {
      this.contentId = this.contentMetadata.identifier;
      if ((this.contentMetadata?.objectType).toLowerCase() === 'question') {
        this.getContentDetails('question');
      } else {
        this.getContentDetails('content');
      }
    }
  }

  getContentDetails(objectType) {
    this.playerType = 'default-player';
    this.contentDetails = {
      contentId: this.contentId,
      contentData: {}
    };
    if (objectType === 'question') {
      this.editorService.getQuestionList(this.contentId).subscribe(res => {
        this.contentDetails.contentData = res.result.questions[0];
        this.playerType = 'quml'
        this.setContentLabelMapping();
      })
    } else if(objectType === 'content') {
      this.editorService.fetchContentDetails(this.contentId, objectType).subscribe(res => {
        this.contentDetails.contentData = _.get(res, 'result.content');
        this.playerConfig = this.playerService.getPlayerConfig(this.contentDetails);
        this.setPlayerType();
        if (this.playerType === 'default-player') {
          this.loadDefaultPlayer();
        } else {
          this.playerConfig.config = {};
          this.loadNewPlayer();
        }
        this.setContentLabelMapping()
      })
    }
  }

  setContentLabelMapping() {
    this.metadataDetails = [];
    const fieldsProperties = this.metadataFormConfig.properties;
    _.forEach(fieldsProperties, (field) => {
      if (_.has(this.contentDetails.contentData, field.code)) {
        this.metadataDetails.push(
          {
            code: field.code,
            label: field.label,
            value: _.get(this.contentDetails.contentData, field.code)
        })
      } else {
        this.metadataDetails.push(
          {
            code: field.code,
            label: field.label,
            value: ''
          });
      }
    });
  }

  setPlayerType() {
    const playerType = _.get(this.configService.playerConfig, 'playerType');
    _.forIn(playerType, (value, key) => {
      if (value.length) {
        if (_.includes(value, _.get(this.contentDetails, 'contentData.mimeType'))) {
          this.playerType = key;
        }
      }
    });

    if (_.get(this.contentDetails, 'contentData.mimeType') === 'application/vnd.sunbird.question') {
      this.playerType = 'quml';
    }
  }

  loadDefaultPlayer() {
    // const iFrameSrc = this.configService.appConfig.PLAYER_CONFIG.baseURL + '&build_number=' + this.buildNumber;
    const iFrameSrc = `/content/preview/preview.html?webview=true&build_number=2.8.0.e552fcd`;
    setTimeout(() => {
      const playerElement = this.contentIframe.nativeElement;
      playerElement.src = iFrameSrc;
      playerElement.onload = (event) => {
        try {
          this.adjustPlayerHeight();
          playerElement.contentWindow.initializePreview(this.playerConfig);
        } catch (err) {
          console.log('loading default player failed', err);
        }
      };
    }, 0);
  }

  loadNewPlayer() {
    setTimeout(() => {
      if (this.playerType == "pdf-player") {

        const pdfElement = document.createElement('sunbird-pdf-player');
        pdfElement.setAttribute('player-config', JSON.stringify(this.playerConfig));
        pdfElement.addEventListener('playerEvent', this.eventHandler);
        pdfElement.addEventListener('telemetryEvent', this.generateContentReadEvent);
        this.pdfPlayer.nativeElement.append(pdfElement);

      } else if (this.playerType == "video-player") {

        const videoElement = document.createElement('sunbird-video-player');
        videoElement.setAttribute('player-config', JSON.stringify(this.playerConfig));
        videoElement.addEventListener('playerEvent', this.eventHandler);
        videoElement.addEventListener('telemetryEvent', this.generateContentReadEvent);
        this.videoPlayer.nativeElement.append(videoElement);

      }
    }, 500);
  }

  /**
   * Adjust player height after load
   */
  adjustPlayerHeight() {
    const playerWidth = $('#contentPlayer').width();
    if (playerWidth) {
      const height = playerWidth * (9 / 16);
      $('#contentPlayer').css('height', height + 'px');
    }
  }

  eventHandler(e) { }

  generateContentReadEvent(e) { }
}
