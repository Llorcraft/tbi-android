registerLocaleData(localeES);

import { HttpModule, Http } from '@angular/http';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import localeES from '@angular/common/locales/en';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, LoadingController } from 'ionic-angular';
import { TooltipsModule } from 'ionic-tooltips';

/*Pages*/
import { InitPage } from '../pages/init/init';
import { MyApp } from './app.component';
import { DownloadPage } from '../pages/download/download';
import { ContactPage } from '../pages/contact/contact';
import { ProjectReportsPage } from '../pages/home/home';
import { ProjectsPage } from '../pages/projects/projects';
import { EditProjectPage } from '../pages/projects/edit';
import { ProjectPage } from '../pages/projects/project';
import { SummaryPage } from '../pages/summary/summary';
import { SummaryEditPage } from '../pages/summary/summary-edit';

/*Plugins*/
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { FileTransfer } from '@ionic-native/file-transfer';

/*Services*/
import { ProjectService, LoadindService } from '../services';
import { ReportService } from '../services/report.service';
import { ComponentService } from '../services/component.service';
import { FileDeviceService } from '../services/file-device.service';
import { FileService } from '../services/file.service';
import { FileLocalService } from '../services/file-local.service';
import { MessageService } from '../services/messages.service';
import { PictureService } from '../services/picture.service';
import { LicencesService } from '../services/licences.service';
// import { ReportSafetSurfacePage } from '../pages/reports/safety/surface';

/*Custom Validators */
import { InsulatedCompareTempValidator } from '../validations';

/*Components*/
import { SvgInsulationComponent } from '../components/svg/svg-insulation.component';
import { SvgCO2Component } from '../components/svg/svg-co2.component';
import { SvgCustomComponent } from '../components/svg/svg-custom.component';
import { SvgSafetyComponent } from '../components/svg/svg-safety.component';
import { SvgMaintenanceComponent } from '../components/svg/svg-maintenance.component';
import { SvgFlangeComponent } from '../components/svg/svg-flange.component';
import { SvgHotSurfaceComponent } from '../components/svg/svg-hot-surface.component';
import { SvgFireProtectionComponent } from '../components/svg/svg-fire-protection.component';
import { SvgTrafficComponent } from '../components/svg/svg-traffic.component';
import { SvgDamageInsulationComponent } from '../components/svg/svg-damage-insulation.component';
import { SvgDamageCladdingComponent } from '../components/svg/svg-damage-cladding.component';
import { SvgIceWetComponent } from '../components/svg/svg-ice-wet.component';
import { SvgMechanicalComponent } from '../components/svg/svg-mechanical.component';
import { SvgElectricalComponent } from '../components/svg/svg-electrical.component';
import { SvgLeakageComponent } from '../components/svg/svg-leakage.component';
import { SvgOtherSafetyComponent } from '../components/svg/svg-other-safety.component';
import { SvgColdComponent } from '../components/svg/svg-cold.component';
import { SvgPipeInsultationComponent } from '../components/svg/svg-pipe-insulation.component';
import { SvgPipeComponent } from '../components/svg/svg-pipe.component';
import { SvgValveComponent } from '../components/svg/svg-valve.component';
import { SvgSurfaceComponent } from '../components/svg/svg-surface.component';
import { SvgDamagedCladdingComponent } from '../components/svg/svg-damaged-cladding.component';
import { SvgDamagedInsulationComponent } from '../components/svg/svg-damaged-insulation.component';
import { SvgEnergyComponent } from '../components/svg/svg-energy.component';
import { SvgInsulatedSurfaceComponent } from '../components/svg/svg-insulated-surface.component';
import { SvgOthersComponent } from '../components/svg/svg-others.component';
import { SvgInsulatedOthersComponent } from '../components/svg/svg-insulated-others.component';
import { SvgCilinderAreaComponent } from '../components/svg/svg-cilinder-area.component';
import { SvgCubeAreaComponent } from '../components/svg/svg-cube-area.component';
import { SvgCircleAreaComponent } from '../components/svg/svg-circle-area.component';
import { SvgHousekeepingComponent } from '../components/svg/svg-housekeeping.component';
import { SvgStructuralComponent } from '../components/svg/svg-structural.component';
import { SvgRectangleAreaComponent } from '../components/svg/svg-rectangle-area.component';
import { SvgLikeComponent } from '../components/svg/svg-like.component';
import { SvgIncreaseComponent } from '../components/svg/svg-increase.component';
import { SvgEmptyComponent } from '../components/svg/svg-empty.component';
//Reports

import {
  GenericReportPage,
  ReportHeaderComponent,
  ReportFooterComponent,
  ReportsPage,
  ReportSurfacePage,
  ReportAreaButtonComponent,
  ReportAreaModalComponent,
  ReportMoreButtonComponent,
  ReportErrorsComponent,
  ReportMediumTempButtonsComponent,
  ReportTempMarkersWindowComponent,
  ReportResultComponent,
  ReportPictureSlideComponent,
  ReportEditPictureComponent,
  ReportFlangePage,
  ReportPipePage,
  ReportValvePage,
  ReportInsulatedSurfacePage,
  ReportInsulatedPipePage,
  ReportDamagedPage,
  ReportCondensationPage,
  ReportLeakagePage,
  KnownTempPage,
  SurfaceMaterialComponent
} from '../pages/reports'

