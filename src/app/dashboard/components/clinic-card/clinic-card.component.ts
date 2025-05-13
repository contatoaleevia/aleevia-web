import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClinicCardData } from './clinic-card.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareLinkComponent } from '../share-link/share-link.component';

@Component({
  selector: 'app-clinic-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clinic-card.component.html',
  styleUrl: './clinic-card.component.scss'
})
export class ClinicCardComponent implements OnInit {
  @Input() clinicData!: ClinicCardData;

  ngOnInit() {
    if (!this.clinicData.logo) {
      this.clinicData.logo = 'assets/images/logo-aleevia.png';
    }
  }

  constructor(private modalService: NgbModal) { }

  openShareLinkModal(link: string) {
    const modalRef = this.modalService.open(ShareLinkComponent, {
      centered: true,
      backdrop: true,
      size: 'md',

    });

    modalRef.componentInstance.link = link;
  }
}
