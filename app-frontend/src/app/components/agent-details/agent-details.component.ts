import { Component, Input, OnInit } from '@angular/core';
import { AgentService } from 'src/app/services/agent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Agent } from 'src/app/models/agent.model';
import { Installedapp } from 'src/app/models/installedapp.model';
import { InstalledappService } from 'src/app/services/installedapp.service';

@Component({
  selector: 'app-agent-details',
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.css']
})
export class AgentDetailsComponent implements OnInit {
  // @Input() viewMode = false;

  // @Input() currentAgent: Agent = {
  //   title: '',
  //   description: '',
  //   published: false
  // };
  title = '';
  thirdpartyApps?: Installedapp[];
  message = '';

  constructor(
    private installedappService: InstalledappService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getDeviceInfo(this.route.snapshot.params["id"]);
  }

  getDeviceInfo(id: string): void {
    this.installedappService.getInstalledApps(id)
      .subscribe({
        next: (data) => {
          this.thirdpartyApps = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  updatePublished(status: boolean): void {
    const data = {
      // title: this.currentAgent.title,
      // description: this.currentAgent.description,
      published: status
    };

    this.message = '';

    // this.agentService.update(this.currentAgent.id, data)
    //   .subscribe({
    //     next: (res) => {
    //       console.log(res);
    //       this.currentAgent.published = status;
    //       this.message = res.message ? res.message : 'The status was updated successfully!';
    //     },
    //     error: (e) => console.error(e)
    //   });
  }

  updateAgent(): void {
    this.message = '';

    // this.agentService.update(this.currentAgent.id, this.currentAgent)
    //   .subscribe({
    //     next: (res) => {
    //       console.log(res);
    //       this.message = res.message ? res.message : 'This agent was updated successfully!';
    //     },
    //     error: (e) => console.error(e)
    //   });
  }

  deleteAgent(): void {
    // this.agentService.delete(this.currentAgent.id)
    //   .subscribe({
    //     next: (res) => {
    //       console.log(res);
    //       this.router.navigate(['/agents']);
    //     },
    //     error: (e) => console.error(e)
    //   });
  }
}