//Pipes
import { SurfaceMaterialPipe } from '../pipes/surface-material.pipe';

import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ToolsComponent } from '../components/tools/tools.component';
import { Flashlight } from '@ionic-native/flashlight';
import { SummaryHeaderComponent } from '../pages/summary/components/header';
import { CommonModule, registerLocaleData } from '@angular/common';
import { GlobalErrorHandler } from '../models/errors/global-error';
import { DisclaimerPage } from '../pages/disclaimer/disclaimer';
import { ReportPdfPage } from '../pages/reports/pdf/report-pdf.component';
import { SummaryReportPage } from '../pages/summary-report/summary-report';
import { PdfHeaderComponent } from '../components/pdf-header/pdf-header.component';

@NgModule({
  declarations: [
    MyApp,
    DownloadPage,
    ContactPage,
    ProjectReportsPage,
    ProjectsPage,
    EditProjectPage,
    ProjectPage,
    GenericReportPage,
    ReportsPage,
    InitPage,
    SummaryPage,
    SummaryReportPage,
    ReportPdfPage,
    SummaryEditPage,
    SummaryHeaderComponent,
    KnownTempPage,
    //Pipes
    SurfaceMaterialPipe,
    //Reports
    ReportEditPictureComponent,
    ReportPictureSlideComponent,
    ReportHeaderComponent,
    ReportFooterComponent,
    ReportAreaButtonComponent,
    ReportAreaModalComponent,
    ReportMoreButtonComponent,
    ReportMediumTempButtonsComponent,
    ReportTempMarkersWindowComponent,
    ReportErrorsComponent,
    ReportResultComponent,
    ReportSurfacePage,
    ReportInsulatedSurfacePage,
    ReportFlangePage,
    ReportPipePage,
    ReportInsulatedPipePage,
    ReportValvePage,
    ReportDamagedPage,
    ReportCondensationPage,
    ReportLeakagePage,
    DisclaimerPage,
    //Custom Validators
    InsulatedCompareTempValidator,
    //Components
    SurfaceMaterialComponent,
    ToolsComponent,
    PdfHeaderComponent,
    SvgEmptyComponent,
    SvgInsulationComponent,
    SvgCO2Component,
    SvgCustomComponent,
    SvgSafetyComponent,
    SvgMaintenanceComponent,
    SvgFlangeComponent,
    SvgHotSurfaceComponent,
    SvgFireProtectionComponent,
    SvgTrafficComponent,
    SvgDamageInsulationComponent,
    SvgDamageCladdingComponent,
    SvgMechanicalComponent,
    SvgElectricalComponent,
    SvgIceWetComponent,
    SvgLeakageComponent,
    SvgOtherSafetyComponent,
    SvgColdComponent,
    SvgPipeInsultationComponent,
    SvgPipeComponent,
    SvgValveComponent,
    SvgSurfaceComponent,
    SvgDamagedCladdingComponent,
    SvgDamagedInsulationComponent,
    SvgEnergyComponent,
    SvgInsulatedSurfaceComponent,
    SvgOthersComponent,
    SvgInsulatedOthersComponent,
    SvgCilinderAreaComponent,
    SvgCubeAreaComponent,
    SvgCircleAreaComponent,
    SvgRectangleAreaComponent,
    SvgHousekeepingComponent,
    SvgStructuralComponent,
    SvgLikeComponent,
    SvgIncreaseComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    IonicModule.forRoot(MyApp, {
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios-transition',
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: true
    }),
    TooltipsModule,
    PDFExportModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DownloadPage,
    ContactPage,
    ProjectReportsPage,
    ProjectsPage,
    EditProjectPage,
    ProjectPage,
    GenericReportPage,
    ReportsPage,
    InitPage,
    SummaryPage,
    SummaryReportPage,
    ReportPdfPage,
    SummaryEditPage,
    SummaryHeaderComponent,
    KnownTempPage,
    //Reports
    SurfaceMaterialComponent,
    ReportHeaderComponent,
    ReportFooterComponent,
    ReportAreaModalComponent,
    ReportTempMarkersWindowComponent,
    ReportSurfacePage,
    ReportInsulatedSurfacePage,
    ReportFlangePage,
    ReportPipePage,
    ReportInsulatedPipePage,
    ReportValvePage,
    ReportDamagedPage,
    ReportCondensationPage,
    ReportLeakagePage,
    DisclaimerPage,
    ToolsComponent,
    PdfHeaderComponent
  ],
  providers: [
    /*App services*/
    MessageService,
    ReportService,
    ProjectService,
    ComponentService,
    StatusBar,
    SplashScreen,
    FileOpener,
    FilePath,
    File,
    Camera,
    ScreenOrientation,
    //PictureLocalService,
    FileDeviceService,
    FileLocalService,
    FileChooser,
    UniqueDeviceID,
    FileTransfer,
    { provide: ErrorHandler, useClass: GlobalErrorHandler, deps: [MessageService, Http] },
    //{ provide: ErrorHandler, useClass: IonicErrorHandler },
    LicencesService,
    PictureService,
    Flashlight,
    LoadindService,
    LoadingController,
    { provide: LOCALE_ID, useValue: "en-US" },
    { provide: FileService, useClass: FileLocalService },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}

