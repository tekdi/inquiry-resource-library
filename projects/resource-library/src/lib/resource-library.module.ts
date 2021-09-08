import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonFormElementsModule, DialcodeCursor } from 'common-form-elements-v9';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClientModule } from '@angular/common/http';
import { ResourceLibraryComponent } from './resource-library.component';
import { ContentplayerPageComponent } from './components/contentplayer-page/contentplayer-page.component';
import { HeaderComponent } from './components/header/header.component';
import { LibraryComponent } from './components/library/library.component';
import { LibraryFilterComponent } from './components/library-filter/library-filter.component';
import { LibraryListComponent } from './components/library-list/library-list.component';
import { LibraryPlayerComponent } from './components/library-player/library-player.component';
import { TemplateComponent } from './components/template/template.component';
import { ResourceReorderComponent } from './components/resource-reorder/resource-reorder.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { QumlplayerPageComponent } from './components/qumlplayer-page/qumlplayer-page.component';
import {SunbirdPdfPlayerModule} from '@project-sunbird/sunbird-pdf-player-v9';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v9';
import { QumlLibraryModule } from '@project-sunbird/sunbird-quml-player-v9';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import { TelemetryInteractDirective } from './directives/telemetry-interact/telemetry-interact.directive';
import { CacheService } from 'ng2-cache-service';
import { CacheStorageAbstract } from 'ng2-cache-service/dist/src/services/storage/cache-storage-abstract.service';
import { CacheSessionStorage } from 'ng2-cache-service/dist/src/services/storage/session-storage/cache-session-storage.service';
import { QumlPlayerComponent } from './components/quml-player/quml-player.component';
import { DialcodeComponent } from './components/dialcode/dialcode.component';
import { DialcodeService } from './services/dialcode/dialcode.service';
import { PublishChecklistComponent } from './components/publish-checklist/publish-checklist.component';
@NgModule({
  declarations: [ResourceLibraryComponent, ContentplayerPageComponent, QumlplayerPageComponent,
    HeaderComponent, LibraryComponent, LibraryFilterComponent, LibraryListComponent,
    LibraryPlayerComponent, ResourceReorderComponent, SkeletonLoaderComponent, TemplateComponent, TelemetryInteractDirective,
    QumlPlayerComponent, DialcodeComponent, PublishChecklistComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild([]), SuiModule,
  CommonFormElementsModule, InfiniteScrollModule, HttpClientModule, SunbirdPdfPlayerModule, SunbirdVideoPlayerModule,
  QumlLibraryModule, CarouselModule],
  providers: [
    CacheService,
    { provide: CacheStorageAbstract, useClass: CacheSessionStorage },
    { provide: DialcodeCursor, useExisting: DialcodeService }
  ],
  exports: []
})
export class ResourceLibraryModule { }
