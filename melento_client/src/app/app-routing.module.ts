import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { HomeComponent } from './components/home/home.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { AdminComponent } from './components/admin/admin.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminGaurd } from './guard/admingaurd';
import { ViewAssessmentDetailsComponent } from './components/view-assessment-details/view-assessment-details.component';
import { CartComponent } from './components/cart/cart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TestScreenComponent } from './components/test-screen/test-screen.component';
import { ResultScreenComponent } from './components/dashboard/result-screen/result-screen.component';
import { AttendanceScreenComponent } from './components/dashboard/attendance-screen/attendance-screen.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DisableAssessmentsComponent } from './components/dashboard/disable-assessments/disable-assessments.component';
import { AssessmentResolver } from './resolvers/assessmentresolver';
import { ScoreResolver } from './resolvers/scoreresolver';
import { LikedAssessmentsComponent } from './components/dashboard/liked-assessments/liked-assessments.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'assessment', component: AssessmentComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGaurd],
    resolve: { products: AssessmentResolver, prod: ScoreResolver },
  },
  { path: 'navbar', component: NavbarComponent },
  { path: 'cart', component: CartComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  { path: 'testScreen', component: TestScreenComponent },
  { path: 'resultScreen', component: ResultScreenComponent },
  { path: 'attendanceScreen', component: AttendanceScreenComponent },
  { path: 'diabledAssessment', component: DisableAssessmentsComponent },
  {
    path: 'view-assessment',
    component: AssessmentComponent,
  },
  {
    path: 'view-assessment-details/:id',
    component: ViewAssessmentDetailsComponent,
  },
  { path: 'app-liked-assessments', component: LikedAssessmentsComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
