import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StageService } from '../../../core/services/stage.service';
import { Stage } from '../../../models/stage.model';

@Component({
  selector: 'app-stage-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './stage-list.html'
})
export class StageListComponent implements OnInit {
  stages = signal<Stage[]>([]);
  keyword = signal('');
  sortBy = signal('id');
  sortDirection = signal('asc');
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 6;
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(private stageService: StageService) {}

  ngOnInit(): void {
    this.loadStages();
  }

  loadStages(): void {
    this.stageService.getAll(
      this.currentPage(),
      this.pageSize,
      this.keyword(),
      this.sortBy(),
      this.sortDirection()
    ).subscribe({
      next: (response) => {
        this.stages.set(response.content);
        this.totalPages.set(response.totalPages);
      },
      error: (err) => {
        console.error('Error cargando escenarios:', err);
        this.errorMessage.set('No se pudo cargar la lista de escenarios.');
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.loadStages();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadStages();
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este escenario?')) {
      this.stageService.delete(id).subscribe({
        next: () => {
          this.successMessage.set('Escenario eliminado correctamente.');
          this.loadStages();
          setTimeout(() => this.successMessage.set(null), 3000);
        },
        error: (err) => {
          this.errorMessage.set('No se pudo borrar el concierto. Es posible que tenga artistas o escenarios asociados.');
          setTimeout(() => this.errorMessage.set(null), 5000);
        }
      });
    }
  }

}
