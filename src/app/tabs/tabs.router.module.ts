import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'study-tab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../study-tab/study-tab.module').then(m => m.StudyPageModule)
          }
        ]
      },
      {
        path: 'schedule-tab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../schedule-tab/schedule-tab.module').then(m => m.SchedulePageModule)
          }
        ]
      },
      {
        path: 'social-tab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../social-tab/social-tab.module').then(m => m.SocialPageModule)
          }
        ]
      },
      {
        path: 'settings-tab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../settings-tab/settings-tab.module').then(m => m.SettingsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/settings-tab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/settings-tab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
