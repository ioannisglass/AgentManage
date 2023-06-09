import { Component, OnInit } from '@angular/core';
import { Agent } from 'src/app/models/agent.model';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent implements OnInit {
  agent: Agent = {
    com_name: '',
    os_info: '',
    published: false
  };
  submitted = false;
  constructor(private agentService: AgentService) { }

  ngOnInit(): void {
  }

  saveAgent(): void {
    const data = {
      title: this.agent.com_name,
      description: this.agent.os_info
    };

    this.agentService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }

  newAgent(): void {
    this.submitted = false;
    this.agent = {
      com_name: '',
      os_info: '',
      published: false
    };
  }
}
