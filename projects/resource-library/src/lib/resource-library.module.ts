import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonFormElementsModule} from '@project-sunbird/common-form-elements-full';
import {SuiModule} from 'ng2-semantic-ui-v9';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {HttpClientModule} from '@angular/common/http';
import {ResourceLibraryComponent} from './resource-library.component';
import {ContentPlayerPageComponent} from './components/content-player-page/content-player-page.component';
import {LibraryComponent} from './components/library/library.component';
import {LibraryFilterComponent} from './components/library-filter/library-filter.component';
import {LibraryListComponent} from './components/library-list/library-list.component';
import {LibraryPlayerComponent} from './components/library-player/library-player.component';
import {SkeletonLoaderComponent} from './components/skeleton-loader/skeleton-loader.component';
import {TelemetryInteractDirective} from './directives/telemetry-interact/telemetry-interact.directive';
import {QumlPlayerComponent} from './components/quml-player/quml-player.component';
import { InterpolatePipe } from './pipes/interpolate/interpolate.pipe';
import {QumlLibraryModule} from '@project-sunbird/sunbird-quml-player';
import {CarouselModule} from 'ngx-bootstrap/carousel';
@NgModule({
    declarations: [
        ResourceLibraryComponent, ContentPlayerPageComponent,
        LibraryComponent, LibraryFilterComponent, LibraryListComponent,
        LibraryPlayerComponent, SkeletonLoaderComponent, TelemetryInteractDirective,
        QumlPlayerComponent, InterpolatePipe
    ],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild([]), SuiModule,
        CommonFormElementsModule, InfiniteScrollModule, HttpClientModule, QumlLibraryModule, CarouselModule
    ],
    providers: [
    ],
    exports: [
        LibraryComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ResourceLibraryModule {
}
