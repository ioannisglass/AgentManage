import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentsListComponent } from './components/agents-list/agents-list.component';
import { AgentDetailsComponent } from './components/agent-details/agent-details.component';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { AuthUserComponent } from './components/auth-user/auth-user.component';
import { ActkeysListComponent } from './components/actkeys-list/actkeys-list.component';
import { ActkeyDetailComponent } from './components/actkey-detail/actkey-detail.component';

const routes: Routes = [
  {
    // path: '', redirectTo: 'agents', pathMatch: 'full'
    path: '', redirectTo: 'auth', pathMatch: 'full'
  },
  // {
  //   path: 'agents',  component: AgentsListComponent
  // },
  {
    path: 'agents/:id', component: AgentDetailsComponent
  },
  {
    path: 'actkeys', component: ActkeysListComponent
  },
  {
    path: 'actkeys/:id', component: AgentsListComponent
  },
  {
    path: 'add', component: AddAgentComponent
  },
  {
    path: 'auth', component: AuthUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
