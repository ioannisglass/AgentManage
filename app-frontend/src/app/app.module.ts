import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { AgentDetailsComponent } from './components/agent-details/agent-details.component';
import { AgentsListComponent } from './components/agents-list/agents-list.component';
import { AuthUserComponent } from './components/auth-user/auth-user.component';
import { ActkeysListComponent } from './components/actkeys-list/actkeys-list.component';
import { Actkey } from './models/actkey.model';
import { ActkeyDetailComponent } from './components/actkey-detail/actkey-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    AddAgentComponent,
    AgentDetailsComponent,
    AgentsListComponent,
    AuthUserComponent,
    ActkeysListComponent,
    ActkeyDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
