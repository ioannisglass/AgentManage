import { Component, OnInit } from '@angular/core';
import { Agent } from 'src/app/models/agent.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-agents-list',
  templateUrl: './agents-list.component.html',
  styleUrls: ['./agents-list.component.css']
})
export class AgentsListComponent implements OnInit {
  agents?: Agent[];
  currentAgent: Agent = {};
  currentIndex = -1;
  title = '';
  constructor(
    private agentService: AgentService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getAgentByID(this.route.snapshot.params["id"]);
    // this.retrieveAgents();
  }

  getAgentByID(id: string): void {
    console.log('actkey: ' + id);
    this.agentService.get(id)
      .subscribe({
        next: (data) => {
          this.agents = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  retrieveAgents(): void {
    this.agentService.getAll()
      .subscribe({
        next: (data) => {
          this.agents = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveAgents();
    this.currentAgent = {};
    this.currentIndex = -1;
  }

  goAgentDetail(agent: Agent, index: number): void {
    this.currentAgent = agent;
    this.currentIndex = index;

    this.router.navigate([`/agents/:${agent.id}`]);
  }

  removeAllAgents(): void {
    this.agentService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
  }

  searchTitle(): void {
    this.currentAgent = {};
    this.currentIndex = -1;

    this.agentService.findByTitle(this.title)
      .subscribe({
        next: (data) => {
          this.agents = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
}
