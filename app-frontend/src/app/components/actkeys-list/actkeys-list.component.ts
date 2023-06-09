import { Component, OnInit } from '@angular/core';
import { ActkeyService } from 'src/app/services/actkey.service';
import { Actkey } from 'src/app/models/actkey.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-actkeys-list',
  templateUrl: './actkeys-list.component.html',
  styleUrls: ['./actkeys-list.component.css']
})
export class ActkeysListComponent implements OnInit {
  actkeys?: Actkey[];
  currentActkey: Actkey = {};
  currentIndex = -1;
  title = '';
  constructor(
    private actkeyService: ActkeyService,
    private router: Router) { }
  
  ngOnInit(): void {
    this.retrieveActkeys();
  }

  retrieveActkeys(): void {
    this.actkeyService.getAll()
      .subscribe({
        next: (data) => {
          this.actkeys = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
  
  goActkeyDetail(actkey: Actkey, index: number): void {
    this.currentActkey = actkey;
    this.currentIndex = index;
    
    this.router.navigate([`/actkeys/${actkey.actkey}`]);
  }
}
