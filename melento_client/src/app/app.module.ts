import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { AdminComponent } from './components/admin/admin.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { AddCourseComponent } from './components/course/add-course/add-course.component';
import { AddAssessmentComponent } from './components/assessment/add-assessment/add-assessment.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';
import { UpdateCourseComponent } from './components/course/update-course/update-course.component';
//Angular Material Module Imports
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ViewUserComponent } from './components/user/view-user/view-user.component';
import { ViewAssessmentDetailsComponent } from './components/view-assessment-details/view-assessment-details.component';
import { CartComponent } from './components/cart/cart.component';
import { ViewCourseComponent } from './components/course/view-course/view-course.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ViewAssessmentComponent } from './components/assessment/view-assessment/view-assessment.component';
import { TruncatePipe } from './pipe/truncate.pipe';
import { TestScreenComponent } from './components/test-screen/test-screen.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { ViewCategoryComponent } from './components/category/view-category/view-category.component';
import { UpdateCategoryComponent } from './components/category/update-category/update-category.component';
import { UpdateAssessmentComponent } from './components/assessment/update-assessment/update-assessment.component';
import { ResultScreenComponent } from './components/dashboard/result-screen/result-screen.component';
import { FormArray } from '@angular/forms';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SearchPipe } from './pipe/search.pipe';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ReportComponent } from './components/admin/report/report.component';
import { AttendanceComponent } from './components/admin/attendance/attendance.component';
import { RouterModule } from '@angular/router';
import { ViewAssessmentScoreComponent } from './components/AssessmentScore/view-assessment-score/view-assessment-score.component';
import { UpdateAssessmentScoreComponent } from './components/AssessmentScore/update-assessment-score/update-assessment-score.component';
import { AttendanceScreenComponent } from './components/dashboard/attendance-screen/attendance-screen.component';
import { AssessmentPlotComponent } from './components/assessment-plot/assessment-plot.component';
import { DisableAssessmentsComponent } from './components/dashboard/disable-assessments/disable-assessments.component';
import { Document, Packer, Paragraph, Tab, TextRun } from 'docx';
import { DocxComponent } from './components/docx/docx.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DashboardSidebarComponent } from './components/dashboard/dashboard-sidebar/dashboard-sidebar.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from './services/http-interceptor.service';
import { LocalStorageService } from './services/local-storage-service.service';
import { environment } from '../environment/environment.prod';
import { NgxStripeModule } from 'ngx-stripe';

import { ToastrModule } from 'ngx-toastr';
import { LikedAssessmentsComponent } from './components/dashboard/liked-assessments/liked-assessments.component';
@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    FooterComponent,
    HomeComponent,
    AboutUsComponent,
    ContactUsComponent,
    AssessmentComponent,
    AdminComponent,
    NavbarComponent,
    AddUserComponent,
    AddCourseComponent,
    AddAssessmentComponent,
    UpdateUserComponent,
    ViewUserComponent,
    ViewAssessmentDetailsComponent,
    CartComponent,
    UpdateCourseComponent,
    ViewCourseComponent,
    DashboardComponent,
    ViewAssessmentComponent,
    TruncatePipe,
    TestScreenComponent,
    AddCategoryComponent,
    ViewCategoryComponent,
    UpdateCategoryComponent,
    UpdateAssessmentComponent,
    ResultScreenComponent,
    AttendanceScreenComponent,
    AssessmentPlotComponent,
    ReportComponent,
    AttendanceComponent,
    PageNotFoundComponent,
    SearchPipe,
    ViewAssessmentScoreComponent,
    UpdateAssessmentScoreComponent,
    DisableAssessmentsComponent,
    DocxComponent,
    DashboardSidebarComponent,
    LikedAssessmentsComponent,
  ],
  imports: [
    CarouselModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    MatOptionModule,
    MatToolbarModule,
    MatSelectModule,
    MatRadioModule,
    HttpClientModule,
    MatBadgeModule,
    RouterModule,
    CanvasJSAngularChartsModule,
    ToastrModule.forRoot(),
    NgxStripeModule.forRoot(environment.stripePublishableKey),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    LocalStorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
