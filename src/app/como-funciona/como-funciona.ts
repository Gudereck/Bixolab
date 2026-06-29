import { Component } from '@angular/core';

@Component({
  selector: 'app-como-funciona',
  standalone: true,
  imports: [],
  templateUrl: './como-funciona.html',
  styleUrl: './como-funciona.scss',
})
export class ComoFunciona {
  activeTab: 'coletivo' | 'individual' = 'coletivo';

  setTab(tab: 'coletivo' | 'individual') {
    this.activeTab = tab;
  }
}
