import {Routes} from '@angular/router'
import {HomeCmp} from './desktop/index'
import {DashboardComponent} from './dashboard/dashboard'

export const rootRouterConfig: Routes = [
    {path: '', redirectTo: 'dashboard', terminal: true},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'desktop/:host/:container', component: HomeCmp}
]
