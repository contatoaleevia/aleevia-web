import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-share-link',
  imports: [CommonModule, NgbTooltipModule],
  templateUrl: './share-link.component.html',
  styleUrls: ['./share-link.component.scss']
})
export class ShareLinkComponent {
  @Input() link: string = '';

  constructor(private activeModal: NgbActiveModal) { }

  close(): void {
    this.activeModal.dismiss();
  }

  socialIcons = [
    { name: 'facebook', class: 'bi bi-facebook', color: '#1877F2' },
    { name: 'snapchat', class: 'bi bi-snapchat', color: '#000000' },
    { name: 'x', class: 'bi bi-twitter-x', color: '#242E36' },
    { name: 'telegram', class: 'bi bi-telegram', color: '#2AABEE' },
    { name: 'pinterest', class: 'bi bi-pinterest', color: '#E60019' },
    { name: 'reddit', class: 'bi bi-reddit', color: '#FF4500' }
  ];

  copyLink() {
    navigator.clipboard.writeText(this.link)
  }

  openLink() {
    window.open(this.link, '_blank');
  }

  shareTo(platform: string) {
    const url = encodeURIComponent(this.link);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'snapchat':
        shareUrl = `https://snapchat.com/share?text=${url}`;
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}`;
        break;
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  }

}
