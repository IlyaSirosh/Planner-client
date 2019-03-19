import { Routes} from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'planning', pathMatch: 'full'},
  { path: 'planning', loadChildren: './planning/planning.module#PlanningModule'}
];


